// src/app/api/admin/courses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      createdAt: true,
      modules: {
        select: { _count: { select: { lessons: true } } },
      },
    },
  });

  const payload = courses.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    lessonsCount: c.modules.reduce((sum, m) => sum + m._count.lessons, 0),
  }));

  return NextResponse.json({ courses: payload });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as null | {
    title?: string;
    category?: string;
  };

  const title = (body?.title ?? "").trim();
  const category = (body?.category ?? "Forex").trim();

  if (!title) {
    return NextResponse.json({ error: "Course title is required" }, { status: 400 });
  }

  const created = await prisma.course.create({
    data: {
      title,
      category,
      // optional: set draft status if your schema supports it
      // published: false,
    },
    select: { id: true, title: true, category: true },
  });

  return NextResponse.json({ course: created }, { status: 201 });
}
