// src/app/admin/dashboard/page.tsx
import styles from "./admin-dashboard.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";

export default async function AdminDashboardPage() {
  const session = await getSession();
  // @ts-expect-error role exists
  const role = (session?.user as any)?.role as "ADMIN" | "LEARNER" | undefined;

  return (
    <div className={styles.shell}>
      <Sidebar role={role} />
      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
        <h1 className={styles.h1}>Admin Dashboard</h1>

        <div className={styles.stats}>
          {[
            { label: "Active Users", value: "523" },
            { label: "Total Courses", value: "8" },
            { label: "Lessons Completed", value: "2,136" },
            { label: "Quizzes Taken", value: "1,058" },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <div className={styles.label}>{s.label}</div>
              <div className={styles.value}>{s.value}</div>
            </div>
          ))}
        </div>

        <section className={styles.card}>
          <div className={styles.cardTitle}>Recent Activity</div>
          <ul className={styles.list}>
            <li>Jane Smith completed Institutional Forex Trading</li>
            <li>Alan Turner started Risk Management in Forex</li>
            <li>Sarah Johnson took quiz for Advanced Trading Strategies</li>
          </ul>
        </section>
      </main>

      <Bottombar />
      </div>
    </div>
  );
}
