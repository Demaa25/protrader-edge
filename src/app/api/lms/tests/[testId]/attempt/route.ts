// src/app/api/lms/tests/[testId]/attempt/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AttemptStatus, EvaluationType } from "@prisma/client";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEST_DURATION_SEC = 60 * 60; // 1 hour

export async function POST(req: Request, ctx: { params: Promise<{ testId: string }> }) {
  try {
    const { testId } = await ctx.params;

    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const evaluation = await prisma.evaluation.findUnique({
      where: { id: testId },
      select: {
        id: true,
        type: true,
        title: true,
        questionCount: true,
        passMarkPct: true,
        randomize: true,
        bankId: true,
        course: { select: { title: true } },
      },
    });

    if (!evaluation || evaluation.type !== EvaluationType.TEST) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const bankQuestions = await prisma.bankQuestion.findMany({
      where: { bankId: evaluation.bankId },
      select: {
        id: true,
        prompt: true,
        options: { orderBy: { label: "asc" }, select: { id: true, text: true, label: true } },
      },
    });

    if (bankQuestions.length === 0) {
      return NextResponse.json({ error: "No questions found for this test bank." }, { status: 400 });
    }

    const desiredCount = Math.max(1, Math.min(evaluation.questionCount ?? 30, bankQuestions.length));
    const picked = evaluation.randomize ? shuffle(bankQuestions).slice(0, desiredCount) : bankQuestions.slice(0, desiredCount);

    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.evaluationAttempt.create({
        data: {
          evaluationId: evaluation.id,
          userId,
          status: AttemptStatus.IN_PROGRESS,
          totalQuestions: picked.length,
        },
        select: { id: true, startedAt: true },
      });

      await tx.attemptQuestion.createMany({
        data: picked.map((q, idx) => ({
          attemptId: attempt.id,
          questionId: q.id,
          order: idx + 1,
        })),
      });

      return { attemptId: attempt.id, startedAt: attempt.startedAt };
    });

    return NextResponse.json({
      attemptId: result.attemptId,
      startedAt: result.startedAt.toISOString(),
      durationSec: TEST_DURATION_SEC,
      evaluation: {
        id: evaluation.id,
        title: evaluation.title,
        courseTitle: evaluation.course.title,
        passMarkPct: evaluation.passMarkPct,
      },
      questions: picked.map((q, idx) => ({
        id: q.id,
        prompt: q.prompt,
        order: idx + 1,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error", details: String(e?.message || e) }, { status: 500 });
  }
}