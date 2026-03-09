// src/app/api/admin/lessons/[lessonId]/materials/route.ts
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

export async function GET(_req: Request, ctx: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await ctx.params;

  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const materials = await prisma.lessonMaterial.findMany({
    where: { lessonId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      type: true,
      title: true,
      url: true,
      order: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
    },
  });

  return NextResponse.json({ materials });
}

export async function POST(req: Request, ctx: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await ctx.params;

  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const type = String(body?.type || "").toUpperCase();
  const title = String(body?.title || "").trim();
  const url = String(body?.url || "").trim();

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (!url) return NextResponse.json({ error: "url is required" }, { status: 400 });
  if (!["VIDEO", "DOCUMENT"].includes(type))
    return NextResponse.json({ error: "type must be VIDEO | DOCUMENT" }, { status: 400 });

  // Put new items at the end by default
  const last = await prisma.lessonMaterial.findFirst({
    where: { lessonId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const created = await prisma.lessonMaterial.create({
    data: {
      lessonId,
      type: type as any,
      title,
      url,
      order: (last?.order ?? 0) + 1,
    },
    select: { id: true, type: true, title: true, url: true, order: true },
  });

  return NextResponse.json({ material: created });
}