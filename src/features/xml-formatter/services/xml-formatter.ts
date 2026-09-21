import xmlFormat from "xml-formatter";
import type { XmlIndent } from "../types";

const INDENTATION: Record<XmlIndent, string> = {
  "2": "  ",
  "4": "    ",
  tab: "\t"
};

/**
 * @human Pretty-prints XML.
 * @ai-agent `collapseContent` keeps elements that hold text (including mixed
 * content like `<p>Hello <b>world</b>!</p>`) on one line, `lineSeparator` is
 * pinned to `\n` (the library defaults to `\r\n`), and `strictMode` throws on
 * malformed XML instead of silently auto-closing tags. Do not reintroduce
 * `DOMParser.parseFromString` — CodeQL flags it as a DOM-XSS sink
 * (`js/xss-through-dom` → `HtmlParserSink`).
 */
export function formatXml(input: string, indent: XmlIndent): string {
  return xmlFormat(input, {
    indentation: INDENTATION[indent],
    lineSeparator: "\n",
    collapseContent: true,
    strictMode: true
  });
}

/** @human Strips insignificant whitespace. */
export function minifyXml(input: string): string {
  return xmlFormat.minify(input, { strictMode: true });
}
