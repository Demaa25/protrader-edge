// prisma/seed.ts
import {
  PrismaClient,
  BankType,
  EvaluationType,
} from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

/**
 * CSV expected headers:
 * courseId,bankName,bankType,evaluationType,scopeType,scopeOrder,question,labelA,labelB,labelC,labelD,isCorrect
 *
 * scopeType:
 *  - LESSON (quiz after a lesson)
 *  - MODULE (assessment after a module)  // later
 *  - COURSE (final test)
 *
 * scopeOrder:
 *  - if LESSON: 1-based index of lesson inside the course when ordered by (module.order, lesson.order)
 *  - if MODULE: module.order (1,2,3...)  // later
 *  - if COURSE: ignored (can be 0)
 */

type ScopeType = "LESSON" | "MODULE" | "COURSE";

type CsvRow = {
  courseId: string;
  bankName: string;
  bankType: string;
  evaluationType: string;
  scopeType: string;
  scopeOrder: string;
  question: string;
  labelA: string;
  labelB: string;
  labelC: string;
  labelD: string;
  isCorrect: string;
};

// Small CSV parser (handles commas inside quotes)
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const header = splitCsvLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => splitCsvLine(line));

  return rows.map((cols) => {
    const obj: any = {};
    header.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return obj as CsvRow;
  });
}

function normalizeCorrectLabel(x: string) {
  const v = (x ?? "").trim().toUpperCase();
  return v === "A" || v === "B" || v === "C" || v === "D" ? v : "";
}

