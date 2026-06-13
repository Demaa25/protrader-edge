// src/app/api/admin/courses/[courseId]/thumbnail/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import fs from "fs";

import path from "path";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      courseId: string;
    }>;
  }
) {
  try {
    const { courseId } =
      await params;

    // =========================
    // FORM DATA
    // =========================

    const formData =
      await req.formData();

    const file =
      formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          error:
            "No valid file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // FILE BUFFER
    // =========================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // =========================
    // SAFE FILE NAME
    // =========================

    const originalName =
      (file as File).name ||
      "thumbnail";

    const safeName =
      originalName.replace(
        /\s+/g,
        "-"
      );

    const fileName = `${Date.now()}-${safeName}`;

    // =========================
    // UPLOAD DIRECTORY
    // =========================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    // =========================
    // SAVE FILE
    // =========================

    const filePath = path.join(
      uploadDir,
      fileName
    );

    fs.writeFileSync(
      filePath,
      buffer
    );

    // =========================
    // PUBLIC URL
    // =========================

    const url = `/uploads/${fileName}`;

    // =========================
    // UPDATE DATABASE
    // =========================

    await prisma.course.update({
      where: {
        id: courseId,
      },

      data: {
        thumbnailUrl: url,
      },
    });

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (e: any) {
    console.error(
      "THUMBNAIL_UPLOAD_ERROR",
      e
    );

    return NextResponse.json(
      {
        error:
          e?.message ||
          "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}