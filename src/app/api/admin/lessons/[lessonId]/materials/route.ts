// src/app/api/admin/lessons/[lessonId]/materials/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { parseLessonDocument } from "@/lib/lesson-parser";

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

export async function POST(
  req: Request,
  ctx: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await ctx.params;

  const session = await requireAdmin();
  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = form.get("file");
  const title = String(form.get("title") || "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File required" },
      { status: 400 }
    );
  }

  // save file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fs = await import("fs/promises");
  const path = await import("path");

  const uploadsDir = path.join(
    process.cwd(),
    "public",
    "uploads"
  );

  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadsDir, filename);

  await fs.writeFile(filepath, buffer);

  const url = `/uploads/${filename}`;

  const last = await prisma.lessonMaterial.findFirst({
    where: { lessonId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const created = await prisma.lessonMaterial.create({
    data: {
      lessonId,
      type: "DOCUMENT",
      title: title || file.name,
      url,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      order: (last?.order ?? 0) + 1,
    },
  });

  // parse document
const fullPath = path.join(
  process.cwd(),
  "public",
  url
);

const blocks = await parseLessonDocument(fullPath);

// remove old blocks
await prisma.lessonBlock.deleteMany({
  where: { lessonId },
});

// create new blocks
await prisma.lessonBlock.createMany({
  data: blocks.map((b, i) => ({
    lessonId,
    type: b.type,
    content: b.content ?? null,
    imageUrl: b.imageUrl ?? null,
    order: i + 1,
  })),
});

  return NextResponse.json({ material: created });
}