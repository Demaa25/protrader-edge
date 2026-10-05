-- Remove the retired application feature and knowledge-check assessment type.
DROP TABLE "ApplicationSubmission";
DROP TABLE "Application";

DELETE FROM "Evaluation" WHERE "type" = 'KNOWLEDGE_CHECK';
DELETE FROM "QuestionBank" WHERE "type" = 'KNOWLEDGE_CHECK';

ALTER TABLE "QuestionBank" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;
ALTER TYPE "BankType" RENAME TO "BankType_old";
CREATE TYPE "BankType" AS ENUM ('QUIZ', 'CERTIFICATION');
ALTER TABLE "QuestionBank" ALTER COLUMN "type" TYPE "BankType" USING "type"::"BankType";
DROP TYPE "BankType_old";

ALTER TABLE "Evaluation" ALTER COLUMN "type" TYPE TEXT USING "type"::TEXT;
ALTER TYPE "EvaluationType" RENAME TO "EvaluationType_old";
CREATE TYPE "EvaluationType" AS ENUM ('QUIZ', 'CERTIFICATION');
ALTER TABLE "Evaluation" ALTER COLUMN "type" TYPE "EvaluationType" USING "type"::"EvaluationType";
DROP TYPE "EvaluationType_old";
