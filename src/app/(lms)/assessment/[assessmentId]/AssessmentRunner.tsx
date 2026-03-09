// src/app/(lms)/assessment/[assessmentId]/AssessmentRunner.tsx
"use client";

import styles from "./assessment.module.css";
import { useEffect, useMemo, useState } from "react";

type QuizOptionDTO = { id: string; text: string };
type QuizQuestionDTO = { id: string; prompt: string; order: number; options: QuizOptionDTO[] };

type EvalDTO = { id: string; title: string; courseTitle: string; passMarkPct: number };

type BootDTO = { attemptId: string; evaluation: EvalDTO; questions: QuizQuestionDTO[] };

type AnswerResult = {
  correct: boolean;
  explanation: string | null;
  score: number;
  totalQuestions: number;
  finished: boolean;
  nextQuestionId: string | null;
};

export default function AssessmentRunner({ evaluationId }: { evaluationId: string }) {
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<EvalDTO | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionDTO[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const current = questions[idx];
  const isFirst = idx === 0;
  const isLast = idx === Math.max(0, questions.length - 1);
  const currentChoice = current ? answers[current.id] ?? "" : "";

  const progressLabel = useMemo(() => {
    if (!current) return "";
    return `Question ${idx + 1} of ${questions.length}`;
  }, [current, idx, questions.length]);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/lms/assessments/${evaluationId}/attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const json = (await res.json()) as BootDTO & { error?: string };
        if (!res.ok) throw new Error(json?.error || "Failed to start assessment.");

        if (!mounted) return;

        setEvaluation(json.evaluation);
        setQuestions(json.questions);
        setAttemptId(json.attemptId);
        setIdx(0);
        setAnswers({});
        setFeedback(null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Something went wrong.");
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

  async function submitCurrentAnswer() {
    if (!attemptId || !current) return null;

    const optionId = answers[current.id];
    if (!optionId) return null;

    const res = await fetch(`/api/lms/assessments/${evaluationId}/attempt/${attemptId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: current.id, optionId }),
    });

    const json = (await res.json()) as AnswerResult & { error?: string };
    if (!res.ok) throw new Error(json?.error || "Failed to submit answer.");
    return json;
  }

  async function onNextOrSubmit() {
    if (!current) return;
    if (!answers[current.id]) return;

    try {
      setSubmitting(true);
      setError(null);

      const result = await submitCurrentAnswer();
      if (!result) return;

      setFeedback(result);

      if (isLast) {
        if (result.finished) return;
        throw new Error("Please answer all questions before submitting.");
      }

      setFeedback(null);
      setIdx((v) => Math.min(v + 1, questions.length - 1));
    } catch (e: any) {
      setError(e?.message || "Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  }

  function onPrev() {
    if (isFirst) return;
    setFeedback(null);
    setIdx((v) => Math.max(0, v - 1));
  }

  if (loading) {
    return (
      <>
        <h1 className={styles.h1}>Loading…</h1>
        <div className={styles.sub}>Please wait</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className={styles.h1}>Assessment</h1>
        <div className={styles.sub} style={{ color: "crimson" }}>
          {error}
        </div>
        <a className={styles.back} href="/dashboard">Go Back</a>
      </>
    );
  }

  if (!evaluation || questions.length === 0 || !current) {
    return (
      <>
        <h1 className={styles.h1}>Assessment</h1>
        <div className={styles.sub}>No questions found.</div>
        <a className={styles.back} href="/dashboard">Go Back</a>
      </>
    );
  }

  if (feedback?.finished) {
    const pct = Math.round((feedback.score / Math.max(1, feedback.totalQuestions)) * 100);
    const passed = pct >= evaluation.passMarkPct;

    return (
      <>
        <h1 className={styles.h1}>{evaluation.courseTitle}</h1>
        <div className={styles.sub}>Assessment: {evaluation.title}</div>

        <section className={styles.card}>
          <div className={styles.qTop}>Completed</div>
          <div className={styles.q}>
            Your score: {pct}% ({feedback.score}/{feedback.totalQuestions})
          </div>

          <div className={styles.sub} style={{ marginTop: 8, color: passed ? "green" : "crimson" }}>
            {passed ? "Pass" : "Fail"} (Pass mark: {evaluation.passMarkPct}%)
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
            <button className={styles.btn} onClick={() => window.location.reload()} style={{ width: "auto" }}>
              Retake Assessment
            </button>
            <a className={styles.back} href="/dashboard">Go Back to Dashboard</a>
          </div>
        </section>
      </>
    );
  }

  const nextLabel = isLast ? "Submit Answers" : "Next Question";
  const prevDisabled = isFirst || submitting;
  const nextDisabled = submitting || !currentChoice;

  return (
    <>
      <h1 className={styles.h1}>{evaluation.courseTitle}</h1>
      <div className={styles.sub}>Assessment: {evaluation.title}</div>

      <section className={styles.card}>
        <div className={styles.qTop}>{progressLabel}</div>
        <div className={styles.q}>{current.prompt}</div>

        {current.options.map((o) => (
          <label key={o.id} className={styles.opt}>
            <input
              type="radio"
              name={current.id}
              value={o.id}
              checked={currentChoice === o.id}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }))}
              disabled={submitting}
            />
            <span>{o.text}</span>
          </label>
        ))}

        <div className={styles.btnRow}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            disabled={prevDisabled}
            onClick={onPrev}
            style={{ width: "auto", flex: 1 }}
          >
            Previous Question
          </button>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={nextDisabled}
            onClick={onNextOrSubmit}
            style={{ width: "auto", flex: 1 }}
          >
            {submitting ? "Submitting..." : nextLabel}
          </button>
        </div>

        <a className={styles.back} href="/dashboard">Go Back to Dashboard</a>
      </section>
    </>
  );
}