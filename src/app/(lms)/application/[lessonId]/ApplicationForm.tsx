// src/app/(lms)/application/[lessonId]/ApplicationForm.tsx
"use client";

import { useState } from "react";
import styles from "./application.module.css";

export default function ApplicationForm({
  applicationId,
  lessonId,
  nextLessonId,
  quizId,
}: {
  applicationId: string;
  lessonId: string;
  nextLessonId: string | null;
  quizId: string | null;
}) {
  const [structure, setStructure] = useState("");
  const [liquidity, setLiquidity] = useState("");
  const [risk, setRisk] = useState("");
  const [invalidation, setInvalidation] = useState("");
  const [failure, setFailure] = useState("");

  const [feedback, setFeedback] = useState("");
  const [passed, setPassed] = useState(false);

  const isComplete =
    structure &&
    liquidity &&
    risk &&
    invalidation &&
    failure;

  async function submit() {
    const res = await fetch(
      `/api/application/${applicationId}/submit`,
      {
        method: "POST",
        body: JSON.stringify({
          structure,
          liquidity,
          risk,
          invalidation,
          failure,
        }),
      }
    );

    const data = await res.json();

    setFeedback(data.feedback);
    setPassed(data.passed);
  }

  return (
    <div className={styles.formCard}>
      {/* GRID TOP */}
      <div className={styles.gridTop}>
        <Field
          label="Market Structure"
          placeholder="Describe the market structure..."
          value={structure}
          onChange={setStructure}
        />

        <Field
          label="Liquidity"
          placeholder="Analyze liquidity behavior..."
          value={liquidity}
          onChange={setLiquidity}
        />

        <Field
          label="Risk"
          placeholder="Explain the risk involved..."
          value={risk}
          onChange={setRisk}
        />
      </div>

      {/* GRID BOTTOM */}
      <div className={styles.gridBottom}>
        <Field
          label="Invalidation"
          placeholder="What would invalidate this analysis?"
          value={invalidation}
          onChange={setInvalidation}
        />

        <Field
          label="Failure"
          placeholder="What would make this analysis wrong?"
          value={failure}
          onChange={setFailure}
        />
      </div>

      {/* SUBMIT */}
      <button
        className={styles.submit}
        disabled={!isComplete}
        onClick={submit}
      >
        Submit Analysis
        <span className={styles.submitSub}>
          Your responses will be evaluated
        </span>
      </button>

      {feedback && (
        <div className={passed ? styles.pass : styles.fail}>
          {feedback}
        </div>
      )}

      {passed && (
        <a
          href={
            nextLessonId
              ? `/lessons/${nextLessonId}`
              : `/quiz/${quizId}`
          }
          className={styles.cta}
        >
          {nextLessonId
            ? "Proceed to Next Lesson →"
            : "Proceed to Module Quiz →"}
        </a>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: any) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className={styles.counter}>
        {value.length} / 300
      </span>
    </div>
  );
}