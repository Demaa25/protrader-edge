// src/app/(lms)/enroll/[courseId]/page.tsx
import styles from "./enroll.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type PlanKey = "FULL" | "TWO_PART" | "THREE_PART";

function formatNairaFromKobo(amountKobo: number) {
  return `₦${(amountKobo / 100).toLocaleString()}`;
}

// amounts below are in NAIRA, convert to KOBO when returning
function nairaToKobo(n: number) {
  return Math.round(n * 100);
}

function computePlan(courseBaseKobo: number) {
  // Updated rules for Foundation Program:
  // base price = 250k (course.priceKobo should be 250_000 * 100)
  // FULL pays 200k (discount)
  // TWO_PART pays 250k total: 125k now, 125k later
  // THREE_PART pays 260k total: 100k now, 80k later, 80k later

  const baseKobo = courseBaseKobo;

  const fullTotalKobo = baseKobo - nairaToKobo(50_000);               // 200k
  const twoPartTotalKobo = baseKobo;                        // 250k
  const threePartTotalKobo = baseKobo + nairaToKobo(10_000); // 260k

  return {
    FULL: {
      label: "Full payment (Discounted)",
      totalKobo: fullTotalKobo,
      payNowKobo: fullTotalKobo,
      breakdown: [`Pay once: ${formatNairaFromKobo(fullTotalKobo)}`],
      accessPctAfterThisPayment: 100,
    },
    TWO_PART: {
      label: "2 installments",
      totalKobo: twoPartTotalKobo,
      payNowKobo: nairaToKobo(125_000),
      breakdown: [
        `Today: ${formatNairaFromKobo(nairaToKobo(125_000))}`,
        `Later: ${formatNairaFromKobo(nairaToKobo(125_000))}`,
      ],
      accessPctAfterThisPayment: 50,
    },
    THREE_PART: {
      label: "3 installments",
      totalKobo: threePartTotalKobo,
      payNowKobo: nairaToKobo(100_000),
      breakdown: [
        `Today: ${formatNairaFromKobo(nairaToKobo(100_000))}`,
        `Later: ${formatNairaFromKobo(nairaToKobo(80_000))}`,
        `Later: ${formatNairaFromKobo(nairaToKobo(80_000))}`,
      ],
      // you can set this to whatever access rule you want
      accessPctAfterThisPayment: 40,
    },
  } satisfies Record<PlanKey, any>;
}

export default async function EnrollCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const session = await getSession();
  if (!session?.user) redirect("/login");

  
  const role = (session.user as any)?.role as "ADMIN" | "LEARNER" | "STUDENT" | undefined;
  
  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      priceKobo: true,
    },
  });

  if (!course) redirect("/catalog");

  // If already fully paid, go to course
  const existing = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
    select: { status: true },
  });

  if (existing?.status === "PAID") redirect(`/courses/${course.id}`);

  const baseKobo = course.priceKobo ?? 0;
  const plans = computePlan(baseKobo);

  return (
    <div className={styles.shell}>
      <Sidebar role={role as any} />
      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.h1}>Enroll in {course.title}</h1>
              <p className={styles.p}>
                Choose a payment plan to unlock your course. Installments grant partial access until completed.
              </p>
            </div>
          </header>

          <section className={styles.card}>
            <div className={styles.cardTitle}>Payment Plan</div>

            <form className={styles.form} action={`/api/paystack/initialize`} method="GET">
              <input type="hidden" name="courseId" value={course.id} />

              <div className={styles.grid}>
                {(["FULL", "TWO_PART", "THREE_PART"] as PlanKey[]).map((key) => {
                  const plan = plans[key];
                  return (
                    <label key={key} className={styles.plan}>
                      <input
                        className={styles.radio}
                        type="radio"
                        name="plan"
                        value={key}
                        defaultChecked={key === "FULL"}
                      />
                      <div className={styles.planBody}>
                        <div className={styles.planTop}>
                          <div className={styles.planName}>{plan.label}</div>
                          <div className={styles.planPrice}>
                            Total: {formatNairaFromKobo(plan.totalKobo)}
                          </div>
                        </div>

                        <ul className={styles.planList}>
                          {plan.breakdown.map((x: string) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>

                        <div className={styles.planNote}>
                          Access after this payment: <b>{plan.accessPctAfterThisPayment}%</b>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <button className={styles.payBtn} type="submit">
                Pay Now (Paystack)
              </button>

              <div className={styles.miniNote}>
                By continuing, you agree that installment access is limited until payments are completed.
              </div>
            </form>
          </section>
        </main>

        <Bottombar />
      </div>
    </div>
  );
}