import { prisma } from "~/db.server";

export type { Target } from "@prisma/client";
  
export async function getTargetByUserId(userId: number) {
    const userWithTarget = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        target: true, // Include the related target in the response
      },
    });
  
    // If the user exists and has an associated target, return the target
    if (userWithTarget && userWithTarget.target) {
      return userWithTarget.target;
    } else {
      return null; // Return null if no target is found or user doesn't exist
    }
  }

export async function getTargetByAccountId(accountId: number) {
    const accountWithTarget = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
      include: {
        target: true, // Include the related target in the response
      },
    });
  
    // If the account exists and has an associated target, return the target
    if (accountWithTarget && accountWithTarget.target) {
      return accountWithTarget.target;
    } else {
      return null; // Return null if no target is found or account doesn't exist
    }
}