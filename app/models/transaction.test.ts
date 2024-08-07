import { time } from "console";
import { createTransaction, updateTransaction, getTransactionsByAccountOrTarget, deleteTransaction } from "./transaction.server";

test("test test", () => {
    expect(true).toBe(true);
})

test("test crud methods for transactions", async() => {
    const accountId = 1;
    const targetId = 1;

    var transaction = await createTransaction(accountId, targetId, 10);

    expect(typeof transaction.id).toBe("number");
    expect(typeof transaction.uid).toBe("string");
    expect(typeof transaction.accountId).toBe("number");
    expect(typeof transaction.time).toBe("object");
    expect(typeof transaction.targetId).toBe("number");
    expect(typeof transaction.amount).toBe("number");
    expect(typeof transaction.revertStatus).toBe("string");

    let revertStatus = 'LOCKED' as const
    const updatedData = {
        amount: 5,
        revertStatus
    }
    transaction = await updateTransaction(transaction.id, updatedData);

    expect(typeof transaction.id).toBe("number");
    expect(typeof transaction.uid).toBe("string");
    expect(typeof transaction.accountId).toBe("number");
    expect(typeof transaction.time).toBe("object");
    expect(typeof transaction.targetId).toBe("number");
    expect(typeof transaction.amount).toBe("number");
    expect(typeof transaction.revertStatus).toBe("string");

    var transactions = await getTransactionsByAccountOrTarget(accountId);

    expect(transactions.length).toBe(1);

    var deletedTransaction = await deleteTransaction(transaction.id);

    expect(typeof deletedTransaction.id).toBe("number");
    expect(typeof deletedTransaction.uid).toBe("string");
    expect(typeof deletedTransaction.accountId).toBe("number");
    expect(typeof deletedTransaction.time).toBe("object");
    expect(typeof deletedTransaction.targetId).toBe("number");
    expect(typeof deletedTransaction.amount).toBe("number");
    expect(typeof deletedTransaction.revertStatus).toBe("string");
})