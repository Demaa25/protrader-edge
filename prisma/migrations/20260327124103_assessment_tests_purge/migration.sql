/*
  Warnings:

  - The values [ASSESSMENT,TEST] on the enum `BankType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ASSESSMENT,TEST] on the enum `EvaluationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BankType_new" AS ENUM ('QUIZ');
ALTER TABLE "QuestionBank" ALTER COLUMN "type" TYPE "BankType_new" USING ("type"::text::"BankType_new");
ALTER TYPE "BankType" RENAME TO "BankType_old";
ALTER TYPE "BankType_new" RENAME TO "BankType";
DROP TYPE "BankType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EvaluationType_new" AS ENUM ('QUIZ');
ALTER TABLE "Evaluation" ALTER COLUMN "type" TYPE "EvaluationType_new" USING ("type"::text::"EvaluationType_new");
ALTER TYPE "EvaluationType" RENAME TO "EvaluationType_old";
ALTER TYPE "EvaluationType_new" RENAME TO "EvaluationType";
DROP TYPE "EvaluationType_old";
COMMIT;
