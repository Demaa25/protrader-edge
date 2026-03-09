// src/app/api/admin/lessons/[lessonId]/quizzes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { EvaluationType } from "@prisma/client";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ lessonId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  
  const role = (session.user as any)?.role as string | undefined;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { lessonId } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const title = String(body?.title ?? "").trim();
  const bankId = String(body?.bankId ?? "").trim();

  const questionCount = body?.questionCount !== undefined ? Number(body.questionCount) : undefined;
  const passMarkPct = body?.passMarkPct !== undefined ? Number(body.passMarkPct) : undefined;
  const randomize = body?.randomize !== undefined ? Boolean(body.randomize) : undefined;

  if (!title || !bankId) {
    return NextResponse.json({ error: "Missing title or bankId" }, { status: 400 });
  }

  // lesson -> moduleId + courseId
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      moduleId: true,
      module: { select: { courseId: true } },
    },
  });

  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  // bank must be QUIZ
  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    select: { type: true },
  });

  if (!bank || bank.type !== "QUIZ") {
    return NextResponse.json({ error: "Selected bank is not a Quiz bank" }, { status: 400 });
  }

  // IMPORTANT: your schema has @@unique([lessonId, type]) so upsert by lessonId_type is correct.
  const quiz = await prisma.evaluation.upsert({
    where: { lessonId_type: { lessonId, type: EvaluationType.QUIZ } },
    update: {
      title,
      bankId,
      courseId: lesson.module.courseId,
      moduleId: lesson.moduleId,
      ...(Number.isFinite(questionCount as number) ? { questionCount: questionCount as number } : {}),
      ...(Number.isFinite(passMarkPct as number) ? { passMarkPct: passMarkPct as number } : {}),
      ...(randomize !== undefined ? { randomize } : {}),
    },
    create: {
      type: EvaluationType.QUIZ,
      title,
      bankId,
      courseId: lesson.module.courseId,
      moduleId: lesson.moduleId,
      lessonId,
      questionCount: Number.isFinite(questionCount as number) ? (questionCount as number) : 10,
      passMarkPct: Number.isFinite(passMarkPct as number) ? (passMarkPct as number) : 70,
      randomize: randomize ?? true,
    },
    select: {
      id: true,
      title: true,
      type: true,
      bankId: true,
      questionCount: true,
      passMarkPct: true,
      randomize: true,
      createdAt: true,
      lessonId: true,
    },
  });

  return NextResponse.json({ quiz }, { status: 201 });
}