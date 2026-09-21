import { dump, load } from "js-yaml";
import { safeSync } from "@/shared/utils";
import type { ConversionDirection, ConversionResult, IndentOption } from "../types";

/**
 * @human Converts between JSON and YAML in either direction, entirely in the
 * browser. Returns either the converted text or the parser's error message.
 */
export function convert(
  input: string,
  direction: ConversionDirection,
  indent: IndentOption
): ConversionResult {
  if (!input.trim()) {
    return { ok: false, message: "Input is empty" };
  }

  const spaces = Number(indent);
  const [output, error] = safeSync(() => {
    if (direction === "json-to-yaml") {
      const value: unknown = JSON.parse(input);
      return dump(value, { indent: spaces, lineWidth: -1 }).replace(/\n$/, "");
    }

    return JSON.stringify(load(input) ?? null, null, spaces);
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, output };
}
