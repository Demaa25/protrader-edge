// src/app/api/admin/modules/[moduleId]/route.ts
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

export async function DELETE(_req: Request, ctx: { params: Promise<{ moduleId: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { moduleId } = await ctx.params;

  await prisma.$transaction(async (tx) => {
    // Find lesson ids first
    const lessons = await tx.lesson.findMany({
      where: { moduleId },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    // Delete evaluations attached to lessons (QUIZ) and module (ASSESSMENT)
    // (Deleting evaluations cascades attempts + answers)
    if (lessonIds.length) {
      await tx.evaluation.deleteMany({ where: { lessonId: { in: lessonIds } } });
    }
    await tx.evaluation.deleteMany({ where: { moduleId } });

    // Delete lessons then module (lesson has onDelete Cascade for materials/progress)
    await tx.lesson.deleteMany({ where: { moduleId } });
    await tx.module.delete({ where: { id: moduleId } });
  });

  return NextResponse.json({ ok: true });
}