import Link from "next/link";
import styles from "./metals.module.css";

export default function MetalsSpecialistPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <p className={styles.trackLabel}>Specialist Certification Track</p>
          <h1 className={styles.title}>Gold &amp; Metals Specialist</h1>
          <p className={styles.subtitle}>
            Domain mastery for metals execution, focusing on volatility behavior, liquidity
            asymmetries, and risk governance under high-impulse conditions.
          </p>
        </header>

        {/* ADMISSION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Admission Requirements</h2>
          <ul className={styles.list}>
            <li>Level 3 certification (or screened equivalence)</li>
            <li>Working knowledge of execution context and trade invalidation logic</li>
            <li>Acceptance of strict risk boundaries (metals demand discipline)</li>
          </ul>
        </section>

        {/* SCOPE */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Scope</h2>
          <ul className={styles.list}>
            <li>Volatility regimes and expansion phases in metals</li>
            <li>Liquidity mapping for stop-runs and displacement behavior</li>
            <li>Structural validation to avoid “chasing” moves</li>
            <li>Risk sizing logic under high ATR conditions</li>
          </ul>
        </section>

        {/* OUTCOMES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Outcomes</h2>
          <ul className={styles.list}>
            <li>Cleaner execution under volatility with reduced emotional interference</li>
            <li>Stronger invalidation discipline and trade containment</li>
            <li>More consistent decision-making under rapid movement</li>
            <li>Repeatable execution model for metals markets</li>
          </ul>
        </section>

        {/* CERTIFICATION STANDARD */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Certification Standard</h2>
          <p className={styles.paragraph}>
            Certification requires completion of required modules and competency verification.
            It does not constitute licensing or profitability assurance.
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
