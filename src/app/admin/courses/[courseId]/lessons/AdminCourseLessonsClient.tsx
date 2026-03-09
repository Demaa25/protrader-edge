// src/app/admin/courses/[courseId]/lessons/AdminCourseLessonsClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./admin-lessons.module.css";

type BankType = "QUIZ" | "ASSESSMENT" | "TEST";
type QuestionBank = { id: string; title: string; type: BankType };

type MaterialType = "VIDEO" | "DOCUMENT";
type LessonMaterial = { id: string; type: MaterialType; title: string; url: string; order: number };

type LessonQuiz = {
  id: string;
  title: string;
  bankId: string;
  questionCount: number;
  passMarkPct: number;
  randomize: boolean;
  createdAt: string;
};

type LessonItem = {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  quizzes: LessonQuiz[];
};

type ModuleAssessment = {
  id: string;
  title: string;
  bankId: string;
  createdAt: string;
};

type ModuleItem = {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  lessons: LessonItem[];
  assessments: ModuleAssessment[];
};

const fetchJson = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? (await res.text()));
  return data;
};

export default function AdminCourseLessonsClient({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Module
  const [moduleTitle, setModuleTitle] = useState("");

  // Banks loader
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState("");

  // Create Test (course-level)
  const [showTestForm, setShowTestForm] = useState(false);
  const [testTitle, setTestTitle] = useState("");
  const [testBankId, setTestBankId] = useState("");

  // Create Assessment (module-level)
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [assessmentBankId, setAssessmentBankId] = useState("");
  const [assessmentModuleId, setAssessmentModuleId] = useState("");

  // Create Quiz (lesson-level)
  const [quizPickerLessonId, setQuizPickerLessonId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizBankId, setQuizBankId] = useState("");
  const [quizQuestionCount, setQuizQuestionCount] = useState(5);

  // Materials panel
  const [materialsForLessonId, setMaterialsForLessonId] = useState<string | null>(null);
  const [materials, setMaterials] = useState<LessonMaterial[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsError, setMaterialsError] = useState("");

  // NEW: Upload support (DOCUMENT)
  const [newMatType, setNewMatType] = useState<MaterialType>("VIDEO");
  const [newMatTitle, setNewMatTitle] = useState("");
  const [newMatUrl, setNewMatUrl] = useState(""); // used for VIDEO (and optional doc URLs)
  const [newMatFile, setNewMatFile] = useState<File | null>(null); // used for DOCUMENT uploads
  const [uploading, setUploading] = useState(false);

  const totalLessons = useMemo(
    () => modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0),
    [modules]
  );

  async function loadModules() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchJson(`/api/admin/courses/${courseId}/modules`, { cache: "no-store" });
      setModules(Array.isArray(data) ? data : data.modules ?? []);
    } catch (e: any) {
      setError(e?.message || "Failed to load modules.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function loadBanks(type?: BankType) {
    setBanksError("");
    setBanksLoading(true);
    try {
      const qs = type ? `?type=${encodeURIComponent(type)}` : "";
      const data = await fetchJson(`/api/admin/question-banks${qs}`, { cache: "no-store" });
      const list: QuestionBank[] = Array.isArray(data) ? data : data.banks ?? [];
      setBanks(list);
      return list;
    } catch (e: any) {
      const msg = e?.message || "Could not load question banks.";
      setBanksError(msg);
      return [];
    } finally {
      setBanksLoading(false);
    }
  }

  async function createModule() {
    setError("");
    const title = moduleTitle.trim();
    if (!title) return;

    try {
      await fetchJson(`/api/admin/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setModuleTitle("");
      await loadModules();
    } catch (e: any) {
      setError(e?.message || "Failed to create module.");
    }
  }

  async function addLesson(moduleId: string) {
    setError("");
    const title = prompt("Lesson title")?.trim();
    if (!title) return;

    try {
      await fetchJson(`/api/admin/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      await loadModules();
    } catch (e: any) {
      setError(e?.message || "Failed to add lesson.");
    }
  }

  // ===== QUIZ (lesson-level) =====
  async function openQuizPicker(lessonId: string) {
    setQuizTitle("");
    setQuizBankId("");
    setQuizQuestionCount(5);
    setQuizPickerLessonId(lessonId);

    const list = await loadBanks("QUIZ");
    if (list?.[0]?.id) setQuizBankId(list[0].id);
  }

  async function createLessonQuiz() {
    if (!quizPickerLessonId) return;
    setError("");

    const title = quizTitle.trim();
    if (!title) return setError("Quiz title is required.");
    if (!quizBankId) return setError("Please select a Quiz bank.");

    try {
      await fetchJson(`/api/admin/lessons/${quizPickerLessonId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bankId: quizBankId, questionCount: quizQuestionCount }),
      });

      setQuizPickerLessonId(null);
      await loadModules();
    } catch (e: any) {
      setError(e?.message || "Failed to create quiz.");
    }
  }

  async function removeQuiz(evaluationId: string) {
    setError("");
    try {
      await fetchJson(`/api/admin/quizzes/${evaluationId}`, { method: "DELETE" });
      await loadModules();
    } catch (e: any) {
      setError(e?.message || "Failed to remove quiz.");
    }
  }

  // ===== ASSESSMENT (module-level) =====
  async function toggleAssessmentForm() {
    const next = !showAssessmentForm;
    setShowAssessmentForm(next);
    setShowTestForm(false);

    if (next) {
      const list = await loadBanks("ASSESSMENT");
      if (list?.[0]?.id) setAssessmentBankId(list[0].id);

      const firstModuleId = modules?.[0]?.id ?? "";
      setAssessmentModuleId(firstModuleId);
    }
  }

  async function createAssessment() {
    setError("");
    const title = assessmentTitle.trim();
    if (!title) return;
    if (!assessmentBankId) return setError("Please select an Assessment bank.");
    if (!assessmentModuleId) return setError("Please select a Module for the assessment.");

    try {
      await fetchJson(`/api/admin/modules/${assessmentModuleId}/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bankId: assessmentBankId, questionCount: 10 }),
      });

      setAssessmentTitle("");
      setShowAssessmentForm(false);
      await loadModules();
    } catch (e: any) {
      setError(e?.message || "Failed to create assessment.");
    }
  }

  // ===== TEST (course-level) =====
  async function toggleTestForm() {
    const next = !showTestForm;
    setShowTestForm(next);
    setShowAssessmentForm(false);

    if (next) {
      const list = await loadBanks("TEST");
      if (list?.[0]?.id) setTestBankId(list[0].id);
    }
  }

  async function createTest() {
    setError("");
    const title = testTitle.trim();
    if (!title) return;
    if (!testBankId) return setError("Please select a Test bank.");

    try {
      await fetchJson(`/api/admin/courses/${courseId}/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bankId: testBankId }),
      });

      setTestTitle("");
      setShowTestForm(false);
      alert("Test created/updated.");
    } catch (e: any) {
      setError(e?.message || "Failed to create test.");
    }
  }

  // ===== MATERIALS =====
  async function openMaterials(lessonId: string) {
    setMaterialsError("");
    setMaterialsLoading(true);
    setMaterialsForLessonId(lessonId);
    setMaterials([]);

    setNewMatType("VIDEO");
    setNewMatTitle("");
    setNewMatUrl("");
    setNewMatFile(null);

    try {
      const data = await fetchJson(`/api/admin/lessons/${lessonId}/materials`, { cache: "no-store" });
      setMaterials(Array.isArray(data?.materials) ? data.materials : []);
    } catch (e: any) {
      setMaterialsError(e?.message || "Failed to load lesson materials.");
    } finally {
      setMaterialsLoading(false);
    }
  }

  function onPickFile(file: File | null) {
    setNewMatFile(file);
    if (file && !newMatTitle.trim()) {
      // default title to filename if empty
      setNewMatTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  }

  async function uploadPdf(file: File): Promise<string> {
    // Uses the API route included below
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "Upload failed");
    if (!data?.url) throw new Error("Upload failed: no url returned");
    return String(data.url);
  }

  async function addMaterial() {
    if (!materialsForLessonId) return;
    setMaterialsError("");

    const title = newMatTitle.trim();
    if (!title) return setMaterialsError("Material title is required.");

    try {
      setUploading(true);

      let url = newMatUrl.trim();

      // If DOCUMENT, prefer upload
      if (newMatType === "DOCUMENT") {
        if (newMatFile) {
          // basic validation
          if (newMatFile.type !== "application/pdf" && !newMatFile.name.toLowerCase().endsWith(".pdf")) {
            throw new Error("Only PDF files are supported for now.");
          }
          url = await uploadPdf(newMatFile);
        } else {
          // allow URL fallback if they didn't upload (optional)
          if (!url) throw new Error("Please upload a PDF file (recommended) or provide a document URL.");
        }
      } else {
        // VIDEO requires a URL
        if (!url) throw new Error("Video URL is required.");
      }

      const data = await fetchJson(`/api/admin/lessons/${materialsForLessonId}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newMatType, title, url }),
      });

      const created = data?.material as LessonMaterial | undefined;
      if (created) setMaterials((prev) => [...prev, created].sort((a, b) => a.order - b.order));

      // reset inputs
      setNewMatTitle("");
      setNewMatUrl("");
      setNewMatFile(null);
    } catch (e: any) {
      setMaterialsError(e?.message || "Failed to add material.");
    } finally {
      setUploading(false);
    }
  }

  async function deleteMaterial(lessonId: string, materialId: string) {
    setMaterialsError("");
    try {
      await fetchJson(`/api/admin/lessons/${lessonId}/materials/${materialId}`, { method: "DELETE" });
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    } catch (e: any) {
      setMaterialsError(e?.message || "Failed to delete material.");
    }
  }

  async function deleteModule(moduleId: string) {
    setError("");
    if (!confirm("Delete this module?")) return;

    try {
      await fetchJson(`/api/admin/modules/${moduleId}`, { method: "DELETE" });
      await loadModules();
    } catch (e: any) {
      setError(e?.message || "Failed to delete module.");
    }
  }

  async function removeLesson(lessonId: string) {
    setError("");
    try {
      await fetchJson(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
      await loadModules();
    } catch (e: any) {
      setError(e?.message || "Failed to remove lesson.");
    }
  }

  if (loading) return <div className={styles.muted}>Loading...</div>;

  return (
    <>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.h1}>Edit Lessons</h1>
          <p className={styles.sub}>
            Create modules, add lessons, then attach a quiz (Evaluation → QUIZ) to each lesson.
            Assessments attach to modules. Tests attach to the course.
          </p>
        </div>
        <div className={styles.badge}>{totalLessons} Lessons</div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <section className={styles.card}>
        <div className={styles.cardTitle}>Create Module</div>

        <div className={styles.form}>
          <div className={styles.label}>Module Title</div>
          <input
            className={styles.input}
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            placeholder="e.g. Market Structure"
          />

          <div className={styles.formActions}>
            <button className={styles.primary} onClick={createModule} type="button">
              Create Module
            </button>

            <button className={styles.secondary} onClick={toggleAssessmentForm} type="button">
              Create Assessment
            </button>

            <button className={styles.secondary} onClick={toggleTestForm} type="button">
              Create Test
            </button>
          </div>

          {showAssessmentForm ? (
            <div className={styles.assessmentBox}>
              <div className={styles.label}>Assessment Title</div>
              <input
                className={styles.input}
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
                placeholder="e.g. Module 1 Assessment"
              />

              <div className={styles.label}>Module</div>
              <select
                className={styles.input}
                value={assessmentModuleId}
                onChange={(e) => setAssessmentModuleId(e.target.value)}
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    Module {m.order}: {m.title}
                  </option>
                ))}
              </select>

              <div className={styles.label}>Assessment Bank</div>
              <select
                className={styles.input}
                value={assessmentBankId}
                onChange={(e) => setAssessmentBankId(e.target.value)}
                disabled={banksLoading}
              >
                {banksLoading ? (
                  <option value="">Loading banks...</option>
                ) : banks.length === 0 ? (
                  <option value="">No assessment banks found</option>
                ) : (
                  banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))
                )}
              </select>

              {banksError ? <div className={styles.mutedSmall}>{banksError}</div> : null}

              <button className={styles.primary} onClick={createAssessment} type="button">
                Create Assessment
              </button>
            </div>
          ) : null}

          {showTestForm ? (
            <div className={styles.assessmentBox}>
              <div className={styles.label}>Test Title</div>
              <input
                className={styles.input}
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g. Final Test"
              />

              <div className={styles.label}>Test Bank</div>
              <select
                className={styles.input}
                value={testBankId}
                onChange={(e) => setTestBankId(e.target.value)}
                disabled={banksLoading}
              >
                {banksLoading ? (
                  <option value="">Loading banks...</option>
                ) : banks.length === 0 ? (
                  <option value="">No test banks found</option>
                ) : (
                  banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))
                )}
              </select>

              {banksError ? <div className={styles.mutedSmall}>{banksError}</div> : null}

              <button className={styles.primary} onClick={createTest} type="button">
                Create Test
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>Modules</div>

        {!modules.length ? (
          <div className={styles.muted}>No modules yet.</div>
        ) : (
          <div className={styles.modules}>
            {modules.map((m) => (
              <div key={m.id} className={styles.moduleBlock}>
                <div className={styles.moduleHead}>
                  <div className={styles.moduleTitle}>Module {m.order}: {m.title}</div>

                  <div className={styles.moduleActions}>
                    <button className={styles.secondary} onClick={() => addLesson(m.id)} type="button">
                      Add Lesson
                    </button>

                    <button className={styles.danger} onClick={() => deleteModule(m.id)} type="button">
                      Delete Module
                    </button>
                  </div>
                </div>

                <div className={styles.itemsGrid}>
                  <div>
                    <div className={styles.itemsTitle}>Lessons (and Lesson Quizzes)</div>

                    {m.lessons?.length ? (
                      <ul className={styles.list}>
                        {m.lessons.map((l) => {
                          const quiz = l.quizzes?.[0] ?? null;
                          return (
                            <li key={l.id} className={styles.listRow} style={{ alignItems: "flex-start" }}>
                              <div>
                                <div className={styles.itemName}>
                                  Lesson {l.order}: {l.title}
                                </div>
                                <div className={styles.mutedSmall}>
                                  Quiz: {quiz ? quiz.title : "— none —"}
                                </div>
                              </div>

                              <div className={styles.rowActions}>
                                <button className={styles.link} onClick={() => openMaterials(l.id)} type="button">
                                  Materials
                                </button>

                                <button className={styles.link} onClick={() => openQuizPicker(l.id)} type="button">
                                  {quiz ? "Edit Quiz" : "Add Quiz"}
                                </button>

                                {quiz ? (
                                  <button className={styles.linkDanger} onClick={() => removeQuiz(quiz.id)} type="button">
                                    Remove Quiz
                                  </button>
                                ) : null}

                                <button className={styles.linkDanger} onClick={() => removeLesson(l.id)} type="button">
                                  Remove Lesson
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className={styles.mutedSmall}>No lessons yet.</div>
                    )}

                    {quizPickerLessonId ? (
                      <div className={styles.assessmentBox} style={{ marginTop: 12 }}>
                        <div className={styles.label}>Quiz Title</div>
                        <input
                          className={styles.input}
                          value={quizTitle}
                          onChange={(e) => setQuizTitle(e.target.value)}
                          placeholder="e.g. Lesson 1 Quiz"
                        />

                        <div className={styles.label}>Quiz Bank</div>
                        <select
                          className={styles.input}
                          value={quizBankId}
                          onChange={(e) => setQuizBankId(e.target.value)}
                          disabled={banksLoading}
                        >
                          {banksLoading ? (
                            <option value="">Loading banks...</option>
                          ) : banks.length === 0 ? (
                            <option value="">No quiz banks found</option>
                          ) : (
                            banks.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.title}
                              </option>
                            ))
                          )}
                        </select>

                        <div className={styles.label}>Questions per attempt</div>
                        <input
                          className={styles.input}
                          type="number"
                          min={1}
                          max={15}
                          value={quizQuestionCount}
                          onChange={(e) => setQuizQuestionCount(Number(e.target.value))}
                        />

                        {banksError ? <div className={styles.mutedSmall}>{banksError}</div> : null}

                        <div className={styles.formActions}>
                          <button className={styles.primary} onClick={createLessonQuiz} type="button">
                            Save Quiz
                          </button>
                          <button className={styles.secondary} onClick={() => setQuizPickerLessonId(null)} type="button">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {materialsForLessonId ? (
                      <div className={styles.materialBox}>
                        <div className={styles.materialHead}>
                          <div className={styles.itemsTitle}>Lesson Materials</div>
                          <button
                            className={styles.secondary}
                            type="button"
                            onClick={() => {
                              setMaterialsForLessonId(null);
                              setMaterials([]);
                              setMaterialsError("");
                              setNewMatFile(null);
                            }}
                          >
                            Close
                          </button>
                        </div>

                        {materialsError ? <div className={styles.mutedSmall}>{materialsError}</div> : null}
                        {materialsLoading ? (
                          <div className={styles.mutedSmall}>Loading materials...</div>
                        ) : materials.length === 0 ? (
                          <div className={styles.mutedSmall}>No materials yet.</div>
                        ) : (
                          <ul className={styles.materialList}>
                            {materials.map((mm) => (
                              <li key={mm.id} className={styles.materialRow}>
                                <div>
                                  <div className={styles.materialTitle}>
                                    [{mm.type}] {mm.title}
                                  </div>
                                  <a className={styles.materialLink} href={mm.url} target="_blank" rel="noreferrer">
                                    {mm.url}
                                  </a>
                                </div>
                                <button
                                  className={styles.linkDanger}
                                  onClick={() => deleteMaterial(materialsForLessonId, mm.id)}
                                  type="button"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Add material form */}
                        <div className={styles.materialForm} style={{ gridTemplateColumns: "160px 1fr 1fr auto" }}>
                          <select
                            className={styles.input}
                            value={newMatType}
                            onChange={(e) => {
                              const t = e.target.value as MaterialType;
                              setNewMatType(t);
                              setNewMatUrl("");
                              setNewMatFile(null);
                            }}
                          >
                            <option value="VIDEO">Video</option>
                            <option value="DOCUMENT">Document (PDF Upload)</option>
                          </select>

                          <input
                            className={styles.input}
                            value={newMatTitle}
                            onChange={(e) => setNewMatTitle(e.target.value)}
                            placeholder="Material title (e.g. Lesson PDF)"
                          />

                          {/* 3rd column: either URL or FILE */}
                          {newMatType === "DOCUMENT" ? (
                            <input
                              className={styles.input}
                              type="file"
                              accept="application/pdf,.pdf"
                              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                            />
                          ) : (
                            <input
                              className={styles.input}
                              value={newMatUrl}
                              onChange={(e) => setNewMatUrl(e.target.value)}
                              placeholder="https://... (video link)"
                            />
                          )}

                          <button
                            className={styles.primary}
                            onClick={addMaterial}
                            type="button"
                            disabled={uploading}
                          >
                            {uploading ? "Adding..." : "Add Material"}
                          </button>
                        </div>

                        {/* Optional helper line */}
                        {newMatType === "DOCUMENT" ? (
                          <div className={styles.mutedSmall}>
                            Upload a PDF. It will be saved under <b>/public/uploads</b> and the URL stored in the DB.
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <div className={styles.itemsTitle}>Module Assessment</div>

                    {m.assessments?.length ? (
                      <ul className={styles.list}>
                        {m.assessments.map((a) => (
                          <li key={a.id} className={styles.listRow}>
                            <span className={styles.itemName}>{a.title}</span>
                            <span className={styles.mutedSmall}>Bank: {a.bankId}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={styles.mutedSmall}>No assessment yet (use “Create Assessment”).</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}