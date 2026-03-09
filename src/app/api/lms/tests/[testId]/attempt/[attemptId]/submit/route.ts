// src/app/api/lms/tests/[testId]/attempt/[attemptId]/submit/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getSession } from "@/lib/session";

import { AttemptStatus } from "@prisma/client";

export async function POST(

  _req: Request,

  ctx: { params: Promise<{ testId: string; attemptId: string }> }

) {

  try {

    const { testId, attemptId } = await ctx.params;

    const session = await getSession();

    if (!session?.user) {

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    }

    const userId = (session.user as any)?.id as string | undefined;

    if (!userId) {

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    }

    const attempt = await prisma.evaluationAttempt.findUnique({

      where: { id: attemptId },

      select: {

        id: true,

        userId: true,

        status: true,

        evaluationId: true,

        correctCount: true,

        totalQuestions: true,

        evaluation: {

          select: {

            passMarkPct: true,

          },

        },

      },

    });

    if (!attempt || attempt.userId !== userId || attempt.evaluationId !== testId) {

      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });

    }

    if (attempt.status === AttemptStatus.SUBMITTED) {

      return NextResponse.json({

        score: attempt.correctCount,

        totalQuestions: attempt.totalQuestions,

        finished: true,

      });

    }

    const totalQuestions = await prisma.attemptQuestion.count({

      where: { attemptId },

    });

    const correctCount = await prisma.attemptAnswer.count({

      where: {

        isCorrect: true,

        attemptQuestion: { attemptId },

      },

    });

    const scorePct =

      totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

    const passed = scorePct >= (attempt.evaluation.passMarkPct ?? 70);

    const updated = await prisma.evaluationAttempt.update({

      where: { id: attemptId },

      data: {

        correctCount,

        totalQuestions,

        scorePct,

        passed,

        status: AttemptStatus.SUBMITTED,

        submittedAt: new Date(),

      },

      select: {

        correctCount: true,

        totalQuestions: true,

      },

    });

    return NextResponse.json({

      score: updated.correctCount,

      totalQuestions: updated.totalQuestions,

      finished: true,

    });

  } catch (e: any) {

    return NextResponse.json(

      { error: "Server error", details: String(e?.message || e) },

      { status: 500 }

    );

  }

}
 