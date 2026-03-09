import Link from "next/link";
import styles from "./professional.module.css";

export default function ProfessionalProgramPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Professional Program</h1>
          <p className={styles.subtitle}>
            The Professional Program is focused on capital preservation, governance,
            discipline, and professional-grade execution behavior.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.h2}>What You Learn</h2>
          <ul className={styles.list}>
            <li>Risk governance & drawdown control</li>
            <li>Professional execution rules</li>
            <li>Performance review systems</li>
            <li>Decision journaling & audit trails</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Outcome</h2>
          <p className={styles.paragraph}>
            Graduates operate with institutional discipline and professional mindset.
          </p>
        </section>

        <footer className={styles.footer}>
          <Link href="/login" className={`${styles.btn} ${styles.btnGold}`}>
            Begin Professional Program
          </Link>
        </footer>
      </div>
    </main>
  );
}
