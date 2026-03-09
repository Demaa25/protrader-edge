// src/app/(lms)/quiz/[quizId]/QuizRunner.tsx
"use client";

import styles from "./quiz.module.css";
import { useEffect, useMemo, useState } from "react";

type QuizOptionDTO = { id: string; text: string };
type QuizQuestionDTO = {
  id: string; // BankQuestion.id
  prompt: string;
  order: number;
  options: QuizOptionDTO[];
};

type QuizDTO = {
  id: string; // Evaluation.id
  title: string;
  courseTitle: string;
  passMarkPct: number;
  continueHref: string; // ✅ new
};

type BootDTO = {
  attemptId: string;
  quiz: QuizDTO;
  questions: QuizQuestionDTO[];
  lessonId?: string;
};

type AnswerResult = {
  correct: boolean;
  explanation: string | null;
  score: number;
  totalQuestions: number;
  finished: boolean;
  nextQuestionId: string | null;
};

export default function QuizRunner({ quizId }: { quizId: string }) {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizDTO | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionDTO[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [idx, setIdx] = useState(0);

  // store selected option per question
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // add near other state
  const [gate, setGate] = useState<{ message: string; href: string } | null>(null); // new state to control access to quiz content

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

        const aRes = await fetch(`/api/lms/quizzes/${quizId}/attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const aJson = (await aRes.json()) as (BootDTO & { error?: string });
        if (!aRes.ok) {
          // ✅ handle prerequisite gate
          if (aRes.status === 403 && aJson.lessonId) {
            setGate({
              message: aJson.error || "Please complete the previous lesson before attempting this quiz.",
              href: `/lms/lessons/${aJson.lessonId}`,
            });
            return;
          }
          throw new Error(aJson?.error || "Failed to start quiz attempt.");
        }

        if (!mounted) return;

        setQuiz(aJson.quiz);
        setQuestions(aJson.questions);
        setAttemptId(aJson.attemptId);

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
  }, [quizId]);

  async function submitCurrentAnswer() {
    if (!attemptId || !current) return null;

    const optionId = answers[current.id];
    if (!optionId) return null;

    const res = await fetch(
      `/api/lms/quizzes/${quizId}/attempt/${attemptId}/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: current.id,
          optionId,
        }),
      }
    );

    const json = (await res.json()) as AnswerResult & { error?: string };
    if (!res.ok) throw new Error(json?.error || "Failed to submit answer.");

    return json;
  }

  async function onNextOrSubmit() {
    if (!current) return;

    // must choose an option to proceed
    if (!answers[current.id]) return;

    try {
      setSubmitting(true);
      setError(null);

      const result = await submitCurrentAnswer();
      if (!result) return;

      // store latest feedback (optional: you can show Correct/Incorrect briefly)
      setFeedback(result);

      if (isLast) {
        // last question: show result screen only when server says finished
        if (result.finished) return;
        // If not finished, it means not all questions answered (shouldn't happen with our UI rules)
        throw new Error("Please answer all questions before submitting.");
      }

      // move forward
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

  if (gate) {
    return (
      <>
        <h1 className={styles.h1}>Quiz</h1>
        <div className={styles.sub} style={{ color: "crimson" }}>
          {gate.message}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className={styles.btn} href={gate.href} style={{width: "auto"}}>
            Go to Lesson
          </a>
          <a className={styles.back} href="/dashboard">
            Go Back
          </a>
        </div>
      </>
    );
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
        <h1 className={styles.h1}>Quiz</h1>
        <div className={styles.sub} style={{ color: "crimson" }}>
          {error}
        </div>
        <a className={styles.back} href="/dashboard">
          Go Back
        </a>
      </>
    );
  }

  if (!quiz || questions.length === 0 || !current) {
    return (
      <>
        <h1 className={styles.h1}>Quiz</h1>
        <div className={styles.sub}>No questions found for this quiz.</div>
        <a className={styles.back} href="/dashboard">
          Go Back
        </a>
      </>
    );
  }

  // Finished screen (when last answer submission returns finished=true)
  if (feedback?.finished) {
    const pct = Math.round((feedback.score / Math.max(1, feedback.totalQuestions)) * 100);
    const passed = pct >= quiz.passMarkPct;

    return (
      <>
        <h1 className={styles.h1}>{quiz.courseTitle}</h1>
        <div className={styles.sub}>Quiz: {quiz.title}</div>

        <section className={styles.card}>
          <div className={styles.qTop}>Completed</div>
          <div className={styles.q}>
            Your score: {pct}% ({feedback.score}/{feedback.totalQuestions})
          </div>

          <div
            className={styles.sub}
            style={{ marginTop: 8, color: passed ? "green" : "crimson" }}
          >
            {passed ? "Pass" : "Fail"} (Pass mark: {quiz.passMarkPct}%)
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", width: "100%" }}>
            <button
              className={styles.btn}
              onClick={() => window.location.reload()}
              style={{ width: "auto" }}
            >
              Retake Quiz
            </button>

            <a
             className={`${styles.btn} ${passed ? styles.btnPrimary : styles.disabledBtn}`} 
             href={passed ? quiz.continueHref : "#"} 
             aria-disabled={passed ? "false" : "true"} 
             onClick= {(e) => { 
              if (!passed) e.preventDefault();
             }} 
             style={{ width: "auto", marginLeft: "auto" }} // ✅ pushes to far right
            >
              Continue
            </a>
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
      <h1 className={styles.h1}>{quiz.courseTitle}</h1>
      <div className={styles.sub}>Quiz: {quiz.title}</div>

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
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }))
              }
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

        <a className={styles.back} href="/dashboard">
          Go Back to Dashboard
        </a>
      </section>
    </>
  );
}