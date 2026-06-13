// src/app/api/admin/lessons/[lessonId]/video/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

import fs from "fs/promises";
import path from "path";

export async function POST(
  req: Request,
  ctx: {
    params: Promise<{
      lessonId: string;
    }>;
  }
) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = (session.user as any)?.role;

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { lessonId } = await ctx.params;

    const formData = await req.formData();

    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No video uploaded" },
        { status: 400 }
      );
    }

    // ✅ validate type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid video format" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ create uploads folder
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "videos"
    );

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    // ✅ unique filename
    const safeName = file.name.replace(/\s+/g, "-");

    const fileName = `${Date.now()}-${safeName}`;

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await fs.writeFile(filePath, buffer);

    const url = `/uploads/videos/${fileName}`;

    // ✅ determine next order
    const last = await prisma.lessonMaterial.findFirst({
      where: {
        lessonId,
      },

      orderBy: {
        order: "desc",
      },

      select: {
        order: true,
      },
    });

    // ✅ create DB record
    const material =
      await prisma.lessonMaterial.create({
        data: {
          lessonId,

          type: "VIDEO",

          title: file.name,

          url,

          order: (last?.order ?? 0) + 1,

          fileName: file.name,

          mimeType: file.type,

          sizeBytes: file.size,
        },
      });

    return NextResponse.json({
      success: true,
      material,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Upload failed",
        details: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}