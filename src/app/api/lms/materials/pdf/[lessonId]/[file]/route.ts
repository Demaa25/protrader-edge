// src/app/api/lms/materials/pdf/[lessonId]/[file]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import path from "path";
import fs from "fs/promises";

export async function GET(_req: Request, ctx: { params: Promise<{ lessonId: string; file: string }> }) {
  const { lessonId, file } = await ctx.params;

  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = (session.user as any)?.id as string | undefined;
  
  const role = (session.user as any)?.role as "ADMIN" | "STUDENT" | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Find lesson->course for access check
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const courseId = lesson.module.courseId;

  // Access gate: enrollment/purchase/admin
  const [purchase, enrollment] = await Promise.all([
    prisma.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { status: true },
    }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { id: true },
    }),
  ]);

  const hasAccess =
    !!enrollment ||
    purchase?.status === "PAID" ||
    purchase?.status === "PARTIAL" ||
    role === "ADMIN";

  if (!hasAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // (Optional) also enforce your “previous quiz gate” here if you want.

  const fullPath = path.join(process.cwd(), "uploads", "pdfs", lessonId, file);

  try {
    const bytes = await fs.readFile(fullPath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        // Inline viewing (still not a perfect anti-download, but better UX)
        "Content-Disposition": `inline; filename="${file}"`,
        "Cache-Control": "private, max-age=0, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}