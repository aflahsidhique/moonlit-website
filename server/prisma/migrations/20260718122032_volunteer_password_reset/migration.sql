-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN "passwordResetToken" TEXT;
ALTER TABLE "Volunteer" ADD COLUMN "passwordResetExpires" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_passwordResetToken_key" ON "Volunteer"("passwordResetToken");
