// src/app/api/admin/lessons/[lessonId]/materials/[materialId]/route.ts
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

export async function PATCH(req: Request, ctx: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await ctx.params;

  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = body?.title !== undefined ? String(body.title).trim() : undefined;
  const url = body?.url !== undefined ? String(body.url).trim() : undefined;
  const order = body?.order !== undefined ? Number(body.order) : undefined;

  const type =
    body?.type !== undefined ? String(body.type).toUpperCase().trim() : undefined;

  if (type && !["VIDEO", "DOCUMENT"].includes(type)) {
    return NextResponse.json({ error: "type must be VIDEO | DOCUMENT" }, { status: 400 });
  }

  const updated = await prisma.lessonMaterial.update({
    where: { id: materialId },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(url !== undefined ? { url } : {}),
      ...(Number.isFinite(order as number) ? { order: order as number } : {}),
      ...(type !== undefined ? { type: type as any } : {}),
    },
    select: { id: true, type: true, title: true, url: true, order: true },
  });

  return NextResponse.json({ material: updated });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await ctx.params;

  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.lessonMaterial.delete({ where: { id: materialId } });
  return NextResponse.json({ ok: true });
}