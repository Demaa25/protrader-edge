// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await prisma.course.findMany({
    where: { published: true },
    select: { id: true, title: true, description: true, thumbnailUrl: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ courses });
}
