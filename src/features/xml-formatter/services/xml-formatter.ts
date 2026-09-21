import type { XmlIndent, XmlValidationResult } from "../types";

const CDATA_START = "<![CDATA[";
const CDATA_END = "]]>";

type TokenType = "open" | "close" | "self" | "special" | "text";

interface Token {
  type: TokenType;
  value: string;
}

type XmlNode =
  | { kind: "text"; value: string }
  | { kind: "leaf"; value: string }
  | { kind: "element"; open: string; close: string; children: XmlNode[] };

type XmlElementNode = Extract<XmlNode, { kind: "element" }>;

interface OpenElement {
  open: string;
  children: XmlNode[];
}

const WHITESPACE_ONLY = /^\s*$/;
const HAS_NEWLINE = /[\r\n]/;

/**
 * @human Validates XML by walking its tags with a stack and reporting the first
 * structural problem it finds.
 * @ai-agent Do not reintroduce `DOMParser.parseFromString`. CodeQL flags it as a
 * DOM-XSS sink (`js/xss-through-dom` → `HtmlParserSink`), and we only need
 * well-formedness here — never a live document.
 */
export function validateXml(input: string): XmlValidationResult {
  if (!input.trim()) {
    return { valid: false, message: "XML is empty" };
  }

  const stack: string[] = [];
  let hasRoot = false;
  let rootClosed = false;

  for (const token of tokenize(input)) {
    if (token.type !== "text" && !token.value.endsWith(">")) {
      return { valid: false, message: `Unterminated markup: ${token.value}` };
    }

    switch (token.type) {
      case "text": {
        if ((!hasRoot || rootClosed) && token.value.trim()) {
          return { valid: false, message: "Text is not allowed outside the root element" };
        }
        break;
      }
      case "open":
      case "self": {
        if (rootClosed) {
          return { valid: false, message: "Only one root element is allowed" };
        }
        const name = tagName(token.value);
        if (!name) {
          return { valid: false, message: `Malformed tag: ${token.value}` };
        }
        if (token.type === "open") {
          stack.push(name);
        } else if (!stack.length) {
          rootClosed = true;
        }
        hasRoot = true;
        break;
      }
      case "close": {
        const name = tagName(token.value);
        const open = stack.pop();
        if (open === undefined) {
          return { valid: false, message: `Unexpected closing tag </${name}>` };
        }
        if (open !== name) {
          return { valid: false, message: `Expected </${open}> but found </${name}>` };
        }
        if (!stack.length) {
          rootClosed = true;
        }
        break;
      }
      case "special":
        break;
    }
  }

  if (!hasRoot) {
    return { valid: false, message: "Missing root element" };
  }
  if (stack.length) {
    return { valid: false, message: `Unclosed tag <${stack[stack.length - 1]}>` };
  }

  return { valid: true };
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

/** Reads the element name out of an opening, closing or self-closing tag. */
function tagName(value: string): string {
  const inner = value.slice(1, -1).trim().replace(/^\//, "");
  return /^([^\s/>]+)/.exec(inner)?.[1] ?? "";
}

/**
 * @ai-agent Builds the tree from the token stream. Text nodes keep their exact
 * value: leading, trailing and internal whitespace is data, not formatting.
 */
function parseXml(input: string): XmlNode[] {
  const rootNodes: XmlNode[] = [];
  const stack: OpenElement[] = [];

  const current = () => (stack.length ? stack[stack.length - 1].children : rootNodes);

  for (const token of tokenize(input.trim())) {
    switch (token.type) {
      case "text":
        current().push({ kind: "text", value: token.value });
        break;
      case "open":
        stack.push({ open: token.value.trim(), children: [] });
        break;
      case "close": {
        const element = stack.pop();
        if (element) {
          current().push({
            kind: "element",
            open: element.open,
            close: token.value.trim(),
            children: element.children
          });
        }
        break;
      }
      case "self":
      case "special":
        current().push({ kind: "leaf", value: token.value.trim() });
        break;
    }
  }

  return rootNodes;
}

/**
 * @human A whitespace-only node that only exists to lay out the markup.
 * @ai-agent Whitespace without a newline is *not* indentation — it can separate
 * inline elements (e.g. `<p><b>a</b> <i>b</i></p>`) and must be preserved.
 */
function isIndentation(node: XmlNode): boolean {
  return node.kind === "text" && WHITESPACE_ONLY.test(node.value) && HAS_NEWLINE.test(node.value);
}

/**
 * @human True when an element holds only elements, comments or CDATA, so its
 * children can be re-indented without altering any text content.
 */
function isIndentable(element: XmlElementNode): boolean {
  const hasChildNodes = element.children.some((child) => child.kind !== "text");
  const hasText = element.children.some((child) => child.kind === "text" && !isIndentation(child));
  return hasChildNodes && !hasText;
}

/**
 * Serializes a node without adding any whitespace, so text content survives
 * verbatim. Used for every element that contains text (mixed content).
 */
function serializeInline(node: XmlNode): string {
  switch (node.kind) {
    case "text":
      return node.value;
    case "leaf":
      return node.value;
    case "element":
      return `${node.open}${node.children.map(serializeInline).join("")}${node.close}`;
  }
}

export function formatXml(input: string, indent: XmlIndent): string {
  const result = validateXml(input);
  if (!result.valid) {
    throw new Error(result.message);
  }

  const pad = indent === "tab" ? "\t" : " ".repeat(Number(indent));
  const lines: string[] = [];

  const emit = (node: XmlNode, depth: number) => {
    if (node.kind === "text") {
      return;
    }
    if (node.kind === "element" && isIndentable(node)) {
      lines.push(pad.repeat(depth) + node.open);
      for (const child of node.children) {
        emit(child, depth + 1);
      }
      lines.push(pad.repeat(depth) + node.close);
      return;
    }
    lines.push(pad.repeat(depth) + serializeInline(node));
  };

  for (const node of parseXml(input)) {
    emit(node, 0);
  }

  return lines.join("\n");
}

export function minifyXml(input: string): string {
  const result = validateXml(input);
  if (!result.valid) {
    throw new Error(result.message);
  }

  const parts: string[] = [];

  const walk = (nodes: XmlNode[]) => {
    // Whitespace only exists to indent markup; when there is no sibling markup it
    // is the element's content and has to be kept.
    const hasMarkup = nodes.some((node) => node.kind !== "text");

    for (const node of nodes) {
      if (hasMarkup && isIndentation(node)) {
        continue;
      }
      if (node.kind === "element") {
        parts.push(node.open);
        walk(node.children);
        parts.push(node.close);
      } else {
        parts.push(node.value);
      }
    }
  };

  walk(parseXml(input));
  return parts.join("");
}
