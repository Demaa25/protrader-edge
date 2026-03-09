// src/app/api/paystack/webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function verifyPaystackSignature(payload: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = crypto.createHmac("sha512", secret).update(payload).digest("hex");
  return hash === signature;
}

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(raw, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw);

  if (event?.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const data = event.data;
  const meta = data?.metadata;

  const purchaseId = meta?.purchaseId as string | undefined;
  const userId = meta?.userId as string | undefined;
  const courseId = meta?.courseId as string | undefined;

  if (!purchaseId || !userId || !courseId) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  // Mark purchase as PAID (for now).
  // Installment completion tracking comes next step (requires extra fields/models).
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      status: "PAID",
      paidAt: new Date(),
    },
  });

  // Create enrollment when payment succeeds
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  });

  return NextResponse.json({ ok: true });
}