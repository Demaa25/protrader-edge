import Link from "next/link";
import styles from "./algorithmic.module.css";

export default function AlgorithmicSpecialistPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <p className={styles.trackLabel}>Specialist Certification Track</p>
          <h1 className={styles.title}>Algorithmic Execution Specialist</h1>
          <p className={styles.subtitle}>
            Domain mastery for rule-based execution: converting institutional execution logic into
            deterministic specifications, governance safeguards, and audit-ready behavior.
          </p>
        </header>

        {/* ADMISSION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Admission Requirements</h2>
          <ul className={styles.list}>
            <li>Level 3 certification (or screened equivalence)</li>
            <li>Ability to express execution logic as rules, states, and invalidation conditions</li>
            <li>Commitment to governance-first automation (capital preservation over activity)</li>
          </ul>
        </section>

        {/* SCOPE */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Scope</h2>
          <ul className={styles.list}>
            <li>Deterministic definitions (structure, liquidity, execution states)</li>
            <li>Contract-first workflows (inputs/outputs, schemas, logs)</li>
            <li>Risk gating, veto controls, and kill-switch logic</li>
            <li>Testing discipline: unit tests, integration tests, regression safety</li>
          </ul>
        </section>

        {/* OUTCOMES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Outcomes</h2>
          <ul className={styles.list}>
            <li>Ability to spec institutional logic without discretionary drift</li>
            <li>Governed automation workflows suitable for professional environments</li>
            <li>Audit trail thinking: reproducible decisions and forensic logs</li>
            <li>Reduced operational risk in system development</li>
          </ul>
        </section>

        {/* CERTIFICATION STANDARD */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Certification Standard</h2>
          <p className={styles.paragraph}>
            Certification is awarded after competency verification and successful completion of
            required work products (specifications, test artifacts, governance checks). It does not
            imply profitability or suitability for any investor.
          </p>
        </section>

        {/* FOOTER CTA */}
        <footer className={styles.footer}>
          <Link href="/programs/specialist" className={`${styles.btn} ${styles.btnOutline}`}>
            Back to Specialist Tracks
          </Link>

          <Link href="/login" className={`${styles.btn} ${styles.btnGold}`}>
            Login / Enroll
          </Link>
        </footer>
      </div>
    </main>
  );
}
