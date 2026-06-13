// src/app/admin/courses/[courseId]/lessons/[lessonId]/builder/LessonBuilderClient.tsx
"use client";

import { useEffect, useState } from "react";
import styles from "../../admin-lessons.module.css";
import CourseBuilderSidebar from "../../CourseBuilderSidebar";

type Bank = {
  id: string;
  title: string;
};

export default function LessonBuilderClient({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}) {
  const [uploading, setUploading] =
    useState(false);

  const [lessonTitle, setLessonTitle] =
    useState("");

  const [moduleTitle, setModuleTitle] =
    useState("");

  const [lessonOrder, setLessonOrder] =
   useState<number | null>(null);

  const [moduleOrder, setModuleOrder] =
    useState<number | null>(null);

  const [hasApplication, setHasApplication] =
    useState(false);

  const [hasKC, setHasKC] =
    useState(false);

  const [banks, setBanks] = useState<
    Bank[]
  >([]);

  // ===== MODALS =====

  const [applicationOpen, setApplicationOpen] =
    useState(false);

  const [kcOpen, setKcOpen] =
    useState(false);

  // ===== APPLICATION =====

  const [appInstruction, setAppInstruction] =
    useState("");

  const [appRequirements, setAppRequirements] =
    useState("");

  const [appScenario, setAppScenario] =
    useState("");

  const [chartFile, setChartFile] =
    useState<File | null>(null);

  const [chartPreview, setChartPreview] =
    useState("");

  const [focusAreas, setFocusAreas] =
    useState<string[]>([""]);

  // ===== KNOWLEDGE CHECK =====

  const [kcTitle, setKcTitle] =
    useState("Knowledge Check");

  const [kcBankId, setKcBankId] =
    useState("");

  useEffect(() => {
    loadBuilder();
  }, []);

  async function loadBuilder() {
    try {
      // =========================
      // LESSON DATA
      // =========================

      const lessonRes = await fetch(
        `/api/admin/lessons/${lessonId}/builder`
      );

      if (lessonRes.ok) {
          const data =
          await lessonRes.json();

          // =========================
          // LESSON + MODULE
          // =========================

          setLessonTitle(
            data.lesson.title
          );

          setLessonOrder(
            data.lesson.order
          );

          setModuleTitle(
            data.module.title
          );

          setModuleOrder(
            data.module.order
          );

          // =========================
          // APPLICATION
          // =========================

          if (data.application) {
            setHasApplication(true);

            setAppInstruction(
              data.application
                .instruction ?? ""
            );

            setAppRequirements(
              data.application
                .requirements ?? ""
            );

            setAppScenario(
              data.application
                .scenario ?? ""
            );

            setChartPreview(
              data.application
                .chartImageUrl ?? ""
            );

            setFocusAreas(
              data.application
                .focusAreas?.length
                ? data.application
                  .focusAreas
                : [""]
              );
            }

            // =========================
            // KNOWLEDGE CHECK
            // =========================

            if (data.knowledgeCheck) {
              setHasKC(true);

              setKcTitle(
                data.knowledgeCheck
                  .title ??
                  "Knowledge Check"
              );

              setKcBankId(
                data.knowledgeCheck
                  .bankId ?? ""
              );
            }
          }

          // =========================
          // BANKS
          // =========================

          const bankRes = await fetch(
            `/api/admin/question-banks?type=KNOWLEDGE_CHECK`
          );

          if (bankRes.ok) {
            const bankData =
              await bankRes.json();

            setBanks(
              bankData.banks ??
                bankData
            );
          }
        } catch (e) {
          console.error(e);
        }
      }

  // =====================================
  // DOC
  // =====================================

  async function uploadDoc(
    file: File
  ) {
    const form = new FormData();

    form.append("file", file);

    await fetch(
      `/api/admin/lessons/${lessonId}/materials`,
      {
        method: "POST",
        body: form,
      }
    );

    alert("Document uploaded");
  }

  // =====================================
  // VIDEO
  // =====================================

  async function uploadVideo(
    file: File
  ) {
    const form = new FormData();

    form.append("video", file);

    setUploading(true);

    await fetch(
      `/api/admin/lessons/${lessonId}/video`,
      {
        method: "POST",
        body: form,
      }
    );

    setUploading(false);

    alert("Video uploaded");
  }

  // =====================================
  // APPLICATION
  // =====================================

  async function saveApplication() {
    const form = new FormData();

    form.append(
      "instruction",
      appInstruction
    );

    form.append(
      "requirements",
      appRequirements
    );

    form.append(
      "scenario",
      appScenario
    );
    
    if (chartFile) {
      form.append(
        "chart",
        chartFile
      );
    }

    focusAreas
      .filter((f) => f.trim())
      .forEach((area) => {
        form.append(
          "focusAreas", 
          area
        );
      });

    const res = await fetch(
      `/api/admin/application/${lessonId}`,
      {
        method: "POST",
        body: form,
      }
    );

    if (!res.ok) {
      alert(
        "Failed to save application"
      );
      return;
    }

    setHasApplication(true);
    setApplicationOpen(false);

    alert("Application Saved");
  }

  // =====================================
  // KNOWLEDGE CHECK
  // =====================================

  async function saveKC() {
    const res = await fetch(
      `/api/admin/lessons/${lessonId}/knowledge-check`,
      {
        method: "POST",

        headers: {
          "Content-Type":
          "application/json",
        },

        body: JSON.stringify({
          title: kcTitle,
          bankId: kcBankId,
          questionCount: 5,
          passMarkPct: 70,
        }),
      }
    );

    if (!res.ok) {
      const err =
        await res.json();

      alert(
        err.error ||
          "Failed"
      );

      return;
    }

    setHasKC(true);

    setKcOpen(false);

    alert(
      "Knowledge Check Saved"
    );
  }

  return (
    <div className={styles.builderShell}>
      <CourseBuilderSidebar
        courseId={courseId}
        onAddOverview={() => {}}
        onAddModule={() => {}}
      />

      <main className={styles.builderMain}>
        <div
          className={
            styles.lessonBuilderCard
          }
        >
          <button
            className={
              styles.closeBuilder
            }
            onClick={() =>
              history.back()
            }
          >
            ✕
          </button>

          <div
            className={
              styles.builderMeta
            }
          >
            <div>
              <span>
                Module {moduleOrder}
              </span>{" "}
              {moduleTitle}
            </div>

            <div>
              <span>
                Lesson {lessonOrder}
              </span>{" "}
              {lessonTitle}
            </div>
          </div>

          <h2>Lesson Builder</h2>

          <div
            className={
              styles.lessonBuilderGrid
            }
          >
            {/* DOC */}

            <label
              className={
                styles.builderAction
              }
            >
              Upload DOC

              <input
                type="file"
                hidden
                accept=".doc,.docx,.pdf"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file)
                    uploadDoc(file);
                }}
              />
            </label>

            {/* VIDEO */}

            <label
              className={
                styles.builderAction
              }
            >
              Upload Video

              <input
                type="file"
                hidden
                accept="video/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file)
                    uploadVideo(file);
                }}
              />
            </label>

            {/* APPLICATION */}

            <button
              className={
                styles.builderAction
              }
              onClick={() =>
                setApplicationOpen(true)
              }
            >
              {hasApplication
                ? "Edit Application"
                : "Create Application"}
            </button>

            {/* KNOWLEDGE CHECK */}

            <button
              className={
                styles.builderAction
              }
              onClick={() =>
                setKcOpen(true)
              }
            >
              {hasKC
                ? "Edit Knowledge Check"
                : "Create Knowledge Check"}
            </button>
          </div>
        </div>

        {/* =====================================
            APPLICATION MODAL
        ===================================== */}

        {applicationOpen && (
          <div className={styles.workspace}>
            <h3>
              Application Workspace
            </h3>

            <textarea
              className={styles.workspaceInput}
              placeholder="Instruction"
              value={appInstruction}
              onChange={(e) =>
                setAppInstruction(
                  e.target.value
                )
              }
            />

            <textarea
              className={styles.workspaceInput}
              placeholder="Requirements"
              value={appRequirements}
              onChange={(e) =>
                setAppRequirements(
                  e.target.value
                )
              }
            />

            <textarea
              className={styles.workspaceInput}
              placeholder="Scenario"
              value={appScenario}
              onChange={(e) =>
                setAppScenario(
                  e.target.value
                )
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                setChartFile(file);

                setChartPreview(
                  URL.createObjectURL(file)
                );
              }}
            />

            {chartPreview && (
              <img
                src={chartPreview}
                alt="Chart"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  marginTop: "12px",
                }}
              />
            )}

            {focusAreas.map(
              (area, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    className={styles.workspaceInput}
                    value={area}
                    onChange={(e) => {
                      const copy = [
                        ...focusAreas,
                      ];

                      copy[index] = 
                        e.target.value;

                        setFocusAreas(copy);
                    }}
                  />

                  <button
                    type="button"
                    className={styles.primary}
                    onClick={() => {
                      const copy =
                        focusAreas.filter(
                          (_, i) =>
                            i !== index
                        );

                        setFocusAreas(
                          copy.length
                            ? copy
                            : [""]
                        );
                    }}
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            <button
              className={styles.primary}
              type="button"
              onClick={() =>
                setFocusAreas([
                  ...focusAreas,
                  "",
                ])
              }
            >
              + Add Focus Area
            </button>

            <button
              className={styles.primary}
              onClick={saveApplication}
            >
              Save Application
            </button>
          </div>
        )}

        {/* =====================================
            KNOWLEDGE CHECK
        ===================================== */}

        {kcOpen && (
          <div className={styles.workspace}>
            <h3>
              Knowledge Check
            </h3>

            <input
              className={styles.workspaceInput}
              value={kcTitle}
              onChange={(e) =>
                setKcTitle(
                  e.target.value
                )
              }
            />

            <select
              className={styles.workspaceInput}
              value={kcBankId}
              onChange={(e) =>
                setKcBankId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Knowledge Check Bank
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
              onClick={saveKC}
            >
              Save Knowledge Check
            </button>
          </div>
        )}
      </main>
    </div>
  );
}