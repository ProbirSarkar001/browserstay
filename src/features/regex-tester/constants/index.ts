import type { RegexFlag } from "../types";

export const FLAG_OPTIONS: { value: RegexFlag; label: string; description: string }[] = [
  { value: "g", label: "g", description: "Global — find all matches" },
  { value: "i", label: "i", description: "Ignore case" },
  { value: "m", label: "m", description: "Multiline — ^ and $ match per line" },
  { value: "s", label: "s", description: "Dotall — . matches newlines" },
  { value: "u", label: "u", description: "Unicode" }
];

export const SAMPLE_PATTERN = "(?<user>[\\w.+-]+)@([\\w-]+\\.[\\w.]+)";

export const SAMPLE_TEXT = `Contact ada@example.com or grace@navy.mil for details.
Invalid addresses like not-an-email@ or @missing.com are skipped.`;
