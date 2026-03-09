//src/app/(marketing)/resources/page.tsx
import Link from "next/link";
import styles from "./resources.module.css";

export default function ResourcesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Resources</h1>
          <p className={styles.subtitle}>
            ProTrader Edge provides structured resources designed to support
            professional market understanding, execution discipline, and
            institutional trading workflows.
          </p>
        </header>

        {/* CARDS */}
        <section className={styles.grid} aria-label="Resources categories">
          <Link href="/resources/research" className={styles.card}>
            <h2 className={styles.cardTitle}>Research &amp; Methodology</h2>
            <p className={styles.cardText}>
              Institutional perspectives, market structure frameworks, and
              professional analysis. No signals. No hype.
            </p>
            <span className={styles.cardCta}>View Research →</span>
          </Link>

          <Link href="/resources/frameworks" className={styles.card}>
            <h2 className={styles.cardTitle}>Market Frameworks</h2>
            <p className={styles.cardText}>
              Conceptual models and structural frameworks used throughout the
              ProTrader Edge curriculum.
            </p>
            <span className={styles.cardCta}>View Frameworks →</span>
          </Link>

          <Link href="/resources/tools" className={styles.card}>
            <h2 className={styles.cardTitle}>Trading Tools</h2>
            <p className={styles.cardText}>
              Optional indicators, EAs, and utilities for execution and risk
              management. Delivered by email after purchase.
            </p>
            <span className={styles.cardCta}>View Tools →</span>
          </Link>

          <Link href="/resources/articles" className={styles.card}>
            <h2 className={styles.cardTitle}>Articles</h2>
            <p className={styles.cardText}>
              Educational articles explaining key trading concepts, progression,
              and professional practices.
            </p>
            <span className={styles.cardCta}>View Articles →</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
