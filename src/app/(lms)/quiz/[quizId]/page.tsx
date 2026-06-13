// src/app/(lms)/quiz/[quizId]/page.tsx
import styles from "./quiz.module.css";
import LessonSidebar from "../../lessons/[lessonId]/LessonSidebar";
import QuizRunner from "./QuizRunner";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;

  const session = await getSession();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  // 🔥 Get evaluation with full structure
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: quizId },
    include: {
      module: {
        include: {
          course: true,
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!evaluation || !evaluation.module) {
    return <div>Quiz not found</div>;
  }

  const module = evaluation.module;

  // 🔥 Fetch progress for all lessons in this module
  const progresses = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: module.lessons.map((l) => l.id) },
    },
  });

  const progressMap = Object.fromEntries(
    progresses.map((p) => [
      p.lessonId,
      {
        completed: p.completed,
        progress: p.progress,
      },
    ])
  );

  // 🔥 Calculate module progress %
  const completedCount = module.lessons.filter(
    (l) => progressMap[l.id]?.completed
  ).length;

  const progressPct =
    module.lessons.length === 0
      ? 0
      : (completedCount / module.lessons.length) * 100;

  return (
    <div className={styles.layout}>
      <LessonSidebar
        courseId={module.course.id}
        courseTitle={module.course.title}
        moduleTitle={module.title}
        moduleOrder={module.order}
        lessons={module.lessons}
        currentLessonId={"quiz"} // 👈 important
        quizId={evaluation.id}
        progressPct={progressPct}
        progressMap={progressMap}
      />

      <main className={styles.main}>
        <QuizRunner quizId={quizId} />
      </main>
    </div>
  );
}