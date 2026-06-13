// src/app/(lms)/courses/[courseId]/CoursePageClient.tsx
"use client";

import { useState } from "react";
import styles from "./course.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";

type Tab =
  | "OVERVIEW"
  | "OBJECTIVES"
  | "CURRICULUM";

type ItemKind =
  | "LESSON"
  | "QUIZ";

type SyllabusItem = {
  kind: ItemKind;
  id: string;
  title: string;
  order?: number;
  href: string;
  locked: boolean;
};

export default function CoursePageClient({
  role,
  course,
  purchased,
  completedLessons,
  totalLessons,
  progressPct,
  ctaHref,
  ctaText,
}: any) {
  const [tab, setTab] =
    useState<Tab>("OVERVIEW");

  return (
    <div className={styles.shell}>
      <Sidebar role={role} />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <h1 className={styles.h1}>
            {course.title}
          </h1>

          {/* HERO */}

          <section className={styles.top}>
            <div
              className={styles.hero}
              style={{
                backgroundImage:
                  course.thumbnailUrl
                    ? `url(${course.thumbnailUrl})`
                    : undefined,
              }}
            />

            <div className={styles.progressCard}>
              <div className={styles.small}>
                {completedLessons} /{" "}
                {totalLessons} Lessons
                Completed
              </div>

              <div className={styles.bar}>
                <span
                  style={{
                    width: `${progressPct}%`,
                  }}
                />
              </div>

              <a
                className={styles.btn}
                href={ctaHref}
              >
                {ctaText}
              </a>
            </div>
          </section>

          {/* TABS */}

          <section className={styles.card}>
            <div className={styles.tabs}>
              <button
                onClick={() =>
                  setTab(
                    "OVERVIEW"
                  )
                }
                className={`${styles.tab} ${
                  tab ===
                  "OVERVIEW"
                    ? styles.activeTab
                    : ""
                }`}
              >
                Overview
              </button>

              <button
                onClick={() =>
                  setTab(
                    "OBJECTIVES"
                  )
                }
                className={`${styles.tab} ${
                  tab ===
                  "OBJECTIVES"
                    ? styles.activeTab
                    : ""
                }`}
              >
                Objectives
              </button>

              <button
                onClick={() =>
                  setTab(
                    "CURRICULUM"
                  )
                }
                className={`${styles.tab} ${
                  tab ===
                  "CURRICULUM"
                    ? styles.activeTab
                    : ""
                }`}
              >
                Curriculum
              </button>
            </div>

            {/* OVERVIEW */}

            {tab ===
              "OVERVIEW" && (
              <div
                className={
                  styles.textContent
                }
              >
                {course.description ||
                  "No course overview yet."}
              </div>
            )}

            {/* OBJECTIVES */}

            {tab ===
              "OBJECTIVES" && (
              <div
                className={
                  styles.textContent
                }
              >
                {course.objectives ||
                  "No learning objectives added yet."}
              </div>
            )}

            {/* CURRICULUM */}

            {tab ===
              "CURRICULUM" && (
              <div
                className={
                  styles.syllabus
                }
              >
                {course.modules.map(
                  (m: any) => {
                    const quiz =
                      m
                        .evaluations?.[0] ??
                      null;

                    const items: SyllabusItem[] =
                      [];

                    for (const lesson of m.lessons) {
                      items.push({
                        kind: "LESSON",

                        id: lesson.id,

                        title:
                          lesson.title,

                        order:
                          lesson.order,

                        href: `/lessons/${lesson.id}`,

                        locked:
                          !purchased,
                      });
                    }

                    if (quiz) {
                      items.push({
                        kind: "QUIZ",

                        id: quiz.id,

                        title:
                          quiz.title,

                        href: `/quiz/${quiz.id}`,

                        locked:
                          !purchased,
                      });
                    }

                    return (
                      <div
                        key={m.id}
                        className={
                          styles.moduleCard
                        }
                      >
                        <div
                          className={
                            styles.moduleHeader
                          }
                        >
                          <div
                            className={
                              styles.moduleTitle
                            }
                          >
                            Module{" "}
                            {m.order}
                            : {m.title}
                          </div>
                        </div>

                        <div
                          className={
                            styles.items
                          }
                        >
                          {items.map(
                            (
                              it
                            ) => {
                              const disabled =
                                it.locked;

                              return (
                                <a
                                  key={`${it.kind}-${it.id}`}
                                  className={`${styles.item} ${
                                    disabled
                                      ? styles.locked
                                      : ""
                                  }`}
                                  href={
                                    disabled
                                      ? "#"
                                      : it.href
                                  }
                                >
                                  <span
                                    className={
                                      styles.itemTitle
                                    }
                                  >
                                    {it.kind ===
                                    "LESSON"
                                      ? `Lesson ${it.order}: ${it.title}`
                                      : `Quiz: ${it.title}`}
                                  </span>

                                  <span
                                    className={
                                      styles.chev
                                    }
                                  >
                                    ›
                                  </span>
                                </a>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}