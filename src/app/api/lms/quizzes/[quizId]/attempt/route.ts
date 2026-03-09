// src/app/api/lms/quizzes/[quizId]/attempt/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AttemptStatus, EvaluationType } from "@prisma/client";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params; // ✅ await params (Next 16)
    if (!quizId) {
      return NextResponse.json({ error: "Missing quizId" }, { status: 400 });
    }

    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-expect-error custom field exists in your session
    const userId = (session.user as any)?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // quizId is Evaluation.id
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        type: true,
        title: true,
        questionCount: true,
        passMarkPct: true,
        randomize: true,
        bankId: true,
        courseId: true,
        lessonId: true,
        course: { select: { title: true } },
      },
    });

    if (!evaluation || evaluation.type !== EvaluationType.QUIZ) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // ✅ Gate: must complete the lesson BEFORE attempting its quiz
    if (evaluation.lessonId) {
      const progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: evaluation.lessonId } },
        select: { completed: true },
      });
      if (!progress?.completed) {
        return NextResponse.json(
          {
            error: "Please complete the previous lesson before attempting this quiz.",
            lessonId: evaluation.lessonId,
          },
          { status: 400 }
        );
      }
    }

    // Pull all questions in the bank
    const bankQuestions = await prisma.bankQuestion.findMany({
      where: { bankId: evaluation.bankId },
      select: {
        id: true,
        prompt: true,
        options: {
          orderBy: { label: "asc" },
          select: { id: true, text: true },
        },
      },
    });

    if (bankQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this quiz bank." },
        { status: 400 }
      );
    }

    // Choose N questions for this attempt (you said: bank has 15, pick 5)
    const desiredCount = Math.max(
      1,
      Math.min(evaluation.questionCount ?? 5, bankQuestions.length)
    );

    const picked = evaluation.randomize
      ? shuffle(bankQuestions).slice(0, desiredCount)
      : bankQuestions.slice(0, desiredCount);

    // Compute "continue to next lesson" href (after THIS quiz)
    // This quiz belongs to evaluation.lessonId (the lesson that had the quiz)
    let continueHref = `/courses/${evaluation.courseId}`;
    if (evaluation.lessonId) {
      const orderedLessons = await prisma.lesson.findMany({
        where: { module: { courseId: evaluation.courseId } },
        orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
        select: { id: true },
      });

      const at = orderedLessons.findIndex((l) => l.id === evaluation.lessonId);
      const nextLesson = at >= 0 ? orderedLessons[at + 1] : null;
      continueHref = nextLesson ? `/lessons/${nextLesson.id}` : `/courses/${evaluation.courseId}`;
    }

    // Create attempt + attemptQuestions
    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.evaluationAttempt.create({
        data: {
          evaluationId: evaluation.id,
          userId,
          status: AttemptStatus.IN_PROGRESS,
          totalQuestions: picked.length,
        },
        select: { id: true },
      });

      await tx.attemptQuestion.createMany({
        data: picked.map((q, idx) => ({
          attemptId: attempt.id,
          questionId: q.id,
          order: idx + 1,
        })),
      });

      return { attemptId: attempt.id };
    });

    return NextResponse.json({
      attemptId: result.attemptId,
      quiz: {
        id: evaluation.id,
        title: evaluation.title,
        courseTitle: evaluation.course.title,
        passMarkPct: evaluation.passMarkPct,
        continueHref, // ✅ send to frontend
      },
      questions: picked.map((q, idx) => ({
        id: q.id,
        prompt: q.prompt,
        order: idx + 1,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
      })),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}