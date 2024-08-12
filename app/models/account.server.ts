//import { verifyLogin } from "~/models/user.server";

import { prisma } from "~/db.server";

export type { Account } from "@prisma/client";

export async function getAccountById(id: number) {
  return prisma.account.findUnique({ where: { id } });
}

export async function getAccountsByUserId(userId: number) {
  const userWithAccounts = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      AccountsOnUsers: {
        include: {
          account: true,
        },
      },
    },
  })

  const accounts = userWithAccounts?.AccountsOnUsers.map(aou => aou.account)

  return accounts
}

export async function getAccountByTargetId(targetId: number) {
  const account = await prisma.account.findUnique({
    where: {
      targetId: targetId
    }
  });

  return account;
}

export async function createAccount(userId: number, accountType: string, targetName: string, routingNumber: string, transitNumber: string, userPermissions: 'VIEW' | 'DEPOSIT' | 'FULL_ACCESS' | 'OWNER') {
  const account = await prisma.account.create({
    data: {
      type: accountType,
      target: {
        create: {
          name: targetName,
          routingNumber: routingNumber,
          transitNumber: transitNumber,
        },
      },
      AccountsOnUsers: {
        create: {
          userId: userId,
          userPerms: userPermissions,
        },
      },
    },
  });

  return account;
}

  export async function updateAccount(accountId: number, updatedData: {
    type?: string;
    currentBalance?: number;
    targetId?: number;
  }) {
    const updatedAccount = await prisma.account.update({
      where: {
        id: accountId,
      },
      data: updatedData,
    });
  
    return updatedAccount;
  }

  export async function deleteAccount(accountId: number) {
    try {
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // First, fetch the account to get its associated targetId
        const account = await prisma.account.findUnique({
          where: { id: accountId },
          select: { targetId: true },
        });

  
        if (!account) {
          throw new Error(`Account with ID ${accountId} not found.`);
        }
  
        // Delete the relationships from AccountsOnUsers
        await prisma.accountsOnUsers.deleteMany({
          where: { accountId: accountId },
        });

        if (!account.targetId) {
          // Delete the account
          const deletedAccount = await prisma.account.delete({
            where: { id: accountId },
          });
    
          // Return the deleted account and target details
          return { deletedAccount };
        }

        const targetId = account.targetId;
  
        // Delete the target associated with the account
        const deletedTarget = await prisma.target.delete({
          where: { id: targetId },
        });
  
        // Delete the account
        const deletedAccount = await prisma.account.delete({
          where: { id: accountId },
        });
  
        // Return the deleted account and target details
        return { deletedAccount, deletedTarget };
      });
  
      return result;
    } catch (error) {
      console.error('Error deleting account and related data:', error);
      throw error;
    } finally {
      await prisma.$disconnect(); // Always ensure the database connection is closed
    }
  }