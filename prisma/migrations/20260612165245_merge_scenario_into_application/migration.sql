/*
  Warnings:

  - You are about to drop the `Scenario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScenarioSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scenario" DROP CONSTRAINT "Scenario_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "ScenarioSubmission" DROP CONSTRAINT "ScenarioSubmission_scenarioId_fkey";

-- DropForeignKey
ALTER TABLE "ScenarioSubmission" DROP CONSTRAINT "ScenarioSubmission_userId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "chartImageUrl" TEXT;

-- DropTable
DROP TABLE "Scenario";

-- DropTable
DROP TABLE "ScenarioSubmission";

-- DropEnum
DROP TYPE "ScenarioLevel";
