// src/app/(marketing)/legal/terms-of-use/page.tsx
import styles from "./terms.module.css";

export default function TermsOfUsePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Terms of Use</h1>
        </header>

        <section className={styles.card}>
          <p className={styles.lead}>
            These Terms of Use ("Terms") govern your access to and use of the ProTrader Edge website,
            programs, services, tools, and content (collectively, the "Platform"). By accessing or
            using the Platform, you agree to be bound by these Terms. If you do not agree, you must
            discontinue use immediately.
          </p>

          <div className={styles.content}>

            <section className={styles.block}>
              <h2 className={styles.h2}>1. Eligibility</h2>
              <p className={styles.p}>
                By using the Platform, you confirm that you are at least 18 years old and of sound
                mind, have the legal capacity to enter into this agreement, and are accessing the
                content for educational purposes only.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>2. Educational Use Only</h2>
              <p className={styles.p}>
                All content provided by ProTrader Edge is strictly for educational and informational
                purposes. We do not provide investment advice, trading advice, brokerage services,
                portfolio management, or asset management services.
              </p>
              <p className={styles.p}>
                You acknowledge that any trading decisions you make are made independently and at
                your own risk.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>3. Account Registration</h2>
              <p className={styles.p}>
                To access certain services, you may be required to create an account. You agree to
                provide accurate, complete, and current information and to maintain the security of
                your login credentials.
              </p>
              <p className={styles.p}>
                You are solely responsible for all activities that occur under your account.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>4. Payments, Pricing, and Refunds</h2>
              <p className={styles.p}>
                Prices for programs and services are displayed on the Platform and are subject to
                change at any time. Payments must be made in full before access is granted.
              </p>
              <p className={styles.p}>
                All purchases are governed by our Refund Policy, which forms an integral part
                of these Terms.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>5. Intellectual Property</h2>
              <p className={styles.p}>
                All content, including course materials, methodologies, frameworks, videos, charts,
                indicators, written content, branding, logos, and trademarks, are the exclusive
                intellectual property of ProTrader Edge Limited.
              </p>
              <p className={styles.p}>
                Unauthorized copying, recording, distribution, resale, modification, or commercial
                use is strictly prohibited.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>6. User Conduct</h2>
              <p className={styles.p}>User must not:</p>
              <ul className={styles.list}>
                <li>Share login credentials or paid content</li>
                <li>Record or redistribute proprietary materials</li>
                <li>Misrepresent your identity</li>
                <li>Engage in abusive, unlawful, or disruptive behavior</li>
                <li>Attempt to reverse engineer or bypass platform security</li>
              </ul>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>7. Suspension and Termination</h2>
              <p className={styles.p}>
                ProTrader Edge reserves the right to suspend or terminate your account, without
                notice, if you violate these Terms or misuse the Platform. Termination does not
                entitle you to a refund.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>8. Third-Party Services</h2>
              <p className={styles.p}>
                The Platform may reference or link to third-party platforms, brokers, prop firms,
                exchanges, or software for educational purposes. ProTrader Edge does not control or
                endorse these services and is not responsible for their availability, accuracy, or
                performance.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>9. Disclaimer of Warranties</h2>
              <p className={styles.p}>
                The Platform is provided "as is" and "as available" without warranties of any kind,
                express or implied.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>10. Limitation of Liability</h2>
              <p className={styles.p}>
                To the fullest extent permitted by law, ProTrader Edge Limited shall not be liable
                for any direct, indirect, incidental, consequential, or special damages.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>11. Indemnification</h2>
              <p className={styles.p}>
                You agree to indemnify and hold harmless ProTrader Edge Limited from any claims,
                losses, damages, liabilities, or expenses arising from your use of the Platform.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>12. Force Majeure</h2>
              <p className={styles.p}>
                ProTrader Edge shall not be liable for delays or failures caused by events beyond
                reasonable control.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>13. Modifications to Terms</h2>
              <p className={styles.p}>
                We reserve the right to update these Terms at any time without express notice.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>14. Dispute Resolution</h2>
              <p className={styles.p}>
                Disputes shall first be resolved through good-faith negotiation, then Arbitration,
                and finally the courts of competent jurisdiction in Nigeria.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>15. Severability</h2>
              <p className={styles.p}>
                If any provision is held invalid, remaining provisions remain in full force.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>16. Entire Agreement</h2>
              <p className={styles.p}>
                These Terms together with the Privacy Policy and Refund Policy constitute the entire agreement.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>17. Governing Law</h2>
              <p className={styles.p}>
                These Terms shall be governed by the laws of the Federal Republic of Nigeria.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>18. Contact Information</h2>
              <p className={styles.p}>Email: support@protraderdge.com</p>
              <p className={styles.p}>
                Business Address: Umuekeugo-Ogbor Uvuru, Aboh-Mbaise, Imo State, Nigeria.
              </p>
            </section>

          </div>
        </section>
      </div>
    </main>
  );
}
