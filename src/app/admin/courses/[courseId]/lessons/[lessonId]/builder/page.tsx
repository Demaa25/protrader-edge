// src/app/admin/courses/[courseId]/lessons/[lessonId]/builder/page.tsx
import LessonBuilderClient from "./LessonBuilderClient";

export default async function Page({
  params,
}: {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}) {
  const { courseId, lessonId } =
    await params;

  return (
    <LessonBuilderClient
      courseId={courseId}
      lessonId={lessonId}
    />
  );
}