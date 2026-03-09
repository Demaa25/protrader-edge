// src/app/api/lms/assessments/[assessmentId]/attempt/[attemptId]/answer/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AttemptStatus } from "@prisma/client";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ assessmentId: string; attemptId: string }> }
) {
  try {
    const { assessmentId, attemptId } = await ctx.params;

    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as { questionId?: string; optionId?: string };
    const questionId = body.questionId?.trim();
    const optionId = body.optionId?.trim();
    if (!questionId || !optionId) {
      return NextResponse.json({ error: "questionId and optionId are required" }, { status: 400 });
    }

    const attempt = await prisma.evaluationAttempt.findUnique({
      where: { id: attemptId },
      select: { id: true, userId: true, status: true, evaluationId: true, evaluation: { select: { passMarkPct: true } } },
    });

    if (!attempt || attempt.userId !== userId || attempt.evaluationId !== assessmentId) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    if (attempt.status === AttemptStatus.SUBMITTED) {
      return NextResponse.json({ error: "Attempt already submitted" }, { status: 400 });
    }

    const aq = await prisma.attemptQuestion.findUnique({
      where: { attemptId_questionId: { attemptId, questionId } },
      select: { id: true },
    });
    if (!aq) return NextResponse.json({ error: "Question is not part of this attempt" }, { status: 400 });

    const option = await prisma.bankOption.findFirst({
      where: { id: optionId, questionId },
      select: { isCorrect: true },
    });
    if (!option) return NextResponse.json({ error: "Invalid option for this question" }, { status: 400 });

    const correctOption = await prisma.bankOption.findFirst({
      where: { questionId, isCorrect: true },
      select: { explanation: true },
    });

    const isCorrect = option.isCorrect === true;
    const explanation = correctOption?.explanation ?? null;

    await prisma.attemptAnswer.upsert({
      where: { attemptQuestionId: aq.id },
      update: { selectedOptionId: optionId, isCorrect, answeredAt: new Date() },
      create: { attemptQuestionId: aq.id, selectedOptionId: optionId, isCorrect },
    });

    const totalQuestions = await prisma.attemptQuestion.count({ where: { attemptId } });
    const answeredCount = await prisma.attemptAnswer.count({ where: { attemptQuestion: { attemptId } } });
    const correctCount = await prisma.attemptAnswer.count({ where: { isCorrect: true, attemptQuestion: { attemptId } } });

    const finished = answeredCount >= totalQuestions;
    const scorePct = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePct >= (attempt.evaluation.passMarkPct ?? 70);

    await prisma.evaluationAttempt.update({
      where: { id: attemptId },
      data: {
        correctCount,
        totalQuestions,
        scorePct,
        passed,
        status: finished ? AttemptStatus.SUBMITTED : AttemptStatus.IN_PROGRESS,
        submittedAt: finished ? new Date() : null,
      },
    });

    return NextResponse.json({
      correct: isCorrect,
      explanation,
      score: correctCount,
      totalQuestions,
      finished,
      nextQuestionId: null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error", details: String(e?.message || e) }, { status: 500 });
  }
}