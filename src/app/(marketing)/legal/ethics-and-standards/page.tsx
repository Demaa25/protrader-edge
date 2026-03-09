// src/app/(marketing)/legal/ethics-and-standards/page.tsx
import styles from "./ethics.module.css";

export default function EthicsStandardsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Ethics &amp; Standards</h1>
        </header>

        <section className={styles.card}>
          <p className={styles.lead}>
            ProTrader Edge Limited operates on the principle that long-term success in trading is
            built on discipline, integrity, and professional conduct. This page outlines the
            ethical standards expected of our team, instructors, and students, and defines the
            professional culture we uphold.
          </p>

          <div className={styles.content}>
            <section className={styles.block}>
              <h2 className={styles.h2}>Our Ethical Foundation</h2>
              <p className={styles.p}>
                ProTrader Edge Limited treats trading as a professional discipline, not a
                speculative activity. We reject shortcuts, hype, misrepresentation, and outcome-based
                promises in favor of process, accountability, and risk awareness.
              </p>
              <p className={styles.p}>
                Our standards are designed to protect learners, preserve the integrity of our
                educational environment, and maintain alignment with regulatory expectations.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Education-Only Standard</h2>
              <p className={styles.p}>
                ProTrader Edge Limited provides education and research only. We do not offer
                investment advice, trade signals, account management, or financial recommendations.
              </p>
              <p className={styles.p}>
                Instructors are prohibited from giving personalized trade direction, entry/exit
                instructions, or portfolio advice. All examples are strictly based on educational
                demonstrations only.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Risk Responsibility</h2>
              <p className={styles.p}>
                We believe ethical trading education begins with honest risk disclosure. All students
                are taught that losses are part of trading and that no framework eliminates uncertainty.
              </p>
              <p className={styles.p}>
                We do not promote excessive leverage, reckless behavior, or capital misuse. Students
                are trained to trade only with risk they can afford to lose.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Integrity of Representation</h2>
              <p className={styles.p}>
                ProTrader Edge Limited does not advertise guaranteed results, fixed returns, or
                unrealistic performance claims. Any performance examples used are hypothetical or
                historical and are clearly labeled as such.
              </p>
              <p className={styles.p}>
                Testimonials, where used, reflect individual experiences and are not presented as
                typical outcomes.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Professional Conduct</h2>
              <p className={styles.p}>
                We expect all participants to operate with respect, honesty, and professionalism.
                Harassment, abusive behavior, misinformation, or unethical conduct is not tolerated.
              </p>
              <p className={styles.p}>
                ProTrader Edge Limited reserves the right to remove participants who violate these
                standards without refund after first warning has been given.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Intellectual Property Respect</h2>
              <p className={styles.p}>
                All course materials, methodologies, tools, and frameworks are proprietary to
                ProTrader Edge Limited. Recording, copying, redistributing, or reselling content
                without written consent sought and obtained is strictly prohibited.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Instructor Standards</h2>
              <p className={styles.p}>All instructors operate under strict guidelines:</p>
              <ul className={styles.list}>
                <li>No trade signals or personalized advice</li>
                <li>No outcome guarantees or profit promises</li>
                <li>No conflicts of interest</li>
                <li>Clear separation between education and trading decisions</li>
                <li>Consistent emphasis on risk and process</li>
              </ul>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Conflicts of Interest</h2>
              <p className={styles.p}>
                ProTrader Edge Limited avoids conflicts of interest that may compromise educational
                integrity. We do not accept compensation for promoting specific brokers, platforms,
                or financial products without clear disclosure, otherwise no advert of any sought.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Enforcement &amp; Accountability</h2>
              <p className={styles.p}>
                Violations of these Ethics &amp; Standards may result in suspension or termination of
                access to ProTrader Edge services without refund. Serious breaches may be reported
                where required by law.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Continuous Improvement</h2>
              <p className={styles.p}>
                These standards are reviewed periodically to ensure alignment with evolving regulatory
                expectations, best practices, and the professional goals of our community.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>Contact</h2>
              <p className={styles.p}>
                Questions regarding ethics or professional standards may be directed to:
              </p>
              <p className={styles.p}>Email:&nbsp;support@protraderdge.com</p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
