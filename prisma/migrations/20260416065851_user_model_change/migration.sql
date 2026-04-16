/*
  Warnings:

  - You are about to drop the column `status` on the `Enrollment` table. All the data in the column will be lost.
  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mentorId" TEXT,
ALTER COLUMN "image" SET NOT NULL;

-- CreateIndex
CREATE INDEX "User_mentorId_idx" ON "User"("mentorId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
