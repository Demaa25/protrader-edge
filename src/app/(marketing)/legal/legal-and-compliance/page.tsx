// src/app/(marketing)/legal/legal-and-compliance/page.tsx
import styles from "./compliance.module.css";

export default function LegalCompliancePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Legal &amp; Compliance</h1>
        </header>

        <section className={styles.card}>
          <p className={styles.lead}>
            This page outlines the legal disclosures, risk statements, and compliance policies
            governing the use of the ProTrader Edge platform. By accessing this website or enrolling
            in any program, you agree to the terms set out below.
          </p>

          <div className={styles.stack}>
            <section className={styles.block}>
              <h2 className={styles.h2}>1. Educational Disclaimer</h2>
              <p className={styles.p}>
                ProTrader Edge Limited is a financial markets education and research platform. All
                content provided on this website, including courses, videos, webinars, tools,
                indicators, market commentary, and written materials, is strictly for educational
                and informational purposes only.
              </p>
              <p className={styles.p}>
                Nothing on this website constitutes investment advice, financial advice, trading
                advice, or a recommendation to buy, sell, or hold any financial instrument.
              </p>
              <p className={styles.p}>
                All examples are hypothetical or historical and are presented solely for
                educational illustration. They do not represent actual trading results or guarantee
                future performance.
              </p>
              <p className={styles.p}>
                It is worthy to note that users remain solely responsible for their own trading
                decisions.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>2. No Advisory Relationship</h2>
              <p className={styles.p}>
                ProTrader Edge Limited is not a registered investment adviser, broker-dealer,
                portfolio manager, or fund manager. Accessing this website, enrolling in programs,
                or interacting with instructors does not create an advisory, fiduciary, or client
                relationship.
              </p>

              <p className={styles.p}>Note properly that we do not:</p>
              <ul className={styles.list}>
                <li>Manage or hold client funds</li>
                <li>Execute trades on behalf of users</li>
                <li>Provide personalized investment advice</li>
                <li>Provide portfolio management services</li>
                <li>Accept discretionary trading authority</li>
              </ul>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>3. Risk Disclosure</h2>
              <p className={styles.p}>
                Trading foreign exchange, CFDs, metals, indices, and other leveraged instruments
                involves a high level of risk and may not be suitable for all individuals.
              </p>
              <p className={styles.p}>
                You may lose some or all of your invested capital. Leverage can amplify both gains
                and losses. Past performance is not indicative of future results.
              </p>
              <p className={styles.p}>
                Only trade with capital you can afford to lose. This advice is very necessary
                because of the swing associated with performance / results.
              </p>
              <p className={styles.p}>
                ProTrader Edge Limited assumes no liability for losses incurred as a result of
                using information provided on this platform.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>4. Market Commentary Disclaimer</h2>
              <p className={styles.p}>
                Any market analysis, charts, commentary, or trade scenarios shared on ProTrader Edge
                are provided solely for educational demonstration.
              </p>
              <p className={styles.p}>
                These are not trade instructions, recommendations, or signals. They are non-binding,
                non-personalized, and must be independently evaluated by the user.
              </p>
              <p className={styles.p}>
                ProTrader Edge Limited does not provide real-time execution alerts or personalized
                signals.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>5. Performance Disclaimer</h2>
              <p className={styles.p}>
                There is no guarantee of profit in trading. Any performance examples, results, or
                testimonials shown are not typical and do not represent expected outcomes.
              </p>
              <p className={styles.p}>
                Individual results vary based on market conditions, discipline, capital, psychology,
                and risk management.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>6. Terms of Use</h2>
              <p className={styles.p}>By using this website, you agree that:</p>
              <ul className={styles.list}>
                <li>You are responsible for your own trading decisions</li>
                <li>You understand the risks associated with trading</li>
                <li>You will not hold ProTrader Edge liable for any losses</li>
                <li>You will not redistribute paid or proprietary content</li>
                <li>You will use this website for lawful purposes only</li>
              </ul>
              <p className={styles.p}>
                ProTrader Edge Limited reserves the right to update content, policies, or access
                permissions at any time without prior notice.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>7. Privacy Policy</h2>
              <p className={styles.p}>
                ProTrader Edge Limited collects only the personal data necessary to provide its
                services and operates in compliance with the Nigeria Data Protection Regulation
                (NDPR).
              </p>
              <p className={styles.p}>
                We do not sell or share personal data with third parties except where required by
                law or with your explicit written consent.
              </p>
              <p className={styles.p}>
                Users may request access, correction, or deletion of their personal data by
                contacting our support team.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>8. Regulatory Status</h2>
              <p className={styles.p}>
                ProTrader Edge Limited is an educational and research platform. We are not licensed
                by the Securities and Exchange Commission (SEC) of Nigeria because we do not provide
                investment advisory, brokerage, or asset management services.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>9. Governing Law &amp; Jurisdiction</h2>
              <p className={styles.p}>
                These terms and all interactions with ProTrader Edge are governed by the laws of
                the Federal Republic of Nigeria. Any disputes shall be resolved first through
                arbitration before courts of competent jurisdiction in Nigeria where applicable.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>10. Contact Information</h2>
              <p className={styles.p}>For questions, support, or complaints, contact:</p>
              <p className={styles.p}>Email: info@protrader-edge.com</p>
              <p className={styles.p}>
                Business Address: Umuekeugo Ogbor, Uvuru Aboh-Mbaise, Imo State, Nigeria
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
