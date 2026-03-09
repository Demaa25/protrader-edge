// src/app/forgot-password/page.tsx
"use client";
import styles from "./forgot.module.css";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up email reset flow
    setSent(true);
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>ProTrader <span>Edge</span></div>
        <h1 className={styles.h1}>Forgot Password?</h1>
        <p className={styles.p}>Enter your email to reset your password.</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <button className={styles.btn} type="submit">Reset Password</button>
        </form>

        {sent && <div className={styles.note}>If the email exists, you&apos;ll receive reset instructions.</div>}
        <a className={styles.link} href="/login">Back to Login</a>
      </div>
    </main>
  );
}
