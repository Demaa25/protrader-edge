// src/app/(lms)/assessment/[assessmentId]/page.tsx
import styles from "./assessment.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import AssessmentRunner from "./AssessmentRunner";

export default async function AssessmentPage(props: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await props.params;

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Topbar />
        <main className={styles.main}>
          <AssessmentRunner evaluationId={assessmentId} />
        </main>
        <Bottombar />
      </div>
    </div>
  );
}