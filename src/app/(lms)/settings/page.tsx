// src/app/settings/page.tsx
"use client";

import styles from "./settings.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ApiResp = { ok?: boolean; error?: string };

export default function SettingsPage() {
  const { data, update } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    setName(data?.user?.name ?? "");
    setEmail(data?.user?.email ?? "");
  }, [data?.user?.name, data?.user?.email]);

  async function saveProfile() {
    setProfileMsg(null);
    setProfileErr(null);

    if (!email.trim()) return setProfileErr("Email is required.");

    setSavingProfile(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
      });

      const json = (await res.json()) as ApiResp;
      if (!res.ok || !json.ok) {
        setProfileErr(json.error ?? "Failed to update profile.");
        return;
      }

      // refresh next-auth session values in UI
      await update?.({ name: name.trim(), email: email.trim().toLowerCase() } as any);

      setProfileMsg("Profile updated.");
    } catch {
      setProfileErr("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function updatePassword() {
    setPassMsg(null);
    setPassErr(null);

    if (!currentPassword) return setPassErr("Current password is required.");
    if (!newPassword) return setPassErr("New password is required.");
    if (newPassword.length < 8) return setPassErr("New password must be at least 8 characters.");
    if (newPassword !== confirmNewPassword) return setPassErr("Passwords do not match.");

    setSavingPass(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = (await res.json()) as ApiResp;
      if (!res.ok || !json.ok) {
        setPassErr(json.error ?? "Failed to update password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPassMsg("Password updated.");
    } catch {
      setPassErr("Failed to update password.");
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <div className={styles.shell}>
      <Sidebar />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <h1 className={styles.h1}>Profile & Settings</h1>

          <section className={styles.card}>
            <div className={styles.cardTitle}>Profile Information</div>

            <div className={styles.row}>
              <div className={styles.avatar} />

              <div className={styles.form}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />

                <label className={styles.label}>Email Address</label>
                <input
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                />

                {profileErr && <div className={styles.err}>{profileErr}</div>}
                {profileMsg && <div className={styles.ok}>{profileMsg}</div>}

                <button
                  className={styles.primary}
                  type="button"
                  onClick={saveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}>Account Settings</div>

            <div className={styles.form}>
              <label className={styles.label}>Current Password</label>
              <input
                className={styles.input}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <label className={styles.label}>New Password</label>
              <input
                className={styles.input}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label className={styles.label}>Confirm New Password</label>
              <input
                className={styles.input}
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              {passErr && <div className={styles.err}>{passErr}</div>}
              {passMsg && <div className={styles.ok}>{passMsg}</div>}

              <button
                className={styles.primary}
                type="button"
                onClick={updatePassword}
                disabled={savingPass}
              >
                {savingPass ? "Updating..." : "Update Password"}
              </button>
            </div>
          </section>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}