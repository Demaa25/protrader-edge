// src/app/(lms)/lessons/[lessonId]/LessonSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./LessonSidebar.module.css";

type Lesson = {
  id: string;
  title: string;
  order: number;
};

type Props = {
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  moduleOrder: number;
  lessons: Lesson[];
  currentLessonId: string;
  quizId?: string | null;
  progressPct: number;
};

export default function LessonSidebar({
  courseId,
  moduleTitle,
  moduleOrder,
  lessons,
  currentLessonId,
  quizId,
  progressPct,
}: Props) {
  return (
    <aside className={styles.sidebar}>
      {/* LOGO */}
      <div className={styles.logo}>
        <Image
          src="/PTE Logo_2.png"
          alt="logo"
          width={28}
          height={28}
        />
        <span>ProTrader Edge</span>
      </div>

      {/* BACK */}
      <Link
        href={`/courses/${courseId}`}
        className={styles.back}
      >
        ← Back to Course
      </Link>

      {/* MODULE */}
      <div className={styles.moduleBlock}>
        <div className={styles.moduleLabel}>
          MODULE {moduleOrder}
        </div>

        <div className={styles.moduleTitle}>
          {moduleTitle}
        </div>

        <div className={styles.progress}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* SCROLL AREA */}
      <div className={styles.scroll}>
        <div className={styles.section}>Lessons</div>

        <div className={styles.lessonList}>
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className={`${styles.lessonItem} ${
                lesson.id === currentLessonId
                  ? styles.active
                  : ""
              }`}
            >
              Lesson {lesson.order}
            </Link>
          ))}

          {/* MODULE QUIZ (always visible) */}
          {quizId && (
            <Link
              href={`/quiz/${quizId}`}
              className={`${styles.quiz} ${
                currentLessonId === "quiz"
                  ? styles.active
                  : ""
              }`}
            >
              Quiz
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}