// src/app/api/lms/quizzes/[quizId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ quizId: string }> }
) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId } = await ctx.params;

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      type: true,
      title: true,
      questionCount: true,
      passMarkPct: true,
      randomize: true,
      course: { select: { title: true } },
    },
  });

  if (!evaluation) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  if (evaluation.type !== "QUIZ") return NextResponse.json({ error: "Not a quiz" }, { status: 400 });

  return NextResponse.json({
    id: evaluation.id,
    title: evaluation.title,
    courseTitle: evaluation.course.title,
    questionCount: evaluation.questionCount,
    passMarkPct: evaluation.passMarkPct,
  });
}