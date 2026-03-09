// src/app/(marketing)/resources/tools/risk-calculator/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./risk-calculator.module.css";

function clampNum(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RiskCalculatorPage() {
  const [balance, setBalance] = useState<string>("10000");
  const [riskPercent, setRiskPercent] = useState<string>("1");

  const { riskAmount, pct } = useMemo(() => {
    const b = Number(balance);
    const p = clampNum(Number(riskPercent), 0, 100);
    const amt = Number.isFinite(b) && b >= 0 ? (b * p) / 100 : NaN;
    return { riskAmount: amt, pct: p };
  }, [balance, riskPercent]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Tools</p>
          <h1 className={styles.title}>Risk Calculator</h1>
          <p className={styles.intro}>
            Compute maximum monetary loss permitted on a single trade (hard risk cap enforced).
            Stateless utility — refresh resets inputs.
          </p>
        </header>

        <section className={styles.panel}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Account Balance</span>
              <input
                className={styles.input}
                inputMode="decimal"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="e.g. 10000"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Risk % per Trade</span>
              <input
                className={styles.input}
                inputMode="decimal"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                placeholder="e.g. 1"
              />
              <span className={styles.help}>Clamped to 0–100. Current: {pct.toFixed(2)}%</span>
            </label>
          </div>

          <div className={styles.result}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Max Risk Amount</span>
              <span className={styles.resultValue}>${formatMoney(riskAmount)}</span>
            </div>
            <p className={styles.note}>
              This is the hard loss cap for the trade. Execution should be rejected if the stop-loss,
              spread, commission, or broker constraints violate this cap.
            </p>
          </div>

          <div className={styles.actions}>
            <Link className={styles.secondaryBtn} href="/resources/tools">
              ← Back to Tools
            </Link>
          </div>

          <p className={styles.disclaimer}>
            Educational utility only. No advice, no signals, no performance guarantees.
          </p>
        </section>
      </div>
    </main>
  );
}