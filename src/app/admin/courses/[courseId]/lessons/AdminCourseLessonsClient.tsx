// src/app/admin/courses/[courseId]/lessons/AdminCourseLessonsClient.tsx
"use client";

import { useEffect, useState } from "react";
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

const fetchJson = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Request failed");
  return data;
};

export default function AdminCourseLessonsClient({
  courseId,
}: {
  courseId: string;
}) {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [moduleTitle, setModuleTitle] = useState("");

  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [quizModuleId, setQuizModuleId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizBankId, setQuizBankId] = useState("");

  // NEW uploader state
  const [uploadLessonId, setUploadLessonId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [scenarioLessonId, setScenarioLessonId] = useState<string | null>(null);
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [scenarioInstruction, setScenarioInstruction] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");
  const [scenarioLevel, setScenarioLevel] = useState("FOUNDATION");
  const [chartFile, setChartFile] = useState<File | null>(null);

  async function loadModules() {
    setLoading(true);
    try {
      const data = await fetchJson(
        `/api/admin/courses/${courseId}/modules`
      );
      setModules(data.modules ?? data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModules();
  }, [courseId]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      }
    );

    loadModules();
  }

  async function addLesson(moduleId?: string) {
    const id = moduleId ?? modules[0]?.id;
    if (!id) return;

    const title = prompt("Lesson title");
    if (!title) return;

    await fetchJson(
      `/api/admin/modules/${id}/lessons`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      }
    );

    loadModules();
  }

  async function openScenarioBuilder(lessonId?: string) {
    const id = lessonId ?? modules[0]?.lessons[0]?.id;
    if (!id) return;

    setScenarioLessonId(id);
  }

  async function createScenario() {
    if (!scenarioLessonId) return;

    const form = new FormData();

    form.append("title", scenarioTitle);
    form.append("instruction", scenarioInstruction);
    form.append("description", scenarioDescription);
    form.append("level", scenarioLevel);

    if (chartFile) {
      form.append("chart", chartFile);
    }

    await fetch(
      `/api/admin/scenario/${scenarioLessonId}`,
      {
        method: "POST",
        body: form,
      }
    );

    setScenarioLessonId(null);
  }


  async function openQuiz(moduleId?: string) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quizTitle,
          bankId: quizBankId,
        }),
      }
    );

    setQuizModuleId(null);
    loadModules();
  }

  async function uploadFile(
    lessonId: string,
    file: File
  ) {
    const form = new FormData();
    form.append("file", file);

    setUploading(true);

    await fetch(
      `/api/admin/lessons/${lessonId}/materials`,
      {
        method: "POST",
        body: form,
      }
    );

    setUploading(false);
    setUploadLessonId(null);
  }

  async function deleteModule(moduleId: string) {
    if (!confirm("Delete module?")) return;

    await fetchJson(`/api/admin/modules/${moduleId}`, {
      method: "DELETE",
    });

    loadModules();
  }

  async function removeLesson(lessonId: string) {
    await fetchJson(`/api/admin/lessons/${lessonId}`, {
      method: "DELETE",
    });

    loadModules();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.builderShell}>
      <CourseBuilderSidebar
        courseId={courseId}
        onAddOverview={() => alert("Add overview")}
        onAddModule={createModule}
      />

      <main className={styles.builderMain}>
        <div className={styles.headerRow}>
          <h1 className={styles.h1}>
            Course Curriculum Builder
          </h1>
        </div>

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        <section className={styles.card}>
          <div className={styles.cardTitle}>
            Course Structure
          </div>

          <div className={styles.modules}>
            {modules.map((m) => (
              <div
                key={m.id}
                className={styles.moduleBlock}
              >
                <div className={styles.moduleHead}>
                  <div className={styles.moduleTitle}>
                    Module {m.order}: {m.title}
                  </div>

                  <div className={styles.moduleActions}>
                    <button
                      className={styles.secondary}
                      onClick={() =>
                        addLesson(m.id)
                      }
                    >
                      Add Lesson
                    </button>

                    <button
                      className={styles.secondary}
                      onClick={() =>
                        openQuiz(m.id)
                      }
                    >
                      {m.quiz
                        ? "Edit Quiz"
                        : "Add Quiz"}
                    </button>

                    <button
                      className={styles.danger}
                      onClick={() =>
                        deleteModule(m.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className={styles.lessonTree}>
                  {m.lessons.map((l) => (
                    <div
                      key={l.id}
                      className={styles.lessonRow}
                    >
                      Lesson {l.order}: {l.title}

                      <div>
                        <button
                          className={styles.link}
                          onClick={() =>
                            setUploadLessonId(l.id)
                          }
                        >
                          Upload Doc
                        </button>

                        <button
                          className={styles.link}
                          onClick={() => openScenarioBuilder(l.id)}
                        >
                          Add Scenario
                        </button>

                        <button
                          onClick={() =>
                            removeLesson(l.id)
                          }
                          className={styles.linkDanger}
                        >
                          remove
                        </button>
                      </div>

                      {uploadLessonId === l.id && (
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            uploadFile(
                              l.id,
                              e.target.files![0]
                            )
                          }
                        />
                      )}
                    </div>
                  ))}

                  {m.quiz && (
                    <div className={styles.quizRow}>
                      Quiz: {m.quiz.title}
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
                  setQuizTitle(e.target.value)
                }
                placeholder="Quiz title"
              />

              <select
                className={styles.input}
                value={quizBankId}
                onChange={(e) =>
                  setQuizBankId(e.target.value)
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

        {scenarioLessonId && (
          <section className={styles.card}>
            <div className={styles.cardTitle}>
              Create Scenario
            </div>

            <div className={styles.form}>
              <input
                className={styles.input}
                placeholder="Scenario title"
                value={scenarioTitle}
                onChange={(e) =>
                  setScenarioTitle(e.target.value)
                }
              />

              <select
                className={styles.input}
                value={scenarioLevel}
                onChange={(e) =>
                  setScenarioLevel(e.target.value)
                }
              >
                <option value="FOUNDATION">
                  Foundation
                </option>
                <option value="INTERMEDIATE">
                  Intermediate
                </option>
                <option value="ADVANCED">
                  Advanced
                </option>
              </select>

              <textarea 
                className={styles.input}
                placeholder="Instruction"
                value={scenarioInstruction}
                onChange={(e) =>
                  setScenarioInstruction(e.target.value)
                }
              />

              <textarea 
                className={styles.input}
                placeholder="Description"
                value={scenarioDescription}
                onChange={(e) =>
                  setScenarioDescription(e.target.value)
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setChartFile(
                    e.target.files?.[0] ?? null
                  )
                }
              />

              <button
                className={styles.primary}
                onClick={createScenario}
              >
                Save Scenario
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}