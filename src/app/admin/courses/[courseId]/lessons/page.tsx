// src/app/admin/courses/[courseId]/lessons/page.tsx
import styles from "./admin-lessons.module.css";
import AdminCourseLessonsClient from "./AdminCourseLessonsClient";

type ParamsLike = { courseId: string } | Promise<{ courseId: string }>;

export default async function AdminCourseLessonsPage(
  props: { params: ParamsLike }
) {
  const { courseId } = await Promise.resolve(props.params);

  return (
    <div>
      <AdminCourseLessonsClient courseId={courseId} />
    </div>
  );
}