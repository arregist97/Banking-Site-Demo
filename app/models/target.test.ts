import { getTargetByAccountId, getTargetByUserId } from "./target.server";

test("getTargetByAccountId", async() => {
    const id = 1;
    const target = await getTargetByAccountId(id);
    if (!target) {
        throw new Error("Target not found.");
    }
    expect(typeof target.id).toBe("number");
    expect(typeof target.uid).toBe("string");
    expect(typeof target.name).toBe("string");
    expect(typeof target.routingNumber).toBe("string");
    expect(typeof target.transitNumber).toBe("string");
});

test("getTargetByUserId", async() => {
    const id = 1;
    const target = await getTargetByUserId(id);
    if (!target) {
        throw new Error("Target not found.");
    }
    expect(typeof target.id).toBe("number");
    expect(typeof target.uid).toBe("string");
    expect(typeof target.name).toBe("string");
    expect(typeof target.routingNumber).toBe("string");
    expect(typeof target.transitNumber).toBe("string");
});