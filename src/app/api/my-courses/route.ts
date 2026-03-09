// src/app/api/my-courses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  // Fetch enrollments + course basic details + lightweight structure for progress calc
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          thumbnailUrl: true,
          modules: {
            select: {
              lessons: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  const courses = enrollments.map((e) => e.course);

  // Flatten lesson IDs per course to compute progress from LessonProgress
  const courseLessonMap = courses.map((c) => ({
    courseId: c.id,
    lessonIds: c.modules.flatMap((m) => m.lessons.map((l) => l.id)),
  }));

  const allLessonIds = courseLessonMap.flatMap((x) => x.lessonIds);
  const progressRows = allLessonIds.length
    ? await prisma.lessonProgress.findMany({
        where: { userId, lessonId: { in: allLessonIds } },
        select: { lessonId: true, completed: true, progress: true },
      })
    : [];

  const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p]));

  const payload = courses.map((c) => {
    const lessonIds = courseLessonMap.find((x) => x.courseId === c.id)?.lessonIds ?? [];
    const total = lessonIds.length || 0;
    const completedCount = lessonIds.filter((id) => progressByLesson.get(id)?.completed).length;

    const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    const status = percent >= 100 ? "COMPLETED" : "IN_PROGRESS";

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnailUrl: c.thumbnailUrl,
      progressPercent: percent,
      status,
      // later we’ll add “currentLesson” when lesson routing is wired
      currentLessonLabel: status === "COMPLETED" ? "You've completed this course!" : "Continue where you left off.",
    };
  });

  return NextResponse.json({ courses: payload });
}
