// src/app/api/paystack/initialize/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const courseId =
      searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        {
          error: "Course ID required",
        },
        {
          status: 400,
        }
      );
    }

    const session =
      await getSession();

    if (!session?.user) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    const userId = (
      session.user as any
    ).id as string;

    const email =
      session.user.email!;

    const course =
      await prisma.course.findUnique({
        where: {
          id: courseId,
        },
      });

    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found",
        },
        {
          status: 404,
        }
      );
    }

    const existing =
      await prisma.purchase.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

    if (
      existing?.status === "PAID"
    ) {
      return NextResponse.redirect(
        new URL(
          `/courses/${course.id}`,
          req.url
        )
      );
    }

    let purchaseId =
      existing?.id ?? null;

    if (!existing) {
      const purchase =
        await prisma.purchase.create({
          data: {
            userId,
            courseId,

            totalKobo:
              course.priceKobo,

            amountKobo:
              course.priceKobo,

            status: "PENDING",
          },
        });

      purchaseId = purchase.id;
    }

    const reference = `pte_${Date.now()}`;

    const initRes =
      await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,

            amount:
              course.priceKobo,

            reference,

            callback_url: `${process.env.NEXTAUTH_URL}/payment/verify`,

            metadata: {
              purchaseId,
              userId,
              courseId,
            },
          }),
        }
      );

    const data =
      await initRes.json();

    if (!data.status) {
      return NextResponse.json(
        {
          error:
            "Paystack initialization failed",

          details: data,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.redirect(
      data.data.authorization_url
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}