-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BankType" ADD VALUE 'KNOWLEDGE_CHECK';
ALTER TYPE "BankType" ADD VALUE 'CERTIFICATION';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EvaluationType" ADD VALUE 'KNOWLEDGE_CHECK';
ALTER TYPE "EvaluationType" ADD VALUE 'CERTIFICATION';

-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "questionCount" DROP DEFAULT;
