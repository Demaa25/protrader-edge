//src/app/(marketing)/legal/risk-disclosures/page.tsx
import Link from "next/link";
import styles from "./risk.module.css";

export default function RiskDisclosurePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Risk Disclosures</h1>
        </header>

        <section className={styles.card}>
          <b className={styles.lead}>VERY IMPORTANT INFORMATION</b>

          <p className={styles.lead}>
            This Risk Disclosures page provides important legal, regulatory, and risk-related information regarding the use of the ProTrader Edge platform. Users are encouraged to read this page carefully before accessing any content or enrolling in any program.
          </p>

          <div className={styles.content}>
            <section className={styles.block}>
              <h2 className={styles.h2}>1. Educational Disclosure</h2>
              <p className={styles.p}>
                ProTrader Edge Limited is an education and research platform. All content, programs, tools, indicators, webinars, and materials are provided for educational and informational purposes only.
              </p>
              <p className={styles.p}>
                Nothing on this platform constitutes investment advice, trading advice, financial advice, or a recommendation to buy, sell, or hold any financial instrument.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>2. No Advisory Relationship Disclosure</h2>
              <p className={styles.p}>
                ProTrader Edge Limited is not a registered investment adviser, broker-dealer, portfolio manager, or fund manager. Accessing the platform does not create an advisory, fiduciary, or client relationship.
              </p>
              <p className={styles.p}>
                We do not manage funds, execute trades, or provide personalized investment advice.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>3. Risk Disclosure</h2>
              <p className={styles.p}>
                Trading financial markets involves substantial risk and may not be suitable for all individuals. You may lose some or all of your invested capital. Leverage magnifies both gains and losses.
              </p>
              <p className={styles.p}>
                Past performance is not indicative of future results. You should trade only with capital you can afford to lose, knowing the swing nature of financial markets.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>4. Performance Disclaimer</h2>
              <p className={styles.p}>
                There is no guarantee of profit in trading. Any performance examples, results, or testimonials shown are not typical and do not represent expected outcomes.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>5. Regulatory Status</h2>
              <p className={styles.p}>
                ProTrader Edge Limited is an educational platform and is not licensed by the Securities and Exchange Commission (SEC) of Nigeria, for it is not meant to do so outside its scope.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>6. Jurisdiction &amp; Governing Law</h2>
              <p className={styles.p}>
                All use of the ProTrader Edge Limited platform is governed by the laws of the Federal Republic of Nigeria. Users are responsible for ensuring compliance with local laws in their jurisdiction.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>7. Third-Party Services Disclaimer</h2>
              <p className={styles.p}>
                ProTrader Edge Limited may reference third-party brokers, exchanges, prop firms, or software providers for educational purposes. We do not control or endorse these services and are not responsible for their actions, availability, or performance.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>8. Related Policies</h2>
              <ul className={styles.list}>
                <li><Link className={styles.link} href="/legal/legal-and-compliance">Legal Compliance</Link></li>
                <li><Link className={styles.link} href="/legal/terms-of-use">Terms of Use</Link></li>
                <li><Link className={styles.link} href="/legal/privacy-policy">Privacy Policy</Link></li>
                <li><Link className={styles.link} href="/legal/refund-policy">Refund Policy</Link></li>
              </ul>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>9. Contact Information</h2>
              <p className={styles.p}>For questions regarding these disclosures, contact:</p>
              <p className={styles.p}>Email:&nbsp;support@protraderdge.com</p>
              <p className={styles.p}>
                Business Address:&nbsp;Umuekeugo-Ogbor Uvuru, Aboh-Mbaise, Imo State, Nigeria
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
