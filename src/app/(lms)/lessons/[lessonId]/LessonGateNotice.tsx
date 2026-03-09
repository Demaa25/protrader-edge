// src/app/(lms)/lessons/[lessonId]/LessonGateNotice.tsx
"use client";

import { useEffect, useState } from "react";

export default function LessonGateNotice(props: {
  quizHref: string;
  passMarkPct: number;
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => setOpen(true), []);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: "min(520px, 92vw)",
          background: "white",
          borderRadius: 14,
          padding: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18 }}>Quiz Required</div>
        <div style={{ marginTop: 8, color: "#555", lineHeight: 1.5 }}>
          You must pass the previous quiz with at least <b>{props.passMarkPct}%</b> to continue
          to this lesson.
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <a
            href={props.quizHref}
            style={{
              flex: 1,
              textAlign: "center",
              background: "#2563eb",
              color: "white",
              padding: "10px 12px",
              borderRadius: 10,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Go to Quiz
          </a>

          <button
            onClick={() => setOpen(false)}
            style={{
              background: "transparent",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 10,
              padding: "10px 12px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}