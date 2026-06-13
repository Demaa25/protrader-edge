// src/app/api/lms/knowledge-check/[knowledgeCheckId]/attempt/[attemptId]/answer/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AttemptStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ knowledgeCheckId: string; attemptId: string }> }
) {
  const { knowledgeCheckId, attemptId } = await params;

  const session = await getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const { questionId, optionId } = await req.json();

  const attempt = await prisma.evaluationAttempt.findUnique({
    where: { id: attemptId },
    include: { evaluation: true },
  });

  if (!attempt || attempt.userId !== userId || attempt.evaluationId !== knowledgeCheckId)
    return NextResponse.json({ error: "Invalid attempt" }, { status: 400 });

  const aq = await prisma.attemptQuestion.findUnique({
    where: { attemptId_questionId: { attemptId, questionId } },
  });

  const option = await prisma.bankOption.findFirst({
    where: { id: optionId, questionId },
  });

  const isCorrect = option?.isCorrect === true;

  await prisma.attemptAnswer.upsert({
    where: { attemptQuestionId: aq!.id },
    update: {
      selectedOptionId: optionId,
      isCorrect,
    },
    create: {
      attemptQuestionId: aq!.id,
      selectedOptionId: optionId,
      isCorrect,
    },
  });

  const total = await prisma.attemptQuestion.count({ where: { attemptId } });
  const correct = await prisma.attemptAnswer.count({
    where: { isCorrect: true, attemptQuestion: { attemptId } },
  });

  const finished = await prisma.attemptAnswer.count({
    where: { attemptQuestion: { attemptId } },
  }) >= total;

  const scorePct = Math.round((correct / total) * 100);
  const passed = scorePct >= attempt.evaluation.passMarkPct;

  await prisma.evaluationAttempt.update({
    where: { id: attemptId },
    data: {
      correctCount: correct,
      totalQuestions: total,
      scorePct,
      passed,
      status: finished ? AttemptStatus.SUBMITTED : AttemptStatus.IN_PROGRESS,
    },
  });

  return NextResponse.json({
    correct: isCorrect,
    explanation: null,
    score: correct,
    totalQuestions: total,
    finished,
  });
}