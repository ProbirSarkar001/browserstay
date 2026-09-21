import type { DiffLine, DiffOp, DiffResult, DiffSummary } from "../types";

/** Above these limits the O(n·m) table is replaced with a coarse diff. */
const MAX_TOTAL_LINES = 5000;
const MAX_CELLS = 4_000_000;

/**
 * @human Compares two texts line by line and returns the operations needed to
 * turn the left text into the right text, along with summary counts.
 */
export function diffText(left: string, right: string): DiffResult {
  const a = splitLines(left);
  const b = splitLines(right);
  const tooLarge = a.length + b.length > MAX_TOTAL_LINES || a.length * b.length > MAX_CELLS;
  const ops = tooLarge ? coarseDiff(a, b) : lcsDiff(a, b);

  return {
    lines: withLineNumbers(ops),
    summary: summarize(ops),
    truncated: tooLarge
  };
}

/** Renders a diff as a unified-style text block (` `, `-`, `+` prefixes). */
export function toUnifiedText(result: DiffResult): string {
  const marker: Record<DiffOp, string> = { equal: " ", delete: "-", insert: "+" };
  return result.lines.map((line) => marker[line.op] + line.value).join("\n");
}

/**
 * @ai-agent Splits on `\n`, normalises CRLF, and ignores a single trailing
 * newline so "a\n" and "a" compare as identical.
 */
function splitLines(text: string): string[] {
  if (!text) {
    return [];
  }
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines;
}

function lcsDiff(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const width = m + 1;
  const table = new Uint32Array((n + 1) * width);

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      table[i * width + j] =
        a[i] === b[j]
          ? table[(i + 1) * width + j + 1] + 1
          : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    }
  }

  const ops: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push(line("equal", a[i]));
      i += 1;
      j += 1;
    } else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) {
      ops.push(line("delete", a[i]));
      i += 1;
    } else {
      ops.push(line("insert", b[j]));
      j += 1;
    }
  }
  while (i < n) {
    ops.push(line("delete", a[i]));
    i += 1;
  }
  while (j < m) {
    ops.push(line("insert", b[j]));
    j += 1;
  }
  return ops;
}

/** Trims the common prefix and suffix, then marks the middle as replaced. */
function coarseDiff(a: string[], b: string[]): DiffLine[] {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    start += 1;
  }

  let end = 0;
  while (end < a.length - start && end < b.length - start && a[a.length - 1 - end] === b[b.length - 1 - end]) {
    end += 1;
  }

  const ops: DiffLine[] = [];
  for (let index = 0; index < start; index += 1) {
    ops.push(line("equal", a[index]));
  }
  for (let index = start; index < a.length - end; index += 1) {
    ops.push(line("delete", a[index]));
  }
  for (let index = start; index < b.length - end; index += 1) {
    ops.push(line("insert", b[index]));
  }
  for (let index = a.length - end; index < a.length; index += 1) {
    ops.push(line("equal", a[index]));
  }
  return ops;
}

function line(op: DiffOp, value: string): DiffLine {
  return { op, value, leftNumber: null, rightNumber: null };
}

function withLineNumbers(ops: DiffLine[]): DiffLine[] {
  let leftNumber = 1;
  let rightNumber = 1;

  return ops.map((entry) => {
    const next = { ...entry };
    if (entry.op !== "insert") {
      next.leftNumber = leftNumber;
      leftNumber += 1;
    }
    if (entry.op !== "delete") {
      next.rightNumber = rightNumber;
      rightNumber += 1;
    }
    return next;
  });
}

function summarize(ops: DiffLine[]): DiffSummary {
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const entry of ops) {
    if (entry.op === "insert") {
      additions += 1;
    } else if (entry.op === "delete") {
      deletions += 1;
    } else {
      unchanged += 1;
    }
  }

  return { additions, deletions, unchanged, identical: additions === 0 && deletions === 0 };
}
