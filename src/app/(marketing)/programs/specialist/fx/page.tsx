import Link from "next/link";
import styles from "./fx.module.css";

export default function FxSpecialistPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <p className={styles.trackLabel}>Specialist Certification Track</p>
          <h1 className={styles.title}>FX Execution Specialist</h1>
          <p className={styles.subtitle}>
            Domain mastery for foreign exchange execution: liquidity behavior, session regimes,
            structure validation, and risk-governed trade management under institutional constraints.
          </p>
        </header>

        {/* ADMISSION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Admission Requirements</h2>
          <ul className={styles.list}>
            <li>Level 3 certification (or screened equivalence)</li>
            <li>Demonstrated competency in multi-timeframe execution context</li>
            <li>Acceptance of governance: no signals, no shortcuts, process-first training</li>
          </ul>
        </section>

        {/* SCOPE */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Scope</h2>
          <ul className={styles.list}>
            <li>Major pairs and key crosses (liquidity characteristics and session behavior)</li>
            <li>Regime recognition: trend, range, transition, and volatility expansion</li>
            <li>Execution positioning: where trades are valid vs structurally invalid</li>
            <li>Risk governance: exposure, drawdown containment, and discipline protocols</li>
          </ul>
        </section>

        {/* OUTCOMES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Outcomes</h2>
          <ul className={styles.list}>
            <li>Consistent execution logic aligned to liquidity and structure</li>
            <li>Higher selectivity: rejecting low-quality conditions</li>
            <li>Improved risk control and repeatability</li>
            <li>Audit-ready decision trail (what, why, where invalidated)</li>
          </ul>
        </section>

        {/* CERTIFICATION STANDARD */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Certification Standard</h2>
          <p className={styles.paragraph}>
            Certification is granted only after completion of required lessons and competency
            verification. Certificates are training records and do not represent licensing,
            profitability guarantees, or investment advice.
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
