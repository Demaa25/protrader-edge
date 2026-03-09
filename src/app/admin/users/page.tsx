// src/app/admin/users/page.tsx
"use client";
import styles from "./admin-users.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";

export default function AdminUsersPage() {
  return (
    <div className={styles.shell}>
      <Sidebar role="ADMIN" />
      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
        <h1 className={styles.h1}>User Management</h1>

        <section className={styles.card}>
          <div className={styles.cardTitle}>Add New User</div>
          <div className={styles.form}>
            <label className={styles.label}>Full Name</label>
            <input className={styles.input} placeholder="Full Name" />
            <label className={styles.label}>Email Address</label>
            <input className={styles.input} placeholder="Email" />
            <label className={styles.label}>Role</label>
            <select className={styles.input}><option>Student</option><option>Admin</option></select>
            <button className={styles.primary}>Add User</button>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardTitle}>Manage Users</div>
          <div className={styles.toolbar}>
            <input className={styles.search} placeholder="Search users..." />
            <select className={styles.filter}><option>Filter by Role</option></select>
          </div>

          <div className={styles.tableHead}>
            <div>User</div><div>Email</div><div>Role</div><div />
          </div>

          {[
            { name: "John Doe", email: "admin", role: "Admin" },
            { name: "Jane Smith", email: "student", role: "Student" },
            { name: "Alan Turner", email: "student", role: "Student" },
          ].map((u) => (
            <div key={u.name} className={styles.row}>
              <div className={styles.user}>{u.name}</div>
              <div>{u.email}</div>
              <div>{u.role}</div>
              <div className={styles.actions}>
                <button className={styles.iconBtn}>Edit</button>
                <button className={styles.danger}>Del</button>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Bottombar />
      </div>
    </div>
  );
}
