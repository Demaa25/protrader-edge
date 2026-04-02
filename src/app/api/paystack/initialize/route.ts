//src/app/api/paystack/initialize/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const courseId = searchParams.get("courseId"); // LMS
    const courseSlug = searchParams.get("course"); // Public

    let session = null;
    let userId: string | null = null;
    let email: string | null = null;

    /**
     * Only require auth when coming from LMS
     */
    if (courseId) {
      session = await getSession();

      if (!session?.user)
        return NextResponse.redirect(
          new URL("/login", req.url)
        );

      userId = (session.user as any).id as string;
      email = session.user.email!;
    }

    /**
     * PUBLIC PURCHASE
     * no login required
     */
    if (!courseId && courseSlug) {
      email = searchParams.get("email") || undefined as any;
    }

    let course;

    /**
     * LMS lookup
     */
    if (courseId) {
      course = await prisma.course.findUnique({
        where: { id: courseId },
      });
    }

    /**
     * Public lookup
     */
    if (!course && courseSlug) {
      course = await prisma.course.findFirst({
        where: {
          title: {
            contains: courseSlug,
            mode: "insensitive",
          },
        },
      });
    }

    if (!course)
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );

    const amountKobo = course.priceKobo;

    /**
     * If LMS -> create purchase
     */
    let purchaseId: string | null = null;

    if (userId) {
      const existing = await prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
      });

      if (existing?.status === "PAID") {
        return NextResponse.redirect(
          new URL(`/courses/${course.id}`, req.url)
        );
      }

      const purchase = await prisma.purchase.create({
        data: {
          userId,
          courseId: course.id,
          totalKobo: amountKobo,
          amountKobo: amountKobo,
          status: "PENDING",
          planType: "FULL",
        },
      });

      purchaseId = purchase.id;
    }

    const reference = `pte_${Date.now()}`;

    const initRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email ?? "guest@protraderedge.com",
          amount: amountKobo,
          reference,
          callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
          metadata: {
            purchaseId,
            courseId: course.id,
            userId,
          },
        }),
      }
    );

    const data = await initRes.json();

    if (!data.status)
      return NextResponse.json(
        { error: "Paystack error", details: data },
        { status: 500 }
      );

    return NextResponse.redirect(data.data.authorization_url);

  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}