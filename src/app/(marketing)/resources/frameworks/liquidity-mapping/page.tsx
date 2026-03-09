// src/app/(marketing)/resources/frameworks/liquidity-mapping/page.tsx
import styles from "./liquidity-mapping.module.css";

export default function LiquidityMappingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <header className={styles.hero}>
          <h1 className={styles.title}>Liquidity Mapping Framework</h1>

          <p className={styles.purpose}>
            <strong>Purpose</strong>
          </p>
          <p className={styles.lead}>
            To identify where orders are likely resting and why price is attracted to certain
            levels.
          </p>

          <p className={styles.question}>This framework answers:</p>
          <p className={styles.highlight}>Where is liquidity likely to be taken next?</p>
        </header>

        {/* CORE PRINCIPLES */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Core Principles</h2>
          <ul className={styles.list}>
            <li>Markets move to facilitate transactions</li>
            <li>Liquidity pools form around obvious price levels</li>
            <li>Stop orders are a source of liquidity</li>
            <li>Institutions trade into liquidity, not away from it</li>
          </ul>
        </section>

        {/* WEBSITE PAGE STRUCTURE (FROM DOC) */}
        <section className={styles.section}>
          <h2 className={styles.h2}>What Liquidity Is</h2>
          <p className={styles.p}>
            Liquidity represents the ability for orders to be filled. In practice, it clusters
            where participants place obvious orders—especially stops—creating locations price is
            drawn toward.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Common Liquidity Pools</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.h3}>Equal Highs / Equal Lows</h3>
              <p className={styles.pMuted}>
                Clusters created by repeated highs or lows that invite stop placement.
              </p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Range Highs / Lows</h3>
              <p className={styles.pMuted}>
                Liquidity pools formed at the edges of established ranges.
              </p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Previous Day High / Low</h3>
              <p className={styles.pMuted}>
                Widely watched reference levels that frequently hold resting orders.
              </p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Session High / Low</h3>
              <p className={styles.pMuted}>
                Intraday liquidity points that reflect participation shifts across sessions.
              </p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.h3}>Untested Swing Points</h3>
              <p className={styles.pMuted}>
                Prior swing areas that remain unvisited and may attract future price.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Liquidity Events</h2>
          <div className={styles.eventStack}>
            <div className={styles.event}>
              <h3 className={styles.h3}>Sweep (Stop Run)</h3>
              <p className={styles.pMuted}>
                Price takes liquidity beyond an obvious level by triggering stops.
              </p>
            </div>
            <div className={styles.event}>
              <h3 className={styles.h3}>Partial Sweep</h3>
              <p className={styles.pMuted}>
                Price reaches into liquidity, takes a portion, and reacts before full clearance.
              </p>
            </div>
            <div className={styles.event}>
              <h3 className={styles.h3}>Failed Sweep</h3>
              <p className={styles.pMuted}>
                Attempted liquidity grab that does not complete and reverses/invalidates quickly.
              </p>
            </div>
            <div className={styles.event}>
              <h3 className={styles.h3}>Internal vs External Liquidity</h3>
              <p className={styles.pMuted}>
                Liquidity can exist inside a range/structure (internal) or beyond key boundaries
                (external).
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Institutional Behavior</h2>
          <p className={styles.p}>
            Institutions require liquidity to execute size. They typically operate into liquidity
            (where orders can be filled) rather than away from it. Liquidity mapping therefore
            clarifies why price is attracted to certain obvious levels.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Strategic Context</h2>
          <p className={styles.p}>
            Liquidity mapping is applied as context—not as a standalone trade trigger. It supports
            disciplined participation by clarifying where price is likely drawn and where reactions
            may occur after liquidity is taken.
          </p>
        </section>

        {/* APPLICATION */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Application</h2>
          <p className={styles.p}>Used to:</p>
          <ul className={styles.list}>
            <li>Anticipate reversals or continuations</li>
            <li>Avoid chasing price</li>
            <li>Align entries with institutional intent</li>
            <li>Frame risk asymmetrically</li>
          </ul>
        </section>

        {/* DISCLAIMER */}
        <section className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            The Liquidity Mapping Framework is educational and methodological in nature. It does
            not constitute investment advice, trading signals, or performance guarantees.
          </p>
        </section>
      </div>
    </main>
  );
}
