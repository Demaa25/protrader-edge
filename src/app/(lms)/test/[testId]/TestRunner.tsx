// src/app/(lms)/test/[testId]/TestRunner.tsx
"use client";

import styles from "../../quiz/[quizId]/quiz.module.css";
import { useEffect, useMemo, useRef, useState } from "react";

type OptionDTO = { id: string; text: string };
type QuestionDTO = { id: string; prompt: string; order: number; options: OptionDTO[] };
type EvalDTO = { id: string; title: string; courseTitle: string; passMarkPct: number };

type BootDTO = {
  attemptId: string;
  evaluation: EvalDTO;
  questions: QuestionDTO[];
  // for timer sync:
  startedAt: string; // ISO
  durationSec: number; // 3600
};

type SubmitResult = {
  score: number;
  totalQuestions: number;
  finished: boolean;
};

type AnswerResult = {
  correct: boolean;
  explanation: string | null;
  score: number;
  totalQuestions: number;
  finished: boolean;
  nextQuestionId: string | null;
};

function fmt(sec: number) {
  const s = Math.max(0, sec);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function TestRunner({ evaluationId }: { evaluationId: string }) {
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<EvalDTO | null>(null);
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [finalScore, setFinalScore] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [remainingSec, setRemainingSec] = useState<number>(3600);
  const deadlineRef = useRef<number | null>(null);
  const autoSubmittedRef = useRef(false);

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

        const res = await fetch(`/api/lms/tests/${evaluationId}/attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const json = (await res.json()) as BootDTO & { error?: string };
        if (!res.ok) throw new Error(json?.error || "Failed to start test.");

        if (!mounted) return;

        setEvaluation(json.evaluation);
        setQuestions(json.questions);
        setAttemptId(json.attemptId);
        setIdx(0);
        setAnswers({});
        setFeedback(null);
        setFinalScore(null);

        const startedAtMs = new Date(json.startedAt).getTime();
        const deadline = startedAtMs + json.durationSec * 1000;
        deadlineRef.current = deadline;
        autoSubmittedRef.current = false;

        const now = Date.now();
        setRemainingSec(Math.max(0, Math.floor((deadline - now) / 1000)));
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

  // countdown tick
  useEffect(() => {
    if (!attemptId || !deadlineRef.current || finalScore?.finished) return;

    const t = setInterval(() => {
      const now = Date.now();
      const sec = Math.max(0, Math.floor((deadlineRef.current! - now) / 1000));
      setRemainingSec(sec);

      if (sec <= 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        submitTest("Time elapsed. Auto-submitting…");
      }
    }, 250);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, finalScore?.finished]);

  async function submitTest(_reason?: string) {
    if (!attemptId) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/lms/tests/${evaluationId}/attempt/${attemptId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }), // optional, server doesn’t need it but harmless
      });

      const json = (await res.json()) as SubmitResult & { error?: string };
      if (!res.ok) throw new Error(json?.error || "Failed to submit test.");

      setFinalScore(json);
    } catch (e: any) {
      setError(e?.message || "Failed to submit test.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitCurrentAnswer() {
    if (!attemptId || !current) return null;
    const optionId = answers[current.id];
    if (!optionId) return null;

    const res = await fetch(`/api/lms/tests/${evaluationId}/attempt/${attemptId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: current.id, optionId }),
    });

    const json = (await res.json()) as AnswerResult & { error?: string };
    if (!res.ok) throw new Error(json?.error || "Failed to submit answer.");
    return json;
  }

  async function onNextOrSubmitAnswer() {
    if (!current) return;
    if (!answers[current.id]) return;

    try {
      setSubmitting(true);
      setError(null);

      const result = await submitCurrentAnswer();
      if (!result) return;

      setFeedback(result);

      if (isLast) {
        // Instead of relying on “finished”, tests can be submitted early/late via submit endpoint.
        // If user answered all, we can auto-submit now:
        await submitTest();
        return;
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
        <h1 className={styles.h1}>Test</h1>
        <div className={styles.sub} style={{ color: "crimson" }}>{error}</div>
        <a className={styles.back} href="/dashboard">Go Back</a>
      </>
    );
  }

  if (!evaluation || questions.length === 0 || !current) {
    return (
      <>
        <h1 className={styles.h1}>Test</h1>
        <div className={styles.sub}>No questions found.</div>
        <a className={styles.back} href="/dashboard">Go Back</a>
      </>
    );
  }

  // Final screen
  if (finalScore?.finished) {
    const pct = Math.round((finalScore.score / Math.max(1, finalScore.totalQuestions)) * 100);
    const passed = pct >= evaluation.passMarkPct;

    return (
      <>
        <h1 className={styles.h1}>{evaluation.courseTitle}</h1>
        <div className={styles.sub}>Test: {evaluation.title}</div>

        <section className={styles.card}>
          <div className={styles.qTop}>Submitted</div>
          <div className={styles.q}>
            Your score: {pct}% ({finalScore.score}/{finalScore.totalQuestions})
          </div>

          <div className={styles.sub} style={{ marginTop: 8, color: passed ? "green" : "crimson" }}>
            {passed ? "Pass" : "Fail"} (Pass mark: {evaluation.passMarkPct}%)
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
            <button className={styles.btn} onClick={() => window.location.reload()} style={{ width: "auto" }}>
              Retake Test
            </button>
            <a className={styles.back} href="/dashboard">Go Back to Dashboard</a>
          </div>
        </section>
      </>
    );
  }

  const nextLabel = isLast ? "Submit Test" : "Next Question";
  const prevDisabled = isFirst || submitting;
  const nextDisabled = submitting || !currentChoice;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div>
          <h1 className={styles.h1}>{evaluation.courseTitle}</h1>
          <div className={styles.sub}>Test: {evaluation.title}</div>
        </div>
        <div style={{ fontWeight: 900, color: remainingSec <= 60 ? "crimson" : "var(--muted)" }}>
          Time left: {fmt(remainingSec)}
        </div>
      </div>

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
            onClick={onNextOrSubmitAnswer}
            style={{ width: "auto", flex: 1 }}
          >
            {submitting ? "Submitting..." : nextLabel}
          </button>
        </div>

        <button
          className={styles.btn}
          onClick={() => submitTest()}
          disabled={submitting}
          style={{ marginTop: 10 }}
        >
          {submitting ? "Submitting..." : "Submit Test Now"}
        </button>

        <a className={styles.back} href="/dashboard">Go Back to Dashboard</a>
      </section>
    </>
  );
}