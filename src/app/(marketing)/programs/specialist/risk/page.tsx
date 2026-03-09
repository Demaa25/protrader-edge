import Link from "next/link";
import styles from "./risk.module.css";

export default function RiskSpecialistPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <p className={styles.trackLabel}>Specialist Certification Track</p>
          <h1 className={styles.title}>Risk &amp; Portfolio Specialist</h1>
          <p className={styles.subtitle}>
            Domain mastery for professional risk governance: drawdown containment, exposure control,
            capital allocation discipline, and audit-ready decision structures.
          </p>
        </header>

        {/* ADMISSION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Admission Requirements</h2>
          <ul className={styles.list}>
            <li>Level 3 certification (or screened equivalence)</li>
            <li>Ability to apply risk rules consistently under pressure</li>
            <li>Acceptance of governance: preservation-first decision-making</li>
          </ul>
        </section>

        {/* SCOPE */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Scope</h2>
          <ul className={styles.list}>
            <li>Risk frameworks: position sizing, max loss, max exposure</li>
            <li>Drawdown regimes and defensive response protocols</li>
            <li>Portfolio thinking: correlation awareness and concentration limits</li>
            <li>Performance governance: review standards, journaling, and rule enforcement</li>
          </ul>
        </section>

        {/* OUTCOMES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Outcomes</h2>
          <ul className={styles.list}>
            <li>More stable equity curve behavior through disciplined containment</li>
            <li>Reduced overtrading and improved selectivity</li>
            <li>Professional-level exposure control across markets</li>
            <li>Audit-ready performance review and rule compliance</li>
          </ul>
        </section>

        {/* CERTIFICATION STANDARD */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Certification Standard</h2>
          <p className={styles.paragraph}>
            Certification is granted after completion of required modules and demonstrated competency.
            It does not guarantee performance or constitute investment advice.
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
