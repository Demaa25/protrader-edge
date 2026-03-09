/*
  Warnings:

  - A unique constraint covering the columns `[lessonId,type]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moduleId,type]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseId,type]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Evaluation_courseId_type_lessonId_moduleId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_lessonId_type_key" ON "Evaluation"("lessonId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_moduleId_type_key" ON "Evaluation"("moduleId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_courseId_type_key" ON "Evaluation"("courseId", "type");
