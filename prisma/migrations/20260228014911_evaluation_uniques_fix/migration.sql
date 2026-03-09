/*
  Warnings:

  - A unique constraint covering the columns `[courseId,type,lessonId,moduleId]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Evaluation_courseId_type_key";

-- DropIndex
DROP INDEX "Evaluation_lessonId_type_key";

-- DropIndex
DROP INDEX "Evaluation_moduleId_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_courseId_type_lessonId_moduleId_key" ON "Evaluation"("courseId", "type", "lessonId", "moduleId");
