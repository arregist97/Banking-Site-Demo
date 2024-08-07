/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `targetId` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AccountsOnUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Target` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Target` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `uid` was added to the `Account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `userId` on the `AccountsOnUsers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `accountId` on the `AccountsOnUsers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Password` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uid` was added to the `Target` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uid` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `accountId` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `targetId` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `uid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_targetId_fkey";

-- DropForeignKey
ALTER TABLE "AccountsOnUsers" DROP CONSTRAINT "AccountsOnUsers_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountsOnUsers" DROP CONSTRAINT "AccountsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_targetId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
ADD COLUMN     "uid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "targetId",
ADD COLUMN     "targetId" INTEGER,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AccountsOnUsers" DROP CONSTRAINT "AccountsOnUsers_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "accountId",
ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD CONSTRAINT "AccountsOnUsers_pkey" PRIMARY KEY ("userId", "accountId");

-- AlterTable
ALTER TABLE "Password" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Target" DROP CONSTRAINT "Target_pkey",
ADD COLUMN     "uid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Target_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "uid" TEXT NOT NULL,
DROP COLUMN "accountId",
ADD COLUMN     "accountId" INTEGER NOT NULL,
DROP COLUMN "targetId",
ADD COLUMN     "targetId" INTEGER NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "uid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_targetId_key" ON "Account"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountsOnUsers" ADD CONSTRAINT "AccountsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountsOnUsers" ADD CONSTRAINT "AccountsOnUsers_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
