/*
  Warnings:

  - The values [VIDEO] on the enum `LessonMaterialType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `concept` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `practicalInsight` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `professionalPerspective` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `whyItMatters` on the `Lesson` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LessonBlockType" AS ENUM ('HEADING', 'TEXT', 'IMAGE', 'CALLOUT', 'BULLET_LIST', 'SECTION');

-- AlterEnum
BEGIN;
CREATE TYPE "LessonMaterialType_new" AS ENUM ('DOCUMENT');
ALTER TABLE "LessonMaterial" ALTER COLUMN "type" TYPE "LessonMaterialType_new" USING ("type"::text::"LessonMaterialType_new");
ALTER TYPE "LessonMaterialType" RENAME TO "LessonMaterialType_old";
ALTER TYPE "LessonMaterialType_new" RENAME TO "LessonMaterialType";
DROP TYPE "LessonMaterialType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_moduleId_fkey";

-- DropIndex
DROP INDEX "Lesson_moduleId_idx";

-- DropIndex
DROP INDEX "Lesson_moduleId_order_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "concept",
DROP COLUMN "practicalInsight",
DROP COLUMN "professionalPerspective",
DROP COLUMN "whyItMatters";

-- CreateTable
CREATE TABLE "LessonBlock" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" "LessonBlockType" NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LessonBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBlock" ADD CONSTRAINT "LessonBlock_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
