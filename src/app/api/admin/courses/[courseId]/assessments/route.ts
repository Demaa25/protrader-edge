// src/app/api/admin/courses/[courseId]/assessments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EvaluationType } from "@prisma/client";

export async function POST(req: Request, ctx: { params: Promise<{ courseId: string }> }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-expect-error custom field exists in your session
  const role = (session.user as any)?.role as string | undefined;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { courseId } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const bankId = String(body.bankId ?? "").trim();
  const moduleId = String(body.moduleId ?? "").trim();

  const questionCount = body.questionCount !== undefined ? Number(body.questionCount) : undefined;
  const passMarkPct = body.passMarkPct !== undefined ? Number(body.passMarkPct) : undefined;
  const randomize = body.randomize !== undefined ? Boolean(body.randomize) : undefined;

  if (!title || !bankId || !moduleId) {
    return NextResponse.json(
      { error: "Missing title, bankId, or moduleId" },
      { status: 400 }
    );
  }

  // module must belong to course
  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { id: true, courseId: true, order: true },
  });
  if (!mod || mod.courseId !== courseId) {
    return NextResponse.json({ error: "Invalid moduleId for this course" }, { status: 400 });
  }

  // bank must be ASSESSMENT
  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    select: { type: true, name: true },
  });
  if (!bank || bank.type !== "ASSESSMENT") {
    return NextResponse.json({ error: "Selected bank is not an Assessment bank" }, { status: 400 });
  }

  // One ASSESSMENT per module enforced by @@unique([moduleId, type])
  const evaluation = await prisma.evaluation.upsert({
    where: { moduleId_type: { moduleId, type: EvaluationType.ASSESSMENT } },
    update: {
      title,
      bankId,
      ...(Number.isFinite(questionCount) ? { questionCount } : {}),
      ...(Number.isFinite(passMarkPct) ? { passMarkPct } : {}),
      ...(randomize !== undefined ? { randomize } : {}),
    },
    create: {
      type: EvaluationType.ASSESSMENT,
      title,
      bankId,
      courseId,
      moduleId,
      questionCount: Number.isFinite(questionCount) ? questionCount : 10,
      passMarkPct: Number.isFinite(passMarkPct) ? passMarkPct : 70,
      randomize: randomize ?? true,
    },
    select: { id: true, title: true, type: true, createdAt: true, moduleId: true, bankId: true },
  });

  return NextResponse.json(evaluation);
}