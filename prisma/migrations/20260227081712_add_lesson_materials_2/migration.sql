/*
  Warnings:

  - You are about to drop the column `fileSize` on the `LessonMaterial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LessonMaterial" DROP COLUMN "fileSize",
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "sizeBytes" INTEGER;
