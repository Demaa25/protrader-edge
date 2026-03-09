import Link from "next/link";
import styles from "./foundation.module.css";

export default function FoundationProgramPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Foundation Program</h1>
          <p className={styles.subtitle}>
            The Foundation Program builds the structural and conceptual base required
            for institutional-style trading. It is designed for beginners and traders
            transitioning away from retail methods.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.h2}>What You Learn</h2>
          <ul className={styles.list}>
            <li>Market structure & liquidity foundations</li>
            <li>Why price moves (not indicators)</li>
            <li>Execution discipline & invalidation logic</li>
            <li>Risk awareness from day one</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Outcome</h2>
          <p className={styles.paragraph}>
            Students complete this level with the ability to read price action
            structurally and avoid common retail traps.
          </p>
        </section>

        <footer className={styles.footer}>
          <Link href="/login" className={`${styles.btn} ${styles.btnGold}`}>
            Begin Foundation Program
          </Link>
        </footer>
      </div>
    </main>
  );
}
