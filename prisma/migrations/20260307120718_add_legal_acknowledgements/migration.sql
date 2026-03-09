-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptedPrivacyPolicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptedTermsOfUse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacyAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3);
