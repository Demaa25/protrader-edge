// src/app/(marketing)/resources/frameworks/execution-context/page.tsx
import styles from "./execution-context.module.css";

export default function ExecutionContextFrameworkPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Execution Context Framework</h1>

          <p className={styles.purpose}>
            <strong>Purpose</strong>
          </p>
          <p className={styles.lead}>
            To determine when trading is permitted or prohibited based on market conditions.
          </p>

          <p className={styles.question}>This framework answers:</p>
          <p className={styles.highlight}>Should I trade right now — yes or no?</p>
        </header>

        {/* CORE PRINCIPLES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Core Principles</h2>
          <ul className={styles.list}>
            <li>Not all time is tradable time</li>
            <li>Execution must occur in favorable conditions</li>
            <li>Context overrides setup quality</li>
            <li>Discipline is enforced by environment, not emotion</li>
          </ul>
        </section>

        {/* CONTEXT FILTERS */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Context Filters</h2>
          <p className={styles.p}>
            Context is evaluated using a fixed set of environmental filters. If key conditions are
            unfavorable, execution is reduced or prohibited.
          </p>
          <ul className={styles.list}>
            <li>Trading Session (Asia / London / New York)</li>
            <li>Market Open / Close</li>
            <li>News Proximity</li>
            <li>Volatility Regime</li>
            <li>Spread Conditions</li>
            <li>Time-of-Day Behavior</li>
          </ul>
        </section>

        {/* CONTEXT STATES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Context States</h2>
          <div className={styles.stateGrid}>
            <div className={styles.stateCard}>
              <h3 className={styles.h3}>Favorable</h3>
              <p className={styles.pMuted}>Execution allowed.</p>
            </div>

            <div className={styles.stateCard}>
              <h3 className={styles.h3}>Neutral</h3>
              <p className={styles.pMuted}>Execution reduced.</p>
            </div>

            <div className={styles.stateCard}>
              <h3 className={styles.h3}>Unfavorable</h3>
              <p className={styles.pMuted}>No execution.</p>
            </div>
          </div>
        </section>

        {/* APPLICATION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Application</h2>
          <p className={styles.p}>Used to:</p>
          <ul className={styles.list}>
            <li>Prevent overtrading</li>
            <li>Reduce false signals</li>
            <li>Improve execution quality</li>
            <li>Protect psychological capital</li>
          </ul>
        </section>

        {/* DISCLAIMER */}
        <section className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            The Execution Context Framework is educational and methodological in nature. It does not
            constitute investment advice, trading signals, or performance guarantees.
          </p>
        </section>
      </div>
    </main>
  );
}