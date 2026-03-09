import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type PlanKey = "FULL" | "TWO_PART" | "THREE_PART";

const NAIRA_TO_KOBO = (n: number) => Math.round(n * 100);

function planAmounts(baseKobo: number) {
  // Your rules for Foundation Program:
  // base = 250k (priceKobo)
  // FULL: 200k once
  // TWO_PART: 125k + 125k (total 250k)
  // THREE_PART: 100k + 80k + 80k (total 260k)
  return {
    FULL: {
      totalKobo: NAIRA_TO_KOBO(200_000),
      installments: [NAIRA_TO_KOBO(200_000)],
    },
    TWO_PART: {
      totalKobo: baseKobo,
      installments: [NAIRA_TO_KOBO(125_000), NAIRA_TO_KOBO(125_000)],
    },
    THREE_PART: {
      totalKobo: baseKobo + NAIRA_TO_KOBO(10_000),
      installments: [NAIRA_TO_KOBO(100_000), NAIRA_TO_KOBO(80_000), NAIRA_TO_KOBO(80_000)],
    },
  } satisfies Record<PlanKey, { totalKobo: number; installments: number[] }>;
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // @ts-expect-error custom field
    const userId = (session.user as any).id as string | undefined;
    const email = session.user.email;
    if (!userId || !email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const planType = (searchParams.get("plan") || "FULL") as PlanKey;

    if (!courseId) return NextResponse.json({ error: "courseId is required" }, { status: 400 });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, priceKobo: true },
    });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const baseKobo = course.priceKobo ?? 0;
    if (!Number.isFinite(baseKobo) || baseKobo <= 0) {
      return NextResponse.json(
        { error: "Course price is invalid. Set course.priceKobo to a value > 0." },
        { status: 400 }
      );
    }

    const plan = planAmounts(baseKobo)[planType];
    if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    // Find existing purchase (if any)
    const existingPurchase = await prisma.purchase.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
      select: {
        id: true,
        status: true,
        planType: true,
        totalKobo: true,
        installments: {
          orderBy: { installmentNo: "asc" },
          select: { id: true, installmentNo: true, status: true },
        },
      },
    });

    // If already PAID, go to course
    if (existingPurchase?.status === "PAID") {
      return NextResponse.redirect(new URL(`/courses/${course.id}`, req.url));
    }

    // Determine which installment we’re paying now
    const alreadyPaidCount =
      existingPurchase?.installments.filter((i) => i.status === "PAID").length ?? 0;

    const nextInstallmentNo = alreadyPaidCount + 1;
    const payNowKobo = plan.installments[nextInstallmentNo - 1];

    if (!payNowKobo || payNowKobo <= 0) {
      return NextResponse.json(
        { error: "No installment due (or invalid amount).", details: { nextInstallmentNo } },
        { status: 400 }
      );
    }

    // Upsert Purchase
    const purchase = await prisma.purchase.upsert({
      where: { userId_courseId: { userId, courseId: course.id } },
      update: {
        planType,
        totalKobo: plan.totalKobo,
        // keep amountKobo in sync for FULL compatibility
        amountKobo: plan.totalKobo,
        status: "PENDING",
      },
      create: {
        userId,
        courseId: course.id,
        planType,
        totalKobo: plan.totalKobo,
        amountKobo: plan.totalKobo,
        status: "PENDING",
      },
      select: { id: true, planType: true },
    });

    // Ensure Installment row exists for this installmentNo
    // (create if missing, otherwise reuse)
    const installment = await prisma.installment.upsert({
      where: { purchaseId_installmentNo: { purchaseId: purchase.id, installmentNo: nextInstallmentNo } },
      update: {
        amountKobo: payNowKobo,
        status: "PENDING",
        reference: null,
        paidAt: null,
      },
      create: {
        purchaseId: purchase.id,
        installmentNo: nextInstallmentNo,
        amountKobo: payNowKobo,
        status: "PENDING",
      },
      select: { id: true },
    });

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "PAYSTACK_SECRET_KEY missing" }, { status: 500 });

    const callbackUrl =
      process.env.PAYSTACK_CALLBACK_URL || `${process.env.NEXTAUTH_URL}/courses/${course.id}`;

    const reference = `pte_${installment.id}_${Date.now()}`;

    // Save reference on installment (not purchase)
    await prisma.installment.update({
      where: { id: installment.id },
      data: { reference },
    });

    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: payNowKobo, // integer KOBO
        reference,
        callback_url: callbackUrl,
        metadata: {
          courseId: course.id,
          purchaseId: purchase.id,
          installmentId: installment.id,
          userId,
          planType,
          installmentNo: nextInstallmentNo,
          payNowKobo,
          totalKobo: plan.totalKobo,
        },
      }),
    });

    const initJson = await initRes.json();
    if (!initRes.ok || !initJson?.status) {
      return NextResponse.json({ error: "Paystack initialize failed", details: initJson }, { status: 500 });
    }

    return NextResponse.redirect(initJson.data.authorization_url, 302);
  } catch (e: any) {
    return NextResponse.json({ error: "Server error", details: String(e?.message || e) }, { status: 500 });
  }
}