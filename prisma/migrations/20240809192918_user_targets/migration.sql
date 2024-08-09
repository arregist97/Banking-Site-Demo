/*
  Warnings:

  - A unique constraint covering the columns `[targetId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "targetId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_targetId_key" ON "User"("targetId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;
