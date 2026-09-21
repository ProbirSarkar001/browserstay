import { dump, load, YAMLException } from "js-yaml";
import type { ConversionDirection, ConversionResult, IndentOption } from "../types";

/**
 * @human Converts between JSON and YAML in either direction, entirely in the
 * browser. Returns either the converted text or a parse error with its location.
 */
export function convert(
  input: string,
  direction: ConversionDirection,
  indent: IndentOption
): ConversionResult {
  if (!input.trim()) {
    return { ok: false, message: "Input is empty", line: 0, column: 0 };
  }

  const spaces = Number(indent);

  try {
    if (direction === "json-to-yaml") {
      const value: unknown = JSON.parse(input);
      const output = dump(value, { indent: spaces, lineWidth: -1 });
      return { ok: true, output: output.replace(/\n$/, "") };
    }

    const value = load(input);
    return { ok: true, output: JSON.stringify(value ?? null, null, spaces) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Conversion failed";
    const at = direction === "json-to-yaml" ? locateJsonError(input) : locateYamlError(error);
    return { ok: false, message, ...at };
  }
}

/**
 * @ai-agent js-yaml throws a `YAMLException` whose zero-based `mark` points at the
 * problem. The UI reports one-based lines and columns.
 */
function locateYamlError(error: unknown): { line: number; column: number } {
  if (error instanceof YAMLException && error.mark) {
    return { line: error.mark.line + 1, column: error.mark.column + 1 };
  }
  return { line: 0, column: 0 };
}

const WHITESPACE = /\s/;

/**
 * @ai-agent Chromium reports `JSON.parse` failures as "Unexpected token …" without
 * a position, so scan the document for the first syntax error ourselves.
 */
function locateJsonError(input: string): { line: number; column: number } {
  const index = findJsonErrorIndex(input);
  if (index < 0) {
    return { line: 0, column: 0 };
  }
  const lines = input.slice(0, index).split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

/**
 * @human Returns the index of the first JSON syntax error, or -1 when the input
 * is structurally valid.
 */
function findJsonErrorIndex(input: string): number {
  let index = 0;

  function skipWhitespace(): void {
    while (index < input.length && WHITESPACE.test(input[index])) {
      index += 1;
    }
  }

  function readString(): boolean {
    index += 1;
    while (index < input.length) {
      const char = input[index];
      if (char === '"') {
        index += 1;
        return true;
      }
      index += char === "\\" ? 2 : 1;
    }
    return false;
  }

  function readScalar(): boolean {
    const match = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/.exec(
      input.slice(index)
    );
    if (!match) {
      return false;
    }
    index += match[0].length;
    return true;
  }

  function readValue(): boolean {
    skipWhitespace();
    const char = input[index];
    if (char === "{") {
      return readObject();
    }
    if (char === "[") {
      return readArray();
    }
    return char === '"' ? readString() : readScalar();
  }

  function readObject(): boolean {
    index += 1;
    skipWhitespace();
    if (input[index] === "}") {
      index += 1;
      return true;
    }
    for (;;) {
      skipWhitespace();
      if (input[index] !== '"' || !readString()) {
        return false;
      }
      skipWhitespace();
      if (input[index] !== ":") {
        return false;
      }
      index += 1;
      if (!readValue()) {
        return false;
      }
      skipWhitespace();
      if (input[index] === ",") {
        index += 1;
        continue;
      }
      if (input[index] === "}") {
        index += 1;
        return true;
      }
      return false;
    }
  }

  function readArray(): boolean {
    index += 1;
    skipWhitespace();
    if (input[index] === "]") {
      index += 1;
      return true;
    }
    for (;;) {
      if (!readValue()) {
        return false;
      }
      skipWhitespace();
      if (input[index] === ",") {
        index += 1;
        continue;
      }
      if (input[index] === "]") {
        index += 1;
        return true;
      }
      return false;
    }
  }

  if (!readValue()) {
    return index;
  }
  skipWhitespace();
  return index >= input.length ? -1 : index;
}
