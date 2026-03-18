// src/components/Sidebar.tsx 
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";
import {
  Mail,
  Lock,
  MailOpen,
  User,
  LogOut,
  Shield,
  Users,
  BookOpen,
  PlusCircle,
} from "lucide-react";

type Role = "ADMIN" | "LEARNER";

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link className={`${styles.link} ${active ? styles.active : ""}`} href={href}>
      <span className={styles.iconWrap}>{icon}</span>
      <span className={styles.linkText}>{label}</span>
    </Link>
  );
}

export function Sidebar({ role }: { role?: Role }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // exact match for dashboard
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname?.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.logoMark}>▮▮▮</span>
        <span className={styles.brandText}>
          ProTrader <span className={styles.brandAccent}>Edge</span>
        </span>
      </div>

      {/* Main nav */}
      <nav className={styles.nav}>
        <NavItem
          href="/dashboard"
          label="Dashboard"
          active={isActive("/dashboard")}
          icon={<Mail size={18} />}
        />

        {/* If you later create /my-courses page, update the href */}
        <NavItem
          href="/my-courses"
          label="My Courses"
          active={isActive("/my-courses")}
          icon={<Lock size={18} />}
        />

        <NavItem
          href="/catalog"
          label="Catalog"
          active={isActive("/catalog")}
          icon={<MailOpen size={18} />}
        />

        <NavItem
          href="/settings"
          label="Profile & Settings"
          active={isActive("/settings")}
          icon={<User size={18} />}
        />

        {role === "ADMIN" && (
          <>
            <div className={styles.divider} />

            <NavItem
              href="/admin/dashboard"
              label="Admin Dashboard"
              active={isActive("/admin/dashboard")}
              icon={<Shield size={18} />}
            />

            <NavItem
              href="/admin/courses"
              label="Courses"
              active={isActive("/admin/courses")}
              icon={<BookOpen size={18} />}
            />

            <NavItem
              href="/admin/users"
              label="Users"
              active={isActive("/admin/users")}
              icon={<Users size={18} />}
            />

            <NavItem
              href="/admin/upload-question-bank"
              label="Question Banks"
              active={isActive("/admin/upload-question-bank")}
              icon={<PlusCircle size={18} />}
            />
          </>
        )}
      </nav>

      {/* Bottom logout (matches mock placement) */}
      <div className={styles.bottom}>
        <button
          className={styles.logout}
          onClick={() => signOut({ callbackUrl: "/login" })}
          type="button"
        >
          <span className={styles.iconWrap}>
            <LogOut size={18} />
          </span>
          <span className={styles.linkText}>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
