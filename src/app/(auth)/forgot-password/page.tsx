// src/app/(auth)/forgot-password/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./forgot.module.css";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        {/* Brand centered + logo */}
        <Link href="/" className={styles.brandWrap}>
          {/* Put your logo file in /public and reference it like below */}
          <Image
            src="/PTE Logo_2.png"
            alt="ProTrader Edge Logo"
            width={46}
            height={46}
            className={styles.logo}
            priority
          />
          <div className={styles.brand}>
            ProTrader <span>Edge</span>
          </div>
        </Link>
        <h1 className={styles.h1}>Forgot Password?</h1>
        <p className={styles.p}>Enter your email to reset your password.</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <button className={styles.btn} type="submit">Reset Password</button>
        </form>

        {sent && <div className={styles.note}>A password reset link has been sent to your email.</div>}
        <a className={styles.link} href="/login">Back to Login</a>
      </div>
    </main>
  );
}
