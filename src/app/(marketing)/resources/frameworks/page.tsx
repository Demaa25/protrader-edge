//src/app/(marketing)/resources/frameworks/page.tsx
import Link from "next/link";
import styles from "./frameworks.module.css";

export default function FrameworksPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Market Frameworks</h1>
          <p className={styles.intro}>
            At ProTrader Edge, trading education is structured around institutional market
            frameworks, not indicators, opinions, or discretionary shortcuts. Our frameworks define
            how markets are observed, interpreted, and governed across different levels of trader
            development. They are methodological references, not trading systems, and form the
            intellectual foundation of the ProTrader Edge curriculum.
          </p>
        </header>

        <h2 className={styles.sectionTitle}>Our Core Market Frameworks</h2>

        <section className={styles.grid}>
          <Link href="/resources/frameworks/market-structure" className={styles.card}>
            <h2>Market Structure Framework</h2>
            <p>
              Defines structural phases, swing logic, trend transitions, and institutional
              positioning behavior.
            </p>
            <span className={styles.cta}>
              View Framework <span className={styles.arrow}>→</span>
            </span>
          </Link>

          <Link href="/resources/frameworks/liquidity-mapping" className={styles.card}>
            <h2>Liquidity Mapping Framework</h2>
            <p>
              Identifies liquidity pools, stop clusters, inducement zones, and expansion triggers
              that drive price movement.
            </p>
            <span className={styles.cta}>
              View Framework <span className={styles.arrow}>→</span>
            </span>
          </Link>

          <Link href="/resources/frameworks/execution-context" className={styles.card}>
            <h2>Execution Context Framework</h2>
            <p>
              Aligns structure, liquidity, timing, and invalidation logic for professional-grade
              trade execution.
            </p>
            <span className={styles.cta}>
              View Framework <span className={styles.arrow}>→</span>
            </span>
          </Link>

          <Link href="/resources/frameworks/risk-governance" className={styles.card}>
            <h2>Risk Governance Framework</h2>
            <p>
              Establishes position sizing rules, exposure control, drawdown management, and capital
              preservation discipline.
            </p>
            <span className={styles.cta}>
              View Framework <span className={styles.arrow}>→</span>
            </span>
          </Link>
        </section>

        {/* NEW: How Frameworks Evolve Across Levels (rewritten from your .txt) */}
        <section className={styles.evolveSection}>
          <h2 className={styles.sectionTitle}>How Frameworks Evolve Across Levels</h2>

          <p className={styles.evolveIntro}>
            ProTrader Edge frameworks are not static concepts. Their function evolves as a trader
            progresses through the curriculum—moving from disciplined observation, to analytical
            filtering, to professional-grade operation and governance.
          </p>

          <div className={styles.evolveGrid}>
            <div className={styles.evolveCard}>
              <h3 className={styles.evolveH3}>Level 1 — Foundation</h3>
              <ul className={styles.evolveList}>
                <li>Market Structure → Observation</li>
                <li>Liquidity → Awareness</li>
                <li>Execution Context → Discipline</li>
                <li>Risk Governance → Survival</li>
              </ul>
              <p className={styles.evolveNote}>
                Objective: Literacy, restraint, and disciplined observation.
              </p>
            </div>

            <div className={styles.evolveCard}>
              <h3 className={styles.evolveH3}>Level 2 — Intermediate</h3>
              <ul className={styles.evolveList}>
                <li>Market Structure → Directional bias</li>
                <li>Liquidity → Expectation framing</li>
                <li>Execution Context → Trade permission</li>
                <li>Risk Governance → Stability control</li>
              </ul>
              <p className={styles.evolveNote}>
                Objective: Consistency and analytical filtering.
              </p>
            </div>

            <div className={styles.evolveCard}>
              <h3 className={styles.evolveH3}>Level 3 — Professional</h3>
              <ul className={styles.evolveList}>
                <li>Market Structure → Strategic execution</li>
                <li>Liquidity → Trade justification</li>
                <li>Execution Context → System override</li>
                <li>Risk Governance → Institutional governance</li>
              </ul>
              <p className={styles.evolveNote}>
                Objective: Longevity, control, and professional-grade operation.
              </p>
            </div>
          </div>

          <div className={styles.alignSection}>
            <h2 className={styles.alignTitle}>Frameworks, Programs, and Progression</h2>
            <p className={styles.alignIntro}>
              The Market Frameworks form the intellectual backbone of all ProTrader Edge programs.
              Rather than introducing disconnected concepts at each level, the same frameworks
              deepen in function and responsibility as traders progress.
            </p>

            <div className={styles.alignGrid}>
              <div className={styles.alignCard}>
                <h3 className={styles.alignH3}>Foundation Program (Level 1)</h3>
                <p className={styles.alignP}>
                  Frameworks are introduced conceptually to build market literacy, structural
                  awareness, and disciplined observation.
                </p>
              </div>

              <div className={styles.alignCard}>
                <h3 className={styles.alignH3}>Intermediate Program (Level 2)</h3>
                <p className={styles.alignP}>
                  Frameworks are applied analytically to filter execution, control participation,
                  and stabilize performance.
                </p>
              </div>

              <div className={styles.alignCard}>
                <h3 className={styles.alignH3}>Professional Program (Level 3)</h3>
                <p className={styles.alignP}>
                  Frameworks are deployed operationally as part of integrated trading systems,
                  governance rules, and risk control structures.
                </p>
              </div>
            </div>

            <p className={styles.progressionNote}>
              Progression is competency-based, not time-based. Mastery at one level becomes the
              entry requirement for the next.
            </p>

            <div className={styles.disclaimer}>
              The Market Frameworks presented on this page are educational and methodological in
              nature. They do not constitute investment advice, trading signals, or performance
              guarantees.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
