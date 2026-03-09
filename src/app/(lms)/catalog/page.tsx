// src/app/(lms)/catalog/page.tsx
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import styles from "./catalog.module.css";
import { prisma } from "@/lib/prisma";

export default async function CatalogPage() {
  // Pull courses created from your admin course builder
  // Only show published courses in the catalog
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
    },
  });

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <h1 className={styles.h1}>Course Catalog</h1>

          <div className={styles.grid}>
            {courses.map((course) => (
              <div key={course.id} className={styles.card}>
                <div
                  className={styles.thumb}
                  style={
                    course.thumbnailUrl
                      ? {
                          backgroundImage: `url(${course.thumbnailUrl})`,
                        }
                      : undefined
                  }
                />

                <div className={styles.title}>{course.title}</div>

                <Link className={styles.btnLink} href={`/enroll/${course.id}`}>
                  Enroll
                </Link>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <p style={{ color: "var(--muted)", marginTop: 14 }}>
              No published courses yet.
            </p>
          )}
        </main>

        <Bottombar />
      </div>
    </div>
  );
}
