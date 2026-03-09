// src/app/(marketing)/resources/tools/drawdown-risk/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./drawdown-risk.module.css";

function num(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function fmtPct(x: number, d = 2) {
  if (!Number.isFinite(x)) return "—";
  return (x * 100).toFixed(d) + "%";
}

export default function DrawdownRiskPage() {
  const [riskPct, setRiskPct] = useState("1"); // per trade
  const [losses, setLosses] = useState("10"); // consecutive losses
  const [startingEquity, setStartingEquity] = useState("10000");

  const out = useMemo(() => {
    const r = num(riskPct) / 100;
    const n = Math.max(0, Math.floor(num(losses)));
    const e0 = num(startingEquity);

    const remaining = Number.isFinite(r) && r >= 0 && r < 1 ? Math.pow(1 - r, n) : NaN;
    const drawdown = Number.isFinite(remaining) ? 1 - remaining : NaN;
    const recovery = Number.isFinite(remaining) && remaining > 0 ? (1 / remaining) - 1 : NaN;

    const equity = Number.isFinite(e0) && Number.isFinite(remaining) ? e0 * remaining : NaN;

    const rows = [];
    for (let i = 1; i <= Math.min(n, 25); i++) {
      const rem = Number.isFinite(r) && r >= 0 && r < 1 ? Math.pow(1 - r, i) : NaN;
      const dd = Number.isFinite(rem) ? 1 - rem : NaN;
      const rec = Number.isFinite(rem) && rem > 0 ? (1 / rem) - 1 : NaN;
      rows.push({ i, rem, dd, rec });
    }

    return { remaining, drawdown, recovery, equity, rows, n };
  }, [riskPct, losses, startingEquity]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Tools</p>
          <h1 className={styles.title}>Drawdown &amp; Risk-of-Ruin (Deterministic)</h1>
          <p className={styles.intro}>
            Illustrate fixed-risk drawdown and recovery math from losing streaks (non-predictive).
            Stateless utility — refresh resets inputs.
          </p>
        </header>

        <section className={styles.panel}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Starting Equity ($)</span>
              <input className={styles.input} inputMode="decimal" value={startingEquity} onChange={(e) => setStartingEquity(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Fixed Risk per Trade (%)</span>
              <input className={styles.input} inputMode="decimal" value={riskPct} onChange={(e) => setRiskPct(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Consecutive Losses</span>
              <input className={styles.input} inputMode="numeric" value={losses} onChange={(e) => setLosses(e.target.value)} />
              <span className={styles.help}>Table shows up to 25 steps.</span>
            </label>
          </div>

          <div className={styles.result}>
            <div className={styles.row}>
              <span className={styles.rLabel}>Remaining Equity Factor</span>
              <span className={styles.rValue}>{Number.isFinite(out.remaining) ? out.remaining.toFixed(4) : "—"}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rLabel}>Drawdown</span>
              <span className={styles.rValueGold}>{fmtPct(out.drawdown)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rLabel}>Recovery Needed to Break Even</span>
              <span className={styles.rValue}>{fmtPct(out.recovery)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rLabel}>Equity After Streak</span>
              <span className={styles.rValue}>
                {Number.isFinite(out.equity) ? "$" + out.equity.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
              </span>
            </div>
          </div>

          {out.n > 0 && (
            <div className={styles.tableWrap} role="region" aria-label="Drawdown table">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Losses</th>
                    <th>Remaining</th>
                    <th>Drawdown</th>
                    <th>Recovery Needed</th>
                  </tr>
                </thead>
                <tbody>
                  {out.rows.map((r) => (
                    <tr key={r.i}>
                      <td>{r.i}</td>
                      <td>{Number.isFinite(r.rem) ? r.rem.toFixed(4) : "—"}</td>
                      <td>{fmtPct(r.dd)}</td>
                      <td>{fmtPct(r.rec)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.actions}>
            <Link className={styles.secondaryBtn} href="/resources/tools">
              ← Back to Tools
            </Link>
          </div>

          <p className={styles.disclaimer}>
            Deterministic math illustration only. It does not predict outcomes or future performance.
          </p>
        </section>
      </div>
    </main>
  );
}