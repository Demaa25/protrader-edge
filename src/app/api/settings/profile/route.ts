// src/app/api/settings/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  // ensure email unique
  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: name || null, email },
  });

  return NextResponse.json({ ok: true });
}