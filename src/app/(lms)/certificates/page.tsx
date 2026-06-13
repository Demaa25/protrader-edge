// src/app/(lms)/certificates/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Sidebar } from "@/components/Sidebar";
import styles from "./certificates.module.css";
import CertificateTemplate from "./CertificateTemplate";

type Course = {
  id: string;
  title: string;
};

export default function CertificatesPage() {
  const [courses, setCourses] =
    useState<Course[]>([]);

  const [courseId, setCourseId] =
    useState("");

  const [certificate, setCertificate] =
    useState<any>(null);

  const certificateRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
      });
  }, []);

  async function generateCertificate() {
    if (!courseId) return;

    const res = await fetch(
      "/api/certificates/generate",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          courseId,
        }),
      }
    );

    const data =
      await res.json();

    setCertificate(
      data.certificate
    );
  }

  async function downloadPDF() {
    if (!certificateRef.current)
      return;

    const canvas =
      await html2canvas(
        certificateRef.current,
        {
          scale: 3,
          useCORS: true,
        }
      );

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1400, 990],
    });

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      1400,
      990
    );

    pdf.save(
      `${certificate.certificateNumber}.pdf`
    );
  }

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.h1}>
          Certificate Generation
        </h1>

        <p className={styles.p}>
          Generate your certificate
          of completion.
        </p>

        <section className={styles.card}>
          <label className={styles.label}>
            Select Course
          </label>

          <select
            className={styles.select}
            value={courseId}
            onChange={(e) =>
              setCourseId(
                e.target.value
              )
            }
          >
            <option value="">
              Select Course
            </option>

            {courses.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.title}
              </option>
            ))}
          </select>

          <button
            className={styles.primary}
            onClick={
              generateCertificate
            }
          >
            Generate Certificate
          </button>
        </section>

        {certificate && (
          <>
            <div
              className={
                styles.previewWrap
              }
            >
              <div
                ref={
                  certificateRef
                }
              >
                <CertificateTemplate
                  studentName={
                    certificate.user
                      ?.name ||
                    "Student"
                  }
                  courseTitle={
                    certificate
                      .course
                      ?.title
                  }
                  certificateNumber={
                    certificate.certificateNumber
                  }
                  completionDate={new Date(
                    certificate.issuedAt
                  ).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                />
              </div>
            </div>

            <div
              className={
                styles.actions
              }
            >
              <button
                className={
                  styles.secondary
                }
                onClick={
                  downloadPDF
                }
              >
                Download PDF
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}