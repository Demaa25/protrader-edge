// src/app/admin/courses/AdminCoursesClient.tsx
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import styles from "./admin-courses.module.css";

type CourseRow = {
  id: string;
  title: string;
  category: string;
  lessonsCount: number;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Request failed");
  return data;
};

export default function AdminCoursesClient() {
  const { data, error, isLoading, mutate } = useSWR<{ courses: CourseRow[] }>(
    "/api/admin/courses",
    fetcher,
    { refreshInterval: 5000 } // “auto refresh” without changing your UI
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Forex");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [submitting, setSubmitting] = useState(false);

  const courses = data?.courses ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      const matchSearch = !q || c.title.toLowerCase().includes(q);
      const matchCat = filter === "All" || c.category === filter;
      return matchSearch && matchCat;
    });
  }, [courses, search, filter]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category))).filter(Boolean);
    return ["All", ...unique];
  }, [courses]);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t, category }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error ?? "Failed to create course");

      setTitle("");
      // instant refresh of list
      await mutate();
    } catch (err: any) {
      alert(err?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className={styles.h1}>Course Builder</h1>

      {/* Create New Course (same UI block, now functional) */}
      <section className={styles.card}>
        <div className={styles.cardTitle}>Create New Course</div>

        <form className={styles.form} onSubmit={createCourse}>
          <div className={styles.label}>Course Title</div>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course Title..."
          />

          <div className={styles.label}>Category</div>
          <select
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Forex">Forex</option>
            {/* keep design same, can add more later */}
          </select>

          <button className={styles.primary} type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Course"}
          </button>
        </form>
      </section>

      {/* Manage Courses (same UI, now from DB) */}
      <section className={styles.card}>
        <div className={styles.cardTitle}>Manage Courses</div>

        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={styles.filter}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "Filter by Category" : c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tableHead}>
          <div>Course</div>
          <div>Category</div>
          <div>Lessons</div>
        </div>

        {isLoading ? (
          <div style={{ padding: 12, color: "var(--muted)" }}>Loading courses...</div>
        ) : error ? (
          <div style={{ padding: 12, color: "crimson" }}>
            Failed to load courses. {(error as any)?.message ?? ""}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 12, color: "var(--muted)" }}>No courses found.</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className={styles.row}>
              <div>{c.title}</div>
              <div>{c.category}</div>

              {/* IMPORTANT: keep the same “Lessons” column, just add Edit Lessons */}
              <div>
                {c.lessonsCount} Lessons{" "}
                <a
                  href={`/admin/courses/${c.id}/lessons`}
                  style={{ color: "var(--primary)", fontWeight: 800, marginLeft: 8 }}
                >
                  Edit Course
                </a>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
