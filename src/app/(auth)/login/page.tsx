// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./login.module.css";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/welcome", // 🔥 After login, always go to /welcome
    });
    if ((res as any)?.error) setErr("Invalid credentials");
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

        <h1 className={styles.h1}>Welcome Back</h1>
        <p className={styles.p}>Log in to access your courses.</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <div className={styles.row}>
            <label className={styles.chk}>
              <input type="checkbox" /> Remember me
            </label>
            <a className={styles.link} href="/forgot-password">
              Forgot Password?
            </a>
          </div>

          {err && <div className={styles.err}>{err}</div>}
          <button className={styles.btn} type="submit">
            Log In
          </button>
        </form>

        <div className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link className={styles.createLink} href="/register">
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}