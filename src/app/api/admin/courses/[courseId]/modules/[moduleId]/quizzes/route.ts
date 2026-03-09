// src/app/api/admin/courses/[courseId]/modules/[moduleId]/quizzes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { EvaluationType } from "@prisma/client";

export async function POST(req: Request, ctx: { params: Promise<{ moduleId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-expect-error custom field exists
  const role = (session.user as any)?.role as string | undefined;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { moduleId } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const title = String(body?.title ?? "").trim();
  const lessonId = String(body?.lessonId ?? "").trim();
  const bankId = String(body?.bankId ?? "").trim();

  const questionCount = body.questionCount !== undefined ? Number(body.questionCount) : undefined;
  const passMarkPct = body.passMarkPct !== undefined ? Number(body.passMarkPct) : undefined;
  const randomize = body.randomize !== undefined ? Boolean(body.randomize) : undefined;

  if (!title || !lessonId || !bankId) {
    return NextResponse.json(
      { error: "Missing title, lessonId, or bankId" },
      { status: 400 }
    );
  }

  // Validate lesson belongs to module and get courseId
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, moduleId: true, order: true, module: { select: { courseId: true } } },
  });

  if (!lesson || lesson.moduleId !== moduleId) {
    return NextResponse.json({ error: "Invalid lessonId for this module" }, { status: 400 });
  }

  // Bank must be QUIZ
  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    select: { type: true },
  });
  if (!bank || bank.type !== "QUIZ") {
    return NextResponse.json({ error: "Selected bank is not a Quiz bank" }, { status: 400 });
  }

  // One QUIZ per lesson enforced by @@unique([lessonId, type])
  const evaluation = await prisma.evaluation.upsert({
    where: { lessonId_type: { lessonId, type: EvaluationType.QUIZ } },
    update: {
      title,
      bankId,
      courseId: lesson.module.courseId,
      moduleId,
      ...(Number.isFinite(questionCount) ? { questionCount } : {}),
      ...(Number.isFinite(passMarkPct) ? { passMarkPct } : {}),
      ...(randomize !== undefined ? { randomize } : {}),
    },
    create: {
      type: EvaluationType.QUIZ,
      title,
      bankId,
      courseId: lesson.module.courseId,
      moduleId,
      lessonId,
      questionCount: Number.isFinite(questionCount) ? questionCount : 10,
      passMarkPct: Number.isFinite(passMarkPct) ? passMarkPct : 70,
      randomize: randomize ?? true,
    },
    select: { id: true, title: true, type: true, createdAt: true, lessonId: true, bankId: true },
  });

  return NextResponse.json({ quiz: evaluation }, { status: 201 });
}