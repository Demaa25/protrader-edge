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
        <Link href="/legal/terms-of-use" className={styles.link}>
          Terms of Use
        </Link>

        <Link href="/legal/privacy-policy" className={styles.link}>
          Privacy Policy
        </Link>

        <Link href="/legal/refund-policy" className={styles.link}>
          Refund Policy
        </Link>
      </div>
    </footer>
  );
}