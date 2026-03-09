// src/app/api/admin/modules/[moduleId]/lessons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await ctx.params;

  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = String(body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Lesson title is required" }, { status: 400 });

  const last = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const lesson = await prisma.lesson.create({
    data: { moduleId, title, order: (last?.order ?? 0) + 1 },
    select: { id: true, title: true, order: true, createdAt: true },
  });

  return NextResponse.json({ lesson });
}
