-- CreateEnum
CREATE TYPE "InstallmentPlan" AS ENUM ('FULL', 'TWO_PART', 'THREE_PART');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterEnum
ALTER TYPE "PurchaseStatus" ADD VALUE 'PARTIAL';

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "planType" "InstallmentPlan" NOT NULL DEFAULT 'FULL',
ADD COLUMN     "totalKobo" INTEGER;

-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "installmentNo" INTEGER NOT NULL,
    "amountKobo" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Installment_reference_key" ON "Installment"("reference");

-- CreateIndex
CREATE INDEX "Installment_purchaseId_idx" ON "Installment"("purchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Installment_purchaseId_installmentNo_key" ON "Installment"("purchaseId", "installmentNo");

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
