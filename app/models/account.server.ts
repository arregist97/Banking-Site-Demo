//import { verifyLogin } from "~/models/user.server";

import { prisma } from "~/db.server";

export type { Account } from "@prisma/client";

export async function getAccountById(id: string) {
  return prisma.account.findUnique({ where: { id } });
}

export async function getAccountsByUserId(userId: string) {
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

export async function createAccount(userId: string, accountType: string, targetName: string, routingNumber: string, transitNumber: string, userPermissions: 'VIEW' | 'DEPOSIT' | 'FULL_ACCESS' | 'OWNER') {
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

  export async function closeAccount(accountId: string){
    //ToDo
    return null
  }

  export async function deleteAccount(accountId: string) {
    try {
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // First, fetch the account to get its associated targetId
        const account = await prisma.account.findUnique({
          where: { id: accountId },
          select: { targetId: true },
        });

        console.log(account);
  
        if (!account) {
          throw new Error(`Account with ID ${accountId} not found.`);
        }
  
        const targetId = account.targetId;
        console.log(targetId);
  
        // Delete the relationships from AccountsOnUsers
        await prisma.accountsOnUsers.deleteMany({
          where: { accountId: accountId },
        });
  
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