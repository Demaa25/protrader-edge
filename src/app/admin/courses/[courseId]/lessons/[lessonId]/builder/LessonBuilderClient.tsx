"use client";

import { useEffect, useState } from "react";
import styles from "../../admin-lessons.module.css";
import CourseBuilderSidebar from "../../CourseBuilderSidebar";

type BuilderData = {
  lesson: { title: string; order: number };
  module: { title: string; order: number };
};

export default function LessonBuilderClient({
  courseId,
  lessonId,
}: {
  courseId: string;
  lessonId: string;
}) {
  const [lessonTitle, setLessonTitle] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonOrder, setLessonOrder] = useState<number | null>(null);
  const [moduleOrder, setModuleOrder] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadBuilder() {
      try {
        const response = await fetch(`/api/admin/lessons/${lessonId}/builder`);
        if (!response.ok) return;

        const data = (await response.json()) as BuilderData;
        setLessonTitle(data.lesson.title);
        setLessonOrder(data.lesson.order);
        setModuleTitle(data.module.title);
        setModuleOrder(data.module.order);
      } catch (error) {
        console.error(error);
      }
    }

    void loadBuilder();
  }, [lessonId]);

  async function uploadDocument(file: File) {
    const form = new FormData();
    form.append("file", file);

    setUploading(true);
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/materials`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("Document upload failed");
      alert("Document uploaded");
    } catch (error) {
      console.error(error);
      alert("Document upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function uploadVideo(file: File) {
    const form = new FormData();
    form.append("video", file);

    setUploading(true);
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/video`, {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("Video upload failed");
      alert("Video uploaded");
    } catch (error) {
      console.error(error);
      alert("Video upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.builderShell}>
      <CourseBuilderSidebar
        courseId={courseId}
        onAddThumbnail={() => {}}
        onAddOverview={() => {}}
        onAddObjectives={() => {}}
        onAddModule={() => {}}
        onAddCertification={() => {}}
      />

      <main className={styles.builderMain}>
        <div className={styles.lessonBuilderCard}>
          <button className={styles.closeBuilder} onClick={() => history.back()}>
            ✕
          </button>

          <div className={styles.builderMeta}>
            <div><span>Module {moduleOrder}</span> {moduleTitle}</div>
            <div><span>Lesson {lessonOrder}</span> {lessonTitle}</div>
          </div>

          <h2>Lesson Builder</h2>

          <div className={styles.lessonBuilderGrid}>
            <label className={styles.builderAction}>
              {uploading ? "Uploading…" : "Upload Document"}
              <input
                type="file"
                hidden
                accept=".doc,.docx,.pdf"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadDocument(file);
                }}
              />
            </label>

            <label className={styles.builderAction}>
              {uploading ? "Uploading…" : "Upload Video"}
              <input
                type="file"
                hidden
                accept="video/*"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadVideo(file);
                }}
              />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}
