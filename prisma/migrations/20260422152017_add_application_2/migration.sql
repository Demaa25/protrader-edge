-- AlterTable
ALTER TABLE "ApplicationSubmission" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "passed" BOOLEAN NOT NULL DEFAULT false;
