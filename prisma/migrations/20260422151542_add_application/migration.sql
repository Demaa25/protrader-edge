-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "instruction" TEXT,
    "requirements" TEXT,
    "scenario" TEXT,
    "focusAreas" TEXT[],

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationSubmission" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "structure" TEXT,
    "liquidity" TEXT,
    "risk" TEXT,
    "invalidation" TEXT,
    "failure" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_lessonId_key" ON "Application"("lessonId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationSubmission" ADD CONSTRAINT "ApplicationSubmission_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
