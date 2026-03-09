// src/app/(marketing)/resources/tools/page.tsx
import Link from "next/link";
import styles from "./tools.module.css";

const tools = [
  {
    title: "Risk Calculator",
    href: "/resources/tools/risk-calculator",
    desc: "Compute maximum monetary loss permitted on a single trade (hard risk cap enforced).",
  },
  {
    title: "Lot Size / Position Size Calculator",
    href: "/resources/tools/lot-size-calculator",
    desc: "Convert Risk Amount + Stop Loss into an executable lot size (always rounded down).",
  },
  {
    title: "Trade Viability Checker",
    href: "/resources/tools/trade-viability-checker",
    desc: "Structural pre-execution gate: validates broker constraints and cost ratios.",
  },
  {
    title: "R-Multiple (R:R) Evaluator",
    href: "/resources/tools/r-multiple",
    desc: "Evaluate reward relative to defined risk, expressed strictly in R-multiples (structure only).",
  },
  {
    title: "Drawdown & Risk-of-Ruin (Deterministic)",
    href: "/resources/tools/drawdown-risk",
    desc: "Illustrate fixed-risk drawdown and recovery math from losing streaks (non-predictive).",
  },
  {
    title: "Session & Market State Filter",
    href: "/resources/tools/session-filter",
    desc: "Display session context and general liquidity labeling from time + instrument category only.",
  },
  {
    title: "SSD Logic Validator",
    href: "/resources/tools/ssd-validator",
    desc: "Validate whether a trading concept meets minimum structural requirements of a rule-based system.",
  },
];

export default function ToolsIndexPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Tools</h1>
          <p className={styles.intro}>
            Stateless decision-support utilities. No accounts. No storage. Refresh resets inputs.
          </p>
        </header>

        <section className={styles.grid} aria-label="Tools list">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardTitle}>{t.title}</div>
                <div className={styles.cardDesc}>{t.desc}</div>
              </div>

              <div className={styles.cardCta}>
                Open <span className={styles.arrow}>→</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}