import { prisma } from "~/db.server";

export type { Transaction } from "@prisma/client";

export async function getTransactionById(transactionId: number) {
  return await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
    include: {
      target: true,
      account: true,
    },
  });
}

export async function getTransactionsByAccountOrTarget(accountId: number) {
    try {
      // First, fetch the account to get its associated targetId
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: { targetId: true },
      });
  
      if (!account) {
        throw new Error(`Account with ID ${accountId} not found.`);
      }

      if(!account.targetId) {
        throw new Error(`No target found for account with ID ${accountId}`);
      }
  
      const targetId = account.targetId;
  
      // Fetch transactions that either belong to the account or are associated with its target
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            { accountId: accountId },  // Transactions belonging to the account
            { targetId: targetId },    // Transactions associated with the account's target
          ],
        },
        include: {
          account: true,   // Optionally include related account details
          target: true,    // Optionally include related target details
        },
      });
  
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    } finally {
      await prisma.$disconnect(); // Always ensure the database connection is closed
    }
}

export async function createTransaction(
    accountId: number,
    targetId: number,
    amount: number
) {
    return prisma.transaction.create({
        data: {
            account: {
                connect: {
                    id: accountId
                }
            },
            target: {
                connect: {
                    id: targetId
                }
            },
            amount,
            revertStatus: 'NOT_REQUESTED'
        }
    }

    )
}

export async function updateTransaction(transactionId: number, updatedData: {
  amount?: number;
  revertStatus?: 'NOT_REQUESTED' | 'REQUESTED' | 'REVERTED' | 'LOCKED';
  time?: Date;
}) {
  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: updatedData,
  });

  return updatedTransaction;
}

export async function deleteTransaction(transactionId: number) {
    try {
      const deletedTransaction = await prisma.transaction.delete({
        where: { id: transactionId }
      });
  
      return deletedTransaction;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } finally {
      await prisma.$disconnect(); // Always ensure the database connection is closed
    }
  }