/*
  Warnings:

  - You are about to drop the column `learn` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "learn",
ADD COLUMN     "objectives" TEXT;
