import { describe, expect, it } from "vitest";
import { safe, safeSync } from "./safe";

describe("safeSync", () => {
  it("returns the value and a null error on success", () => {
    expect(safeSync(() => JSON.parse('{"a":1}'))).toEqual([{ a: 1 }, null]);
  });

  it("returns a null value and the thrown error on failure", () => {
    const [value, error] = safeSync(() => JSON.parse("{"));

    expect(value).toBeNull();
    expect(error).toBeInstanceOf(SyntaxError);
  });
});

describe("safe", () => {
  it("resolves to the value and a null error on success", async () => {
    await expect(safe(Promise.resolve("ok"))).resolves.toEqual(["ok", null]);
  });

  it("resolves to a null value and the rejection error on failure", async () => {
    const [value, error] = await safe(Promise.reject(new Error("boom")));

    expect(value).toBeNull();
    expect(error).toBeInstanceOf(Error);
  });
});
