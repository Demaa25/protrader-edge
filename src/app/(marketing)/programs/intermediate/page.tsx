import Link from "next/link";
import styles from "./intermediate.module.css";

export default function IntermediateProgramPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Intermediate Program</h1>
          <p className={styles.subtitle}>
            The Intermediate Program develops execution models, multi-timeframe alignment,
            and decision-making consistency.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.h2}>What You Learn</h2>
          <ul className={styles.list}>
            <li>Execution models & trade validation</li>
            <li>Multi-timeframe structure alignment</li>
            <li>Liquidity-based entries</li>
            <li>Structured trade management</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Outcome</h2>
          <p className={styles.paragraph}>
            Students exit this level with repeatable execution logic and reduced emotional trading.
          </p>
        </section>

        <footer className={styles.footer}>
          <Link href="/login" className={`${styles.btn} ${styles.btnGold}`}>
            Begin Intermediate Program
          </Link>
        </footer>
      </div>
    </main>
  );
}
