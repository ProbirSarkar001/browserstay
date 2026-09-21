import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
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
      const value = JSON.parse(input) as unknown;
      const output = stringifyYaml(value, { indent: spaces, lineWidth: 0 });
      return { ok: true, output: output.replace(/\n$/, "") };
    }

    const value = parseYaml(input) as unknown;
    return { ok: true, output: JSON.stringify(value ?? null, null, spaces) };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Conversion failed",
      ...(direction === "json-to-yaml" ? locateJsonError(input, error) : locateYamlError(error))
    };
  }
}

/**
 * @ai-agent Firefox/Safari and older V8 include a position in the JSON.parse
 * message; current V8 (Chrome/Edge) does not. When the message has no position,
 * fall back to `findJsonErrorIndex` so the UI still reports a real location.
 */
function locateJsonError(input: string, error: unknown): { line: number; column: number } {
  const message = error instanceof Error ? error.message : "";

  const lineColumn = message.match(/line (\d+) column (\d+)/i);
  if (lineColumn) {
    return { line: Number(lineColumn[1]), column: Number(lineColumn[2]) };
  }

  const position = message.match(/position (\d+)/i);
  if (position) {
    const index = Math.min(Number(position[1]), input.length);
    return indexToLineColumn(input, index);
  }

  const index = findJsonErrorIndex(input);
  return index < 0 ? { line: 0, column: 0 } : indexToLineColumn(input, index);
}

function indexToLineColumn(input: string, index: number): { line: number; column: number } {
  const lines = input.slice(0, index).split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

const WHITESPACE = /\s/;

/**
 * @human Minimal JSON scanner used only to locate the first syntax error after
 * `JSON.parse` has already rejected the input. Returns the character index of
 * the error, or -1 if the input looks structurally valid.
 */
function findJsonErrorIndex(input: string): number {
  let index = 0;

  const skipWhitespace = () => {
    while (index < input.length && WHITESPACE.test(input[index])) {
      index += 1;
    }
  };

  const parseString = (): boolean => {
    index += 1;
    while (index < input.length) {
      const char = input[index];
      if (char === '"') {
        index += 1;
        return true;
      }
      if (char === "\\") {
        index += 1;
        const escape = input[index];
        if (escape === "u") {
          index += 1;
          for (let digit = 0; digit < 4; digit += 1) {
            if (!/^[0-9a-fA-F]$/.test(input[index] ?? "")) {
              return false;
            }
            index += 1;
          }
          continue;
        }
        if (escape === undefined) {
          return false;
        }
        index += 1;
        continue;
      }
      index += 1;
    }
    return false;
  };

  const parseNumber = (): boolean => {
    const match = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(input.slice(index));
    if (!match) {
      return false;
    }
    index += match[0].length;
    return true;
  };

  const parseLiteral = (literal: string): boolean => {
    if (!input.startsWith(literal, index)) {
      return false;
    }
    index += literal.length;
    return true;
  };

  const parseObject = (): boolean => {
    index += 1;
    skipWhitespace();
    if (input[index] === "}") {
      index += 1;
      return true;
    }
    for (;;) {
      skipWhitespace();
      if (input[index] !== '"' || !parseString()) {
        return false;
      }
      skipWhitespace();
      if (input[index] !== ":") {
        return false;
      }
      index += 1;
      if (!parseValue()) {
        return false;
      }
      skipWhitespace();
      const char = input[index];
      if (char === ",") {
        index += 1;
        continue;
      }
      if (char === "}") {
        index += 1;
        return true;
      }
      return false;
    }
  };

  const parseArray = (): boolean => {
    index += 1;
    skipWhitespace();
    if (input[index] === "]") {
      index += 1;
      return true;
    }
    for (;;) {
      if (!parseValue()) {
        return false;
      }
      skipWhitespace();
      const char = input[index];
      if (char === ",") {
        index += 1;
        continue;
      }
      if (char === "]") {
        index += 1;
        return true;
      }
      return false;
    }
  };

  function parseValue(): boolean {
    skipWhitespace();
    const char = input[index];
    if (char === "{") {
      return parseObject();
    }
    if (char === "[") {
      return parseArray();
    }
    if (char === '"') {
      return parseString();
    }
    if (char === "-" || (char !== undefined && char >= "0" && char <= "9")) {
      return parseNumber();
    }
    if (char === "t") {
      return parseLiteral("true");
    }
    if (char === "f") {
      return parseLiteral("false");
    }
    if (char === "n") {
      return parseLiteral("null");
    }
    return false;
  }

  if (!parseValue()) {
    return index;
  }
  skipWhitespace();
  return index >= input.length ? -1 : index;
}

/**
 * @ai-agent The `yaml` package attaches a `linePos` array (`{ line, col }`) to
 * parse errors. Prefer it over parsing the human-readable message.
 */
function locateYamlError(error: unknown): { line: number; column: number } {
  if (error && typeof error === "object" && "linePos" in error) {
    const linePos = (error as { linePos?: { line: number; col: number }[] }).linePos;
    const first = linePos?.[0];
    if (first) {
      return { line: first.line, column: first.col };
    }
  }
  return { line: 0, column: 0 };
}
