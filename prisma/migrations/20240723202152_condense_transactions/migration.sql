/*
  Warnings:

  - You are about to drop the column `routingNumber` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the `ExternalAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExternalTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InternalTransaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[targetId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Permissions" ADD VALUE 'OWNER';

-- DropForeignKey
ALTER TABLE "ExternalTransaction" DROP CONSTRAINT "ExternalTransaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalTransaction" DROP CONSTRAINT "ExternalTransaction_externalId_fkey";

-- DropForeignKey
ALTER TABLE "InternalTransaction" DROP CONSTRAINT "InternalTransaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "InternalTransaction" DROP CONSTRAINT "InternalTransaction_targetId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "routingNumber",
ADD COLUMN     "targetId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ExternalAccount";

-- DropTable
DROP TABLE "ExternalTransaction";

-- DropTable
DROP TABLE "InternalTransaction";

-- CreateTable
CREATE TABLE "Transaction" (
    "accountId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "revertStatus" "RevertStatus" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("accountId","time","targetId")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "transitNumber" TEXT NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_targetId_key" ON "Account"("targetId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
