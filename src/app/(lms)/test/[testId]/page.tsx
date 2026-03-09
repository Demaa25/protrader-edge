// src/app/(lms)/test/[testId]/page.tsx
import styles from "./test.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import TestRunner from "./TestRunner";

export default async function TestPage(props: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await props.params;

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Topbar />
        <main className={styles.main}>
          <TestRunner evaluationId={testId} />
        </main>
        <Bottombar />
      </div>
    </div>
  );
}