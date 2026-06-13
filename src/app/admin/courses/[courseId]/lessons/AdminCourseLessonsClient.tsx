// src/app/admin/courses/[courseId]/lessons/AdminCourseLessonsClient.tsx
"use client";

import { use, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import styles from "./admin-lessons.module.css";
import CourseBuilderSidebar from "./CourseBuilderSidebar";

type LessonItem = {
  id: string;
  title: string;
  order: number;
};

type ModuleQuiz = {
  id: string;
  title: string;
  bankId: string;
};

type ModuleItem = {
  id: string;
  title: string;
  order: number;
  lessons: LessonItem[];
  quiz?: ModuleQuiz | null;
};

type QuestionBank = {
  id: string;
  title: string;
};

const fetchJson = async (
  url: string,
  init?: RequestInit
) => {
  const res = await fetch(url, init);

  const data = await res
    .json()
    .catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.error ?? "Request failed"
    );
  }

  return data;
};

export default function AdminCourseLessonsClient({
  courseId,
}: {
  courseId: string;
}) {
  // ===========================
  // THUMBNAIL
  // ===========================

  const [thumbnailOpen, setThumbnailOpen] = useState (false);

  const [thumbnailUploading, setThumbnailUploading] = useState (false);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [thumbnailUploaded, setThumbnailUploaded] = useState (false);

  // ===========================
  // OVERVIEW
  // ===========================

  const [overviewOpen, setOverviewOpen] =
    useState(false);

  const [overviewPreview, setOverviewPreview] =
    useState(false);

  const [overviewText, setOverviewText] =
    useState("");

  const [overviewSaved, setOverviewSaved] =
    useState(false);

  // ===========================
  // OBJECTIVES
  // ===========================

  const [objectivesOpen, setObjectivesOpen] =
    useState(false);

  const [objectivesPreview, setObjectivesPreview] =
    useState(false);

  const [objectivesText, setObjectivesText] =
    useState("");

  const [objectivesSaved, setObjectivesSaved] =
    useState(false);

  // ===========================
    
  const [modules, setModules] = useState<
    ModuleItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [banks, setBanks] = useState<
    QuestionBank[]
  >([]);

  const [quizModuleId, setQuizModuleId] =
    useState<string | null>(null);

  const [quizTitle, setQuizTitle] =
    useState("");

  const [quizBankId, setQuizBankId] =
    useState("");

  async function loadModules() {
    setLoading(true);

    try {
      const data = await fetchJson(
        `/api/admin/courses/${courseId}/modules`
      );

      setModules(data.modules ?? data);

      if (data.course?.description) {
        setOverviewText(
          data.course.description
        );

        setOverviewSaved(true);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModules();
  }, [courseId]);

  async function uploadThumbnail() {
    if (!thumbnailFile) {
      alert("Please select an image");
      return;
    }

    const form = new FormData();

    form.append("file", thumbnailFile);

    setThumbnailUploading(true);

    const res = await fetch(
      `/api/admin/courses/${courseId}/thumbnail`,
      {
        method: "POST",
        body: form,
      }
    );

    setThumbnailUploading(false);

    if (!res.ok) {
      alert("Failed to upload thumbnail");
      return;
    }

    setThumbnailUploaded(true);

    alert("Thumbnail uploaded successfully");

    setThumbnailOpen(false);

    setThumbnailFile(null);
  }

  async function loadBanks() {
    const data = await fetchJson(
      `/api/admin/question-banks?type=QUIZ`
    );

    setBanks(data.banks ?? data);
  }

  async function createModule() {
    const title = prompt("Module title");

    if (!title) return;

    await fetchJson(
      `/api/admin/courses/${courseId}/modules`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      }
    );

    loadModules();
  }

  async function addLesson(
    moduleId?: string
  ) {
    const id = moduleId ?? modules[0]?.id;

    if (!id) return;

    const title = prompt("Lesson title");

    if (!title) return;

    await fetchJson(
      `/api/admin/modules/${id}/lessons`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      }
    );

    loadModules();
  }

  async function openQuiz(
    moduleId?: string
  ) {
    const id = moduleId ?? modules[0]?.id;

    if (!id) return;

    setQuizModuleId(id);

    setQuizTitle("");

    setQuizBankId("");

    await loadBanks();
  }

  async function createModuleQuiz() {
    if (!quizModuleId) return;

    await fetchJson(
      `/api/admin/modules/${quizModuleId}/quiz`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          title: quizTitle,
          bankId: quizBankId,
        }),
      }
    );

    setQuizModuleId(null);

    loadModules();
  }

  async function deleteModule(
    moduleId: string
  ) {
    if (!confirm("Delete module?"))
      return;

    await fetchJson(
      `/api/admin/modules/${moduleId}`,
      {
        method: "DELETE",
      }
    );

    loadModules();
  }

  async function removeLesson(
    lessonId: string
  ) {
    if (!confirm("Delete lesson?"))
      return;

    await fetchJson(
      `/api/admin/lessons/${lessonId}`,
      {
        method: "DELETE",
      }
    );

    loadModules();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.builderShell}>
      <CourseBuilderSidebar
        courseId={courseId}
        onAddThumbnail={() =>
          setThumbnailOpen(true)
        }
        onAddOverview={() =>
          setOverviewOpen(true)
        }
        onAddObjectives={() =>
          setObjectivesOpen(true)
        }
        onAddModule={createModule}
        onAddCertification={() => {}}
      />

      <main className={styles.builderMain}>
        <div className={styles.headerRow}>
          <h1 className={styles.h1}>
            Course Curriculum Builder
          </h1>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <section className={styles.card}>
          <div className={styles.cardTitle}>
            Course Structure
          </div>

          {/* THUMBNAIL */}

          {thumbnailOpen && (
            <section className={styles.card}>
              <div className={styles.cardTitle}>
                Upload Course Thumbnail
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    setThumbnailFile(file);
                  }
                }}
              />

              {thumbnailFile && (
                <div style={{ marginTop: 12 , fontWeight: 700}}>
                  Selected:
                  {" "}
                  {thumbnailFile.name}
                </div>
              )}

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 12,
                }}
              >
                <button
                  className={styles.secondary}
                  onClick={() => {
                    setThumbnailOpen(false);
                    setThumbnailFile(null);
                  }}
                >
                  Cancel
                </button>

                <button 
                  className={styles.primary}
                  onClick={uploadThumbnail}
                  disabled={
                    !thumbnailFile ||
                    thumbnailUploading
                  }
                >
                  {thumbnailUploading
                    ? "Uploading..."
                    : "Upload Thumbnail"
                  }
                </button>
              </div>
            </section>
          )}

          {(overviewOpen ||
            overviewSaved) && (
            <div className={styles.overviewBox}>
              <div
                className={
                  styles.overviewHead
                }
              >
                <div>
                  <h2
                    className={
                      styles.overviewTitle
                    }
                  >
                    Course Overview
                  </h2>

                  <p
                    className={
                      styles.overviewSub
                    }
                  >
                    What this course is about.
                  </p>
                </div>

                <div
                  className={
                    styles.overviewBtnRow
                  }
                >
                  {overviewSaved &&
                    !overviewOpen && (
                      <button
                        className={
                          styles.secondary
                        }
                        onClick={() =>
                          setOverviewPreview(
                            !overviewPreview
                          )
                        }
                      >
                        {overviewPreview
                          ? "Hide Preview"
                          : "Preview"}
                      </button>
                    )}

                  {overviewSaved &&
                    !overviewOpen && (
                      <button
                        className={
                          styles.secondary
                        }
                        onClick={() =>
                          setOverviewOpen(
                            true
                          )
                        }
                      >
                        Edit
                      </button>
                    )}
                </div>
              </div>

              {overviewOpen ? (
                <>
                  <textarea
                    value={overviewText}
                    onChange={(e) =>
                      setOverviewText(
                        e.target.value
                      )
                    }
                    placeholder="Write course overview..."
                    className={
                      styles.overviewTextarea
                    }
                  />

                  <div
                    className={
                      styles.overviewActions
                    }
                  >
                    <button
                      className={
                        styles.secondary
                      }
                      onClick={() =>
                        setOverviewOpen(
                          false
                        )
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className={
                        styles.primary
                      }
                      onClick={async () => {
                        await fetch(
                          `/api/admin/courses/${courseId}/overview`,
                          {
                            method:
                              "POST",

                            headers: {
                              "Content-Type":
                                "application/json",
                            },

                            body: JSON.stringify(
                              {
                                description:
                                  overviewText,
                              }
                            ),
                          }
                        );

                        setOverviewSaved(
                          true
                        );

                        setOverviewOpen(
                          false
                        );

                        setOverviewPreview(
                          false
                        );
                      }}
                    >
                      Save Overview
                    </button>
                  </div>
                </>
              ) : null}

              {overviewSaved &&
                overviewPreview && (
                  <div
                    className={
                      styles.overviewContent
                    }
                  >
                    {overviewText}
                  </div>
                )}
            </div>
          )}

          {/* OBJECTIVES */}

          {(objectivesOpen ||
            objectivesSaved) && (
            <div className={styles.overviewBox}>
              <div className={styles.overviewHead}>
                <div>
                  <h2
                    className={
                      styles.overviewTitle
                    }
                  >
                    Learning Objectives
                  </h2>

                  <p
                    className={
                      styles.overviewSub
                    }
                  >
                    What students will learn in this course.
                  </p>
                </div>

                <div
                  className={
                    styles.overviewBtnRow
                  }
                >
                  {objectivesSaved &&
                    !objectivesOpen && (
                      <button
                        className={
                          styles.secondary
                        }
                        onClick={() =>
                          setObjectivesPreview(
                            !objectivesPreview
                          )
                        }
                      >
                        {objectivesPreview
                          ? "Hide Preview"
                          : "Preview"}
                      </button>
                    )}

                  {objectivesSaved &&
                    !objectivesOpen && (
                      <button
                        className={
                          styles.secondary
                        }
                        onClick={() =>
                          setObjectivesOpen(
                            true
                          )
                        }
                      >
                        Edit
                      </button>
                    )}
                </div>
              </div>

              {objectivesOpen ? (
                <>
                  <textarea
                    value={objectivesText}
                    onChange={(e) =>
                      setObjectivesText(
                        e.target.value
                      )
                    }
                    placeholder="Write learning objectives..."
                    className={
                      styles.overviewTextarea
                    }
                  />

                  <div
                    className={
                      styles.overviewActions
                    }
                  >
                    <button
                      className={
                        styles.secondary
                      }
                      onClick={() =>
                        setObjectivesOpen(
                          false
                        )
                      }
                    >
                      Cancel
                    </button>

                    <button
                      className={
                        styles.primary
                      }
                      onClick={ async () => {
                        await fetch(
                          `/api/admin/courses/${courseId}/objectives`,
                          {
                            method:
                              "POST",

                            headers: {
                              "Content-Type":
                                "application/json",
                            },

                            body: JSON.stringify(
                              {
                                objectives:
                                  objectivesText,
                              }
                            ),
                          }
                        );

                        setObjectivesSaved(
                          true
                        );

                        setObjectivesOpen(
                          false
                        );

                        setObjectivesPreview(
                          false
                        );
                      }}
                    >
                      Save Objectives
                    </button>
                  </div>
                </>
              ) : null}

              {objectivesSaved &&
                objectivesPreview && (
                  <div
                    className={
                      styles.overviewContent
                    }
                  >
                    {objectivesText}
                  </div>
                )}
            </div>
          )}

          <div className={styles.modules}>
            {modules.map((m) => (
              <div
                key={m.id}
                className={
                  styles.moduleBlock
                }
              >
                <div
                  className={
                    styles.moduleHead
                  }
                >
                  <div
                    className={
                      styles.moduleTitle
                    }
                  >
                    Module {m.order}:{" "}
                    {m.title}
                  </div>

                  <div
                    className={
                      styles.moduleActions
                    }
                  >
                    <button
                      className={
                        styles.secondary
                      }
                      onClick={() =>
                        addLesson(m.id)
                      }
                    >
                      Add Lesson
                    </button>

                    <button
                      className={
                        styles.secondary
                      }
                      onClick={() =>
                        openQuiz(m.id)
                      }
                    >
                      {m.quiz
                        ? "Edit Quiz"
                        : "Add Quiz"}
                    </button>

                    <button
                      className={
                        styles.danger
                      }
                      onClick={() =>
                        deleteModule(
                          m.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div
                  className={
                    styles.lessonTree
                  }
                >
                  {m.lessons.map((l) => (
                    <div
                      key={l.id}
                      className={
                        styles.lessonCard
                      }
                    >
                      <Link
                        href={`/admin/courses/${courseId}/lessons/${l.id}/builder`}
                        className={
                          styles.lessonLink
                        }
                      >
                        <span>
                          Lesson {l.order}:{" "}
                          {l.title}
                        </span>
                      </Link>

                      <button
                        onClick={() =>
                          removeLesson(
                            l.id
                          )
                        }
                        className={
                          styles.trashBtn
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {m.quiz && (
                    <div
                      className={
                        styles.quizRow
                      }
                    >
                      Quiz:{" "}
                      {m.quiz.title}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {quizModuleId && (
          <section className={styles.card}>
            <div className={styles.cardTitle}>
              Module Quiz
            </div>

            <div className={styles.form}>
              <input
                className={styles.input}
                value={quizTitle}
                onChange={(e) =>
                  setQuizTitle(
                    e.target.value
                  )
                }
                placeholder="Quiz title"
              />

              <select
                className={styles.input}
                value={quizBankId}
                onChange={(e) =>
                  setQuizBankId(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Question Bank
                </option>

                {banks.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                  >
                    {b.title}
                  </option>
                ))}
              </select>

              <button
                className={styles.primary}
                onClick={createModuleQuiz}
              >
                Save Quiz
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}