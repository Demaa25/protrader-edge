"use client";

import { useEffect, useMemo, useState } from "react";

type MaterialType = "VIDEO" | "DOCUMENT";

type LessonMaterial = {
  id: string;
  lessonId: string;
  type: MaterialType;
  title: string;
  url: string;
  order: number;
};

export function LessonMaterialsEditor({ lessonId }: { lessonId: string }) {
  const [materials, setMaterials] = useState<LessonMaterial[]>([]);
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<MaterialType>("VIDEO");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const canSubmit = useMemo(() => title.trim().length > 0 && url.trim().length > 0, [title, url]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/materials`, { cache: "no-store" });
      const data = await res.json();
      setMaterials(data.materials ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  async function addMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const res = await fetch(`/api/admin/lessons/${lessonId}/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        title: title.trim(),
        url: url.trim(),
        order: materials.length,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to add material");
      return;
    }

    setTitle("");
    setUrl("");
    await refresh();
  }

  async function removeMaterial(materialId: string) {
    const ok = confirm("Remove this material?");
    if (!ok) return;

    const res = await fetch(`/api/admin/lessons/${lessonId}/materials/${materialId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Failed to remove material");
      return;
    }

    await refresh();
  }

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>Materials</div>

      {loading ? (
        <div style={{ opacity: 0.7, fontSize: 13 }}>Loading…</div>
      ) : materials.length === 0 ? (
        <div style={{ opacity: 0.7, fontSize: 13 }}>No materials added yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          {materials.map((m) => (
            <div
              key={m.id}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 90px",
                gap: 10,
                alignItems: "center",
                border: "1px solid rgba(16,24,40,0.12)",
                borderRadius: 12,
                padding: 10,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 800 }}>{m.type === "VIDEO" ? "Video" : "Document"}</div>
              <div style={{ display: "grid", gap: 4 }}>
                <div style={{ fontWeight: 800 }}>{m.title}</div>
                <a href={m.url} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                  {m.url}
                </a>
              </div>
              <button
                type="button"
                onClick={() => removeMaterial(m.id)}
                style={{
                  border: "0",
                  background: "#ffeded",
                  color: "#b42318",
                  fontWeight: 900,
                  borderRadius: 10,
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addMaterial} style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10 }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MaterialType)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(16,24,40,0.12)" }}
          >
            <option value="VIDEO">Video</option>
            <option value="DOCUMENT">Document</option>
          </select>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Material title (e.g. Liquidity Model Walkthrough)"
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(16,24,40,0.12)" }}
          />
        </div>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste URL (e.g. YouTube/Vimeo/Drive/S3 link)"
          style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(16,24,40,0.12)" }}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            justifySelf: "start",
            border: 0,
            borderRadius: 12,
            padding: "12px 16px",
            fontWeight: 900,
            cursor: canSubmit ? "pointer" : "not-allowed",
            background: canSubmit ? "#1f5eff" : "rgba(31,94,255,0.35)",
            color: "#fff",
          }}
        >
          Add Material
        </button>
      </form>
    </div>
  );
}