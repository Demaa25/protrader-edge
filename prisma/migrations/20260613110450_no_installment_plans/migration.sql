/*
  Warnings:

  - The values [PARTIAL] on the enum `PurchaseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `planType` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the `Installment` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PurchaseStatus_new" AS ENUM ('PENDING', 'PAID', 'FAILED');
ALTER TABLE "Purchase" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Purchase" ALTER COLUMN "status" TYPE "PurchaseStatus_new" USING ("status"::text::"PurchaseStatus_new");
ALTER TYPE "PurchaseStatus" RENAME TO "PurchaseStatus_old";
ALTER TYPE "PurchaseStatus_new" RENAME TO "PurchaseStatus";
DROP TYPE "PurchaseStatus_old";
ALTER TABLE "Purchase" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_purchaseId_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "planType";

-- DropTable
DROP TABLE "Installment";

-- DropEnum
DROP TYPE "InstallmentPlan";

-- DropEnum
DROP TYPE "InstallmentStatus";
