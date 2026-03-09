// src/app/dashboard/page.tsx
import styles from "./dashboard.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  
  const role = (session.user as any)?.role as "ADMIN" | "LEARNER" | undefined;

  
  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) redirect("/login");

  // 🔒 Prevent bypassing /welcome
  const [purchaseCount, enrollmentCount] = await Promise.all([
    prisma.purchase.count({
      where: { userId, status: "PAID" },
    }),
    prisma.enrollment.count({
      where: { userId },
    }),
  ]);

  const isReturning = purchaseCount > 0 || enrollmentCount > 0;

  if (!isReturning) {
    redirect("/welcome");
  }

  // 🔥 Get latest purchased course
  const latestPurchase = await prisma.purchase.findFirst({
    where: { userId, status: "PAID" },
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  let ctaText = "Begin Training";
  let ctaHref = "#";

  if (latestPurchase?.course) {
    const course = latestPurchase.course;

    const lessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );

    const completedCount =
      lessonIds.length === 0
        ? 0
        : await prisma.lessonProgress.count({
            where: {
              userId,
              lessonId: { in: lessonIds },
              completed: true,
            },
          });

    const hasStarted = completedCount > 0;

    const firstLessonId = course.modules[0]?.lessons[0]?.id;

    ctaText = hasStarted ? "Continue Training" : "Begin Training";
    ctaHref = firstLessonId
      ? `/lessons/${firstLessonId}`
      : `/courses/${course.id}`;
  }

  return (
    <div className={styles.shell}>
      <Sidebar role={role} />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.h1}>
                Welcome{session.user.name ? `, ${session.user.name}` : ""}
              </h1>
              <p className={styles.p}>
                Continue your professional trading development.
              </p>
            </div>
          </header>

          <section className={styles.card}>
            <div className={styles.cardTitle}>Latest Program</div>

            {latestPurchase?.course ? (
              <div className={styles.continueRow}>
                <div className={styles.thumb} />
                <div className={styles.meta}>
                  <div className={styles.courseTitle}>
                    {latestPurchase.course.title}
                  </div>
                  <div className={styles.courseSub}>
                    Structured institutional curriculum
                  </div>
                </div>
                <a className={styles.btn} href={ctaHref}>
                  {ctaText}
                </a>
              </div>
            ) : (
              <div>No active programs yet.</div>
            )}
          </section>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}