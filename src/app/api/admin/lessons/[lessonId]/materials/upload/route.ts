// src/app/api/admin/lessons/[lessonId]/materials/upload/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { LessonMaterialType } from "@prisma/client";

export async function POST(req: Request, ctx: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await ctx.params;

  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // @ts-expect-error
  const role = (session.user as any)?.role as string | undefined;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  const title = String(form.get("title") ?? "").trim();

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "file is required" }, { status: 400 });

  // Basic validation
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const ext = ".pdf";
  const safeName = crypto.randomBytes(12).toString("hex") + ext;

  const dir = path.join(process.cwd(), "uploads", "pdfs", lessonId);
  await fs.mkdir(dir, { recursive: true });

  const fullPath = path.join(dir, safeName);
  await fs.writeFile(fullPath, bytes);

  // Put new items at end
  const last = await prisma.lessonMaterial.findFirst({
    where: { lessonId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  // Store a protected URL (NOT /public)
  const url = `/api/lms/materials/pdf/${lessonId}/${safeName}`;

  const created = await prisma.lessonMaterial.create({
    data: {
      lessonId,
      type: LessonMaterialType.DOCUMENT,
      title,
      url,
      order: (last?.order ?? 0) + 1,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: bytes.length,
    },
    select: { id: true, type: true, title: true, url: true, order: true },
  });

  return NextResponse.json({ material: created }, { status: 201 });
}