// src/app/api/admin/upload-question-bank/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { BankType, EvaluationType } from "@prisma/client";

type ScopeType = "LESSON" | "MODULE" | "COURSE";

function normalizeCorrect(x: string) {
  const v = (x ?? "").trim().toUpperCase();
  return ["A", "B", "C", "D"].includes(v) ? v : "";
}

function toInt(x: string, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();

    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }); as CsvRow[];

    // ===============================
    // 1. GROUP BANKS
    // ===============================
    const bankGroups = new Map<string, any[]>();

    for (const r of rows) {
      const key = `${r.bankType}::${r.bankName}`;
      if (!bankGroups.has(key)) bankGroups.set(key, []);
      bankGroups.get(key)!.push(r);
    }

    // ===============================
    // 2. CREATE BANKS + QUESTIONS
    // ===============================
    for (const [key, bankRows] of bankGroups.entries()) {
      const [bankTypeRaw, bankName] = key.split("::");

      const bankType = bankTypeRaw.toUpperCase() as BankType;

      const bank = await prisma.questionBank.upsert({
        where: {
          name_type: {
            name: bankName,
            type: bankType,
          },
        },
        update: {},
        create: {
          name: bankName,
          type: bankType,
        },
      });

      // 🔥 Clear existing questions (same as seed.ts)
      const existing = await prisma.bankQuestion.findMany({
        where: { bankId: bank.id },
        select: { id: true },
      });

      if (existing.length > 0) {
        await prisma.bankOption.deleteMany({
          where: { questionId: { in: existing.map(q => q.id) } },
        });

        await prisma.bankQuestion.deleteMany({
          where: { bankId: bank.id },
        });
      }

      // Create questions
      for (let i = 0; i < bankRows.length; i++) {
        const r = bankRows[i];

        const prompt = r.question?.trim();
        if (!prompt) continue;

        const correct = normalizeCorrect(r.isCorrect);

        const options = [
          { label: "A", text: r.labelA },
          { label: "B", text: r.labelB },
          { label: "C", text: r.labelC },
          { label: "D", text: r.labelD },
        ].filter(o => o.text);

        if (options.length < 2) continue;

        await prisma.bankQuestion.create({
          data: {
            bankId: bank.id,
            prompt,
            order: i + 1,
            options: {
              create: options.map(o => ({
                label: o.label,
                text: o.text,
                isCorrect: correct === o.label,
              })),
            },
          },
        });
      }
    }

    // ===============================
    // 3. GROUP EVALUATIONS
    // ===============================
    const evalGroups = new Map<string, any[]>();

    for (const r of rows) {
      const key = `${r.courseId}::${r.evaluationType}::${r.scopeType}::${r.scopeOrder}::${r.bankType}::${r.bankName}`;
      if (!evalGroups.has(key)) evalGroups.set(key, []);
      evalGroups.get(key)!.push(r);
    }

    // ===============================
    // 4. CREATE EVALUATIONS
    // ===============================
    for (const [key] of evalGroups.entries()) {
      const [courseId, evalTypeRaw, scopeTypeRaw, scopeOrderRaw, bankTypeRaw, bankName] = key.split("::");

      const evaluationType = evalTypeRaw.toUpperCase() as EvaluationType;
      const scopeType = scopeTypeRaw.toUpperCase() as ScopeType;
      const scopeOrder = toInt(scopeOrderRaw);

      const bank = await prisma.questionBank.findUnique({
        where: {
          name_type: {
            name: bankName,
            type: bankTypeRaw.toUpperCase() as BankType,
          },
        },
      });

      if (!bank) continue;

      // ===============================
      // RESOLVE SCOPE
      // ===============================
      let lessonId: string | null = null;
      let moduleId: string | null = null;

      if (scopeType === "LESSON") {
        const lessons = await prisma.lesson.findMany({
          where: { module: { courseId } },
          orderBy: [
            { module: { order: "asc" } },
            { order: "asc" },
          ],
          select: { id: true },
        });

        if (scopeOrder < 1 || scopeOrder > lessons.length) continue;

        lessonId = lessons[scopeOrder - 1].id;
      }

      if (scopeType === "MODULE") {
        const mod = await prisma.module.findFirst({
          where: { courseId, order: scopeOrder },
        });

        if (!mod) continue;
        moduleId = mod.id;
      }

      // ===============================
      // TITLE
      // ===============================
      const title =
        scopeType === "LESSON"
          ? `Lesson ${scopeOrder} Quiz`
          : scopeType === "MODULE"
          ? `Module ${scopeOrder} Assessment`
          : `Final Test`;

      // ===============================
      // QUESTION COUNT
      // ===============================
      const count = await prisma.bankQuestion.count({
        where: { bankId: bank.id },
      });

      const questionCount = Math.min(10, Math.max(1, count));

      // ===============================
      // UPSERT EVALUATION
      // ===============================
      let existing = null;

      if (lessonId) {
        existing = await prisma.evaluation.findFirst({
          where: { lessonId, type: evaluationType },
        });
      }
      
      if (!existing && moduleId) {
        existing = await prisma.evaluation.findFirst({
          where: { moduleId, type: evaluationType },
        });
      }

      if (existing) {
        await prisma.evaluation.update({
          where: { id: existing.id },
          data: {
            title,
            bankId: bank.id,
            questionCount,
            randomize: true,
          },
        });
      } else {
        await prisma.evaluation.create({
          data: {
            courseId,
            type: evaluationType,
            title,
            bankId: bank.id,
            lessonId: lessonId ?? undefined,
            moduleId: moduleId ?? undefined,
            questionCount,
            passMarkPct: 70,
            randomize: true,
          },
        });
      }
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}