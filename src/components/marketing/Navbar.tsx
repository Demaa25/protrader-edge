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
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => setOpenKey(null), [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpenKey(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className={styles.header} ref={(el) => { rootRef.current = el }}>
      <div className={styles.inner}>

        <Link href="/" className={styles.brand}>
          <span className={styles.logoWrap}>
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

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>

        <nav
          className={`${styles.nav} ${mobileOpen ? styles.mobileNavOpen : ""}`}
        >
          {navItems.map((item) => {
            const key = item.label.toLowerCase();
            const isOpen = openKey === key;

            if (item.dropdown) {
              return (
                <div key={item.label} className={styles.dropdown}>
                  <button
                    className={styles.navLink}
                    onClick={() => setOpenKey(isOpen ? null : key)}
                  >
                    {item.label} <span className={styles.caret}>▾</span>
                  </button>

                  <div
                    className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}
                  >
                    {item.dropdown.map((d) => (
                      <Link
                        key={d.href}
                        href={d.href}
                        className={styles.menuItem}
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
                className={styles.navLink}
              >
                {item.label}
              </Link>
            );
          })}

          <div className={styles.mobileButtons}>
            <Link href="/register" className={styles.signup}>
              Sign Up
            </Link>
            <Link href="/login" className={styles.login}>
              Login
            </Link>
          </div>
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