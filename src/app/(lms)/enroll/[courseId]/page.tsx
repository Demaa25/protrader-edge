// src/app/(lms)/enroll/[courseId]/page.tsx
import styles from "./enroll.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function formatNairaFromKobo(amountKobo: number) {
  return `₦${(amountKobo / 100).toLocaleString()}`;
}

export default async function EnrollCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;
  const userId = (session.user as any)?.id;

  if (!userId) {
    redirect("/login");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },

    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      priceKobo: true,
      description: true,
    },
  });

  if (!course) {
    redirect("/catalog");
  }

  const existing =
    await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },

      select: {
        status: true,
      },
    });

  if (existing?.status === "PAID") {
    redirect(`/courses/${course.id}`);
  }

  return (
    <div className={styles.shell}>
      <Sidebar role={role as any} />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.h1}>
              Enroll in {course.title}
            </h1>

            <p className={styles.p}>
              Complete payment to unlock
              full access to this course.
            </p>
          </header>

          <section className={styles.card}>
            {course.thumbnailUrl && (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className={styles.thumbnail}
              />
            )}

            <div className={styles.courseInfo}>
              <h2>{course.title}</h2>

              <div className={styles.price}>
                {formatNairaFromKobo(
                  course.priceKobo ?? 0
                )}
              </div>

              {course.description && (
                <p className={styles.description}>
                  {course.description}
                </p>
              )}
            </div>

            <form
              action="/api/paystack/initialize"
              method="GET"
            >
              <input
                type="hidden"
                name="courseId"
                value={course.id}
              />

              <button
                className={styles.payBtn}
                type="submit"
              >
                Pay Now
              </button>
            </form>

            <div className={styles.note}>
              Secure payment powered by
              Paystack.
            </div>
          </section>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}