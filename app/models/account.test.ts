import { createAccount, deleteAccount, getAccountById, getAccountsByUserId, updateAccount } from "./account.server";
import { getUserByEmail } from "./user.server";
import { E } from "vitest/dist/reporters-yx5ZTtEV";

test("test account crud queries", async() => {
    var user = await getUserByEmail("rachel@remix.run");
    expect(user != null).toBe(true);
    if (user !== null) {
        var accounts = await getAccountsByUserId(user.id);
        expect(accounts?.length).toBe(1);

        var account = await createAccount(user.id, "checking", "rachel's account", "test", "test", "OWNER");
        expect(typeof account.id).toBe("string");
        expect(typeof account.type).toBe("string");
        expect(typeof account.currentBalance).toBe("number");
        expect(typeof account.targetId).toBe("string");

        accounts = await getAccountsByUserId(user.id);
        expect(accounts?.length).toBe(2);

        var readAccount = await getAccountById(account.id);

        expect(typeof readAccount?.id).toBe("string");
        expect(typeof readAccount?.type).toBe("string");
        expect(typeof readAccount?.currentBalance).toBe("number");
        expect(typeof readAccount?.targetId).toBe("string");

        var deletedAccount = await deleteAccount(account.id);
        expect(deletedAccount != null).toBe(true);
    }
})