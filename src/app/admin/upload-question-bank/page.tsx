// src/app/admin/upload-question-bank/page.tsx
"use client";

import { useState } from "react";
import styles from "./upload-question-bank.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";

export default function UploadQuestionBankPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-question-bank", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        setIsError(true);
      } else {
        setMessage("Upload successful");
        setIsError(false);
        setFile(null);
      }
    } catch {
      setMessage("Network error");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.shell}>
      <Sidebar role="ADMIN" />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <div className={styles.card}>
            <h1 className={styles.h1}>Upload Question Bank</h1>
            <p className={styles.p}>
              Upload a CSV file to seed questions into the system.
            </p>

            <form className={styles.form} onSubmit={handleUpload}>
              <input
                type="file"
                accept=".csv"
                className={styles.fileInput}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <button className={styles.btn} disabled={loading}>
                {loading ? "Uploading..." : "Upload CSV"}
              </button>
            </form>

            <button
              type="button"
              className={styles.templateLink}
              onClick={() => {
                const csv = `courseId,bankName,bankType,evaluationType,scopeType,scopeOrder,question,labelA,labelB,labelC,labelD,isCorrect,explanation\n`;

                const blob = new Blob([csv], {type: "text/csv"});
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "question-bank-template.csv";
                a.click();

                URL.revokeObjectURL;
              }}
            >
              Download CSV Template
            </button>

            {message && (
              <div className={isError ? styles.error : styles.success}>
                {message}
              </div>
            )}
          </div>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}