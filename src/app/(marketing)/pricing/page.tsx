// src/app/(marketing)/pricing/page.tsx
import styles from "./pricing.module.css";
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="marketing-page">
      <div className={`container-marketing ${styles.page}`}>
        
        {/* ================= HERO ================= */}
        <section className={styles.hero}>
          <h1>Professional Trading Is Built on Structure, Not Guesswork</h1>

          <p className={styles.heroLead}>
            Train using institutional principles: structured decision-making,
            risk control, and disciplined execution.
          </p>

          <p className={styles.heroSub}>
            No signals. No shortcuts. No hype.
          </p>

          <div className={styles.heroActions}>
            <a
              href="#programs"
              className="btn-primary"
            >
              Start With Foundation
            </a>

            <Link href="#programs" className="btn-secondary">
              View Programs
            </Link>
          </div>
        </section>

        {/* ================= PROGRAM STRUCTURE ================= */}
        <section className={styles.structure}>
          <h2>A Structured 3-Level Development Path</h2>

          <div className={styles.structureRow}>
            <span>Foundation</span>
            <span className={styles.arrow}>→</span>
            <span>Intermediate</span>
            <span className={styles.arrow}>→</span>
            <span>Professional</span>
          </div>

          <p className={styles.structureText}>
            Progression is sequential. Capability is developed, not assumed.
          </p>
        </section>

        {/* ================= PRICING ================= */}
        <section id="programs" className={styles.pricing}>
          
          {/* LEVEL 1 */}
          <div className={`${styles.card} ${styles.highlight}`}>
            <div className={styles.badge}>Start Here</div>

            <h3>Level 1 — Foundation Program</h3>

            <div className={styles.priceRow}>
              <span className={styles.oldPrice}>N350,000</span>
              <span className={styles.newPrice}>N250,000</span>
            </div>

            <div className={styles.discountNote}>
              Introductory Offer — Valid until June 30, 2026
            </div>

            <p className={styles.cardLead}>
              For beginners and traders transitioning from retail methods
            </p>

            <div className={styles.block}>
              <h4>What You Learn</h4>
              <ul>
                <li>Market structure & liquidity foundations</li>
                <li>Why price moves (not indicators)</li>
                <li>Execution discipline & invalidation logic</li>
                <li>Risk awareness from day one</li>
              </ul>
            </div>

            <div className={styles.block}>
              <h4>Includes</h4>
              <ul>
                <li>Full Level 1 training modules</li>
                <li>Institutional tools & templates</li>
                <li>LMS access</li>
                <li>6 months Institutional Lab access</li>
              </ul>
            </div>

            <p className={styles.outcome}>
              Read price structurally and avoid retail trading traps
            </p>

            <a
              href={`/api/paystack/initialize?course=foundation`}
              className="btn-primary" style={{ textAlign: "center" }}
            >
              Purchase Program
            </a>
          </div>

          {/* LEVEL 2 */}
          <div className={styles.card}>
            <h3>Level 2 — Intermediate Program</h3>

            <div className={styles.price}>N550,000</div>

            <p className={styles.cardLead}>
              For traders developing execution consistency
            </p>

            <div className={styles.block}>
              <h4>What You Learn</h4>
              <ul>
                <li>Execution models & trade validation</li>
                <li>Multi-timeframe alignment</li>
                <li>Liquidity-based entries</li>
                <li>Structured trade management</li>
              </ul>
            </div>

            <div className={styles.block}>
              <h4>Includes</h4>
              <ul>
                <li>Full Level 2 training modules</li>
                <li>Execution frameworks and tools</li>
                <li>Advanced structured models</li>
                <li>6 months Institutional Lab access</li>
              </ul>
            </div>

            <p className={styles.outcome}>
              Develop repeatable execution and reduce emotional decisions
            </p>

            <button className={styles.disabledBtn}>
              Purchase Program
            </button>
          </div>

          {/* LEVEL 3 */}
          <div className={styles.card}>
            <h3>Level 3 — Professional Program</h3>

            <div className={styles.price}>N900,000</div>

            <p className={styles.cardLead}>
              For traders operating toward professional standards
            </p>

            <div className={styles.block}>
              <h4>What You Learn</h4>
              <ul>
                <li>Risk governance & drawdown control</li>
                <li>Professional execution rules</li>
                <li>Performance review systems</li>
                <li>Decision journaling & audit processes</li>
              </ul>
            </div>

            <div className={styles.block}>
              <h4>Includes</h4>
              <ul>
                <li>Full Level 3 training modules</li>
                <li>Professional-grade frameworks</li>
                <li>Performance tracking systems</li>
                <li>6 months Institutional Lab access</li>
              </ul>
            </div>

            <p className={styles.outcome}>
              Operate with institutional discipline and capital preservation focus
            </p>

            <button className={styles.disabledBtn}>
              Purchase Program
            </button>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className={styles.final}>
          <h2>Serious About Trading? Start With Structure.</h2>

          <p>
            Begin with the Foundation Program and build real trading competence.
          </p>

          <a
            href="#programs"
            className="btn-primary"
          >
            Start Foundation Program
          </a>
        </section>

      </div>
    </main>
  );
}