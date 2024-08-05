import { createAccount, deleteAccount } from "./account.server";
import { getUserByEmail } from "./user.server";
import { E } from "vitest/dist/reporters-yx5ZTtEV";

test("test test", () => {
    expect(true).toBe(true);
})

test("test account crud queries", async() => {
    var user = await getUserByEmail("rachel@remix.run");
    expect(user != null).toBe(true);
    if (user !== null) {
        var account = await createAccount(user.id, "checking", "rachel's account", "test", "test", "OWNER");
        console.log(account);

        var deletedAccount = await deleteAccount(account.id);
        console.log(deletedAccount);
    }
})