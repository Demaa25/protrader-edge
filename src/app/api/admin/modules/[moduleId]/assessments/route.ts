// src/app/api/admin/modules/[moduleId]/assessment/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { EvaluationType, BankType } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session?.user || role !== "ADMIN") return null;
  return session;
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await ctx.params;

  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const title = (body?.title ?? "Module Assessment").trim();
  const questionCount = Number(body?.questionCount ?? 30);

  // Find module to get courseId
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { courseId: true },
  });

  if (!module) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  // Get assessment question bank
  const bank = await prisma.questionBank.findFirst({
    where: {
      type: BankType.ASSESSMENT,
    },
  });

  if (!bank) {
    return NextResponse.json(
      { error: "No ASSESSMENT question bank found" },
      { status: 400 }
    );
  }

  const evaluation = await prisma.evaluation.create({
    data: {
      type: EvaluationType.ASSESSMENT,
      title,
      bankId: bank.id,

      courseId: module.courseId,
      moduleId,

      questionCount,
      passMarkPct: 70,
      randomize: true,
    },
  });

  return NextResponse.json({ evaluation }, { status: 201 });
}