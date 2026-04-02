// src/app/(lms)/lessons/[lessonId]/page.tsx
import styles from "./lesson.module.css";
import LessonSidebar from "./LessonSidebar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LessonPage({
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
      blocks: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!lesson) redirect("/dashboard");

  const quiz = await prisma.evaluation.findFirst({
    where: {
      moduleId: lesson.moduleId,
      type: "QUIZ",
    },
    select: { id: true },
  });

  const progress =
    (lesson.order / lesson.module.lessons.length) * 100;

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
      />

      <main className={styles.main}>
        <div className={styles.label}>
          LESSON M{lesson.module.order}L{lesson.order}
        </div>

        <h1 className={styles.title}>{lesson.title}</h1>

        {lesson.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}

        <div className={styles.footer}>
          <a
            href={`/scenario/${lesson.id}`}
            className={styles.cta}
          >
            Proceed to Application →
          </a>
        </div>
      </main>
    </div>
  );
}

function BlockRenderer({ block }: any) {
  switch (block.type) {
    case "HEADING":
      return (
        <h2 className={styles.heading}>
          {block.content}
        </h2>
      );

    case "TEXT":
      return (
        <p className={styles.text}>
          {block.content}
        </p>
      );

    case "IMAGE":
      return (
        <img
          src={block.imageUrl}
          className={styles.image}
        />
      );

    case "CALLOUT":
      return (
        <div className={styles.callout}>
          {block.content}
        </div>
      );

    case "SECTION":
      return (
        <div className={styles.section}>
          {block.content}
        </div>
      );

    case "BULLET_LIST":
      return (
        <ul className={styles.list}>
          {block.content
            ?.split("\n")
            .map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
        </ul>
      );

    default:
      return null;
  }
}