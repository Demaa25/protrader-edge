// src/app/api/admin/courses/[courseId]/objectives/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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

    const body =
      await req.json();

    await prisma.course.update({
      where: {
        id: courseId,
      },

      data: {
        objectives:
          body.objectives,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error:
          e?.message ||
          "Failed",
      },
      {
        status: 500,
      }
    );
  }
}