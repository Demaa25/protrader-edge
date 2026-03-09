// src/app/(marketing)/programs/page.tsx
import Link from "next/link";
import styles from "./programs.module.css";

export default function ProgramsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Programs</h1>
          <p className={styles.subtitle}>
            Our Forex education programs are designed to take you from a novice trader
            to a professional. Choose the path that suits your current skill level
            and trading goals.
          </p>
        </section>

        {/* CORE PROGRAMS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Core Training Path</h2>

          <div className={styles.grid4}>
            <ProgramCard
              title="Level 1 — Foundation"
              description="Market structure, liquidity, and execution fundamentals."
              cta="Learn More"
              href="/programs/foundation"
            />

            <ProgramCard
              title="Level 2 — Intermediate"
              description="Execution models, multi-timeframe alignment, and execution discipline."
              cta="Learn More"
              href="/programs/intermediate"
            />

            <ProgramCard
              title="Level 3 — Professional"
              description="Capital protection, governance, and professional execution behavior."
              cta="Learn More"
              href="/programs/professional"
            />

            <ProgramCard
              title="Specialist"
              description="Optional post-professional tracks for domain-specific mastery."
              cta="Learn More"
              href="/programs/specialist"
            />
          </div>
        </section>

        {/* SPECIALIST PROGRAMS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Specialist Certification Track</h2>

          <p className={styles.lead}>
            Specialist certifications are post-professional programs for traders who have completed
            Level 3 and wish to develop domain-specific mastery. These tracks are optional, modular,
            and competency-driven.
          </p>

          <div className={styles.gridSpecialistOneLine}>
            <ProgramCard
              title="FX Execution Specialist"
              description="Advanced institutional execution models for FX markets."
              cta="View Track"
              href="/programs/specialist/fx"
            />

            <ProgramCard
              title="Gold & Metals Specialist"
              description="Liquidity behavior, volatility regimes, and metals execution."
              cta="View Track"
              href="/programs/specialist/metals"
            />

            <ProgramCard
              title="Algorithmic Execution Specialist"
              description="Rule-based execution logic, automation, and governance."
              cta="View Track"
              href="/programs/specialist/algorithmic"
            />

            <ProgramCard
              title="Risk & Portfolio Specialist"
              description="Capital allocation, exposure control, and risk governance."
              cta="View Track"
              href="/programs/specialist/risk"
            />
          </div>
        </section>

        {/* PROGRESSION CTA */}
        <section className={styles.ctaRow}>
          <Link href="/how-progression-works" className={`${styles.btn} ${styles.btnOutline}`}>
            How Progression Works
          </Link>

          <Link href="/login" className={`${styles.btn} ${styles.btnGold}`}>
            Begin Training
          </Link>
        </section>
      </div>
    </main>
  );
}

/* ---------------------------------------- */
/* COMPONENT */
/* ---------------------------------------- */
function ProgramCard({
  title,
  description,
  cta,
  href,
  icon,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon?: string;
}) {
  return (
    <div className={styles.card}>
      {icon ? <div className={styles.icon} aria-hidden="true">{icon}</div> : null}

      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>

      <Link href={href} className={styles.cardLink}>
        {cta} <span className={styles.arrow}>→</span>
      </Link>
    </div>
  );
}
