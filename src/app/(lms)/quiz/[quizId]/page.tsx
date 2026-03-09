// src/app/(lms)/quiz/[quizId]/page.tsx
import styles from "./quiz.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import QuizRunner from "./QuizRunner";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <QuizRunner quizId={quizId} />
        </main>

        <Bottombar />
      </div>
    </div>
  );
}