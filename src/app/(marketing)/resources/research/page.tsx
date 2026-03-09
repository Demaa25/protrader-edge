// src/app/(marketing)/resources/research/page.tsx
import Link from "next/link";
import styles from "./research.module.css";

export default function ResearchPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Research &amp; Methodology</h1>
          <p className={styles.intro}>
            Institutional-grade analysis underpinning ProTrader Edge frameworks, curriculum design,
            and execution governance.
          </p>
        </header>

        {/* PURPOSE */}
        <section className={styles.section}>
          <h2 className={styles.h2}>What Our Research Represents</h2>
          <p className={styles.p}>
            ProTrader Edge research examines market behavior, execution dynamics, and risk exposure
            under real-world conditions. It is observational, diagnostic, and governance-focused —
            not predictive.
          </p>
          <p className={styles.p}>
            Research informs framework construction, curriculum sequencing, execution permissions,
            and risk controls across market regimes.
          </p>
        </section>

        {/* DOMAINS */}
        <section className={`${styles.section} ${styles.domains}`}>
          <div className={styles.domainCard}>
            <h3 className={styles.h3}>Market Structure Research</h3>
            <p className={styles.pSmall}>Structural regimes, authority shifts, continuation failure.</p>
          </div>

          <div className={styles.domainCard}>
            <h3 className={styles.h3}>Liquidity &amp; Participation</h3>
            <p className={styles.pSmall}>
              Inducement behavior, stop-driven expansion, session liquidity.
            </p>
          </div>

          <div className={styles.domainCard}>
            <h3 className={styles.h3}>Execution Context Analysis</h3>
            <p className={styles.pSmall}>Time-based participation rules and volatility regimes.</p>
          </div>

          <div className={styles.domainCard}>
            <h3 className={styles.h3}>Risk &amp; Performance Governance</h3>
            <p className={styles.pSmall}>Drawdown clustering, risk-of-ruin, expectancy degradation.</p>
          </div>
        </section>

        {/* CONNECTION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>How Research Connects</h2>

          <pre className={styles.flow}>Research → Frameworks → Curriculum → Execution Governance</pre>

          <p className={styles.p}>
            Research insights are distilled into frameworks. Frameworks shape curriculum. Curriculum
            governs execution behavior inside the LMS.
          </p>
        </section>

        {/* BOUNDARIES */}
        <section className={`${styles.section} ${styles.muted}`}>
          <h2 className={styles.h2}>What We Do Not Publish</h2>
          <ul className={styles.list}>
            <li>Trade signals</li>
            <li>Forecasts or predictions</li>
            <li>Indicator-based strategies</li>
            <li>Performance promises</li>
          </ul>
          <p className={styles.p}>Research exists to govern decision-making, not replace it.</p>
        </section>

        {/* CTA */}
        <section className={`${styles.section} ${styles.cta}`}>
          <Link href="/resources/frameworks" className={styles.ctaLink}>
            View Market Frameworks <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/programs" className={styles.ctaLink}>
            Explore Programs <span className={styles.arrow}>→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
