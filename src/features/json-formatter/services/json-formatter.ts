import type { JsonIndent, JsonValidationResult } from "../types";

export function validateJson(input: string): JsonValidationResult {
  if (!input.trim()) {
    return { valid: false, message: "JSON is empty", line: 0, column: 0 };
  }

  try {
    return { valid: true, value: JSON.parse(input) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    const { line, column } = locateError(input, message);
    return { valid: false, message, line, column };
  }
}

export function formatJson(input: string, indent: JsonIndent): string {
  const result = validateJson(input);
  if (!result.valid) {
    throw new Error(result.message);
  }
  return JSON.stringify(result.value, null, indent === "tab" ? "\t" : Number(indent));
}

export function minifyJson(input: string): string {
  const result = validateJson(input);
  if (!result.valid) {
    throw new Error(result.message);
  }
  return JSON.stringify(result.value);
}

/** Extracts a human-readable line/column from a JSON.parse error message. */
function locateError(input: string, message: string): { line: number; column: number } {
  const match = message.match(/position (\d+)/i);
  if (!match) {
    return { line: 0, column: 0 };
  }

  const position = Math.min(Number(match[1]), input.length);
  const before = input.slice(0, position);
  const lines = before.split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}
