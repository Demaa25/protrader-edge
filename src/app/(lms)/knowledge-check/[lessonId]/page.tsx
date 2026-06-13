// src/app/(lms)/knowledge-check/[lessonId]/page.tsx
import styles from "./knowledge-check.module.css";
import LessonSidebar from "../../lessons/[lessonId]/LessonSidebar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import KnowledgeCheckClient from "./KnowledgeCheckClient";

export default async function KnowledgeCheckPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const session = await getSession();
  if (!session?.user) redirect("/login");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
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

  if (!lesson) redirect("/dashboard");

  // ✅ Get Knowledge Check Evaluation
  const evaluation = await prisma.evaluation.findFirst({
    where: {
      lessonId,
      type: "KNOWLEDGE_CHECK",
    },
  });

  if (!evaluation) {
    return <div>No knowledge check found</div>;
  }

  const module = lesson.module;

  // Progress (reuse your logic)
  const progresses = await prisma.lessonProgress.findMany({
    where: {
      userId: session.user.id,
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
        courseId={lesson.module.course.id}
        courseTitle={lesson.module.course.title}
        moduleTitle={lesson.module.title}
        moduleOrder={lesson.module.order}
        lessons={lesson.module.lessons}
        currentLessonId={lesson.id}
        progressPct={progressPct}
        progressMap={progressMap} // plug your real one
      />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Knowledge Check</h1>
          <p>
            Answer the questions to reinforce your understanding.
          </p>
        </div>

        <KnowledgeCheckClient evaluationId={evaluation.id} />
      </main>
    </div>
  );
}