// src/app/certificates/page.tsx
"use client";
import styles from "./certificates.module.css";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";

export default function CertificatesPage() {
  const [course, setCourse] = useState("Institutional Forex Trading");
  const [generated, setGenerated] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <h1 className={styles.h1}>Certificate Generation</h1>
        <p className={styles.p}>Generate your certificate of completion for a course you&apos;ve finished.</p>

        <section className={styles.card}>
          <label className={styles.label}>Select Course</label>
          <select className={styles.select} value={course} onChange={(e) => setCourse(e.target.value)}>
            <option>Institutional Forex Trading</option>
            <option>Risk Management in Forex</option>
          </select>

          <button className={styles.primary} onClick={() => setGenerated(true)}>Generate Certificate</button>
        </section>

        <section className={styles.previewWrap}>
          <div className={styles.previewTitle}>Your Certificate</div>
          <div className={styles.preview}>
            <div className={styles.previewHeader}>ProTrader <span>Edge</span></div>
            <div className={styles.big}>Certificate of Completion</div>
            <div className={styles.line}>Name</div>
            <div className={styles.name}>John Doe</div>
            <div className={styles.line}>Has successfully completed</div>
            <div className={styles.course}>{course}</div>
            <div className={styles.bottom}>
              <div>Instructor&apos;s Signature</div>
              <div className={styles.seal}>CERTIFIED</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {generated && (
            <div className={styles.actions}>
              <button className={styles.secondary}>Download PDF</button>
              <button className={styles.secondary}>Regenerate</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
