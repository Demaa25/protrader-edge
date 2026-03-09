// src/app/(marketing)/resources/frameworks/risk-governance/page.tsx
import styles from "./risk-governance.module.css";

export default function RiskGovernanceFrameworkPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Risk Governance Framework</h1>

          <p className={styles.purpose}>
            <strong>Purpose</strong>
          </p>
          <p className={styles.lead}>
            To define how risk is controlled at system level, not trade level.
          </p>

          <p className={styles.question}>This framework answers:</p>
          <p className={styles.highlight}>
            How do we ensure long-term survival regardless of short-term outcomes?
          </p>
        </header>

        {/* CORE PRINCIPLES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Core Principles</h2>
          <ul className={styles.list}>
            <li>Risk is managed before execution</li>
            <li>Losses are operational costs, not failures</li>
            <li>Capital preservation is non-negotiable</li>
            <li>Systems fail from poor governance, not bad trades</li>
          </ul>
        </section>

        {/* RISK DIMENSIONS */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Risk Dimensions</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.h3}>Position Risk</h3>
              <p className={styles.pMuted}>Controls exposure at the trade level.</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Session Risk</h3>
              <p className={styles.pMuted}>Caps damage inside a single trading session.</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Daily / Weekly Risk</h3>
              <p className={styles.pMuted}>Prevents compounding losses across time windows.</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Drawdown Limits</h3>
              <p className={styles.pMuted}>Defines when trading must stop and reset.</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Risk-of-Ruin Awareness</h3>
              <p className={styles.pMuted}>Keeps probability of failure structurally low.</p>
            </div>
          </div>
        </section>

        {/* GOVERNANCE RULES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Governance Rules</h2>
          <ul className={styles.list}>
            <li>Fixed risk per trade</li>
            <li>Maximum concurrent exposure</li>
            <li>Loss caps per session</li>
            <li>Mandatory cooling-off rules</li>
            <li>Performance review cycles</li>
          </ul>
        </section>

        {/* APPLICATION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Application</h2>
          <p className={styles.p}>Used to:</p>
          <ul className={styles.list}>
            <li>Prevent account blow-ups</li>
            <li>Enforce discipline</li>
            <li>Scale responsibly</li>
            <li>Maintain institutional mindset</li>
          </ul>
        </section>

        {/* DISCLAIMER */}
        <section className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            The Risk Governance Framework is educational and methodological in nature. It does not
            constitute investment advice, trading signals, or performance guarantees.
          </p>
        </section>
      </div>
    </main>
  );
}