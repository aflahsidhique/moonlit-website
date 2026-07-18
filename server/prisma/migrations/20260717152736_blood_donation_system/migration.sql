/*
  Warnings:

  - Added the required column `district` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "BloodRequestResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bloodRequestId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'notified',
    "respondedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BloodRequestResponse_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BloodRequestResponse_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BloodDonationRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "volunteerId" TEXT NOT NULL,
    "donationDate" DATETIME NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "bloodRequestId" TEXT,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BloodDonationRecord_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BloodDonationRecord_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "volunteerId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushSubscription_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BloodRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "urgency" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "doctorName" TEXT,
    "phone" TEXT NOT NULL,
    "documentUrls" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNote" TEXT,
    "lat" REAL,
    "lng" REAL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BloodRequest" ("bloodGroup", "createdAt", "deletedAt", "hospital", "id", "location", "patientName", "phone", "status", "units", "updatedAt", "urgency") SELECT "bloodGroup", "createdAt", "deletedAt", "hospital", "id", "location", "patientName", "phone", "status", "units", "updatedAt", "urgency" FROM "BloodRequest";
DROP TABLE "BloodRequest";
ALTER TABLE "new_BloodRequest" RENAME TO "BloodRequest";
CREATE TABLE "new_Volunteer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "volunteerId" TEXT,
    "passwordHash" TEXT,
    "fullName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "aadhaar" TEXT,
    "photoUrl" TEXT,
    "mobile" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "taluk" TEXT NOT NULL,
    "panchayat" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "emergencyName" TEXT NOT NULL,
    "emergencyRelationship" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "isBloodDonor" BOOLEAN NOT NULL DEFAULT false,
    "lastBloodDonationDate" DATETIME,
    "bloodDonationAvailable" BOOLEAN NOT NULL DEFAULT true,
    "weight" REAL,
    "medicalConditions" TEXT,
    "lat" REAL,
    "lng" REAL,
    "availableTime" TEXT NOT NULL,
    "instagram" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "idType" TEXT,
    "idUploadUrl" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Volunteer" ("aadhaar", "address", "availableTime", "bloodGroup", "createdAt", "deletedAt", "district", "dob", "email", "emergencyName", "emergencyPhone", "emergencyRelationship", "facebook", "fullName", "gender", "id", "idType", "idUploadUrl", "instagram", "isBloodDonor", "lastBloodDonationDate", "linkedin", "medicalConditions", "message", "mobile", "panchayat", "passwordHash", "photoUrl", "pin", "skills", "state", "status", "taluk", "updatedAt", "volunteerId", "ward", "weight", "whatsapp") SELECT "aadhaar", "address", "availableTime", "bloodGroup", "createdAt", "deletedAt", "district", "dob", "email", "emergencyName", "emergencyPhone", "emergencyRelationship", "facebook", "fullName", "gender", "id", "idType", "idUploadUrl", "instagram", "isBloodDonor", "lastBloodDonationDate", "linkedin", "medicalConditions", "message", "mobile", "panchayat", "passwordHash", "photoUrl", "pin", "skills", "state", "status", "taluk", "updatedAt", "volunteerId", "ward", "weight", "whatsapp" FROM "Volunteer";
DROP TABLE "Volunteer";
ALTER TABLE "new_Volunteer" RENAME TO "Volunteer";
CREATE UNIQUE INDEX "Volunteer_volunteerId_key" ON "Volunteer"("volunteerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BloodRequestResponse_bloodRequestId_volunteerId_key" ON "BloodRequestResponse"("bloodRequestId", "volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");
