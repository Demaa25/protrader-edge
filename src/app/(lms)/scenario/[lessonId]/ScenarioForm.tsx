// src/app/(lms)/scenario/[lessonId]/ScenarioForm.tsx
"use client";

import { useState } from "react";
import styles from "./scenario.module.css";

export default function ScenarioForm({
  scenarioId,
}: {
  scenarioId: string;
}) {
  const [structure, setStructure] = useState("");
  const [liquidity, setLiquidity] = useState("");
  const [risk, setRisk] = useState("");
  const [invalidation, setInvalidation] = useState("");
  const [failure, setFailure] = useState("");

  const [feedback, setFeedback] = useState("");
  const [passed, setPassed] = useState(false);

  async function submit() {
    const res = await fetch(
      `/api/scenario/${scenarioId}/submit`,
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
    <div className={styles.form}>
      <Field
        label="Market Structure"
        value={structure}
        onChange={setStructure}
      />

      <Field
        label="Liquidity"
        value={liquidity}
        onChange={setLiquidity}
      />

      <Field
        label="Risk"
        value={risk}
        onChange={setRisk}
      />

      <Field
        label="Invalidation"
        value={invalidation}
        onChange={setInvalidation}
      />

      <Field
        label="Failure"
        value={failure}
        onChange={setFailure}
      />

      <button
        className={styles.submit}
        onClick={submit}
      >
        Submit Analysis
      </button>

      {feedback && (
        <div
          className={
            passed
              ? styles.pass
              : styles.fail
          }
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: any) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}