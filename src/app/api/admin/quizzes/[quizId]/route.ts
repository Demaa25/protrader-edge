// src/app/api/admin/quizzes/[quizId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { EvaluationType } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "ADMIN") return null;
  return session;
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ quizId: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId } = await ctx.params;

  const evalRow = await prisma.evaluation.findUnique({
    where: { id: quizId },
    select: { id: true, type: true },
  });

  if (!evalRow || evalRow.type !== EvaluationType.QUIZ) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // Cascades:
  // Evaluation -> EvaluationAttempt -> AttemptQuestion -> AttemptAnswer
  await prisma.evaluation.delete({ where: { id: quizId } });

  return NextResponse.json({ ok: true });
}