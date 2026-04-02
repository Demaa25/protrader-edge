// src/app/api/admin/question-banks/route.ts
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

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "QUIZ" | null;

  const banks = await prisma.questionBank.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true, // ✅ correct field in your schema
      type: true,
    },
  });

  // ✅ keep frontend contract: { id, title, type }
  return NextResponse.json({
    banks: banks.map((b) => ({ id: b.id, title: b.name, type: b.type })),
  });
}
