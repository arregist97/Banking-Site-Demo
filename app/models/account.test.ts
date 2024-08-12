import { createAccount, deleteAccount, getAccountById, getAccountsByUserId } from "./account.server";
import { getUserByEmail } from "./user.server";

test("account crud queries", async() => {
    const user = await getUserByEmail("rachel@remix.run");
    if(!user) {
        throw new Error("Test user not found.")
    }
    const accounts = await getAccountsByUserId(user.id);
    expect(accounts?.length).toBe(1);

    const account = await createAccount(user.id, "checking", "rachel's account", "test", "test", "OWNER");
    expect(typeof account.id).toBe("number");
    expect(typeof account.uid).toBe("string");
    expect(typeof account.type).toBe("string");
    expect(typeof account.currentBalance).toBe("number");
    expect(typeof account.targetId).toBe("number");

    const updatedAccounts = await getAccountsByUserId(user.id);
    expect(updatedAccounts?.length).toBe(2);

    const readAccount = await getAccountById(account.id);

    expect(typeof readAccount?.id).toBe("number");
    expect(typeof readAccount?.uid).toBe("string");
    expect(typeof readAccount?.type).toBe("string");
    expect(typeof readAccount?.currentBalance).toBe("number");
    expect(typeof readAccount?.targetId).toBe("number");

    const deletedAccount = await deleteAccount(account.id);
    expect(deletedAccount != null).toBe(true);
})