// src/app/api/auth/reset-password/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  // check if already used
  if (record.used) {
    return Response.json(
      { error: "Token has already been used" },
      { status: 400 }
    );
  }

  // check expiration
  if (record.expiresAt < new Date()) {
    await prisma.passwordResetToken.update({
      where: { token },
      data: { expired: true },
    });

    return Response.json(
      { error: "Token expired" },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: record.email },
    data: { password: hash },
  });

  // mark token used
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });

  return Response.json({ ok: true });
}