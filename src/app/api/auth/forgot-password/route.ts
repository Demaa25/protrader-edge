// src/app/api/auth/forgot-password/route.ts
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email";
import { resetTokenEmail } from "@/lib/emailTemplates/token";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // do not reveal whether email exists
    return Response.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
      used: false,
      expired: false,
    },
  });

  const resetLink = `${process.env.APP_URL}/reset-password/${token}`;

  await sendEmail(
    email,
    "Reset your password",
    resetTokenEmail(resetLink)
  );

  return Response.json({ ok: true });
}