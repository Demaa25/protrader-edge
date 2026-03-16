// src/app/(auth)/reset-password/[token]/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./reset.module.css";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setMsg(data.error);
      return;
    }

    setMsg("Password updated successfully");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
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
            <h1 className={styles.h1}>Reset Password</h1>

            <form className={styles.form} onSubmit={onSubmit}>
              <input
              className={styles.input}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              <input
              className={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              />
              
              <button className={styles.btn} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>

            {msg && <div className={styles.note}>{msg}</div>}
        </div>
    </main>
  );
}