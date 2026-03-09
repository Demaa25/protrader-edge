//src/app/(marketing)/about/page.tsx
import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>About ProTrader Edge</h1>

          <p className={styles.intro}>
            ProTrader Edge is an institutional trading education and technology
            company focused on developing disciplined, professional traders. We do
            not teach speculation. We train execution, risk control, and structured
            market understanding.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.h2}>Why We Exist</h2>
          <p className={styles.p}>
            Most traders fail because they are taught opinions, indicators, and
            shortcuts. Professional trading requires structure, process, and
            discipline. ProTrader Edge exists to bridge that gap.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>What We Do Differently</h2>
          <p className={styles.p}>
            We operate a gated, audited learning system that enforces progression,
            assessment, and certification. No skipping. No hype. No shortcuts.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>How We Train</h2>
          <p className={styles.p}>
            Our programs are built on institutional market mechanics, liquidity
            theory, execution models, and risk governance. Students progress only
            after demonstrating competence.
          </p>
        </section>

        <section className={`${styles.section} ${styles.learnMore}`}>
          <h2 className={styles.h2}>Learn More</h2>

          <ul className={styles.links}>
            <li>
              <Link className={styles.link} href="/about/overview">
                Program Overview <span className={styles.arrow}>→</span>
              </Link>
            </li>
            <li>
              <Link className={styles.link} href="/about/methodology">
                Our Methodology <span className={styles.arrow}>→</span>
              </Link>
            </li>
            <li>
              <Link className={styles.link} href="/about/technology">
                Our Technology <span className={styles.arrow}>→</span>
              </Link>
            </li>
            <li>
              <Link className={styles.link} href="/about/certification">
                Certification Framework <span className={styles.arrow}>→</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
