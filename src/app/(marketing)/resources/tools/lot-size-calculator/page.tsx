// src/app/(marketing)/resources/tools/lot-size-calculator/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./lot-size-calculator.module.css";

function safeNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export default function LotSizeCalculatorPage() {
  const [accountBalance, setAccountBalance] = useState("1000");
  const [riskPerTradePct, setRiskPerTradePct] = useState("1");
  const [stopLossPips, setStopLossPips] = useState("20");
  const [pipValuePerLot, setPipValuePerLot] = useState("10"); // standard lot ~$10/pip for many majors

  const result = useMemo(() => {
    const bal = safeNum(accountBalance);
    const riskPct = safeNum(riskPerTradePct);
    const sl = safeNum(stopLossPips);
    const pv = safeNum(pipValuePerLot);

    const riskAmount = bal > 0 && riskPct > 0 ? (bal * riskPct) / 100 : NaN;
    const rawLots = riskAmount > 0 && sl > 0 && pv > 0 ? riskAmount / (sl * pv) : NaN;

    return { riskAmount, rawLots };
  }, [accountBalance, riskPerTradePct, stopLossPips, pipValuePerLot]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Tools</p>
          <h1 className={styles.title}>Lot Size / Position Size Calculator</h1>
          <p className={styles.intro}>
            Calculate lot size using Account Balance and Risk per Trade (%).
            Stateless utility — refresh resets inputs.
          </p>
        </header>

        <section className={styles.panel}>
          <div className={styles.grid}>
            {/* Top row */}
            <label className={styles.field}>
              <span className={styles.label}>Account Balance ($)</span>
              <input
                className={styles.input}
                inputMode="decimal"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                placeholder="e.g. 1000"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Risk per Trade (%)</span>
              <input
                className={styles.input}
                inputMode="decimal"
                value={riskPerTradePct}
                onChange={(e) => setRiskPerTradePct(e.target.value)}
                placeholder="e.g. 1"
              />
              <span className={styles.help}>Example: 1 means 1% of account balance.</span>
            </label>

            {/* Bottom row */}
            <label className={styles.field}>
              <span className={styles.label}>Stop Loss (pips)</span>
              <input
                className={styles.input}
                inputMode="decimal"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(e.target.value)}
                placeholder="e.g. 20"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Pip Value per 1.00 lot ($/pip)</span>
              <input
                className={styles.input}
                inputMode="decimal"
                value={pipValuePerLot}
                onChange={(e) => setPipValuePerLot(e.target.value)}
                placeholder="e.g. 10"
              />
              <span className={styles.help}>
                If you don’t know this, use your broker/instrument pip value reference.
              </span>
            </label>
          </div>

          <div className={styles.result}>
            <div className={styles.row}>
              <span className={styles.rLabel}>Risk Amount ($)</span>
              <span className={styles.rValue}>
                {Number.isFinite(result.riskAmount) ? result.riskAmount.toFixed(2) : "—"}
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.rLabel}>Raw Lot Size</span>
              <span className={styles.rValue}>
                {Number.isFinite(result.rawLots) ? result.rawLots.toFixed(4) : "—"}
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.rLabel}>Executable Lot Size</span>
              <span className={styles.rValueGold}>
                {Number.isFinite(result.rawLots) ? result.rawLots.toFixed(2) : "—"}
              </span>
            </div>

            <p className={styles.note}>
              Formula: (Account Balance × Risk %) / (Stop Loss × Pip Value per 1.00 lot).
              Confirm broker constraints (min lot, step, max lot) before execution.
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