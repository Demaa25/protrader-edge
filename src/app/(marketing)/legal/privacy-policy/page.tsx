// src/app/(marketing)/legal/privacy-policy/page.tsx
import styles from "./privacy.module.css";

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Privacy Policy</h1>
        </header>

        <section className={styles.card}>
          <p className={styles.lead}>
            ProTrader Edge Limited ("we", "our", "us") is committed to protecting your personal data and privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website,
            enroll in our programs, or interact with our services.
          </p>

          <p className={styles.lead}>
            This policy is issued in accordance with the Nigeria Data Protection Regulation (NDPR) and aligns with
            internationally recognized data protection principles.
          </p>

          <div className={styles.content}>
            <section className={styles.block}>
              <h2 className={styles.h2}>1. Information We Collect</h2>
              <p className={styles.p}>We may collect the following categories of personal data:</p>
              <ul className={styles.list}>
                <li>Identity information (name, username)</li>
                <li>Contact details (email address, and phone number)</li>
                <li>Billing and payment information (processed securely via third-party providers)</li>
                <li>Account login credentials</li>
                <li>Course progress and engagement data</li>
                <li>Device and usage data (IP address, browser type, pages visited)</li>
                <li>Communications and support inquiries</li>
              </ul>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>2. How We Collect Information</h2>
              <p className={styles.p}>We collect data when you:</p>
              <ul className={styles.list}>
                <li>Create an account or enroll in a program</li>
                <li>Make a payment or request a refund</li>
                <li>Subscribe to emails or newsletters</li>
                <li>Contact support</li>
                <li>Use our website or learning platform</li>
              </ul>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>3. Purpose and Legal Basis for Processing</h2>
              <p className={styles.p}>We process personal data for the following purposes:</p>
              <ul className={styles.list}>
                <li>Providing access to educational services</li>
                <li>Processing payments and issuing receipts</li>
                <li>Account management and authentication</li>
                <li>Customer support and communications</li>
                <li>Improving platform functionality and content</li>
                <li>Legal and regulatory compliance</li>
                <li>Marketing communications (with consent)</li>
              </ul>
              <p className={styles.p}>
                Our legal bases include contractual necessity, user consent, legitimate business interest,
                and compliance with legal obligations.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>4. Cookies and Tracking Technologies</h2>
              <p className={styles.p}>
                We use cookies and similar technologies to enhance user experience, analyze site performance,
                and improve our services.
              </p>
              <p className={styles.p}>
                You may control cookies through your browser settings. Disabling cookies may limit site functionality.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>5. Data Sharing and Third Parties</h2>
              <p className={styles.p}>
                We do not sell your personal data. We may share data with trusted third-party service providers, including:
              </p>
              <ul className={styles.list}>
                <li>Payment processors (e.g., Paystack, Flutterwave, Stripe, PayPal)</li>
                <li>Email and communication providers</li>
                <li>Hosting and cloud service providers</li>
                <li>Analytics and security providers</li>
                <li>Regulatory or legal authorities where required</li>
              </ul>
              <p className={styles.p}>
                All third parties are required to maintain appropriate data protection safeguards.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>6. Data Retention</h2>
              <p className={styles.p}>
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected,
                including legal, accounting, and regulatory requirements.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>7. Data Security</h2>
              <p className={styles.p}>
                We implement appropriate technical and organizational measures to protect personal data against unauthorized access,
                loss, misuse, or disclosure.
              </p>
              <p className={styles.p}>
                However, no system is 100% secure, and users share information at their own risk.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>8. Your Rights</h2>
              <p className={styles.p}>
                Under NDPR and applicable international standards, you have the right to:
              </p>
              <ul className={styles.list}>
                <li>Request access to your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (where applicable)</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Object to certain processing activities</li>
                <li>Request data portability</li>
              </ul>
              <p className={styles.p}>Requests may be submitted to: support@protrader-edge.com</p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>9. International Data Transfers</h2>
              <p className={styles.p}>
                Where data is transferred outside Nigeria, we ensure appropriate safeguards are in place,
                including contractual protections with service providers.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>10. Children’s Privacy</h2>
              <p className={styles.p}>
                ProTrader Edge Limited does not knowingly collect personal data from individuals under the age of 18.
                This could only happen via false representation. If such data is discovered, it will be deleted promptly.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>11. Policy Updates</h2>
              <p className={styles.p}>
                We may update this Privacy Policy periodically to reflect legal, technical, or operational changes.
                The updated version will be posted on this page with the revised effective date always.
              </p>
            </section>

            <section className={styles.block}>
              <h2 className={styles.h2}>12. Contact Information</h2>
              <p className={styles.p}>
                For privacy-related inquiries or data requests, contact:
              </p>
              <p className={styles.p}>Email: support@protrader-edge.com</p>
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
