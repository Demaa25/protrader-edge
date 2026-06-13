// src/app/api/certificates/generate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

function generateCertificateNumber(
  count: number
) {
  const year =
    new Date().getFullYear();

  const padded = String(
    count + 1
  ).padStart(5, "0");

  return `PTE-${year}-${padded}`;
}

export async function POST(
  req: Request
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = (
      session.user as any
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { courseId } =
      await req.json();

    /* =========================
       CHECK EXISTING
    ========================= */

    const existing =
      await prisma.certificate.findUnique(
        {
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },

          include: {
            user: {
              select: {
                name: true,
              },
            },

            course: {
              select: {
                title: true,
              },
            },
          },
        }
      );

    if (existing) {
      return NextResponse.json({
        certificate: existing,
      });
    }

    /* =========================
       COUNT
    ========================= */

    const total =
      await prisma.certificate.count();

    /* =========================
       CERT NUMBER
    ========================= */

    const certificateNumber =
      generateCertificateNumber(
        total
      );

    /* =========================
       CREATE
    ========================= */

    const certificate =
      await prisma.certificate.create(
        {
          data: {
            userId,
            courseId,

            certificateNumber,

            issuedAt:
              new Date(),
          },

          include: {
            user: {
              select: {
                name: true,
              },
            },

            course: {
              select: {
                title: true,
              },
            },
          },
        }
      );

    return NextResponse.json({
      certificate,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error:
          e.message ||
          "Failed to generate certificate",
      },
      {
        status: 500,
      }
    );
  }
}