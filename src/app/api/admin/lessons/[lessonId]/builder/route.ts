// src/app/api/admin/lessons/[lessonId]/builder/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: {
    params: Promise<{
      lessonId: string;
    }>;
  }
) {
  const { lessonId } =
    await ctx.params;

  const lesson =
    await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },

      include: {
        module: true,

        application: true,

        evaluations: {
          where: {
            type:
              "KNOWLEDGE_CHECK",
          },
        },
      },
    });

  if (!lesson) {
    return NextResponse.json(
      {
        error: "Lesson not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    lesson: {
      id: lesson.id,

      title: lesson.title,

      order: lesson.order,
    },

    module: {
      id: lesson.module.id,

      title: lesson.module.title,

      order: lesson.module.order,
    },

    application:
      lesson.application ??
      null,

    knowledgeCheck:
      lesson.evaluations?.[0] ??
      null,
  });
}