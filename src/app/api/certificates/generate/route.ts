// src/app/api/certificates/generate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

function makeCertNo() {
  // simple + readable
  return `PTE-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = (await req.json()) as { courseId: string };
  // @ts-expect-error id exists
  const userId = session.user.id as string;

  // TODO: enforce completion rules (all lessons completed + quiz submitted, etc.)
  const cert = await prisma.certificate.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: {
      userId,
      courseId,
      certificateNo: makeCertNo(),
      // pdfUrl: set later when you implement PDF generation/storage
    },
    include: { course: { select: { title: true } } },
  });

  return NextResponse.json({ certificate: cert });
}
