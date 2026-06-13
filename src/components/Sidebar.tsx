// src/components/Sidebar.tsx 
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

import {
  LayoutDashboard,
  BookOpen,
  Lock,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  PlusCircle,
} from "lucide-react";

type Role = "ADMIN" | "LEARNER";

type Props = {
  role?: Role;
  user?: {
    name?: string | null;
  };
};

function NavItem({ href, label, active, icon }: any) {
  return (
    <Link
      href={href}
      className={`${styles.link} ${active ? styles.active : ""}`}
    >
      <span className={styles.iconWrap}>{icon}</span>
      <span className={styles.linkText}>{label}</span>
    </Link>
  );
}

export function Sidebar({
  role = "LEARNER",
  user,
}: Props) {
  const pathname = usePathname();

  const [light, setLight] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("sidebar-theme") !== "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "sidebar-theme",
      light ? "light" : "dark"
    );
  }, [light]);

  const isActive = (href: string) =>
    pathname?.startsWith(href);

  const isAdmin = role === "ADMIN";

  return (
    <aside
      className={`${styles.sidebar} ${
        light ? styles.light : styles.dark
      }`}
    >
      {/* BRAND */}
      <div className={styles.brand}>
        <Image
          src="/PTE Logo_2.png"
          alt="logo"
          width={28}
          height={28}
          className={styles.logoImg}
        />
        <span className={styles.brandText}>
          ProTrader{" "}
          <span className={styles.brandAccent}>
            Edge
          </span>
        </span>
      </div>

      <div className={styles.navScroll}>
        <nav className={styles.nav}>
          {/* STUDENT ITEMS (VISIBLE TO ALL) */}
          <NavItem
            href="/dashboard"
            label="Dashboard"
            active={isActive("/dashboard")}
            icon={<LayoutDashboard size={18} />}
          />

          <NavItem
            href="/my-courses"
            label="My Courses"
            active={isActive("/my-courses")}
            icon={<BookOpen size={18} />}
          />

          <NavItem
            href="/catalog"
            label="Catalog"
            active={isActive("/catalog")}
            icon={<Lock size={18} />}
          />

          {/* ADMIN ONLY */}
          {isAdmin && (
            <>
              <div className={styles.divider} />

              <NavItem
                href="/admin/dashboard"
                label="Admin Dashboard"
                active={isActive("/admin/dashboard")}
                icon={<LayoutDashboard size={18} />}
              />

              <NavItem
                href="/admin/courses"
                label="Manage Courses"
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
                label="Manage Banks"
                active={isActive("/admin/upload-question-bank")}
                icon={<PlusCircle size={18} />}
              />
            </>
          )}
        </nav>
      </div>

      <div className={styles.bottomBlock}>
        <div
          className={styles.themeSwitch}
          onClick={() => setLight(!light)}
        >
          <Sun size={14} />

          <div
            className={`${styles.switchTrack} ${
              light
                ? styles.switchLight
                : styles.switchDark
            }`}
          >
            <div className={styles.switchThumb} />
          </div>

          <Moon size={14} />
        </div>

        <NavItem
          href="/settings"
          label="Settings"
          active={isActive("/settings")}
          icon={<Settings size={18} />}
        />

        <button
          className={styles.logout}
          onClick={() =>
            signOut({ callbackUrl: "/login" })
          }
        >
          <LogOut size={18} />
          Logout
        </button>

        <div className={styles.userBox}>
          <div className={styles.avatar} />
          <span>
            {user?.name ??
              (isAdmin ? "Admin" : "User")}
          </span>
        </div>
      </div>
    </aside>
  );
}