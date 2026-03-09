//src/app/(marketing)/about/certification/page.tsx
import styles from "./certification.module.css";

export default function CertificationPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Certification Framework</h1>

          <p className={styles.intro}>
            Certification at ProTrader Edge is not automatic. It is earned through
            demonstrated competence, disciplined execution, and adherence to risk
            rules. Every certificate represents verified skill, not course
            completion.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.h2}>Progression Is Gated</h2>
            <p className={styles.p}>
              Students advance only after completing required lessons, passing
              assessments, and meeting defined performance criteria. This ensures
              that knowledge builds correctly and no gaps are carried forward.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Level-Based Certification</h2>
            <p className={styles.p}>
              Each program level has its own certification. These certifications
              reflect mastery of specific competencies — from market structure and
              liquidity, to execution models and professional risk management.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Audit Trail &amp; Verification</h2>
            <p className={styles.p}>
              Every certificate is backed by a complete audit trail including lesson
              completion, assessment results, and timestamps. This ensures
              verifiability and prevents credential inflation.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>No Bypass Policy</h2>
            <p className={styles.p}>
              Certification cannot be bypassed through payment, attendance, or
              instructor approval. Advancement is controlled entirely by system
              rules, not discretion.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Professional Alignment</h2>
            <p className={styles.p}>
              The certification framework is aligned with professional trading desk
              expectations: risk-first thinking, execution discipline, and
              accountability.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
