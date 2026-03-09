//src/app/(marketing)/legal/refund-policy/page.tsx
import styles from "./refund.module.css";

export default function RefundPolicyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Refund Policy</h1>
        </header>

        <section className={styles.card}>
          <p className={styles.lead}>
            This Refund Policy outlines the conditions under which ProTrader Edge Limited may issue
            refunds for digital products and educational programs. Please read this policy carefully
            before making a purchase.
          </p>

          <div className={styles.content}>
            <section className={styles.block}>
              <h2 className={styles.h2}>1. Digital Products &amp; Online Courses</h2>
              <p className={styles.p}>
                Due to the digital nature of our products, all sales are generally final once access
                has been granted. This includes online courses, recorded programs, downloadable
                materials, indicators, templates, and research content.
              </p>

              <p className={styles.p}>Refunds will not be issued for:</p>
              <ul className={styles.list}>
                <li>Change of mind after access is granted</li>
                <li>Lack of trading success or profitability</li>
                <li>Inability to apply strategies taught</li>
                <li>Market losses incurred while trading</li>
                <li>Failure to complete the course</li>
              </ul>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>2. Live Programs, Mentorships &amp; Workshops</h2>
              <p className={styles.p}>
                Payments for live programs, mentorships, or workshops are non-refundable once the
                program has commenced due to capacity limits and scheduling commitments.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>3. Exceptional Circumstances</h2>
              <p className={styles.p}>
                Refunds may be issued in rare cases such as duplicate charges, billing errors, or
                system malfunctions. Requests must be submitted within 7 days of the transaction
                date.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>4. Refund Request Process</h2>
              <p className={styles.p}>To request a refund (where applicable), contact:</p>
              <p className={styles.p}>Email:&nbsp;support@protraderdge.com</p>
              <p className={styles.p}>
                Include your name, email used for purchase, product name, and reason for the
                request. Requests are reviewed within 5–10 business days.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>5. Policy Updates</h2>
              <p className={styles.p}>
                ProTrader Edge Limited reserves the right to modify this Refund Policy at any time.
                The version in effect at the time of purchase shall apply.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
