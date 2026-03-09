// src/app/api/progress/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, completed, progress } = (await req.json()) as {
    lessonId: string;
    completed?: boolean;
    progress?: number;
  };

  const userId = (session.user as any).id as string;

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      completed: completed ?? undefined,
      progress:
        typeof progress === "number"
          ? Math.max(0, Math.min(100, progress))
          : undefined,
    },

    create: {
      userId,
      lessonId,
      completed: !!completed,
      progress:
        typeof progress === "number"
          ? Math.max(0, Math.min(100, progress))
          : 0,
    },
  });

  return NextResponse.json({ ok: true });
}
 