// src/app/admin/courses/[courseId]/lessons/CourseBuilderSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./admin-lessons.module.css";

type Props = {
  courseId: string;

  onAddThumbnail: () => void;

  onAddOverview: () => void;

  onAddObjectives: () => void;

  onAddModule: () => void;

  onAddCertification: () => void;
};

export default function CourseBuilderSidebar({
  courseId,
  onAddThumbnail,
  onAddOverview,
  onAddObjectives,
  onAddModule,
  onAddCertification,
}: Props) {
  return (
    <aside className={styles.builderSidebar}>
      <div className={styles.builderLogo}>
        <Image
          src="/PTE Logo_2.png"
          alt="logo"
          width={28}
          height={28}
        />

        <span>ProTrader Edge</span>
      </div>

      <Link
        href="/admin/courses"
        className={styles.builderBack}
      >
        ← Back to Courses
      </Link>

      <div className={styles.builderActions}>
        <button
          className={styles.builderBtn}
          onClick={onAddThumbnail}
        >
          + Add Thumbnail
        </button>

        <button
          className={styles.builderBtn}
          onClick={onAddOverview}
        >
          + Add Overview
        </button>

        <button
          className={styles.builderBtn}
          onClick={onAddObjectives}
        >
          + Add Objectives
        </button>

        <button
          className={styles.builderBtn}
          onClick={onAddModule}
        >
          + Add Module
        </button>

        <button
          className={styles.builderBtn}
          onClick={onAddCertification}
        >
          + Add Certification Exam
        </button>
      </div>
    </aside>
  );
}