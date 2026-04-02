// src/app/api/admin/quizzes/[quizId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ParamsLike =
  | { quizId: string }
  | Promise<{ quizId: string }>;

export async function DELETE(
  req: Request,
  props: { params: ParamsLike }
) {
  const { quizId } = await Promise.resolve(
    props.params
  );

  await prisma.evaluation.delete({
    where: { id: quizId },
  });

  return NextResponse.json({ success: true });
}