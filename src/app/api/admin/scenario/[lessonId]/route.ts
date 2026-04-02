// src/app/api/admin/scenario/[lessonId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await ctx.params;

  const form = await req.formData();

  const title = form.get("title") as string;
  const instruction = form.get("instruction") as string;
  const description = form.get("description") as string;
  const level = form.get("level") as string;

  let chartImageUrl: string | undefined;

  const file = form.get("chart") as File | null;

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename =
      Date.now() + "-" + file.name;

    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await fs.mkdir(uploadsDir, {
      recursive: true,
    });

    const filePath = path.join(
      uploadsDir,
      filename
    );

    await fs.writeFile(filePath, buffer);

    chartImageUrl = `/uploads/${filename}`;
  }

  const scenario =
    await prisma.scenario.upsert({
      where: { lessonId },
      update: {
        title,
        instruction,
        description,
        level: level as any,
        chartImageUrl,
      },
      create: {
        lessonId,
        title,
        instruction,
        description,
        level: level as any,
        chartImageUrl,
      },
    });

  return NextResponse.json({ scenario });
}