// src/app/api/admin/courses/[courseId]/certification/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EvaluationType, BankType } from "@prisma/client";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.evaluation.findFirst({
    where: { courseId, type: EvaluationType.CERTIFICATION },
    orderBy: { createdAt: "asc" },
  });

  let bank = existing
    ? await prisma.questionBank.findUnique({ where: { id: existing.bankId } })
    : null;

  if (!bank) {
    bank = await prisma.questionBank.create({
      data: {
        name: `Certification Exam Bank — ${courseId}`,
        type: BankType.CERTIFICATION,
      },
    });
  }

  const evaluation = existing
    ? await prisma.evaluation.update({
        where: { id: existing.id },
        data: { bankId: bank.id },
      })
    : await prisma.evaluation.create({
        data: {
      title: "Certification Exam",
      type: EvaluationType.CERTIFICATION,
      courseId,
      bankId: bank.id,
      questionCount: 50, // your spec
      passMarkPct: 70,
      randomize: true,
        },
      });

  return NextResponse.json({ id: evaluation.id });
}
