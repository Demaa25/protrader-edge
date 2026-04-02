// src/app/api/admin/courses/[courseId]/modules/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await ctx.params;

  const session = await getSession();
  if (!session?.user)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  const role = (session.user as any)?.role as
    | string
    | undefined;

  if (role !== "ADMIN")
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );

  const modules = await prisma.module.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      order: true,
      createdAt: true,

      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
          createdAt: true,
        },
      },

      evaluations: {
        where: { type: "QUIZ" },
        select: {
          id: true,
          type: true,
          title: true,
          bankId: true,
          questionCount: true,
          passMarkPct: true,
          randomize: true,
          createdAt: true,
        },
      },
    },
  });

  const shaped = modules.map((m) => ({
    id: m.id,
    title: m.title,
    order: m.order,
    createdAt: m.createdAt,

    lessons: m.lessons,

    quiz: m.evaluations?.[0]
      ? {
          id: m.evaluations[0].id,
          title: m.evaluations[0].title,
          bankId: m.evaluations[0].bankId,
        }
      : null,
  }));

  return NextResponse.json(shaped);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await ctx.params;

  const session = await getSession();
  if (!session?.user)
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  const role = (session.user as any)?.role as
    | string
    | undefined;

  if (role !== "ADMIN")
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
  };

  const title = String(body?.title ?? "").trim();

  if (!title)
    return NextResponse.json(
      { error: "Module title is required" },
      { status: 400 }
    );

  const last = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const created = await prisma.module.create({
    data: {
      courseId,
      title,
      order: (last?.order ?? 0) + 1,
    },
    select: {
      id: true,
      title: true,
      order: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    { module: created },
    { status: 201 }
  );
}