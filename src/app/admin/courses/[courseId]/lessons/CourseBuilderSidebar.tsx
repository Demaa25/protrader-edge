// src/app/admin/courses/[courseId]/lessons/CourseBuilderSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./admin-lessons.module.css";

type Props = {
  courseId: string;
  onAddOverview: () => void;
  onAddModule: () => void;
};

export default function CourseBuilderSidebar({
  courseId,
  onAddOverview,
  onAddModule,
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
        <button className={styles.builderBtn} onClick={onAddOverview}>
          + Add Overview
        </button>

        <button className={styles.builderBtn} onClick={onAddModule}>
          + Add Module
        </button>
      </div>
    </aside>
  );
}