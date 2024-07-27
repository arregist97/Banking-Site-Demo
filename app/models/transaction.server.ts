import { prisma } from "~/db.server";

export type { Transaction } from "@prisma/client";

export async function getTransactionById(id: string) {
  return prisma.account.findUnique({ where: { id } });
}

export async function createTransaction(
    accountId: string,
    targetId: string,
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