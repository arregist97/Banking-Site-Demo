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

export async function createAccount(
  routingNumber: string,
  transitNumber: string,
  name: string,
  balance: number,
  type: string,
  userId: string
) {
    return prisma.target.create({
      data: {
        name,
        routingNumber,
        transitNumber,
        account: {
          create: {
            currentBalance: balance,
            type,
            AccountsOnUsers: {
              create: {
                user: {
                  connect: {
                    id: userId
                  }
                },
                userPerms: 'OWNER'
              }
            }
            //transaction
          }
        }

      },
    });
  }

  export async function closeAccount(accountId: string){
    //ToDo
    return null
  }