-- AlterTable
ALTER TABLE "LessonMaterial" ADD COLUMN     "parseError" TEXT,
ADD COLUMN     "parsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parsedText" TEXT;
