// src/components/marketing/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

type NavItem = {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Programs",
    href: "/programs",
    dropdown: [
      { label: "Core Programs", href: "/programs" },
      { label: "Specialist Certifications", href: "/programs/specialist" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    dropdown: [
      { label: "Research", href: "/resources/research" },
      { label: "Frameworks", href: "/resources/frameworks" },
      { label: "Trading Tools", href: "/resources/tools" },
      { label: "Articles", href: "/resources/articles" },
    ],
  },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

function isActivePath(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  // Close dropdown on route change
  useEffect(() => setOpenKey(null), [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Close dropdown on ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenKey(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className={styles.header} ref={(el) => (rootRef.current = el)}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="ProTrader Edge home">
          <span className={styles.logoWrap} aria-hidden="true">
            {/* CHANGE THIS PATH TO YOUR REAL ROUND LOGO FILE IN /public */}
            <Image
              src="/PTE Logo_2.png"
              alt=""
              width={34}
              height={34}
              className={styles.logo}
              priority
            />
          </span>

          <span className={styles.brandText}>
            ProTrader <span>Edge</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) => {
            const key = item.label.toLowerCase();
            const isOpen = openKey === key;

            if (item.dropdown) {
              const parentActive =
                isActivePath(pathname, item.href) ||
                item.dropdown.some((d) => isActivePath(pathname, d.href));

              return (
                <div
                  key={item.label}
                  className={styles.dropdown}
                  onMouseEnter={() => setOpenKey(key)}
                  onMouseLeave={() => setOpenKey(null)}
                >
                  <Link
                    href={item.href!}
                    className={`${styles.navLink} ${parentActive ? styles.active : ""}`}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                  >
                    {item.label}
                    <span className={styles.caret} aria-hidden="true">
                      ▾
                    </span>
                  </Link>

                  <div
                    className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}
                    role="menu"
                  >
                    {item.dropdown.map((d) => (
                      <Link
                        key={d.href}
                        href={d.href}
                        className={`${styles.menuItem} ${
                          isActivePath(pathname, d.href) ? styles.menuItemActive : ""
                        }`}
                        role="menuitem"
                      >
                        {d.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
                className={`${styles.navLink} ${isActivePath(pathname, item.href) ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.right}>
          <Link href="/register" className={styles.signup}>
            Sign Up
          </Link>

          <Link href="/login" className={styles.login}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}