//src/app/(marketing)/about/technology/page.tsx
import styles from "./technology.module.css";

export default function TechnologyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Our Technology</h1>

          <p className={styles.intro}>
            ProTrader Edge is powered by a purpose-built learning and execution
            infrastructure designed for professional trading education. Our systems
            enforce discipline, progression, and accountability — the same standards
            used in institutional environments.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.h2}>Learning Management System (LMS)</h2>
            <p className={styles.p}>
              The ProTrader Edge LMS is not a video library. It is a gated,
              state-driven system that enforces lesson completion, assessments, and
              progression rules. Students cannot skip steps or bypass requirements.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Assessment &amp; Auto-Grading Engine</h2>
            <p className={styles.p}>
              Every level includes structured assessments. Results are graded
              automatically, logged, and tied to progression eligibility. Failure
              produces targeted feedback — not repetition.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Certification &amp; Audit Trail</h2>
            <p className={styles.p}>
              Certification is generated only after all academic and execution
              requirements are met. Every certification has an audit trail linked
              to completed lessons, assessments, and timestamps.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Media &amp; Content Integrity</h2>
            <p className={styles.p}>
              Lesson videos, slides, and downloadable materials are generated from a
              single canonical source. This ensures that every format teaches the
              same content — word for word, concept for concept.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Security &amp; Data Integrity</h2>
            <p className={styles.p}>
              Student data, progress, and certifications are stored securely.
              Progression rules are enforced at the system level, not by instructors
              or manual overrides.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
