// src/app/page.tsx
import MarketingShell from "@/components/marketing/MarketingShell";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <MarketingShell>
      <main className={styles.main}>
        {/* ================= HERO ================= */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>
              Institutional Trading Education
              <br /> Built on Structure, Discipline, and Governance
            </h1>

            <p className={styles.heroSubtitle}>
              ProTrader Edge trains traders using the same principles that govern institutional
              execution: structured decision-making, risk containment, and repeatable process. No
              signals. No shortcuts. No hype.
            </p>

            <div className={styles.heroActions}>
              <Link href="/programs" className={`${styles.btn} ${styles.btnGold}`}>
                Explore Programs
              </Link>

              <Link href="/how-progression-works" className={`${styles.btn} ${styles.btnOutline}`}>
                How Progression Works
              </Link>
            </div>
          </div>
        </section>

        {/* ================= WHY ================= */}
        {/* Switched from styles.section -> styles.whySection for the screenshot look */}
        <section className={styles.whySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why ProTrader Edge</h2>

            <p className={styles.sectionLead}>
              Most traders fail not because they lack information, but because they lack structure,
              discipline, and risk governance. ProTrader Edge exists to correct that.
            </p>

            <div className={styles.featureGrid}>
              <Feature
                iconSrc="/images/home/why-structure-first.png"
                iconAlt="Structure First icon"
                title="Structure First"
                desc="You learn how markets move before you learn how to trade them."
              />
              <Feature
                iconSrc="/images/home/why-discipline-by-design.png"
                iconAlt="Discipline by Design icon"
                title="Discipline by Design"
                desc="Progression is gated. You cannot advance without competence."
              />
              <Feature
                iconSrc="/images/home/why-risk-governance.png"
                iconAlt="Risk Governance icon"
                title="Risk Governance"
                desc="Capital protection is taught before profit seeking."
              />
              <Feature
                iconSrc="/images/home/why-institutional-thinking.png"
                iconAlt="Institutional Thinking icon"
                title="Institutional Thinking"
                desc="We train process, not prediction."
              />
            </div>
          </div>
        </section>

        {/* ================= PROGRAM OVERVIEW ================= */}
        {/* Switched from styles.sectionAlt -> styles.trainingSection for the clean white/icon look */}
        <section className={styles.trainingSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Training Path</h2>

            <div className={styles.cardGrid}>
              <Card
                iconSrc="/images/home/path-foundation.png"
                iconAlt="Foundation icon"
                title="Foundation"
                desc="Learn how markets move, where liquidity sits, and why price behaves as it does."
                href="/programs/foundation"
              />
              <Card
                iconSrc="/images/home/path-intermediate.png"
                iconAlt="Intermediate icon"
                title="Intermediate"
                desc="Develop execution models, context alignment, and decision consistency."
                href="/programs/intermediate"
              />
              <Card
                iconSrc="/images/home/path-professional.png"
                iconAlt="Professional icon"
                title="Professional"
                desc="Operate with capital governance, risk discipline, and audit-ready logic."
                href="/programs/professional"
              />
            </div>
          </div>
        </section>

        {/* ================= SPECIALIST ================= */}
        {/* DO NOT TOUCH (kept as-is) */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Specialist Certifications</h2>

            <p className={styles.sectionLead}>
              After completing professional training, traders may pursue domain-specific mastery in
              execution, risk, and automation.
            </p>

            <Link href="/programs/specialist" className={`${styles.btn} ${styles.btnDark}`}>
              View Specialist Tracks
            </Link>
          </div>
        </section>

        {/* ================= CTA ================= */}
        {/* DO NOT TOUCH (kept as-is) */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Begin Structured Training</h2>

            <p className={styles.ctaSubtitle}>
              This program is for disciplined traders who want to operate with structure, patience,
              and professional standards.
            </p>

            <Link href="/login" className={`${styles.btn} ${styles.btnGold}`}>
              Login / Enroll
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

/* ------------------------------------ */
/* COMPONENTS */
/* ------------------------------------ */
function Feature({
  iconSrc,
  iconAlt,
  title,
  desc,
}: {
  iconSrc: string;
  iconAlt: string;
  title: string;
  desc: string;
}) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIconWrap} aria-hidden="true">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={72}
          height={72}
          className={styles.featureIcon}
        />
      </div>

      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{desc}</p>
    </div>
  );
}

function Card({
  iconSrc,
  iconAlt,
  title,
  desc,
  href,
}: {
  iconSrc: string;
  iconAlt: string;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div className={styles.programCard}>
      <div className={styles.programIconWrap} aria-hidden="true">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={84}
          height={84}
          className={styles.programIcon}
        />
      </div>

      <h3 className={styles.programTitle}>{title}</h3>
      <p className={styles.programDesc}>{desc}</p>

      <Link href={href} className={`${styles.btn} ${styles.btnDark} ${styles.btnSmall}`}>
        View Program
      </Link>
    </div>
  );
}