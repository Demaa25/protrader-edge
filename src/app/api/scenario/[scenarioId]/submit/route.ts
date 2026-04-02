// src/app/api/scenario/[scenarioId]/submit/route.ts
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ scenarioId: string }> }
) {
  const { scenarioId } = await ctx.params;

  const session = await getSession();
  if (!session?.user)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  const body = await req.json();

  const {
    structure,
    liquidity,
    risk,
    invalidation,
    failure,
  } = body;

  let passed = true;
  let feedback: string[] = [];

  if (!structure)
    feedback.push(
      "Define market structure first."
    );

  if (!liquidity)
    feedback.push(
      "Identify liquidity location."
    );

  if (!risk)
    feedback.push(
      "Define the main risk."
    );

  if (!invalidation)
    feedback.push(
      "Explain invalidation logic."
    );

  if (!failure)
    feedback.push(
      "Describe failure condition."
    );

  if (feedback.length > 0) passed = false;

  await prisma.scenarioSubmission.create({
    data: {
      scenarioId,
      userId: session.user.id,
      structure,
      liquidity,
      risk,
      invalidation,
      failure,
      passed,
      feedback: feedback.join("\n"),
    },
  });

  return NextResponse.json({
    passed,
    feedback:
      feedback.length === 0
        ? "Your reasoning is acceptable. You may proceed."
        : feedback.join("\n"),
  });
}