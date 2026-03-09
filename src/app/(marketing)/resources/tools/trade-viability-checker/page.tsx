// src/app/(marketing)/resources/tools/trade-viability-checker/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./trade-viability-checker.module.css";

function n(v: string) {
  const x = Number(v);
  return Number.isFinite(x) ? x : NaN;
}

function fmt(nv: number, d = 2) {
  if (!Number.isFinite(nv)) return "—";
  return nv.toFixed(d);
}

export default function TradeViabilityCheckerPage() {
  // broker/execution costs
  const [spreadPips, setSpreadPips] = useState("1.2");
  const [commissionUsdPerLot, setCommissionUsdPerLot] = useState("7"); // round turn
  const [pipValuePerLot, setPipValuePerLot] = useState("10");
  const [lots, setLots] = useState("1");

  // structure/risk
  const [stopLossPips, setStopLossPips] = useState("20");
  const [takeProfitPips, setTakeProfitPips] = useState("40");

  const out = useMemo(() => {
    const sp = n(spreadPips);
    const com = n(commissionUsdPerLot);
    const pv = n(pipValuePerLot);
    const l = n(lots);
    const sl = n(stopLossPips);
    const tp = n(takeProfitPips);

    const commissionPips = pv > 0 && l > 0 ? com / (pv * l) : NaN;
    const costPips = (Number.isFinite(sp) ? sp : NaN) + (Number.isFinite(commissionPips) ? commissionPips : NaN);

    const rr = sl > 0 && tp > 0 ? tp / sl : NaN;
    const rrAfterCosts = sl > 0 && tp > 0 && Number.isFinite(costPips)
      ? (tp - costPips) / (sl + costPips)
      : NaN;

    const costToStop = sl > 0 && Number.isFinite(costPips) ? costPips / sl : NaN;

    // simple gate rules (non-advice; structural sanity checks)
    const tooCostly = Number.isFinite(costToStop) && costToStop > 0.25; // costs exceed 25% of stop
    const rrWeak = Number.isFinite(rrAfterCosts) && rrAfterCosts < 1.0;

    let verdict: "Pass" | "Caution" | "Reject" = "Pass";
    if (tooCostly || rrWeak) verdict = "Caution";
    if ((Number.isFinite(costToStop) && costToStop > 0.4) || (Number.isFinite(rrAfterCosts) && rrAfterCosts < 0.8)) {
      verdict = "Reject";
    }

    return { commissionPips, costPips, rr, rrAfterCosts, costToStop, verdict };
  }, [spreadPips, commissionUsdPerLot, pipValuePerLot, lots, stopLossPips, takeProfitPips]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Tools</p>
          <h1 className={styles.title}>Trade Viability Checker</h1>
          <p className={styles.intro}>
            Structural pre-execution gate: validates broker constraints and cost ratios. Stateless utility — refresh resets inputs.
          </p>
        </header>

        <section className={styles.panel}>
          <h2 className={styles.h2}>Costs</h2>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Spread (pips)</span>
              <input className={styles.input} inputMode="decimal" value={spreadPips} onChange={(e) => setSpreadPips(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Commission ($ per 1.00 lot, round-turn)</span>
              <input className={styles.input} inputMode="decimal" value={commissionUsdPerLot} onChange={(e) => setCommissionUsdPerLot(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Pip Value ($/pip per 1.00 lot)</span>
              <input className={styles.input} inputMode="decimal" value={pipValuePerLot} onChange={(e) => setPipValuePerLot(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Lots</span>
              <input className={styles.input} inputMode="decimal" value={lots} onChange={(e) => setLots(e.target.value)} />
            </label>
          </div>

          <h2 className={styles.h2} style={{ marginTop: "1.1rem" }}>
            Risk / R:R
          </h2>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Stop Loss (pips)</span>
              <input className={styles.input} inputMode="decimal" value={stopLossPips} onChange={(e) => setStopLossPips(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Take Profit (pips)</span>
              <input className={styles.input} inputMode="decimal" value={takeProfitPips} onChange={(e) => setTakeProfitPips(e.target.value)} />
            </label>
          </div>

          <div className={styles.result}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Commission (pips)</span>
              <span className={styles.resultValue}>{fmt(out.commissionPips, 3)}</span>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Total Cost (pips)</span>
              <span className={styles.resultValue}>{fmt(out.costPips, 3)}</span>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>R:R (raw)</span>
              <span className={styles.resultValue}>{fmt(out.rr, 2)}</span>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>R:R (after costs)</span>
              <span className={styles.resultValueGold}>{fmt(out.rrAfterCosts, 2)}</span>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Cost / Stop</span>
              <span className={styles.resultValue}>{fmt(out.costToStop * 100, 1)}%</span>
            </div>

            <div className={styles.verdictWrap}>
              <span className={styles.verdictLabel}>Gate Result</span>
              <span
                className={`${styles.verdict} ${
                  out.verdict === "Pass" ? styles.pass : out.verdict === "Caution" ? styles.caution : styles.reject
                }`}
              >
                {out.verdict}
              </span>
            </div>

            <p className={styles.note}>
              This checker is not a signal. It is a cost and constraint sanity check. If costs consume an
              excessive portion of the stop, execution should be rejected regardless of setup quality.
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