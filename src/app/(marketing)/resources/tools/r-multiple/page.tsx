// src/app/(marketing)/resources/tools/r-multiple/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./r-multiple.module.css";

function num(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

export default function RMultiplePage() {
  const [entry, setEntry] = useState("1.2500");
  const [stop, setStop] = useState("1.2480");
  const [target, setTarget] = useState("1.2560");

  const out = useMemo(() => {
    const e = num(entry);
    const s = num(stop);
    const t = num(target);

    const risk = Number.isFinite(e) && Number.isFinite(s) ? Math.abs(e - s) : NaN;
    const reward = Number.isFinite(e) && Number.isFinite(t) ? Math.abs(t - e) : NaN;
    const r = risk > 0 && reward >= 0 ? reward / risk : NaN;

    return { risk, reward, r };
  }, [entry, stop, target]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Tools</p>
          <h1 className={styles.title}>R-Multiple (R:R) Evaluator</h1>
          <p className={styles.intro}>
            Evaluate reward relative to defined risk, expressed strictly in R-multiples (structure only).
            Stateless utility — refresh resets inputs.
          </p>
        </header>

        <section className={styles.panel}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Entry</span>
              <input className={styles.input} inputMode="decimal" value={entry} onChange={(e) => setEntry(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Stop</span>
              <input className={styles.input} inputMode="decimal" value={stop} onChange={(e) => setStop(e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Target</span>
              <input className={styles.input} inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
            </label>
          </div>

          <div className={styles.result}>
            <div className={styles.row}>
              <span className={styles.rLabel}>Risk (|Entry − Stop|)</span>
              <span className={styles.rValue}>{fmt(out.risk, 5)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rLabel}>Reward (|Target − Entry|)</span>
              <span className={styles.rValue}>{fmt(out.reward, 5)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rLabel}>R Multiple</span>
              <span className={styles.rValueGold}>{fmt(out.r, 2)}R</span>
            </div>

            <p className={styles.note}>
              R is a ratio metric. It does not validate setup quality — it quantifies reward relative to defined risk.
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