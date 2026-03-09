//src/app/(marketing)/how-progression-works/page.tsx
import Link from "next/link";
import styles from "./progression.module.css";

export default function ProgressionPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <section className={styles.hero}>
          <h1 className={styles.title}>How Progression Works</h1>
          <p className={styles.subtitle}>
            ProTrader Edge is a gated, competency-based training system. Progression is earned
            through discipline, not speed.
          </p>
        </section>

        {/* WHY GATED */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Why Progression Is Gated</h2>
          <p className={styles.paragraph}>
            Institutional traders are not trained by consuming content. They are trained by proving
            competence. Every level in ProTrader Edge requires lesson completion, assessment, and
            behavioral consistency.
          </p>
          <p className={styles.paragraph}>
            This ensures no skill gaps exist between levels — and that certification reflects real
            ability, not attendance.
          </p>
        </section>

        {/* LEVEL FLOW */}
        <section className={styles.section}>
          <h2 className={styles.h2}>The 4-Stage Path</h2>

          <div className={styles.levelGrid}>
            <div className={styles.levelCard}>
              <strong className={styles.levelTitle}>Level 1 — Foundation</strong>
              <div className={styles.levelDesc}>Market structure, liquidity, execution basics.</div>
            </div>

            <div className={styles.levelCard}>
              <strong className={styles.levelTitle}>Level 2 — Intermediate</strong>
              <div className={styles.levelDesc}>Execution models, multi-timeframe alignment.</div>
            </div>

            <div className={styles.levelCard}>
              <strong className={styles.levelTitle}>Level 3 — Professional</strong>
              <div className={styles.levelDesc}>Capital protection, governance, discipline.</div>
            </div>

            <div className={styles.levelCard}>
              <strong className={styles.levelTitle}>Specialist Track</strong>
              <div className={styles.levelDesc}>Domain-specific mastery (post-certification).</div>
            </div>
          </div>
        </section>

        {/* ASSESSMENT */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Assessment &amp; Unlocking</h2>
          <ul className={styles.list}>
            <li>Lessons must be completed sequentially</li>
            <li>Assessments test execution logic, not memorization</li>
            <li>Failed assessments require review before retake</li>
            <li>No skipping, no fast-tracking</li>
          </ul>
        </section>

        {/* CERTIFICATION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Certification Logic</h2>
          <p className={styles.paragraph}>
            Certification at ProTrader Edge confirms competency at a defined level. It is earned
            through evidence of execution understanding and discipline.
          </p>
          <p className={styles.paragraph}>
            Certificates are not licenses, signals, or profit guarantees — they are proof of
            training completion under institutional standards.
          </p>
        </section>

        {/* WHO THIS IS FOR */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Who This Is For</h2>
          <p className={styles.paragraph}>
            This program is designed for traders who value process, patience, and structure.
          </p>
          <p className={styles.paragraph}>
            If you are seeking shortcuts, signals, or fast profits — this system is not for you.
          </p>
        </section>

        {/* CTA */}
        <section className={styles.ctaRow}>
          <Link href="/programs" className={`${styles.btn} ${styles.btnGold}`}>
            Explore Programs
          </Link>

          <Link href="/login" className={`${styles.btn} ${styles.btnOutline}`}>
            Begin Training
          </Link>
        </section>
      </div>
    </main>
  );
}
