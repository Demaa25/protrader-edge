// src/app/(lms)/lesson-video/[lessonId]/page.tsx

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

import LessonSidebar from "../../lessons/[lessonId]/LessonSidebar";

import CustomVideoPlayer from "./CustomVideoPlayer";

import styles from "./lesson-video.module.css";

type Props = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function LessonVideoPage({
  params,
}: Props) {
  const { lessonId } = await params;

  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },

    include: {
      module: {
        include: {
          course: true,

          lessons: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },

      materials: {
        where: {
          type: "VIDEO",
        },

        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!lesson) {
    redirect("/dashboard");
  }

  const lessonModule = lesson.module;

  const progresses =
    await prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,

        lessonId: {
          in: lessonModule.lessons.map(
            (l) => l.id
          ),
        },
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

  const completedCount =
    lessonModule.lessons.filter(
      (l) =>
        progressMap[l.id]?.completed
    ).length;

  const progressPct =
    lessonModule.lessons.length === 0
      ? 0
      : (completedCount /
          lessonModule.lessons.length) *
        100;

  return (
    <div className={styles.layout}>
      <LessonSidebar
        courseId={lessonModule.course.id}
        courseTitle={
          lessonModule.course.title
        }
        moduleTitle={lessonModule.title}
        moduleOrder={
          lessonModule.order
        }
        lessons={lessonModule.lessons}
        currentLessonId={lesson.id}
        progressPct={progressPct}
        progressMap={progressMap}
      />

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.badge}>
            Lesson Video
          </div>

          <h1 className={styles.title}>
            {lesson.title}
          </h1>

          <p className={styles.sub}>
            Watch the lesson carefully
            before proceeding to the
            knowledge check.
          </p>
        </div>

        <section className={styles.videoCard}>
          {lesson.materials?.length ? (
            <div
              className={
                styles.videoStack
              }
            >
              {lesson.materials.map(
                (video) => (
                  <div
                    key={video.id}
                    className={
                      styles.videoItem
                    }
                  >
                    <div
                      className={
                        styles.videoTitle
                      }
                    >
                      {video.title}
                    </div>

                    <CustomVideoPlayer
                      src={video.url}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className={styles.empty}>
              No lesson video uploaded
              yet.
            </div>
          )}
        </section>

        <div className={styles.actions}>
          <a
            href={`/lessons/${lesson.id}`}
            className={
              styles.secondary
            }
          >
            ← Back to Lesson
          </a>

          <a
            href={`/knowledge-check/${lesson.id}`}
            className={styles.primary}
          >
            Continue to Knowledge Check
            →
          </a>
        </div>
      </main>
    </div>
  );
}