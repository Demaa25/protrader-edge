// src/app/api/admin/courses/[courseId]/route.ts
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

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as null | {
    title?: string;
    category?: string;
  };

  const data: { title?: string; category?: string } = {};
  if (typeof body?.title === "string") data.title = body.title.trim();
  if (typeof body?.category === "string") data.category = body.category.trim();

  const updated = await prisma.course.update({
    where: { id: params.courseId },
    data,
    select: { id: true, title: true, category: true },
  });

  return NextResponse.json({ course: updated });
}
