// src/app/(marketing)/resources/frameworks/market-structure/page.tsx
import styles from "./market-structure.module.css";

export default function MarketStructurePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Market Structure Framework</h1>
          <p className={styles.purpose}>
            <strong>Purpose</strong>
          </p>
          <p className={styles.lead}>
            To provide a rule-based method for identifying the current state of
            price across timeframes.
          </p>
          <p className={styles.question}>
            This framework answers one question:
          </p>
          <p className={styles.highlight}>
            Is price trending, ranging, or transitioning — and where are we
            within that state?
          </p>
        </header>

        <section className={styles.section}>
          <h2>Core Principles</h2>
          <ul>
            <li>Price moves in structured sequences, not randomness</li>
            <li>Structure exists on all timeframes</li>
            <li>Higher timeframe structure governs lower timeframe behavior</li>
            <li>Structural shifts precede directional moves</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Structural Components</h2>
          <ul>
            <li>Swing Highs & Swing Lows</li>
            <li>Higher High / Higher Low</li>
            <li>Lower High / Lower Low</li>
            <li>Range High / Range Low</li>
            <li>Break of Structure (BOS)</li>
            <li>Change of Character (CHoCH)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Framework States</h2>

          <div className={styles.stateGrid}>
            <div className={styles.stateCard}>
              <h3>Expansion</h3>
              <p>Directional impulse</p>
            </div>

            <div className={styles.stateCard}>
              <h3>Consolidation</h3>
              <p>Range or compression</p>
            </div>

            <div className={styles.stateCard}>
              <h3>Transition</h3>
              <p>Structural shift or failure</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Application</h2>
          <p>Used to:</p>
          <ul>
            <li>Define directional bias</li>
            <li>Avoid counter-trend execution</li>
            <li>Anchor multi-timeframe analysis</li>
            <li>Filter low-probability trades</li>
          </ul>
        </section>

        <section className={`${styles.section} ${styles.disclaimer}`}>
          <p>
            The Market Structure Framework is educational and methodological in
            nature. It does not constitute investment advice, trading signals,
            or performance guarantees.
          </p>
        </section>
      </div>
    </main>
  );
}
