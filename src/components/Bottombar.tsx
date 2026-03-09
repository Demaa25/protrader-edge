// src/components/Bottombar.tsx
"use client";

import styles from "./Bottombar.module.css";
import Link from "next/link";

export function Bottombar() {
  return (
    <footer className={styles.bar}>
      <div className={styles.left}>
        © {new Date().getFullYear()} ProTrader Edge. All rights reserved.
      </div>

      <div className={styles.right}>
        <Link href="/terms" className={styles.link}>
          Terms of Use
        </Link>

        <Link href="/privacy" className={styles.link}>
          Privacy Policy
        </Link>

        <Link href="/refund-policy" className={styles.link}>
          Refund Policy
        </Link>
      </div>
    </footer>
  );
}