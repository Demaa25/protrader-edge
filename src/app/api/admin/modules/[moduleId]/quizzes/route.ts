// src/app/api/admin/modules/[moduleId]/quizzes/route.ts
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
  const title = String(body?.title ?? "").trim();
  const lessonId = String(body?.lessonId ?? "").trim();
  const bankId = String(body?.bankId ?? "").trim();

  if (!title || !lessonId || !bankId) {
    return NextResponse.json(
      { error: "title, lessonId and bankId required" },
      { status: 400 }
    );
  }

  const created = await prisma.evaluation.create({
    data: {
      type: EvaluationType.QUIZ,
      title,
      bankId,
      lessonId,
      moduleId,
      courseId: (
        await prisma.module.findUnique({
          where: { id: moduleId },
          select: { courseId: true },
        })
      )?.courseId!,
    },
    select: { id: true, title: true, createdAt: true },
  });

  return NextResponse.json({ quiz: created }, { status: 201 });
}