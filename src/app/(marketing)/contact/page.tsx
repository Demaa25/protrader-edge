// src/app/(marketing)/contact/page.tsx
"use client";

import { useState } from "react";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Contact</h1>
        </header>

        <section className={styles.panel}>
          {/* LEFT */}
          <div className={styles.left}>
            <h2 className={styles.panelTitle}>Get in Touch</h2>

            <div className={styles.emails}>
              <p>
                <strong>General:</strong> info@protrader-edge.com
              </p>
              <p>
                <strong>Support:</strong> support@protrader-edge.com
              </p>
              <p>
                <strong>Partnerships:</strong> partnerships@protrader-edge.com
              </p>
            </div>

            <p className={styles.intro}>
              For program inquiries, institutional partnerships, or Level 4 applications, please use
              the form below. General support requests are handled through your student dashboard
              after login.
            </p>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <h2 className={styles.panelTitle}>Send Us a Message</h2>

            {submitted ? (
              <div className={styles.success}>
                Thank you. Your message has been received and will be reviewed.
              </div>
            ) : (
              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className={styles.row}>
                  <label className={styles.label}>
                    Full Name
                    <input className={styles.input} type="text" required />
                  </label>
                </div>

                <div className={styles.row}>
                  <label className={styles.label}>
                    Email Address
                    <input className={styles.input} type="email" required />
                  </label>
                </div>

                <div className={styles.row}>
                  <label className={styles.label}>
                    Subject
                    <select className={styles.select} required>
                      <option value="">Select one</option>
                      <option>Program inquiry</option>
                      <option>Level 4 application</option>
                      <option>Institutional partnership</option>
                      <option>Media / Press</option>
                    </select>
                  </label>
                </div>

                <div className={styles.row}>
                  <label className={styles.label}>
                    Message
                    <textarea className={styles.textarea} rows={6} required />
                  </label>
                </div>

                <button type="submit" className={styles.button}>
                  Submit
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
