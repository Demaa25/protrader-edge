// src/app/api/admin/lessons/[lessonId]/knowledge-check/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  EvaluationType,
  BankType,
} from "@prisma/client";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      lessonId: string;
    }>;
  }
) {
  try {
    const { lessonId } =
      await params;

    // =========================
    // AUTH
    // =========================

    const session =
      await getSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // LESSON
    // =========================

    const lesson =
      await prisma.lesson.findUnique({
        where: {
          id: lessonId,
        },

        select: {
          id: true,

          module: {
            select: {
              courseId: true,
            },
          },
        },
      });

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "Lesson not found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // BODY
    // =========================

    const body =
      await req.json();

    const title = String(
      body?.title ?? ""
    ).trim();

    const bankId = String(
      body?.bankId ?? ""
    ).trim();

    const questionCount =
      Number(
        body?.questionCount ?? 5
      );

    const passMarkPct =
      Number(
        body?.passMarkPct ?? 70
      );

    // =========================
    // VALIDATION
    // =========================

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Title required",
        },
        {
          status: 400,
        }
      );
    }

    if (!bankId) {
      return NextResponse.json(
        {
          error:
            "Question bank required",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // VERIFY BANK EXISTS
    // =========================

    const bank =
      await prisma.questionBank.findFirst(
        {
          where: {
            id: bankId,

            type:
              BankType.KNOWLEDGE_CHECK,
          },
        }
      );

    if (!bank) {
      return NextResponse.json(
        {
          error:
            "Invalid question bank",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // CREATE OR UPDATE
    // =========================

    const evaluation =
      await prisma.evaluation.upsert(
        {
          where: {
            lessonId_type: {
              lessonId,

              type:
                EvaluationType.KNOWLEDGE_CHECK,
            },
          },

          update: {
            title,

            bankId,

            questionCount,

            passMarkPct,
          },

          create: {
            title,

            type:
              EvaluationType.KNOWLEDGE_CHECK,

            lessonId,

            courseId:
              lesson.module
                .courseId,

            bankId,

            questionCount,

            passMarkPct,

            randomize: true,
          },
        }
      );

    return NextResponse.json({
      evaluation,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error:
          "Server error",

        details: String(
          e?.message || e
        ),
      },
      {
        status: 500,
      }
    );
  }
}