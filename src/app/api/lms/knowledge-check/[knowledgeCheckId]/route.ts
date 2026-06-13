// src/app/api/lms/knowledge-check/[knowledgeCheckId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EvaluationType } from "@prisma/client";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ knowledgeCheckId: string }> }
) {
  const session = await getSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { knowledgeCheckId } = await ctx.params;

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: knowledgeCheckId },
    include: {
      course: { select: { title: true } },
    },
  });

  if (!evaluation)
    return NextResponse.json({ error: "Knowledge check not found" }, { status: 404 });

  if (evaluation.type !== EvaluationType.KNOWLEDGE_CHECK)
    return NextResponse.json({ error: "Not a knowledge check" }, { status: 400 });

  return NextResponse.json({
    id: evaluation.id,
    title: evaluation.title,
    courseTitle: evaluation.course.title,
    questionCount: evaluation.questionCount,
    passMarkPct: evaluation.passMarkPct,
  });
}