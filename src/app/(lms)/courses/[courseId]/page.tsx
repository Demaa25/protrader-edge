// src/app/(lms)/courses/[courseId]/page.tsx

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CoursePageClient from "./CoursePageClient";

export default async function CoursePage({
  params,
}: {
  params: Promise<{
    courseId: string;
  }>;
}) {
  const { courseId } =
    await params;

  const session =
    await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (
    session.user as any
  )?.role;

  const userId = (
    session.user as any
  )?.id;

  if (!userId) {
    redirect("/login");
  }

  // =========================
  // COURSE
  // =========================

  const course =
    await prisma.course.findUnique({
      where: {
        id: courseId,
      },

      select: {
        id: true,
        title: true,
        description: true,
        objectives: true,
        thumbnailUrl: true,
        priceKobo: true,

        modules: {
          orderBy: {
            order: "asc",
          },

          select: {
            id: true,
            title: true,
            order: true,

            lessons: {
              orderBy: {
                order: "asc",
              },

              select: {
                id: true,
                title: true,
                order: true,
              },
            },

            evaluations: {
              where: {
                type: "QUIZ",
              },

              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

  if (!course) {
    redirect("/catalog");
  }

  // =========================
  // PURCHASE
  // =========================

  const purchase =
    await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId:
            course.id,
        },
      },

      select: {
        status: true,
      },
    });

  const purchased =
    purchase?.status ===
    "PAID";

  // =========================
  // LESSONS
  // =========================

  const lessonIds =
    course.modules.flatMap(
      (m) =>
        m.lessons.map(
          (l) => l.id
        )
    );

  const totalLessons =
    lessonIds.length;

  const completedLessons =
    totalLessons === 0
      ? 0
      : await prisma.lessonProgress.count(
          {
            where: {
              userId,

              lessonId: {
                in: lessonIds,
              },

              completed: true,
            },
          }
        );

  const hasStarted =
    totalLessons === 0
      ? false
      : (await prisma.lessonProgress.findFirst(
          {
            where: {
              userId,

              lessonId: {
                in: lessonIds,
              },
            },

            select: {
              id: true,
            },
          }
        )) !== null;

  const progressPct =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons /
            totalLessons) *
            100
        );

  const firstLessonId =
    course.modules[0]
      ?.lessons[0]?.id;

  const priceLabel = `Pay ₦${(
    course.priceKobo /
    100
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
    <CoursePageClient
      role={role}
      course={course}
      purchased={purchased}
      completedLessons={
        completedLessons
      }
      totalLessons={
        totalLessons
      }
      progressPct={progressPct}
      ctaHref={ctaHref}
      ctaText={ctaText}
    />
  );
}