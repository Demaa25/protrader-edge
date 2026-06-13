// src/app/api/application/[applicationId]/submit/route.ts
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function weak(text: string) {
  return !text || text.trim().length < 40;
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((k) => text.includes(k));
}

// ===== VALIDATORS ===== //

function validateStructure(text: string) {
  const t = normalize(text);

  const behavior = [
    "trend",
    "trending",
    "range",
    "ranging",
    "active",
    "movement",
    "moving",
    "direction",
    "no clear",
  ];

  const theory = [
    "buyers and sellers",
    "price is formed",
    "market is",
    "order matching",
  ];

  const hasBehavior = includesAny(t, behavior);
  const isTheory = includesAny(t, theory);

  if (weak(text)) {
    return "Structure is too short.";
  }

  if (!hasBehavior) {
    return "Describe how price is behaving (e.g. trending, ranging, active).";
  }

  if (isTheory && !hasBehavior) {
    return "You explained market theory instead of describing price behavior.";
  }

  return null;
}

function validateLiquidity(text: string) {
  const t = normalize(text);

  const keywords = [
    "liquidity",
    "orders",
    "buy",
    "sell",
    "participants",
    "transactions",
  ];

  if (weak(text)) {
    return "Liquidity explanation is too short.";
  }

  if (!includesAny(t, keywords)) {
    return "Explain where liquidity comes from (orders, participants, transactions).";
  }

  return null;
}

function validateRisk(text: string) {
  const t = normalize(text);

  const keywords = [
    "risk",
    "misinterpret",
    "uncertain",
    "not guaranteed",
    "assumption",
  ];

  if (weak(text)) {
    return "Risk explanation is too short.";
  }

  if (!includesAny(t, keywords)) {
    return "Define a clear analytical risk (not prediction).";
  }

  return null;
}

function validateInvalidation(text: string) {
  const t = normalize(text);

  const keywords = [
    "invalid",
    "if",
    "break",
    "no longer",
    "contradict",
  ];

  if (weak(text)) {
    return "Invalidation is too short.";
  }

  if (!includesAny(t, keywords)) {
    return "Explain what condition makes your idea invalid.";
  }

  return null;
}

function validateFailure(text: string) {
  const t = normalize(text);

  const keywords = [
    "fail",
    "wrong",
    "incorrect",
    "misinterpret",
  ];

  if (weak(text)) {
    return "Failure condition is too short.";
  }

  if (!includesAny(t, keywords)) {
    return "Explain what mistake would make your analysis wrong.";
  }

  return null;
}

// ===== MAIN HANDLER ===== //

export async function POST(
  req: Request,
  ctx: { params: Promise<{ applicationId: string }> }
) {
  const { applicationId } = await ctx.params;

  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const {
    structure = "",
    liquidity = "",
    risk = "",
    invalidation = "",
    failure = "",
  } = body;

  const feedback: string[] = [];

  // FIELD VALIDATIONS
  const checks = [
    validateStructure(structure),
    validateLiquidity(liquidity),
    validateRisk(risk),
    validateInvalidation(invalidation),
    validateFailure(failure),
  ];

  checks.forEach((result) => {
    if (result) feedback.push(result);
  });

  // GLOBAL BANNED LANGUAGE
  const banned = ["will", "guaranteed", "always", "definitely"];
  const fullText = normalize(
    structure + liquidity + risk + invalidation + failure
  );

  if (includesAny(fullText, banned)) {
    feedback.push("Avoid predictive or guaranteed language.");
  }

  const passed = feedback.length === 0;

  await prisma.applicationSubmission.create({
    data: {
      applicationId,
      userId: session.user.id,
      structure,
      liquidity,
      risk,
      invalidation,
      failure,
      passed,
      feedback: feedback.join("\n"),
    },
  });

  let successMessage = "Good. You may proceed to the next lesson.";

  if (passed) {
    const application =
      await prisma.application.findUnique(
        {
          where: { id: applicationId },
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    lessons: {
                      orderBy: {
                        order: "asc",
                      },
                    },
                  },
                },
              },
            }
          }
        }
      );
    
    if (application) {
      const lessons = application.lesson.module.lessons;

      const currentIndex = lessons.findIndex(
        (l) => l.id === application.lessonId
      );
      
      const isLastLesson = currentIndex === lessons.length - 1;

      if (isLastLesson) {
        successMessage = "Good. You may proceed to the module quiz.";
      }
    }
  }

  return NextResponse.json({
    passed,
    feedback: passed
      ? successMessage
      : feedback.join("\n"),
  });
}