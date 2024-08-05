-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_targetId_fkey";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "targetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;
