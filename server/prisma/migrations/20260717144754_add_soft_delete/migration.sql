-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "PartnerInquiry" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Volunteer" ADD COLUMN "deletedAt" DATETIME;
