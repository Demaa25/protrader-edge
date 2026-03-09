// src/app/my-courses/page.tsx
import styles from "./my-courses.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type MyCourse = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  progressPercent: number;
  status: "COMPLETED" | "IN_PROGRESS";
  currentLessonLabel: string;
};

async function buildMyCourses(userId: string): Promise<MyCourse[]> {
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      status: { in: ["PAID", "PARTIAL"] as any }, // schema supports PARTIAL per your update
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          thumbnailUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const courses = purchases.map((p) => p.course);

  const rows = await Promise.all(
    courses.map(async (course) => {
      const totalLessons = await prisma.lesson.count({
        where: { module: { courseId: course.id } },
      });

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId,
          completed: true,
          lesson: { module: { courseId: course.id } },
        },
      });

      const progressPercent =
        totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

      // current lesson = first incomplete lesson by module order + lesson order
      const nextLesson = await prisma.lesson.findFirst({
        where: {
          module: { courseId: course.id },
          progresses: {
            none: { userId, completed: true },
          },
        },
        orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
        select: { title: true },
      });

      const isDone = totalLessons > 0 && completedLessons >= totalLessons;

      const currentLessonLabel = isDone
        ? "Completed"
        : nextLesson?.title
          ? `Next: ${nextLesson.title}`
          : totalLessons === 0
            ? "No lessons yet"
            : "In progress";

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        progressPercent,
        status: isDone ? "COMPLETED" : "IN_PROGRESS",
        currentLessonLabel,
      } satisfies MyCourse;
    })
  );

  return rows;
}

export default async function MyCoursesPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const role = (session?.user as any)?.role as "ADMIN" | "LEARNER" | "STUDENT" | undefined;
  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) redirect("/login");

  const courses = await buildMyCourses(userId);

  return (
    <div className={styles.shell}>
      <Sidebar role={role as any} />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <h1 className={styles.h1}>My Courses</h1>
          <p className={styles.sub}>All courses you’ve purchased.</p>

          {courses.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>No purchased courses yet</div>
              <div className={styles.emptyText}>
                You haven&apos;t purchased any courses. Browse the catalog to get started.
              </div>
              <a className={styles.primary} href="/catalog">
                Browse Catalog
              </a>
            </div>
          ) : (
            <div className={styles.list}>
              {courses.map((c) => {
                const isDone = c.status === "COMPLETED";
                return (
                  <div key={c.id} className={styles.card}>
                    <div
                      className={styles.thumb}
                      style={
                        c.thumbnailUrl
                          ? {
                              backgroundImage: `url(${c.thumbnailUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : undefined
                      }
                    />

                    <div className={styles.info}>
                      <div className={styles.title}>{c.title}</div>
                      <div className={styles.meta}>{c.currentLessonLabel}</div>

                      <div className={styles.progressRow}>
                        <div className={styles.progressBar}>
                          <span
                            className={isDone ? styles.progressDone : styles.progressFill}
                            style={{ width: `${Math.min(100, Math.max(0, c.progressPercent))}%` }}
                          />
                        </div>
                        <div className={styles.percent}>{c.progressPercent}%</div>
                      </div>
                    </div>

                    <a
                      className={isDone ? styles.completedBtn : styles.cta}
                      href={`/courses/${c.id}`}
                    >
                      {isDone ? "Completed" : "Continue"}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <Bottombar />
      </div>
    </div>
  );
}