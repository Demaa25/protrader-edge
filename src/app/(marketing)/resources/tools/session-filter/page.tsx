// src/app/(marketing)/resources/tools/session-filter/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./session-filter.module.css";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function getSessionLabel(utcHour: number) {
  // simple UTC mapping (institutional-friendly, not broker-specific)
  if (utcHour >= 0 && utcHour < 7) return { session: "Asia", liquidity: "Low to Medium" };
  if (utcHour >= 7 && utcHour < 13) return { session: "London", liquidity: "Medium to High" };
  if (utcHour >= 13 && utcHour < 21) return { session: "New York", liquidity: "High" };
  return { session: "Off-Hours", liquidity: "Low" };
}

export default function SessionFilterPage() {
  const now = new Date();
  const [manualUtcHour, setManualUtcHour] = useState<string>(""); // optional override

  const utcHour = useMemo(() => {
    if (manualUtcHour.trim() === "") return now.getUTCHours();
    const h = Number(manualUtcHour);
    if (!Number.isFinite(h)) return now.getUTCHours();
    return Math.min(23, Math.max(0, Math.floor(h)));
  }, [manualUtcHour, now]);

  const ctx = useMemo(() => getSessionLabel(utcHour), [utcHour]);

  const utcStamp = `${pad2(now.getUTCHours())}:${pad2(now.getUTCMinutes())} UTC`;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Tools</p>
          <h1 className={styles.title}>Session &amp; Market State Filter</h1>
          <p className={styles.intro}>
            Display session context and general liquidity labeling from time + instrument category only.
            Stateless utility — refresh resets inputs.
          </p>
        </header>

        <section className={styles.panel}>
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Current Time</div>
              <div className={styles.infoValue}>{utcStamp}</div>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Manual UTC Hour Override (0–23, optional)</span>
              <input
                className={styles.input}
                inputMode="numeric"
                value={manualUtcHour}
                onChange={(e) => setManualUtcHour(e.target.value)}
                placeholder="leave empty to use current time"
              />
            </label>
          </div>

          <div className={styles.result}>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Session</div>
              <div className={styles.cardValueGold}>{ctx.session}</div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardLabel}>Liquidity Label</div>
              <div className={styles.cardValue}>{ctx.liquidity}</div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardLabel}>Rule</div>
              <div className={styles.cardValue}>
                Context is a gate. Setup quality does not override unfavorable conditions.
              </div>
            </div>
          </div>

          <p className={styles.note}>
            This is a general session label for context. It does not account for news, spreads, holidays,
            instrument-specific microstructure, or broker conditions.
          </p>

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