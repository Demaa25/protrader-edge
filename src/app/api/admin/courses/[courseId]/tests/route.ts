// src/app/api/admin/courses/[courseId]/tests/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EvaluationType } from "@prisma/client";

export async function POST(req: Request, ctx: { params: Promise<{ courseId: string }> }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  
  const role = (session.user as any)?.role as string | undefined;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { courseId } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const bankId = String(body.bankId ?? "").trim();

  const questionCount = body.questionCount !== undefined ? Number(body.questionCount) : undefined;
  const passMarkPct = body.passMarkPct !== undefined ? Number(body.passMarkPct) : undefined;
  const randomize = body.randomize !== undefined ? Boolean(body.randomize) : undefined;

  if (!title || !bankId) {
    return NextResponse.json({ error: "Missing title or bankId" }, { status: 400 });
  }

  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    select: { type: true },
  });
  if (!bank || bank.type !== "TEST") {
    return NextResponse.json({ error: "Selected bank is not a Test bank" }, { status: 400 });
  }

  const existing = await prisma.evaluation.findFirst({
    where: { courseId, type: EvaluationType.TEST },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  const evaluation = existing
    ? await prisma.evaluation.update({
        where: { id: existing.id },
        data: {
          title,
          bankId,
          ...(Number.isFinite(questionCount) ? { questionCount } : {}),
          ...(Number.isFinite(passMarkPct) ? { passMarkPct } : {}),
          ...(randomize !== undefined ? { randomize } : {}),
        },
        select: { id: true, title: true, type: true, createdAt: true, courseId: true, bankId: true },
      })
    : await prisma.evaluation.create({
        data: {
          type: EvaluationType.TEST,
          title,
          bankId,
          courseId,
          questionCount: Number.isFinite(questionCount) ? questionCount : 10,
          passMarkPct: Number.isFinite(passMarkPct) ? passMarkPct : 70,
          randomize: randomize ?? true,
        },
        select: { id: true, title: true, type: true, createdAt: true, courseId: true, bankId: true },
      });

  return NextResponse.json(evaluation);
}