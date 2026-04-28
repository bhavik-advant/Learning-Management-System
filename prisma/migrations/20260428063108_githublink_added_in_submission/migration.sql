-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "githubLink" TEXT,
ALTER COLUMN "fileUrl" DROP NOT NULL;
