// src/app/(lms)/welcome/page.tsx
import styles from "./welcome.module.css";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LandingHeader from "./LandingHeader";

const ENROLL_PATH = "/enroll"; // TODO: change to your real enrollment route
const DASHBOARD_PATH = "/dashboard";

export default async function WelcomePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // @ts-expect-error id exists on session.user via your next-auth callback
  const userId = (session.user as any).id as string | undefined;
  const name = session.user.name ?? "Trader";

  if (!userId) redirect("/login");

  // New vs Returning logic:
  // - New user: no purchases + no enrollments
  // - Returning: has at least one purchase OR enrollment
  const [purchaseCount, enrollmentCount] = await Promise.all([
    prisma.purchase.count({ where: { userId, status: "PAID" } }),
    prisma.enrollment.count({ where: { userId } }),
  ]);

  const isReturning = purchaseCount > 0 || enrollmentCount > 0;

  const ctaHref = isReturning ? DASHBOARD_PATH : ENROLL_PATH;
  const ctaText = isReturning ? "Go to Dashboard" : "Enroll";

  return (
    <div className={styles.page}>
      <LandingHeader />

      <main className={styles.main}>
        {!isReturning ? (
          <>
            <header className={styles.hero}>
              <h1 className={styles.h1}>Welcome to ProTrader Edge</h1>
              <p className={styles.sub}>
                Structured Trading Education for Professional Market Operators
              </p>
            </header>

            <section className={styles.section}>
              <h2 className={styles.h2}>Structured Trading Education for Professional Market Operators</h2>
              <p className={styles.p}>
                ProTrader Edge is an institutional-grade trading education and decision-system development platform.
                This is not a signal service, and it is not a shortcut to profits.
              </p>
              <p className={styles.p}>
                Here, trading skill is treated as a professional discipline, developed through structure, governance,
                and progressive mastery.
              </p>
            </section>

            <section className={styles.grid2}>
              <div className={styles.card}>
                <h3 className={styles.h3}>What This Platform Is</h3>
                <ul className={styles.list}>
                  <li>A structured professional trading education system</li>
                  <li>A framework-driven approach to market decision-making</li>
                  <li>A progression-based curriculum (Foundation → Intermediate → Professional)</li>
                  <li>Risk-first, governance-driven, and execution-disciplined</li>
                </ul>
              </div>

              <div className={styles.card}>
                <h3 className={styles.h3}>What This Platform Is Not</h3>
                <ul className={styles.list}>
                  <li>Not a signal service</li>
                  <li>Not a prediction engine</li>
                  <li>Not a get-rich-quick program</li>
                  <li>Not retail indicator-based trading</li>
                </ul>
                <p className={styles.note}>
                  ProTrader Edge teaches how professionals think, not what buttons to click.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>How the Program Is Structured</h2>

              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepTitle}>Level 1 — Foundation</div>
                  <div className={styles.stepBody}>
                    Market structure, liquidity logic, execution context, and risk governance fundamentals.
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.stepTitle}>Level 2 — Intermediate</div>
                  <div className={styles.stepBody}>
                    Multi-timeframe alignment, institutional execution models, and structured decision frameworks.
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.stepTitle}>Level 3 — Professional</div>
                  <div className={styles.stepBody}>
                    Advanced execution logic, validation systems, risk engines, and professional operating discipline.
                  </div>
                </div>
              </div>

              <p className={styles.p}>
                Progression is earned, not rushed. Each level builds on the one before it.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>Your Starting Point</h2>
              <p className={styles.p}>
                All participants begin with Level 1 — Foundation, unless formally qualified for advanced entry.
              </p>

              <div className={styles.card}>
                <div className={styles.h3}>Level 1 is designed to:</div>
                <ul className={styles.list}>
                  <li>Reset retail trading habits</li>
                  <li>Build structured market understanding</li>
                  <li>Establish disciplined risk governance</li>
                </ul>
                <p className={styles.note}>
                  This ensures every participant operates from a common professional baseline.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.h2}>What Happens Next</h2>
              <p className={styles.p}>
                To begin your journey inside ProTrader Edge, you will proceed to program enrollment.
              </p>

              <div className={styles.card}>
                <div className={styles.h3}>Enrollment grants:</div>
                <ul className={styles.list}>
                  <li>Full access to Level 1 curriculum</li>
                  <li>Structured module progression</li>
                  <li>Assessments and competency validation</li>
                  <li>Access to institutional tools and resources</li>
                </ul>
              </div>
            </section>
          </>
        ) : (
          <>
            <header className={styles.hero}>
              <h1 className={styles.h1}>Welcome back, {name}</h1>
              <p className={styles.sub}>
                Continue your training from where you stopped — structured, disciplined, and progress-based.
              </p>
            </header>

            <section className={styles.section}>
              <h2 className={styles.h2}>Your workspace is ready</h2>
              <p className={styles.p}>
                Your enrolled programs, progress tracking, quizzes, and assessments are available in your dashboard.
              </p>
              <p className={styles.p}>
                Keep progression clean: follow the module order, complete checkpoints, and treat every lesson as part
                of an operating system — not random content.
              </p>
            </section>

            <section className={styles.grid2}>
              <div className={styles.card}>
                <h3 className={styles.h3}>Suggested next actions</h3>
                <ul className={styles.list}>
                  <li>Resume your latest course session</li>
                  <li>Complete any pending module quizzes</li>
                  <li>Review notes before the next checkpoint</li>
                </ul>
              </div>

              <div className={styles.card}>
                <h3 className={styles.h3}>Operating rules</h3>
                <ul className={styles.list}>
                  <li>Focus on process before performance</li>
                  <li>Risk governance first</li>
                  <li>Progression is earned, not rushed</li>
                </ul>
              </div>
            </section>
          </>
        )}

        <footer className={styles.footer}>
          <a className={styles.cta} href={ctaHref}>
            {ctaText}
          </a>

          <div className={styles.footerNote}>
            ProTrader Edge is designed for individuals committed to professional development, discipline, and structured
            decision-making in financial markets.
          </div>
        </footer>
      </main>
    </div>
  );
}