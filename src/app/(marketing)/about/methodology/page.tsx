//src/app/(marketing)/about/methodology/page.tsx
import styles from "./methodology.module.css";

export default function MethodologyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Our Methodology</h1>

          <p className={styles.intro}>
            ProTrader Edge teaches trading as a structured professional skill, not a
            speculative activity. Our methodology is built on institutional market
            mechanics, liquidity behavior, and risk-first execution discipline.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.h2}>Markets Are Structured</h2>
            <p className={styles.p}>
              Price does not move randomly. Financial markets operate through
              structured phases driven by liquidity, participation, and order flow.
              Institutions accumulate, distribute, and rebalance positions in
              predictable ways.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Liquidity Drives Movement</h2>
            <p className={styles.p}>
              Every major price expansion is preceded by liquidity collection. Stops
              are not accidents — they are fuel. Understanding where liquidity
              rests is the foundation of professional trading.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Execution Is a Skill</h2>
            <p className={styles.p}>
              Professional trading is not prediction. It is execution under
              uncertainty, with predefined invalidation, risk control, and capital
              preservation rules. We train execution, not opinions.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Risk Comes Before Reward</h2>
            <p className={styles.p}>
              Survival is the first objective. Every strategy, model, and trade is
              governed by risk constraints. Consistency emerges from discipline, not
              from winning streaks.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.h2}>Certification Is Earned</h2>
            <p className={styles.p}>
              Progression through ProTrader Edge is gated. Students demonstrate
              understanding, execution discipline, and risk control before moving
              forward. Certification reflects competence, not attendance.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
