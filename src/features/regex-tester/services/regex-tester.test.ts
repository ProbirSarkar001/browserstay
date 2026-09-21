import { describe, expect, it } from "vitest";
import { MAX_MATCHES, applyReplacement, testRegex } from "./regex-tester";

describe("testRegex", () => {
  it("finds every global match with its index", () => {
    const result = testRegex("a", "g", "banana");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches.map((match) => match.index)).toEqual([1, 3, 5]);
      expect(result.matches[0].value).toBe("a");
    }
  });

  it("returns a single match when the global flag is absent", () => {
    const result = testRegex("a", "", "banana");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].index).toBe(1);
    }
  });

  it("captures numbered and named groups", () => {
    const result = testRegex("(?<user>\\w+)@(\\w+)", "", "ada@example");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches[0].groups).toEqual(["ada", "example"]);
      expect(result.matches[0].namedGroups).toEqual({ user: "ada" });
    }
  });

  it("honours the ignore-case flag", () => {
    const result = testRegex("HELLO", "gi", "hello Hello");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches).toHaveLength(2);
    }
  });

  it("does not loop forever on zero-length matches", () => {
    const result = testRegex("a*", "g", "b");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.matches.length).toBeLessThan(5);
    }
  });

  it("returns no matches for an empty pattern", () => {
    const result = testRegex("", "g", "anything");
    expect(result).toEqual({ ok: true, matches: [], truncated: false });
  });

  it("reports that results were not truncated", () => {
    const result = testRegex("a", "g", "banana");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.truncated).toBe(false);
    }
  });

  it("flags truncation when the match limit is reached", () => {
    const result = testRegex("a", "g", "a".repeat(MAX_MATCHES + 1));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches).toHaveLength(MAX_MATCHES);
      expect(result.truncated).toBe(true);
    }
  });

  it("does not flag truncation when the last match hits the limit exactly", () => {
    const result = testRegex("a", "g", "a".repeat(MAX_MATCHES));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches).toHaveLength(MAX_MATCHES);
      expect(result.truncated).toBe(false);
    }
  });

  it("reports invalid patterns", () => {
    const result = testRegex("(", "g", "text");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message.length).toBeGreaterThan(0);
    }
  });
});

describe("applyReplacement", () => {
  it("replaces every match and supports group references", () => {
    const result = applyReplacement("(\\w+)@\\w+", "", "$1", "ada@example grace@navy");

    expect(result).toEqual({ ok: true, output: "ada grace" });
  });

  it("adds the global flag when it is missing", () => {
    const result = applyReplacement("a", "", "x", "banana");
    expect(result).toEqual({ ok: true, output: "bxnxnx" });
  });

  it("leaves the text untouched for an empty pattern", () => {
    expect(applyReplacement("", "g", "x", "banana")).toEqual({ ok: true, output: "banana" });
  });

  it("reports invalid patterns", () => {
    const result = applyReplacement("(", "g", "x", "text");
    expect(result.ok).toBe(false);
  });
});
