import { safeSync } from "@/shared/utils";
import type { JsonIndent, JsonValidationResult } from "../types";

export function validateJson(input: string): JsonValidationResult {
  if (!input.trim()) {
    return { valid: false, message: "JSON is empty" };
  }

  const [value, error] = safeSync(() => JSON.parse(input));
  if (error) {
    return { valid: false, message: error.message };
  }

  return { valid: true, value };
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
