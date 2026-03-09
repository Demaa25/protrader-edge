// src/app/admin/courses/[courseId]/lessons/page.tsx
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import styles from "./admin-lessons.module.css";
import AdminCourseLessonsClient from "./AdminCourseLessonsClient";

type ParamsLike = { courseId: string } | Promise<{ courseId: string }>;

export default async function AdminCourseLessonsPage(props: { params: ParamsLike }) {
  const { courseId } = await Promise.resolve(props.params);

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Topbar />
        <main className={styles.main}>
          <AdminCourseLessonsClient courseId={courseId} />
        </main>
        <Bottombar />
      </div>
    </div>
  );
}
