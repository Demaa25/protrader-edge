// src/app/(auth)/register/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./register.module.css";

type ApiRes = { ok: boolean; message?: string };

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setDone(false);

    if (!name.trim()) return setErr("Name is required.");
    if (!email.trim()) return setErr("Email is required.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");
    if (!termsAccepted) return setErr("Please accept the Terms of Use.");
    if (!privacyAccepted) return setErr("Please accept the Privacy Policy.");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, acceptedTermsOfUse: termsAccepted, acceptedPrivacyPolicy: privacyAccepted }),
      });

      const data = (await res.json()) as ApiRes;

      if (!res.ok || !data.ok) {
        setErr(data.message || "Unable to create account.");
        return;
      }

      setDone(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        {/* Brand block (centered) */}
        <Link href="/" className={styles.brandLink} aria-label="Go to home">
          {/* If you have the logo file in /public, set src="/PTE Logo_2.png" */}
          <img className={styles.logo} src="/PTE Logo_2.png" alt="ProTrader Edge Logo" />
          <div className={styles.brand}>
            ProTrader <span>Edge</span>
          </div>
        </Link>

        <h1 className={styles.h1}>Create Account</h1>
        <p className={styles.p}>Create an account to access your courses.</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>Full Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            autoComplete="name"
            placeholder="Your name"
          />

          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
          />

          <label className={styles.label}>Confirm Password</label>
          <input
            className={styles.input}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
          />

          {err && <div className={styles.err}>{err}</div>}
          {done && (
            <div className={styles.ok}>
              Account created.{" "}
              <Link className={styles.inlineLink} href="/login">
                Log in
              </Link>
              .
            </div>
          )}

          <div className={styles.legal}>
            <label className={styles.checkboxRow}>
              <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <Link href="/legal/terms-of-use" className={styles.inlineLink}>
                  Terms of Use
                </Link>
              </span>
            </label>

            <label className={styles.checkboxRow}>
              <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <span>
                I acknowledge the{" "}
                <Link href="/legal/privacy-policy" className={styles.inlineLink}>
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{" "}
          <Link className={styles.link} href="/login">
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}