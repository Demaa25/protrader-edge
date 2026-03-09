// src/app/admin/courses/page.tsx
import styles from "./admin-courses.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import AdminCoursesClient from "./AdminCoursesClient";

export default async function AdminCoursesPage() {
  const session = await getSession();
  const role = (session?.user as any)?.role as "ADMIN" | "LEARNER" | undefined;

  return (
    <div className={styles.shell}>
      <Sidebar role={role} />

      <div className={styles.content}>
        <Topbar />
        <main className={styles.main}>
          <AdminCoursesClient />
        </main>
        <Bottombar />
      </div>
    </div>
  );
}
