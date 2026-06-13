// src/app/api/lms/knowledge-check/[knowledgeCheckId]/attempt/route.ts
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ knowledgeCheckId: string }> }
) {
  const { knowledgeCheckId } = await params;

  const session = await getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: knowledgeCheckId },
    include: {
      course: { select: { title: true } },
    },
  });

  if (!evaluation || evaluation.type !== EvaluationType.KNOWLEDGE_CHECK)
    return NextResponse.json({ error: "Knowledge check not found" }, { status: 404 });

  // 🚨 IMPORTANT: Knowledge Check happens AFTER lesson video
  // so NO strict gate like quiz

  const bankQuestions = await prisma.bankQuestion.findMany({
    where: { bankId: evaluation.bankId },
    include: {
      options: { orderBy: { label: "asc" } },
    },
  });

  const picked = evaluation.randomize
    ? shuffle(bankQuestions).slice(0, evaluation.questionCount)
    : bankQuestions.slice(0, evaluation.questionCount);

  const attempt = await prisma.evaluationAttempt.create({
    data: {
      evaluationId: evaluation.id,
      userId,
      status: AttemptStatus.IN_PROGRESS,
      totalQuestions: picked.length,
    },
  });

  await prisma.attemptQuestion.createMany({
    data: picked.map((q, i) => ({
      attemptId: attempt.id,
      questionId: q.id,
      order: i + 1,
    })),
  });

  return NextResponse.json({
    attemptId: attempt.id,
    evaluation: {
      id: evaluation.id,
      title: evaluation.title,
      courseTitle: evaluation.course.title,
      passMarkPct: evaluation.passMarkPct,
      continueHref: `/application/${evaluation.lessonId}`, // 🔥 KEY FLOW
    },
    questions: picked.map((q, i) => ({
      id: q.id,
      prompt: q.prompt,
      order: i + 1,
      options: q.options.map((o) => ({
        id: o.id,
        text: o.text,
      })),
    })),
  });
}