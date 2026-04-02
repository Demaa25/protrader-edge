// src/app/(lms)/scenario/[lessonId]/page.tsx
import styles from "./scenario.module.css";
import LessonSidebar from "../../lessons/[lessonId]/LessonSidebar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ScenarioForm from "./ScenarioForm";

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const session = await getSession();
  if (!session?.user) redirect("/login");

  const scenario = await prisma.scenario.findUnique({
    where: { lessonId },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!scenario) {
    return <div>No scenario created</div>;
  }

  return (
    <div className={styles.layout}>
      <LessonSidebar
        courseId={scenario.lesson.module.course.id}
        courseTitle={scenario.lesson.module.course.title}
        moduleTitle={scenario.lesson.module.title}
        moduleOrder={scenario.lesson.module.order}
        lessons={[]}
        currentLessonId={scenario.lesson.id}
        quizId={null}
        progressPct={100}
      />
      <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.level}>
          {scenario.level}
        </div>

        <h1>{scenario.title}</h1>

        <div className={styles.meta}>
          {scenario.lesson.module.title} • {scenario.lesson.title}
        </div>

        <p className={styles.instruction}>
          {scenario.instruction}
        </p>
      </div>

      {scenario.chartImageUrl && (
        <img
          src={scenario.chartImageUrl}
          className={styles.chart}
        />
      )}

      {scenario.description && (
        <div className={styles.description}>
          {scenario.description}
        </div>
      )}

      <ScenarioForm scenarioId={scenario.id} />
      </div>
    </div>
  );
}