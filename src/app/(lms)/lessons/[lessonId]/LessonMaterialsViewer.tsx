// src/app/(lms)/lessons/[lessonId]/LessonMaterialsViewer.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MaterialType = "VIDEO" | "DOCUMENT";

export type LessonMaterialDTO = {
  id: string;
  type: MaterialType;
  title: string;
  url: string; // must be fetchable in browser (e.g. /uploads/file.pdf)
  order: number;
};

type TocItem = {
  title: string;
  page: number; // 1-based
  items?: TocItem[];
};

type PdfJs = typeof import("pdfjs-dist/build/pdf");

async function loadPdfJs(): Promise<PdfJs> {
  const pdfjs = await import("pdfjs-dist/build/pdf");

  // ✅ bundle worker via Next (no CDN, no fake worker)
  // @ts-expect-error pdfjs typing differs across versions
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  return pdfjs;
}

function isPdf(url: string) {
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return u.pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return url.toLowerCase().includes(".pdf");
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function LessonMaterialsViewer(props: { documents: LessonMaterialDTO[] }) {
  const docs = props.documents ?? [];
  const [activeId, setActiveId] = useState(docs[0]?.id ?? "");
  const active = useMemo(() => docs.find((d) => d.id === activeId) ?? docs[0], [docs, activeId]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1); // ✅ FIX: define page state
  const [toc, setToc] = useState<TocItem[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pdfRef = useRef<any>(null); // PDFDocumentProxy
  const renderTaskRef = useRef<any>(null); // RenderTask
  const renderSeqRef = useRef(0); // monotonic render sequence

  // reset when switching docs
  useEffect(() => {
    setErr("");
    setToc([]);
    setPageCount(0);
    setPage(1);
    pdfRef.current = null;

    // cancel any render in progress
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
      renderTaskRef.current = null;
    }
  }, [active?.id]);

  // load pdf (and outline if present)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!active?.url) return;

      if (!isPdf(active.url)) {
        setErr("This document is not a PDF. Please upload a PDF to use the built-in viewer.");
        return;
      }

      setLoading(true);
      setErr("");

      try {
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        const task = pdfjs.getDocument({ url: active.url, withCredentials: false });
        const pdf = await task.promise;
        if (cancelled) return;

        pdfRef.current = pdf;
        setPageCount(pdf.numPages);
        setPage(1);

        // TOC from PDF outline (only if it exists)
        const outline = await pdf.getOutline().catch(() => null);
        if (!cancelled && outline) {
          const built = await buildToc(pdf, outline);
          if (!cancelled) setToc(built);
        }

        // render first page
        await renderPage(pdf, 1);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load PDF.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [active?.url]);

  // render when page changes
  useEffect(() => {
    if (!pdfRef.current) return;
    renderPage(pdfRef.current, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // re-render on resize to keep it fit
  useEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver(() => {
      if (!pdfRef.current) return;
      renderPage(pdfRef.current, page);
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (!docs.length) return null;

  const canPrev = page > 1;
  const canNext = pageCount > 0 && page < pageCount;

  async function renderPage(pdf: any, pageNumber: number) {
    const canvas = canvasRef.current;
    if (!canvas || !pdf) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ✅ This sequence id prevents stale renders from “winning”
    const mySeq = ++renderSeqRef.current;

    // ✅ Cancel previous render on this SAME canvas, then await its end
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
      try {
        await renderTaskRef.current.promise;
      } catch {
        // ignore cancellation errors
      }
      renderTaskRef.current = null;
    }

    try {
      const pageObj = await pdf.getPage(pageNumber);

      // Fit to container width
      const containerWidth = containerRef.current?.clientWidth ?? 900;
      const usableWidth = Math.max(360, containerWidth - 80);

      const vp1 = pageObj.getViewport({ scale: 1 });
      const scale = usableWidth / vp1.width;
      const viewport = pageObj.getViewport({ scale });

      // if a newer render started while awaiting, stop
      if (renderSeqRef.current !== mySeq) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      // clear canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const renderTask = pageObj.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = renderTask;

      await renderTask.promise;

      // only clear ref if still current
      if (renderSeqRef.current === mySeq) {
        renderTaskRef.current = null;
      }
    } catch (e: any) {
      // ignore cancellation
      const msg = String(e?.message || "");
      if (!msg.toLowerCase().includes("cancel")) {
        console.error(e);
        setErr(msg || "Failed to render page.");
      }
      renderTaskRef.current = null;
    }
  }

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 900, marginBottom: 8 }}>Lesson Documents</div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {docs.map((d) => {
          const on = d.id === active?.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              style={{
                borderRadius: 999,
                padding: "8px 12px",
                border: "1px solid rgba(16,24,40,0.14)",
                background: on ? "#2563eb" : "white",
                color: on ? "white" : "#101828",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {d.title}
            </button>
          );
        })}
      </div>

      {/* Viewer Frame */}
      <div
        style={{
          border: "1px solid rgba(16,24,40,0.12)",
          borderRadius: 14,
          overflow: "hidden",
          background: "#0b1220",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 10,
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            type="button"
            disabled={!canPrev || loading}
            onClick={() => setPage((p) => clamp(p - 1, 1, pageCount || 1))}
            style={btnStyle(!canPrev || loading)}
            aria-label="Previous page"
          >
            ←
          </button>

          <div style={{ color: "white", fontWeight: 900 }}>
            Page {page}
            {pageCount ? ` / ${pageCount}` : ""}
          </div>

          <button
            type="button"
            disabled={!canNext || loading}
            onClick={() => setPage((p) => clamp(p + 1, 1, pageCount || 1))}
            style={btnStyle(!canNext || loading)}
            aria-label="Next page"
          >
            →
          </button>

          <div style={{ flex: 1 }} />

          {loading ? <div style={{ color: "#cbd5e1", fontWeight: 800 }}>Loading…</div> : null}
        </div>

        {/* Body: TOC + Page */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: 560 }}>
          {/* TOC */}
          <div
            style={{
              borderRight: "1px solid rgba(255,255,255,0.08)",
              padding: 12,
              color: "white",
              overflow: "auto",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Contents</div>

            {err ? (
              <div style={{ color: "#fca5a5", fontWeight: 800, lineHeight: 1.4 }}>{err}</div>
            ) : toc.length === 0 ? (
              <div style={{ color: "#cbd5e1", fontWeight: 700, lineHeight: 1.4 }}>
                {loading ? "Reading table of contents…" : "No table of contents found in this PDF."}
              </div>
            ) : (
              <TocList toc={toc} currentPage={page} onJump={(p) => setPage(clamp(p, 1, pageCount || 1))} />
            )}
          </div>

          {/* Page */}
          <div
            ref={containerRef}
            style={{
              display: "grid",
              placeItems: "center",
              padding: 14,
              overflow: "auto",
              background: "#0b1220",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: 12,
                padding: 10,
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              }}
            >
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function btnStyle(disabled: boolean) {
  return {
    borderRadius: 10,
    padding: "8px 12px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: disabled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)",
    color: "white",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  } as const;
}

// Build TOC from PDF outline (if it exists)
async function buildToc(pdf: any, outline: any[]): Promise<TocItem[]> {
  async function resolveItem(item: any): Promise<TocItem> {
    const title = String(item.title ?? "").trim() || "Untitled";
    const page = await resolveDestToPage(pdf, item.dest).catch(() => 1);
    const kids = Array.isArray(item.items) ? await Promise.all(item.items.map(resolveItem)) : undefined;

    return {
      title,
      page,
      ...(kids && kids.length ? { items: kids } : {}),
    };
  }

  return Promise.all(outline.map(resolveItem));
}

async function resolveDestToPage(pdf: any, dest: any): Promise<number> {
  if (!dest) return 1;

  const d = typeof dest === "string" ? await pdf.getDestination(dest) : dest;
  if (!Array.isArray(d) || !d[0]) return 1;

  const pageIndex = await pdf.getPageIndex(d[0]); // 0-based
  return pageIndex + 1;
}

function TocList(props: { toc: TocItem[]; currentPage: number; onJump: (page: number) => void }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {props.toc.map((t, i) => (
        <TocNode key={`${t.title}-${i}`} node={t} depth={0} currentPage={props.currentPage} onJump={props.onJump} />
      ))}
    </div>
  );
}

function TocNode(props: { node: TocItem; depth: number; currentPage: number; onJump: (page: number) => void }) {
  const { node, depth, currentPage, onJump } = props;
  const active = node.page === currentPage;

  return (
    <div style={{ marginLeft: depth * 12 }}>
      <button
        type="button"
        onClick={() => onJump(node.page)}
        style={{
          width: "100%",
          textAlign: "left",
          border: "none",
          background: active ? "rgba(37,99,235,0.35)" : "transparent",
          color: "white",
          padding: "6px 8px",
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: depth === 0 ? 900 : 800,
          lineHeight: 1.2,
        }}
      >
        {node.title}
        <span style={{ opacity: 0.7, fontWeight: 800, marginLeft: 8 }}>· {node.page}</span>
      </button>

      {node.items?.length ? (
        <div style={{ display: "grid", gap: 4, marginTop: 4 }}>
          {node.items.map((child, idx) => (
            <TocNode
              key={`${child.title}-${idx}`}
              node={child}
              depth={depth + 1}
              currentPage={currentPage}
              onJump={onJump}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}