// src/app/(lms)/welcome/LandingHeader.tsx
"use client";

import Image from "next/image";
import styles from "./welcome.module.css";
import { signOut } from "next-auth/react";

export default function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        {/* NOT a link (per your instruction: logo shouldn't go back to marketing) */}
        <Image
          src="/PTE Logo_2.png"
          alt="ProTrader Edge"
          width={34}
          height={34}
          className={styles.logo}
          priority
        />
        <div className={styles.brandText}>
          ProTrader <span>Edge</span>
        </div>
      </div>

      <button
        className={styles.logout}
        onClick={() => signOut({ callbackUrl: "/" })}
        type="button"
      >
        Log Out
      </button>
    </header>
  );
}