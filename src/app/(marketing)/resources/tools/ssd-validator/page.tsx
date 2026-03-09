// src/app/(marketing)/resources/tools/ssd-validator/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./ssd-validator.module.css";

type Check = {
  key: string;
  label: string;
  desc: string;
};

const checks: Check[] = [
  {
    key: "inputs",
    label: "Defined Inputs",
    desc: "The concept specifies required inputs (data, timeframe, session rules) unambiguously.",
  },
  {
    key: "state",
    label: "State Logic",
    desc: "The concept defines states (e.g., valid/invalid, trend/range/transition) and transitions.",
  },
  {
    key: "invalidation",
    label: "Explicit Invalidation",
    desc: "There is a non-negotiable invalidation rule (when participation is prohibited).",
  },
  {
    key: "risk",
    label: "Risk Constraints",
    desc: "Risk limits are defined before execution (caps, exposure rules, stop logic).",
  },
  {
    key: "permission",
    label: "Trade Permission Gate",
    desc: "The concept separates opportunity from permission (context overrides setup).",
  },
  {
    key: "audit",
    label: "Auditability",
    desc: "Decisions can be explained and reviewed (what/why/where invalidated).",
  },
];

export default function SSDValidatorPage() {
  const [state, setState] = useState<Record<string, boolean>>({});

  const score = useMemo(() => {
    const total = checks.length;
    const passed = checks.reduce((acc, c) => acc + (state[c.key] ? 1 : 0), 0);
    return { total, passed };
  }, [state]);

  const verdict = useMemo(() => {
    if (score.passed === score.total) return "Meets minimum structural requirements";
    if (score.passed >= Math.ceil(score.total * 0.7)) return "Partially meets requirements (review gaps)";
    return "Does not meet minimum requirements";
  }, [score]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Tools</p>
          <h1 className={styles.title}>SSD Logic Validator</h1>
          <p className={styles.intro}>
            Validate whether a trading concept meets minimum structural requirements of a rule-based system.
            Stateless utility — refresh resets inputs.
          </p>
        </header>

        <section className={styles.panel}>
          <div className={styles.scoreRow}>
            <div>
              <div className={styles.scoreLabel}>Score</div>
              <div className={styles.scoreValue}>
                {score.passed} / {score.total}
              </div>
            </div>
            <div className={styles.verdict}>
              <div className={styles.scoreLabel}>Result</div>
              <div className={styles.verdictValue}>{verdict}</div>
            </div>
          </div>

          <div className={styles.checkList}>
            {checks.map((c) => (
              <label key={c.key} className={styles.checkItem}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={!!state[c.key]}
                  onChange={(e) => setState((s) => ({ ...s, [c.key]: e.target.checked }))}
                />
                <div className={styles.checkText}>
                  <div className={styles.checkTitle}>{c.label}</div>
                  <div className={styles.checkDesc}>{c.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <p className={styles.note}>
            This tool does not evaluate profitability. It verifies minimum structure: defined inputs, states,
            invalidations, governance, and auditability.
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