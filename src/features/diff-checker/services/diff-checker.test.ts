import { describe, expect, it } from "vitest";
import { diffText, toUnifiedText } from "./diff-checker";

describe("diffText", () => {
  it("reports identical texts", () => {
    const result = diffText("a\nb\nc", "a\nb\nc");

    expect(result.summary).toEqual({ additions: 0, deletions: 0, unchanged: 3, identical: true });
    expect(result.lines.every((line) => line.op === "equal")).toBe(true);
    expect(result.truncated).toBe(false);
  });

  it("treats a trailing newline and CRLF as insignificant", () => {
    expect(diffText("a\nb\n", "a\r\nb").summary.identical).toBe(true);
  });

  it("detects a changed line as a delete plus insert", () => {
    const result = diffText("a\nb\nc", "a\nB\nc");

    expect(result.summary).toMatchObject({ additions: 1, deletions: 1, unchanged: 2, identical: false });
    expect(result.lines.map((line) => line.op)).toEqual(["equal", "delete", "insert", "equal"]);
  });

  it("detects an inserted line", () => {
    const result = diffText("a\nc", "a\nb\nc");

    expect(result.summary).toMatchObject({ additions: 1, deletions: 0, unchanged: 2 });
    expect(result.lines.map((line) => line.value)).toEqual(["a", "b", "c"]);
  });

  it("detects a deleted line", () => {
    const result = diffText("a\nb\nc", "a\nc");

    expect(result.summary).toMatchObject({ additions: 0, deletions: 1, unchanged: 2 });
  });

  it("assigns line numbers per side", () => {
    const result = diffText("a\nb\nc", "a\nc");
    const deleted = result.lines.find((line) => line.op === "delete");

    expect(deleted).toMatchObject({ value: "b", leftNumber: 2, rightNumber: null });
    expect(result.lines.at(-1)).toMatchObject({ value: "c", leftNumber: 3, rightNumber: 2 });
  });

  it("handles empty inputs", () => {
    expect(diffText("", "").summary.identical).toBe(true);

    const added = diffText("", "a\nb");
    expect(added.summary).toMatchObject({ additions: 2, deletions: 0 });

    const removed = diffText("a\nb", "");
    expect(removed.summary).toMatchObject({ additions: 0, deletions: 2 });
  });

  it("falls back to a coarse diff for very large inputs", () => {
    const left = Array.from({ length: 3001 }, (_, index) => `a${index}`).join("\n");
    const right = Array.from({ length: 3001 }, (_, index) => `b${index}`).join("\n");

    const result = diffText(left, right);

    expect(result.truncated).toBe(true);
    expect(result.summary).toMatchObject({ additions: 3001, deletions: 3001, unchanged: 0 });
  });

  it("keeps shared prefix and suffix in the coarse diff", () => {
    const left = ["same", ...Array.from({ length: 3000 }, (_, index) => `a${index}`), "end"].join("\n");
    const right = ["same", ...Array.from({ length: 3000 }, (_, index) => `b${index}`), "end"].join("\n");

    const result = diffText(left, right);

    expect(result.truncated).toBe(true);
    expect(result.lines[0]).toMatchObject({ op: "equal", value: "same" });
    expect(result.lines.at(-1)).toMatchObject({ op: "equal", value: "end" });
  });
});

describe("toUnifiedText", () => {
  it("prefixes each line by its operation", () => {
    expect(toUnifiedText(diffText("a\nb", "a\nc"))).toBe(" a\n-b\n+c");
  });
});