function toInt(x: string, fallback = 0) {
  const n = Number(String(x ?? "").trim());
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function assertEnum<T extends string>(value: string, allowed: readonly T[], label: string): T {
  const v = value.trim().toUpperCase();
  if (!(allowed as readonly string[]).includes(v)) {
    throw new Error(`${label} must be one of: ${allowed.join(", ")}. Got: "${value}"`);
  }
  return v as T;
}

async function seedFromCsv(csvPath: string) {
  const abs = path.resolve(csvPath);
  if (!fs.existsSync(abs)) {
    console.log(`ℹ️ Skipping (file not found): ${abs}`);
    return;
  }

  console.log(`\n📥 Reading: ${abs}`);
  const content = fs.readFileSync(abs, "utf8");
  const rows = parseCsv(content);

  if (rows.length === 0) {
    console.log(`⚠️ No rows found in: ${abs}`);
    return;
  }

  // Group rows by bank (bankType+bankName)
  const bankGroups = new Map<string, CsvRow[]>();
  for (const r of rows) {
    if (!r.bankName || !r.bankType) continue;
    const key = `${r.bankType.trim().toUpperCase()}::${r.bankName.trim()}`;
    if (!bankGroups.has(key)) bankGroups.set(key, []);
    bankGroups.get(key)!.push(r);
  }

  // Create/Update banks + questions/options
  for (const [key, bankRows] of bankGroups.entries()) {
    const [bankTypeRaw, bankName] = key.split("::");

    const bankType = assertEnum(bankTypeRaw, ["QUIZ", "ASSESSMENT", "TEST"] as const, "bankType") as BankType;

    const bank = await prisma.questionBank.upsert({
      where: { name_type: { name: bankName, type: bankType } },
      update: {},
      create: { name: bankName, type: bankType },
      select: { id: true, name: true, type: true },
    });

    // Clear existing questions/options for this bank (idempotent seeding)
    const existingQs = await prisma.bankQuestion.findMany({
      where: { bankId: bank.id },
      select: { id: true },
    });

    if (existingQs.length > 0) {
      await prisma.bankOption.deleteMany({
        where: { questionId: { in: existingQs.map((q) => q.id) } },
      });
      await prisma.bankQuestion.deleteMany({ where: { bankId: bank.id } });
    }

    // Insert questions
    let createdCount = 0;
    for (let i = 0; i < bankRows.length; i++) {
      const r = bankRows[i];
      const prompt = (r.question ?? "").trim();
      if (!prompt) continue;

      const correct = normalizeCorrectLabel(r.isCorrect);

      const optionData = [
        { label: "A", text: (r.labelA ?? "").trim() },
        { label: "B", text: (r.labelB ?? "").trim() },
        { label: "C", text: (r.labelC ?? "").trim() },
        { label: "D", text: (r.labelD ?? "").trim() },
      ].filter((o) => o.text.length > 0);

      if (optionData.length < 2) {
        console.warn(`⚠️ Skipping question (needs at least 2 options): "${prompt}"`);
        continue;
      }
      if (!correct) {
        console.warn(`⚠️ Question missing valid isCorrect (A/B/C/D). Prompt: "${prompt}"`);
      }

      await prisma.bankQuestion.create({
        data: {
          bankId: bank.id,
          prompt,
          order: i + 1,
          options: {
            create: optionData.map((o) => ({
              label: o.label,
              text: o.text,
              isCorrect: correct === o.label,
            })),
          },
        },
      });

      createdCount++;
    }

    console.log(`✅ Seeded QuestionBank: [${bank.type}] ${bank.name} (${createdCount} questions)`);
  }

  // Now create/attach Evaluations based on courseId + scope
  // We group evaluations so many questions can belong to one evaluation/bank.
  type EvalKey = string;
  const evalGroups = new Map<EvalKey, CsvRow[]>();

  for (const r of rows) {
    const courseId = (r.courseId ?? "").trim();
    const bankName = (r.bankName ?? "").trim();
    const bankType = (r.bankType ?? "").trim().toUpperCase();
    const evaluationType = (r.evaluationType ?? "").trim().toUpperCase();
    const scopeType = (r.scopeType ?? "").trim().toUpperCase();
    const scopeOrder = String(r.scopeOrder ?? "").trim();

    if (!courseId || !bankName || !bankType || !evaluationType || !scopeType) continue;

    const key = `${courseId}::${evaluationType}::${scopeType}::${scopeOrder}::${bankType}::${bankName}`;
    if (!evalGroups.has(key)) evalGroups.set(key, []);
    evalGroups.get(key)!.push(r);
  }

  for (const [key, groupRows] of evalGroups.entries()) {
    const [courseId, evaluationTypeRaw, scopeTypeRaw, scopeOrderRaw, bankTypeRaw, bankName] = key.split("::");

    const evaluationType = assertEnum(
      evaluationTypeRaw,
      ["QUIZ", "ASSESSMENT", "TEST"] as const,
      "evaluationType"
    ) as EvaluationType;

    const scopeType = assertEnum(scopeTypeRaw, ["LESSON", "MODULE", "COURSE"] as const, "scopeType") as ScopeType;
    const scopeOrder = toInt(scopeOrderRaw, 0);

    const bankType = assertEnum(bankTypeRaw, ["QUIZ", "ASSESSMENT", "TEST"] as const, "bankType") as BankType;

    // Fetch bank by unique name+type
    const bank = await prisma.questionBank.findUnique({
      where: { name_type: { name: bankName, type: bankType } },
      select: { id: true },
    });

    if (!bank) {
      console.warn(`⚠️ Bank not found for evaluation group: ${bankType}/${bankName}`);
      continue;
    }

    // Find scope IDs
    let lessonId: string | null = null;
    let moduleId: string | null = null;

    if (scopeType === "LESSON") {
      // Map scopeOrder to lesson in a course, ordered by (module.order, lesson.order)
      const lessons = await prisma.lesson.findMany({
        where: { module: { courseId } },
        orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
        select: { id: true },
      });

      if (scopeOrder < 1 || scopeOrder > lessons.length) {
        console.warn(
          `⚠️ LESSON scopeOrder out of range. courseId=${courseId} scopeOrder=${scopeOrder} lessons=${lessons.length}`
        );
        continue;
      }

      lessonId = lessons[scopeOrder - 1].id;
    }

    if (scopeType === "MODULE") {
      const mod = await prisma.module.findFirst({
        where: { courseId, order: scopeOrder },
        select: { id: true },
      });
      if (!mod) {
        console.warn(`⚠️ MODULE not found. courseId=${courseId} module.order=${scopeOrder}`);
        continue;
      }
      moduleId = mod.id;
    }

    // Evaluation title (simple default)
    const title =
      scopeType === "LESSON"
        ? `Lesson ${scopeOrder} Quiz`
        : scopeType === "MODULE"
        ? `Module ${scopeOrder} Assessment`
        : `Final Test`;

    // Decide questionCount: default 10, but never more than bank question count
    const bankQuestionCount = await prisma.bankQuestion.count({ where: { bankId: bank.id } });
    const questionCount = Math.min(10, Math.max(1, bankQuestionCount));

    // IMPORTANT: we DO NOT rely on compound unique inputs.
    // We search for an existing evaluation and update it if it exists.
    const existing = await prisma.evaluation.findFirst({
      where: {
        courseId,
        type: evaluationType,
        lessonId: lessonId ?? null,
        moduleId: moduleId ?? null,
      },
      select: { id: true },
    });

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
      console.log(`🔁 Updated Evaluation: ${title} (${evaluationType})`);
    } else {
      await prisma.evaluation.create({
        data: {
          type: evaluationType,
          title,
          bankId: bank.id,
          courseId,
          lessonId: lessonId ?? undefined,
          moduleId: moduleId ?? undefined,
          questionCount,
          passMarkPct: 70,
          randomize: true,
        },
      });
      console.log(`✅ Created Evaluation: ${title} (${evaluationType})`);
    }
  }

  console.log(`✅ Finished seeding from: ${abs}`);
}

async function main() {
  const seedDir = path.resolve("prisma", "seed-data");

  // You said you currently have quizzes + tests only
  await seedFromCsv(path.join(seedDir, "quizzes.csv"));
  await seedFromCsv(path.join(seedDir, "assessments.csv"));
  await seedFromCsv(path.join(seedDir, "tests.csv"));

  console.log("\n✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });