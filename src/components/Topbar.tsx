// src/components/Topbar.tsx
"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Topbar.module.css";

function pretty(seg: string) {
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Topbar() {
  const pathname = usePathname();
  const { data } = useSession();

  const parts = (pathname || "/")
    .split("/")
    .filter(Boolean)
    .map(pretty);

  return (
    <div className={styles.topbar}>
      <div className={styles.breadcrumb}>
        <span className={styles.crumbHome}>▸</span>
        {parts.length === 0 ? (
          <span className={styles.crumb}>Dashboard</span>
        ) : (
          parts.map((p, i) => (
            <span key={`${p}-${i}`} className={styles.crumb}>
              {p}
              {i < parts.length - 1 && <span className={styles.sep}>/</span>}
            </span>
          ))
        )}
      </div>

      <div className={styles.user}>
        <span className={styles.userName}>{data?.user?.name ?? "User"}</span>
        <span className={styles.chev}>▾</span>
      </div>
    </div>
  );
}
