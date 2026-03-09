// src/app/(lms)/courses/[courseId]/page.tsx
import styles from "./course.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type ItemKind = "LESSON" | "QUIZ" | "ASSESSMENT" | "TEST";

function labelFor(kind: ItemKind) {
  switch (kind) {
    case "LESSON":
      return "Lesson";
    case "QUIZ":
      return "Quiz";
    case "ASSESSMENT":
      return "Assessment";
    case "TEST":
      return "Test";
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

  // @ts-expect-error role exists
  const role = (session.user as any)?.role as "ADMIN" | "STUDENT" | "LEARNER" | undefined;
  // @ts-expect-error id exists
  const userId = (session.user as any)?.id as string | undefined;
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
              evaluations: {
                where: { type: "QUIZ" },
                select: { id: true, title: true, type: true },
              },
            },
          },
          evaluations: {
            where: { type: "ASSESSMENT" },
            select: { id: true, title: true, type: true },
          },
        },
      },
      evaluations: {
        where: { type: "TEST" },
        select: { id: true, title: true, type: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!course) redirect("/catalog");

  // Full access rule (keep your rule simple for now)
  const purchase = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
    select: { status: true },
  });
  const purchased = purchase?.status === "PAID";

  // Progress for top card
  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const totalLessons = lessonIds.length;

  const completedLessons =
    totalLessons === 0
      ? 0
      : await prisma.lessonProgress.count({
          where: { userId, lessonId: { in: lessonIds }, completed: true },
        });

  const hasStarted =
    totalLessons === 0
      ? false
      : (await prisma.lessonProgress.findFirst({
          where: { userId, lessonId: { in: lessonIds } },
          select: { id: true },
        })) !== null;

  const progressPct =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  const firstLessonId = course.modules[0]?.lessons[0]?.id;

  const priceLabel = `Pay ₦${(course.priceKobo / 100).toLocaleString()}`;
  const ctaHref = purchased
    ? firstLessonId
      ? `/lessons/${firstLessonId}`
      : "/dashboard"
    : `/api/paystack/initialize?courseId=${course.id}`;

  const ctaText = purchased ? (hasStarted ? "Continue" : "Start") : priceLabel;

  // program test (first TEST evaluation for the course)
  const programTest = course.evaluations?.[0] ?? null;
  const testHref = programTest ? `/test/${programTest.id}` : "#";

  return (
    <div className={styles.shell}>
      <Sidebar role={role as any} />
      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <h1 className={styles.h1}>{course.title}</h1>

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
                <span style={{ width: `${progressPct}%` }} />
              </div>

              <a className={styles.btn} href={ctaHref}>
                {ctaText}
              </a>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}>Syllabus</div>

            <div className={styles.syllabus}>
              {course.modules.length === 0 ? (
                <div className={styles.empty}>No modules yet.</div>
              ) : (
                course.modules.map((m) => {
                  // module assessment (0 or 1)
                  const assessment = m.evaluations?.[0] ?? null;

                  // Build items in the layout you described:
                  // Lesson -> Quiz -> Lesson -> Quiz -> ... -> Module Assessment
                  const items: SyllabusItem[] = [];

                  for (const lesson of m.lessons) {
                    items.push({
                      kind: "LESSON",
                      id: lesson.id,
                      title: lesson.title,
                      href: `/lessons/${lesson.id}`,
                      locked: !purchased,
                    });

                    const quiz = lesson.evaluations?.[0] ?? null;
                    if (quiz) {
                      items.push({
                        kind: "QUIZ",
                        id: quiz.id,
                        title: quiz.title,
                        href: `/quiz/${quiz.id}`,
                        locked: !purchased,
                      });
                    }
                  }

                  if (assessment) {
                    items.push({
                      kind: "ASSESSMENT",
                      id: assessment.id,
                      title: `Module ${m.order} Assessment: ${assessment.title}`,
                      href: `/assessment/${assessment.id}`,
                      locked: !purchased,
                    });
                  }

                  return (
                    <div key={m.id} className={styles.moduleCard}>
                      <div className={styles.moduleHeader}>
                        <div className={styles.moduleTitle}>
                          Module {m.order}: {m.title}
                        </div>
                      </div>

                      <div className={styles.items}>
                        {items.length === 0 ? (
                          <div className={styles.empty}>No content yet.</div>
                        ) : (
                          items.map((it) => {
                            const disabled = it.locked;
                            return (
                              <a
                                key={`${it.kind}-${it.id}`}
                                className={`${styles.item} ${disabled ? styles.locked : ""}`}
                                href={disabled ? "#" : it.href}
                                aria-disabled={disabled ? "true" : "false"}
                              >
                                <div className={styles.itemLeft}>
                                  <span className={styles.badge}>{labelFor(it.kind)}</span>
                                  <span className={styles.itemTitle}>{it.title}</span>
                                </div>

                                <div className={styles.itemRight}>
                                  {disabled ? (
                                    <span className={styles.lockText}>Locked</span>
                                  ) : (
                                    <span className={styles.chev}>›</span>
                                  )}
                                </div>
                              </a>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <a
            className={`${styles.quizBtn} ${!programTest ? styles.disabledBtn : ""}`}
            href={testHref}
            aria-disabled={!programTest ? "true" : "false"}
          >
            Begin {course.title} Test
          </a>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}