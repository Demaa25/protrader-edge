// src /app/api/admin/modules/[moduleId]/lessons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

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
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as null | { title?: string };
  const title = (body?.title ?? "").trim() || "New Lesson";

  // Lesson.order is required -> auto increment
  const last = await prisma.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const lesson = await prisma.lesson.create({
    data: {
      moduleId,
      title,
      order: (last?.order ?? 0) + 1,
    },
    select: { id: true, title: true, order: true, createdAt: true },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
