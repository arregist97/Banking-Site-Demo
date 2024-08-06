import { time } from "console";
import { createTransaction, updateTransaction, getTransactionsByAccountOrTarget, deleteTransaction } from "./transaction.server";

test("test test", () => {
    expect(true).toBe(true);
})

test("test crud methods for transactions", async() => {
    const accountId = "clzip0ose0000tzuojhlqgamf";
    const targetId = "clzip2a4x0001tzuolfk2ec1i";

    var transaction = await createTransaction(accountId, targetId, 10);

    expect(typeof transaction.accountId).toBe("string");
    expect(typeof transaction.time).toBe("object");
    expect(typeof transaction.targetId).toBe("string");
    expect(typeof transaction.amount).toBe("number");
    expect(typeof transaction.revertStatus).toBe("string");

    const updatedData = {
        amount: 5,
        revertStatus: 'LOCKED'
    }
    transaction = await updateTransaction(accountId, transaction.time, targetId, updatedData);

    expect(typeof transaction.accountId).toBe("string");
    expect(typeof transaction.time).toBe("object");
    expect(typeof transaction.targetId).toBe("string");
    expect(typeof transaction.amount).toBe("number");
    expect(typeof transaction.revertStatus).toBe("string");

    var transactions = await getTransactionsByAccountOrTarget(accountId);

    expect(transactions.length).toBe(1);

    var deletedTransaction = await deleteTransaction(accountId, transaction.time, targetId);

    expect(typeof deletedTransaction.accountId).toBe("string");
    expect(typeof deletedTransaction.time).toBe("object");
    expect(typeof deletedTransaction.targetId).toBe("string");
    expect(typeof deletedTransaction.amount).toBe("number");
    expect(typeof deletedTransaction.revertStatus).toBe("string");
})