/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RevertStatus" AS ENUM ('NOT_REQUESTED', 'REQUESTED', 'REVERTED', 'LOCKED');

-- CreateEnum
CREATE TYPE "Permissions" AS ENUM ('VIEW', 'DEPOSIT', 'FULL_ACCESS');

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "currentBalance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalTransaction" (
    "accountId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "revertStatus" "RevertStatus" NOT NULL,

    CONSTRAINT "InternalTransaction_pkey" PRIMARY KEY ("accountId","time","targetId")
);

-- CreateTable
CREATE TABLE "ExternalTransaction" (
    "accountId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "revertStatus" "RevertStatus" NOT NULL,

    CONSTRAINT "ExternalTransaction_pkey" PRIMARY KEY ("accountId","time","externalId")
);

-- CreateTable
CREATE TABLE "ExternalAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "transitNumber" TEXT NOT NULL,

    CONSTRAINT "ExternalAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountsOnUsers" (
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userPerms" "Permissions" NOT NULL,

    CONSTRAINT "AccountsOnUsers_pkey" PRIMARY KEY ("userId","accountId")
);

-- AddForeignKey
ALTER TABLE "InternalTransaction" ADD CONSTRAINT "InternalTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalTransaction" ADD CONSTRAINT "InternalTransaction_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_externalId_fkey" FOREIGN KEY ("externalId") REFERENCES "ExternalAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountsOnUsers" ADD CONSTRAINT "AccountsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountsOnUsers" ADD CONSTRAINT "AccountsOnUsers_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
