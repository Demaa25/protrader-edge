// src/app/(lms)/application/[lessonId]/page.tsx
import styles from "./application.module.css";
import LessonSidebar from "../../lessons/[lessonId]/LessonSidebar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ApplicationForm from "./ApplicationForm";

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const session = await getSession();
  if (!session?.user) redirect("/login");

  const application = await prisma.application.findUnique({
    where: { lessonId },
    include: {
      lesson: {
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
      },
    },
  });

  if (!application) {
    return <div>No application created</div>;
  }

  const lesson = application.lesson;

  const lessons = lesson.module.lessons;

  const currentIndex = lessons.findIndex(
    (l) => l.id === lesson.id
  );

  const nextLesson = lessons[currentIndex + 1];

  const quiz = await prisma.evaluation.findFirst({
    where: {
      moduleId: lesson.moduleId,
      type: "QUIZ",
    },
    select: { id: true },
  });

  const progresses = await prisma.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      lessonId: { in: lesson.module.lessons.map((l) => l.id) },
    },
  });

  const progressMap = Object.fromEntries(
    progresses.map((p) => [p.lessonId, p])
  );

  const completedCount = progresses.filter((p) => p.completed).length;
  const progress = (completedCount / lesson.module.lessons.length) * 100;

  return (
    <div className={styles.layout}>
      <LessonSidebar
        courseId={lesson.module.course.id}
        courseTitle={lesson.module.course.title}
        moduleTitle={lesson.module.title}
        moduleOrder={lesson.module.order}
        lessons={lesson.module.lessons}
        currentLessonId={lesson.id}
        quizId={quiz?.id}
        progressPct={progress}
        progressMap={progressMap}
      />

      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Application</h1>
          <div className={styles.meta}>
            {lesson.module.title} • {lesson.title}
          </div>
        </div>

        {/* Instruction */}
        {application.instruction && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>Instruction</div>
            <p>{application.instruction}</p>
          </div>
        )}

        {/* Requirements */}
        {application.requirements && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>Requirements</div>
            <p>{application.requirements}</p>
          </div>
        )}

        {/* Scenario */}
        {application.scenario && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>Scenario</div>
            <p>{application.scenario}</p>
          </div>
        )}

        {/* Chart */}
        {application.chartImageUrl && (
          <div className={styles.chartCard}>
            <img
              src={application.chartImageUrl}
              alt="Chart"
              className={styles.chartImage}
            />
          </div>
        )}

        {/* Focus Areas */}
        {application.focusAreas && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>Focus Areas</div>

            <div className={styles.pills}>
              {(application.focusAreas as string[]).map(
                (f, i) => (
                  <span key={i} className={styles.pill}>
                    ✓ {f}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <ApplicationForm applicationId={application.id} lessonId={lesson.id} nextLessonId={nextLesson?.id ?? null} quizId={quiz?.id ?? null} />
      </div>
    </div>
  );
}