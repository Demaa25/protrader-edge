// src/app/(lms)/knowledge-check/[lessonId]/KnowledgeCheckClient.tsx
"use client";

import styles from "./knowledge-check.module.css";
import { useEffect, useMemo, useState } from "react";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  prompt: string;
  order: number;
  options: Option[];
};

type EvaluationDTO = {
  id: string;
  title: string;
  courseTitle: string;
  passMarkPct: number;
  continueHref: string;
};

type BootDTO = {
  attemptId: string;
  evaluation: EvaluationDTO;
  questions: Question[];
};

type AnswerResult = {
  correct: boolean;
  explanation: string | null;
  score: number;
  totalQuestions: number;
  finished: boolean;
};

export default function KnowledgeCheckClient({
  evaluationId,
}: {
  evaluationId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] =
    useState<EvaluationDTO | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] =
    useState<string | null>(null);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [submitting, setSubmitting] =
    useState(false);
  const [feedback, setFeedback] =
    useState<AnswerResult | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  const current = questions[idx];
  const isFirst = idx === 0;
  const isLast = idx === questions.length - 1;

  const currentChoice = current
    ? answers[current.id] ?? ""
    : "";

  const progressLabel = useMemo(() => {
    if (!current) return "";
    return `Question ${idx + 1} of ${questions.length}`;
  }, [current, idx, questions.length]);

  // 🚀 BOOT ATTEMPT
  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/lms/knowledge-check/${evaluationId}/attempt`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = (await res.json()) as BootDTO & {
          error?: string;
        };

        if (!res.ok) {
          throw new Error(
            data.error || "Failed to start knowledge check."
          );
        }

        if (!mounted) return;

        setEvaluation(data.evaluation);
        setQuestions(data.questions);
        setAttemptId(data.attemptId);

        setIdx(0);
        setAnswers({});
        setFeedback(null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e.message);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, [evaluationId]);

  // 🚀 SUBMIT ANSWER
  async function submitCurrentAnswer() {
    if (!attemptId || !current) return null;

    const optionId = answers[current.id];
    if (!optionId) return null;

    const res = await fetch(
      `/api/lms/knowledge-check/${evaluationId}/attempt/${attemptId}/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: current.id,
          optionId,
        }),
      }
    );

    const json = (await res.json()) as AnswerResult & {
      error?: string;
    };

    if (!res.ok) {
      throw new Error(json.error || "Failed to submit answer.");
    }

    return json;
  }

  async function onNextOrSubmit() {
    if (!current || !answers[current.id]) return;

    try {
      setSubmitting(true);
      setError(null);

      const result = await submitCurrentAnswer();
      if (!result) return;

      setFeedback(result);

      if (isLast) {
        if (result.finished) return;
        throw new Error("Incomplete submission.");
      }

      setFeedback(null);
      setIdx((v) =>
        Math.min(v + 1, questions.length - 1)
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  function onPrev() {
    if (isFirst) return;
    setIdx((v) => Math.max(0, v - 1));
  }

  // ================= UI STATES =================

  if (loading) {
    return <div>Loading Knowledge Check...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "crimson" }}>
        {error}
      </div>
    );
  }

  if (!evaluation || !current) {
    return <div>No questions found.</div>;
  }

  // ✅ FINISHED SCREEN
  if (feedback?.finished) {
    const pct = Math.round(
      (feedback.score /
        Math.max(1, feedback.totalQuestions)) *
        100
    );

    const passed = pct >= evaluation.passMarkPct;

    return (
      <div className={styles.card}>
        <h2>Knowledge Check Completed</h2>

        <p>
          Score: {pct}% ({feedback.score}/
          {feedback.totalQuestions})
        </p>

        <p
          style={{
            color: passed ? "green" : "red",
          }}
        >
          {passed ? "Pass" : "Fail"} (Pass mark:{" "}
          {evaluation.passMarkPct}%)
        </p>

        <div className={styles.btnRow}>
          <button
            onClick={() => window.location.reload()}
          >
            Retake
          </button>

          <a
            href={passed ? evaluation.continueHref : "#"}
            className={
              passed
                ? styles.primary
                : styles.disabled
            }
            onClick={(e) => {
              if (!passed) e.preventDefault();
            }}
          >
            Continue →
          </a>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================

  return (
    <div className={styles.card}>
      <div className={styles.qTop}>
        {progressLabel}
      </div>

      <div className={styles.q}>
        {current.prompt}
      </div>

      {current.options.map((o) => (
        <label key={o.id} className={styles.opt}>
          <input
            type="radio"
            name={current.id}
            value={o.id}
            checked={currentChoice === o.id}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [current.id]: e.target.value,
              }))
            }
          />
          <span>{o.text}</span>
        </label>
      ))}

      <div className={styles.btnRow}>
        <button
          onClick={onPrev}
          disabled={isFirst || submitting}
        >
          Previous
        </button>

        <button
          onClick={onNextOrSubmit}
          disabled={!currentChoice || submitting}
        >
          {submitting
            ? "Submitting..."
            : isLast
            ? "Submit"
            : "Next"}
        </button>
      </div>
    </div>
  );
}