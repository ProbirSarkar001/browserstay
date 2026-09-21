import { describe, expect, it } from "vitest";
import { decodeUrl, encodeUrl } from "./url-encoder";

describe("decodeUrl", () => {
  it("keeps literal plus signs by default", () => {
    expect(decodeUrl("a+b")).toBe("a+b");
    expect(decodeUrl("/search?q=a+b")).toBe("/search?q=a+b");
  });

  it("decodes plus as a space when the input is form-encoded", () => {
    expect(decodeUrl("a+b", { plusAsSpace: true })).toBe("a b");
    expect(decodeUrl("/search?q=a+b", { plusAsSpace: true })).toBe("/search?q=a b");
  });

  it("decodes percent-encoded sequences", () => {
    expect(decodeUrl("%E2%9C%93")).toBe("✓");
  });

  it("throws on malformed percent-encoding", () => {
    expect(() => decodeUrl("100%")).toThrow();
  });
});

describe("round trips", () => {
  it("preserves a literal plus through full-URL encoding", () => {
    const input = "https://example.com/a+b?c=d+e";
    expect(decodeUrl(encodeUrl(input, { mode: "full", space: "percent" }))).toBe(input);
  });

  it("preserves a literal plus through component encoding", () => {
    const input = "a+b c";
    expect(decodeUrl(encodeUrl(input, { mode: "component", space: "percent" }))).toBe(input);
  });

  it("decodes spaces encoded as plus when plus handling is enabled", () => {
    const encoded = encodeUrl("hello world", { mode: "component", space: "plus" });

    expect(encoded).toBe("hello+world");
    expect(decodeUrl(encoded, { plusAsSpace: true })).toBe("hello world");
  });
});
