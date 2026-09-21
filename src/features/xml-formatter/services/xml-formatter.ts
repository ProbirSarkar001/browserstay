import type { XmlIndent, XmlValidationResult } from "../types";

const CDATA_START = "<![CDATA[";
const CDATA_END = "]]>";

type TokenType = "open" | "close" | "self" | "special" | "text";

interface Token {
  type: TokenType;
  value: string;
}

/**
 * @human Validates XML using the browser's native XML parser and reports the
 * parser's error message when the document is malformed.
 */
export function validateXml(input: string): XmlValidationResult {
  if (!input.trim()) {
    return { valid: false, message: "XML is empty" };
  }

  if (typeof DOMParser === "undefined") {
    return { valid: false, message: "XML validation requires a browser environment" };
  }

  const doc = new DOMParser().parseFromString(input, "application/xml");
  const errorNode = doc.getElementsByTagName("parsererror")[0];

  if (!errorNode) {
    return { valid: true };
  }

  const raw = errorNode.textContent ?? "Invalid XML";
  const message =
    raw
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line && !/^this page contains/i.test(line)) ?? "Invalid XML";
  return { valid: false, message };
}

/**
 * Finds the end of a tag, ignoring `>` inside quoted attribute values and inside
 * a `<!DOCTYPE … [ … ]>` internal subset.
 */
function readTagEnd(input: string, start: number): number {
  let quote: string | null = null;
  let bracketDepth = 0;

  for (let index = start; index < input.length; index += 1) {
    const char = input[index];
    if (quote) {
      if (char === quote) {
        quote = null;
      }
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "[") {
      bracketDepth += 1;
    } else if (char === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
    } else if (char === ">" && bracketDepth === 0) {
      return index + 1;
    }
  }

  return input.length;
}

/**
 * @ai-agent Splits XML into tags, comments, processing instructions, CDATA and
 * text. This avoids regex pitfalls with `>` inside CDATA or attribute values.
 * Do not replace with a naive `/<[^>]+>/g` split.
 */
function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    if (input[index] !== "<") {
      const next = input.indexOf("<", index);
      const end = next === -1 ? input.length : next;
      tokens.push({ type: "text", value: input.slice(index, end) });
      index = end;
      continue;
    }

    if (input.startsWith(CDATA_START, index)) {
      const end = input.indexOf(CDATA_END, index + CDATA_START.length);
      const stop = end === -1 ? input.length : end + CDATA_END.length;
      tokens.push({ type: "special", value: input.slice(index, stop) });
      index = stop;
      continue;
    }

    if (input.startsWith("<!--", index)) {
      const end = input.indexOf("-->", index + 4);
      const stop = end === -1 ? input.length : end + 3;
      tokens.push({ type: "special", value: input.slice(index, stop) });
      index = stop;
      continue;
    }

    if (input.startsWith("<?", index)) {
      const end = input.indexOf("?>", index + 2);
      const stop = end === -1 ? input.length : end + 2;
      tokens.push({ type: "special", value: input.slice(index, stop) });
      index = stop;
      continue;
    }

    const stop = readTagEnd(input, index + 1);
    const value = input.slice(index, stop);

    if (value.startsWith("</")) {
      tokens.push({ type: "close", value });
    } else if (value.startsWith("<!")) {
      tokens.push({ type: "special", value });
    } else if (value.endsWith("/>")) {
      tokens.push({ type: "self", value });
    } else {
      tokens.push({ type: "open", value });
    }

    index = stop;
  }

  return tokens;
}

/**
 * @ai-agent Only trims indentation at the node edges. Internal whitespace inside
 * a text node is data (e.g. inside `<pre>`) and must NOT be collapsed.
 */
function normalizeText(value: string): string {
  return value.trim();
}

export function formatXml(input: string, indent: XmlIndent): string {
  const result = validateXml(input);
  if (!result.valid) {
    throw new Error(result.message);
  }

  const pad = indent === "tab" ? "\t" : " ".repeat(Number(indent));
  const tokens = tokenize(input.trim());
  const lines: string[] = [];
  let depth = 0;

  for (const token of tokens) {
    switch (token.type) {
      case "close": {
        depth = Math.max(0, depth - 1);
        lines.push(pad.repeat(depth) + token.value.trim());
        break;
      }
      case "open": {
        lines.push(pad.repeat(depth) + token.value.trim());
        depth += 1;
        break;
      }
      case "self":
      case "special": {
        lines.push(pad.repeat(depth) + token.value.trim());
        break;
      }
      case "text": {
        const text = normalizeText(token.value);
        if (text) {
          lines.push(pad.repeat(depth) + text);
        }
        break;
      }
    }
  }

  return lines.join("\n");
}

export function minifyXml(input: string): string {
  const result = validateXml(input);
  if (!result.valid) {
    throw new Error(result.message);
  }

  const tokens = tokenize(input.trim());
  const parts: string[] = [];

  for (const token of tokens) {
    if (token.type === "text") {
      const text = normalizeText(token.value);
      if (text) {
        parts.push(text);
      }
    } else {
      parts.push(token.value.trim());
    }
  }

  return parts.join("");
}
