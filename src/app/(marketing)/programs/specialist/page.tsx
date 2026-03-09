import Link from "next/link";
import styles from "./specialist.module.css";

export default function SpecialistProgramsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Specialist Certifications</h1>
          <p className={styles.subtitle}>
            Specialist certifications are post-professional tracks for traders who have completed
            Level 3 and want domain-specific mastery. These tracks are competency-driven and
            designed for disciplined execution.
          </p>
        </section>

        {/* GRID */}
        <section className={styles.grid}>
          <Card
            title="FX Execution Specialist"
            desc="Advanced institutional execution models for FX markets."
            href="/programs/specialist/fx"
          />
          <Card
            title="Gold & Metals Specialist"
            desc="Liquidity behavior, volatility regimes, and metals execution."
            href="/programs/specialist/metals"
          />
          <Card
            title="Algorithmic Execution Specialist"
            desc="Rule-based execution logic, automation, and governance."
            href="/programs/specialist/algorithmic"
          />
          <Card
            title="Risk & Portfolio Specialist"
            desc="Capital allocation, exposure control, and risk governance."
            href="/programs/specialist/risk"
          />
        </section>

        {/* FOOT NOTE + CTA */}
        <section className={styles.bottom}>
          <p className={styles.note}>
            Admission is limited to Level 3 certified traders (or screened equivalents).
            Enrollment and access rules are enforced in the LMS.
          </p>

          <div className={styles.actions}>
            <Link href="/how-progression-works" className={`${styles.btn} ${styles.btnOutline}`}>
              How Progression Works
            </Link>

            <Link href="/login" className={`${styles.btn} ${styles.btnGold}`}>
              Login / Enroll
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>

      <Link href={href} className={styles.cardLink}>
        View Track <span className={styles.arrow}>→</span>
      </Link>
    </div>
  );
}
