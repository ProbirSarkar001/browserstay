export type DiffOp = "equal" | "insert" | "delete";

export interface DiffLine {
  op: DiffOp;
  value: string;
  /** 1-based line number in the original text, or null for inserted lines. */
  leftNumber: number | null;
  /** 1-based line number in the changed text, or null for deleted lines. */
  rightNumber: number | null;
}

export interface DiffSummary {
  additions: number;
  deletions: number;
  unchanged: number;
  identical: boolean;
}

export interface DiffResult {
  lines: DiffLine[];
  summary: DiffSummary;
  /** True when the inputs were too large for the full algorithm and a coarse diff was used. */
  truncated: boolean;
}
