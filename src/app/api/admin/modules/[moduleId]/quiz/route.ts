// src/app/api/admin/modules/[moduleId]/quiz/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type ParamsLike =
  | { moduleId: string }
  | Promise<{ moduleId: string }>;

export async function POST(
  req: Request,
  props: { params: ParamsLike }
) {
  const { moduleId } = await Promise.resolve(
    props.params
  );

  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { title, bankId } = body;

  if (!title || !bankId) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
  });

  if (!module) {
    return NextResponse.json(
      { error: "Module not found" },
      { status: 404 }
    );
  }

  // delete existing quiz (only one allowed)
  await prisma.evaluation.deleteMany({
    where: {
      moduleId,
      type: "QUIZ",
    },
  });

  const quiz = await prisma.evaluation.create({
    data: {
      title,
      type: "QUIZ",
      bankId,
      courseId: module.courseId,
      moduleId: moduleId,
      questionCount: 10,
      passMarkPct: 70,
    },
  });

  return NextResponse.json({
    success: true,
    quiz,
  });
}