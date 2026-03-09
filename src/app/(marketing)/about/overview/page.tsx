//src/app/(marketing)/about/overview/page.tsx
import Link from "next/link";
import styles from "./overview.module.css";

export default function AboutOverviewPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>About ProTrader Edge</h1>
          <p className={styles.intro}>
            Learn how ProTrader Edge trains professional traders using structured
            methodology, technology, and certification.
          </p>
        </header>

        <section className={styles.grid} aria-label="About overview links">
          <Link href="/about/methodology" className={styles.card}>
            <h2 className={styles.cardTitle}>Our Methodology</h2>
            <p className={styles.cardText}>
              Institutional market structure, liquidity, and execution.
            </p>
            <span className={styles.cardCta}>Learn more →</span>
          </Link>

          <Link href="/about/technology" className={styles.card}>
            <h2 className={styles.cardTitle}>Our Technology</h2>
            <p className={styles.cardText}>
              Gated LMS, assessments, audit trails, and certification systems.
            </p>
            <span className={styles.cardCta}>Learn more →</span>
          </Link>

          <Link href="/about/certification" className={styles.card}>
            <h2 className={styles.cardTitle}>Certification</h2>
            <p className={styles.cardText}>
              Competence-based progression and verification framework.
            </p>
            <span className={styles.cardCta}>Learn more →</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
