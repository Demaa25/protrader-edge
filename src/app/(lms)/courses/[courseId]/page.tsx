// src/app/(lms)/courses/[courseId]/page.tsx
import styles from "./course.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type ItemKind = "LESSON" | "QUIZ";

function labelFor(kind: ItemKind) {
  switch (kind) {
    case "LESSON":
      return "Lesson";
    case "QUIZ":
      return "Quiz";
  }
}

type SyllabusItem = {
  kind: ItemKind;
  id: string;
  title: string;
  href: string;
  locked: boolean;
};

export default async function CoursePage(props: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await props.params;

  const session = await getSession();
  if (!session?.user) redirect("/login");

  const role = (session.user as any)?.role as
    | "ADMIN"
    | "STUDENT"
    | "LEARNER"
    | undefined;

  const userId = (session.user as any)?.id as
    | string
    | undefined;

  if (!userId) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      priceKobo: true,

      modules: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,

          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
            },
          },

          evaluations: {
            where: { type: "QUIZ" },
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!course) redirect("/catalog");

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    select: { status: true },
  });

  const purchased = purchase?.status === "PAID";

  const lessonIds = course.modules.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );

  const totalLessons = lessonIds.length;

  const completedLessons =
    totalLessons === 0
      ? 0
      : await prisma.lessonProgress.count({
          where: {
            userId,
            lessonId: { in: lessonIds },
            completed: true,
          },
        });

  const hasStarted =
    totalLessons === 0
      ? false
      : (await prisma.lessonProgress.findFirst({
          where: {
            userId,
            lessonId: { in: lessonIds },
          },
          select: { id: true },
        })) !== null;

  const progressPct =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons / totalLessons) * 100
        );

  const firstLessonId =
    course.modules[0]?.lessons[0]?.id;

  const priceLabel = `Pay ₦${(
    course.priceKobo / 100
  ).toLocaleString()}`;

  const ctaHref = purchased
    ? firstLessonId
      ? `/lessons/${firstLessonId}`
      : "/dashboard"
    : `/api/paystack/initialize?courseId=${course.id}`;

  const ctaText = purchased
    ? hasStarted
      ? "Continue"
      : "Start"
    : priceLabel;

  return (
    <div className={styles.shell}>
      <Sidebar role={role as any} />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <h1 className={styles.h1}>
            {course.title}
          </h1>

          <section className={styles.top}>
            {course.thumbnailUrl ? (
              <div
                className={styles.hero}
                style={{
                  backgroundImage: `url(${course.thumbnailUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <div className={styles.hero} />
            )}

            <div className={styles.progressCard}>
              <div className={styles.small}>
                {totalLessons === 0
                  ? "0 Lessons"
                  : `${completedLessons} / ${totalLessons} Lessons Completed`}
              </div>

              <div className={styles.bar}>
                <span
                  style={{
                    width: `${progressPct}%`,
                  }}
                />
              </div>

              <a
                className={styles.btn}
                href={ctaHref}
              >
                {ctaText}
              </a>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}>
              Syllabus
            </div>

            <div className={styles.syllabus}>
              {course.modules.map((m) => {
                const quiz =
                  m.evaluations?.[0] ?? null;

                const items: SyllabusItem[] = [];

                for (const lesson of m.lessons) {
                  items.push({
                    kind: "LESSON",
                    id: lesson.id,
                    title: lesson.title,
                    href: `/lessons/${lesson.id}`,
                    locked: !purchased,
                  });
                }

                if (quiz) {
                  items.push({
                    kind: "QUIZ",
                    id: quiz.id,
                    title: quiz.title,
                    href: `/quiz/${quiz.id}`,
                    locked: !purchased,
                  });
                }

                return (
                  <div
                    key={m.id}
                    className={styles.moduleCard}
                  >
                    <div
                      className={styles.moduleHeader}
                    >
                      <div
                        className={styles.moduleTitle}
                      >
                        Module {m.order}:{" "}
                        {m.title}
                      </div>
                    </div>

                    <div className={styles.items}>
                      {items.map((it) => {
                        const disabled =
                          it.locked;

                        return (
                          <a
                            key={`${it.kind}-${it.id}`}
                            className={`${styles.item} ${
                              disabled
                                ? styles.locked
                                : ""
                            }`}
                            href={
                              disabled
                                ? "#"
                                : it.href
                            }
                          >
                            <div
                              className={
                                styles.itemLeft
                              }
                            >
                              <span
                                className={
                                  styles.badge
                                }
                              >
                                {labelFor(
                                  it.kind
                                )}
                              </span>

                              <span
                                className={
                                  styles.itemTitle
                                }
                              >
                                {it.title}
                              </span>
                            </div>

                            <span
                              className={
                                styles.chev
                              }
                            >
                              ›
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}