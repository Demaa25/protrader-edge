/*
  Warnings:

  - You are about to drop the column `content` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "content",
DROP COLUMN "videoUrl",
ADD COLUMN     "concept" TEXT,
ADD COLUMN     "practicalInsight" TEXT,
ADD COLUMN     "professionalPerspective" TEXT,
ADD COLUMN     "whyItMatters" TEXT;
