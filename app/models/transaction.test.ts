import { createTransaction, updateTransaction, getTransactionsByAccountOrTarget, deleteTransaction } from "./transaction.server";


test("crud methods for transactions", async() => {
    const accountId = 1;
    const targetId = 1;

    const transaction = await createTransaction(accountId, targetId, 10);

    expect(typeof transaction.id).toBe("number");
    expect(typeof transaction.uid).toBe("string");
    expect(typeof transaction.accountId).toBe("number");
    expect(typeof transaction.time).toBe("object");
    expect(typeof transaction.targetId).toBe("number");
    expect(typeof transaction.amount).toBe("number");
    expect(typeof transaction.revertStatus).toBe("string");

    const revertStatus = 'LOCKED' as const
    const updatedData = {
        amount: 5,
        revertStatus
    }
    const updatedTransaction = await updateTransaction(transaction.id, updatedData);

    expect(typeof updatedTransaction.id).toBe("number");
    expect(typeof updatedTransaction.uid).toBe("string");
    expect(typeof updatedTransaction.accountId).toBe("number");
    expect(typeof updatedTransaction.time).toBe("object");
    expect(typeof updatedTransaction.targetId).toBe("number");
    expect(typeof updatedTransaction.amount).toBe("number");
    expect(typeof updatedTransaction.revertStatus).toBe("string");

    const transactions = await getTransactionsByAccountOrTarget(accountId);

    expect(transactions.length).toBe(1);

    const deletedTransaction = await deleteTransaction(transaction.id);

    expect(typeof deletedTransaction.id).toBe("number");
    expect(typeof deletedTransaction.uid).toBe("string");
    expect(typeof deletedTransaction.accountId).toBe("number");
    expect(typeof deletedTransaction.time).toBe("object");
    expect(typeof deletedTransaction.targetId).toBe("number");
    expect(typeof deletedTransaction.amount).toBe("number");
    expect(typeof deletedTransaction.revertStatus).toBe("string");
})