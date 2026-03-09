import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const acceptedTermsOfUse = Boolean(body?.acceptedTermsOfUse);
    const acceptedPrivacyPolicy = Boolean(body?.acceptedPrivacyPolicy);

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, message: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (!acceptedTermsOfUse) {
      return NextResponse.json({ ok: false, message: "You must accept the Terms of Use." }, { status: 400 });
    }
    if (!acceptedPrivacyPolicy) {
      return NextResponse.json({ ok: false, message: "You must accept the Privacy Policy." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: false, message: "Email already in use." }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);

    /**
     * IMPORTANT:
     * Adjust the password field name below to match your Prisma User model.
     * Common options: password, hashedPassword, passwordHash
     */
    await prisma.user.create({
      data: {
        name,
        email,
        password: hash,

        acceptedTermsOfUse,
        acceptedPrivacyPolicy,
        termsAcceptedAt: acceptedTermsOfUse ? new Date() : null,
        privacyAcceptedAt: acceptedPrivacyPolicy ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: "Server error." }, { status: 500 });
  }
}