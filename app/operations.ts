import { getAccountById, getAccountByTargetId, updateAccount } from "./models/account.server"
import { getTargetByUserId } from "./models/target.server"
// import { getAccountsByUserId } from "./models/account.server"
// import { getUserById } from "./models/user.server"
import { createTransaction, updateTransaction, getTransactionById } from "./models/transaction.server"
//account operations
export async function closeAccount() {
    return
}

export async function requestAccountFreeze() {
    return
}

export async function freezeAccount() {
    return
}

//transaction operations
export async function deposit(userId: number, accountId: number, amount: number) {
    if(amount < 0) {
        throw new Error("Cannot deposit negative sum.");
    }
    const target = await getTargetByUserId(userId);
    if (!target) {
        console.error("Unable to find target account");
        throw new Error('Null target');
    }
    const account = await getAccountById(accountId);
    if (!account) {
        throw new Error("Unable to find account with id" + accountId);
    }
    const deposit =  await createTransaction(accountId, target.id, amount);
    if (!deposit) {
        throw new Error("Error creating transaction.");
    }
    const updatedData = {
        currentBalance: account.currentBalance + deposit.amount
    }
    await updateAccount(accountId, updatedData);

    return deposit
}

export async function withdraw(userId: number, accountId: number, amount: number) {
    const account = await getAccountById(accountId);
    if (!account) {
        throw new Error("Unable to find account with id" + accountId);
    }
    if(amount > 0) {
        amount = 0 - amount;
    }
    if (account.currentBalance + amount < 0) {
        console.error("Balance: " + account.currentBalance + "/nWithdraw: " + amount);
        throw new Error("Cannot overdraft account.");
    }
    const target = await getTargetByUserId(userId);
    if (!target) {
        console.error("Unable to find target account");
        throw new Error('Null target');
    }
    const withdraw =  await createTransaction(accountId, target.id, amount);
    if (!withdraw) {
        throw new Error("Error creating transaction.");
    }
    const updatedData = {
        currentBalance: account.currentBalance + withdraw.amount
    }
    await updateAccount(accountId, updatedData);

    return withdraw
}

export async function transfer(fromId: number, toId: number, amount: number) {
    if(amount < 0) {
        throw new Error("Cannot transfer negative sum.");
    }
    const fromAccount = await getAccountById(fromId);
    if (!fromAccount) {
        throw new Error("Unable to find account with id " + fromId);
    }
    if (fromAccount.currentBalance - amount < 0) {
        console.error("Balance: " + fromAccount.currentBalance + "/nTransfer: " + amount);
        throw new Error("Cannot overdraft account.");
    }
    const toAccount = await getAccountById(toId);
    if (!toAccount) {
        throw new Error("Unable to find account with id " + toId);
    }
    if (!toAccount.targetId) {
        throw new Error("Unable to find account target. at id " + toId)
    }

    const transfer =  await createTransaction(fromId, toAccount.targetId, amount);

    if (!transfer) {
        throw new Error("Error creating transaction.");
    }

    var updatedFromData = {
        currentBalance: fromAccount.currentBalance - transfer.amount
    }

    const updatedToData = {
        currentBalance: toAccount.currentBalance + transfer.amount
    }

    try {
        await updateAccount(fromId, updatedFromData);
    } catch {
        const reverseData = {
            revertStatus: 'REVERTED' as const
        }
        await updateTransaction(transfer.id, reverseData)
    }

    try {
        await updateAccount(toId, updatedToData);
    } catch {
        var updatedFromData = {
            currentBalance: fromAccount.currentBalance + transfer.amount
        }
        await updateAccount(fromId, updatedFromData);
        const reverseData = {
            revertStatus: 'REVERTED' as const
        }
        await updateTransaction(transfer.id, reverseData)
    }

    return transfer
}

export async function requestReversal(transactionId: number) {
    const requestData = {
        revertStatus: 'REQUESTED' as const
    }
    return await updateTransaction(transactionId, requestData)
}

export async function reverseTransaction(transactionId: number, approved: boolean) {
    if (approved){
        //get transaction by id
        const transaction = await getTransactionById(transactionId);
        if (!transaction){
            throw new Error("Unable to locat transaction with id " + transactionId)
        }
        //get account from target
        const fromAccount = transaction.account
        if (!fromAccount) {
            throw new Error("Unable to retrieve account with id " + transaction.accountId)
        }
        const toAccount = await getAccountByTargetId(transaction.target.id)
        if(!toAccount) {
            throw new Error("Unable to retrieve account from target with id " + transaction.target.id)
        }
        //calculate post-reversion balances
        const toData = {
            currentBalance: toAccount?.currentBalance - transaction.amount
        }
        const fromData = {
            currentBalance: fromAccount?.currentBalance + transaction.amount
        }
        //update account balances
        await updateAccount(toAccount.id, toData);
        await updateAccount(fromAccount.id, fromData);

        const reverseData = {
            revertStatus: 'REVERTED' as const
        }
        return updateTransaction(transactionId, reverseData)
    } else {
        const reverseData = {
            revertStatus: 'LOCKED' as const
        }
        return updateTransaction(transactionId, reverseData)
    }
}

