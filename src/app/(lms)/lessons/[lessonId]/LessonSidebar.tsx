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

type ProgressMap = {
  [lessonId: string]: {
    completed: boolean;
    progress: number;
  };
};

type Props = {
  courseId: string;
  moduleTitle: string;
  moduleOrder: number;
  lessons: Lesson[];
  currentLessonId: string;
  quizId?: string | null;
  progressPct: number;
  progressMap: ProgressMap;
};

export default function LessonSidebar({
  courseId,
  moduleTitle,
  moduleOrder,
  lessons,
  currentLessonId,
  quizId,
  progressPct,
  progressMap,
}: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
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
        <Link href={`/courses/${courseId}`} className={styles.back}>
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

          {/* PROGRESS TEXT */}
          <div className={styles.progressText}>
            {Math.round(progressPct)}% Complete
          </div>

          {/* BAR */}
          <div className={styles.progress}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* SCROLL */}
        <div className={styles.scroll}>
          <div className={styles.section}>Lessons</div>

          <div className={styles.lessonList}>
            {lessons.map((lesson) => {
              const progress = progressMap[lesson.id];
              const completed = progress?.completed;

              return (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className={`${styles.lessonItem} ${
                    lesson.id === currentLessonId
                    ? styles.active
                    : ""
                  }`}
                >
                  <div
                    className={`${styles.circle} ${
                      completed ? styles.completed : ""
                    }`}
                  >
                    {completed && "✓"}
                  </div>

                  <span>Lesson {lesson.order}</span>
                </Link>
              );
            })}

            {quizId && (
              <Link href={`/quiz/${quizId}`} className={styles.quiz}>
                Quiz
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}