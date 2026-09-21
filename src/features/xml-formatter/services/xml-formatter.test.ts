import { describe, expect, it } from "vitest";
import { formatXml, minifyXml, validateXml } from "./xml-formatter";

describe("validateXml", () => {
  it("accepts well-formed XML", () => {
    expect(validateXml("<root><child>text</child></root>").valid).toBe(true);
  });

  it("rejects empty input", () => {
    const result = validateXml("   ");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.message).toBe("XML is empty");
    }
  });

  it("rejects malformed XML with a message", () => {
    const result = validateXml("<root><a></root>");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.message.length).toBeGreaterThan(0);
    }
  });
});

describe("formatXml", () => {
  it("indents nested elements", () => {
    expect(formatXml("<root><child>text</child></root>", "2")).toBe(
      ["<root>", "  <child>", "    text", "  </child>", "</root>"].join("\n")
    );
  });

  it("supports tab indentation", () => {
    expect(formatXml("<root><child/></root>", "tab")).toBe(["<root>", "\t<child/>", "</root>"].join("\n"));
  });

  it("preserves CDATA sections", () => {
    expect(formatXml("<root><![CDATA[a > b]]></root>", "2")).toBe(
      ["<root>", "  <![CDATA[a > b]]>", "</root>"].join("\n")
    );
  });

  it("preserves comments and processing instructions", () => {
    expect(formatXml('<?xml version="1.0"?><root><!-- hi --></root>', "2")).toBe(
      ['<?xml version="1.0"?>', "<root>", "  <!-- hi -->", "</root>"].join("\n")
    );
  });

  it("handles '>' inside attribute values", () => {
    expect(formatXml('<root attr="a>b"><child/></root>', "2")).toBe(
      ['<root attr="a>b">', "  <child/>", "</root>"].join("\n")
    );
  });

  it("preserves internal whitespace inside text nodes", () => {
    expect(formatXml("<root>a  b</root>", "2")).toBe(["<root>", "  a  b", "</root>"].join("\n"));
  });

  it("handles a DOCTYPE with an internal subset", () => {
    expect(formatXml('<!DOCTYPE root [ <!ELEMENT root (#PCDATA)> ]><root>text</root>', "2")).toBe(
      ["<!DOCTYPE root [ <!ELEMENT root (#PCDATA)> ]>", "<root>", "  text", "</root>"].join("\n")
    );
  });

  it("throws for invalid XML", () => {
    expect(() => formatXml("<root><a></root>", "2")).toThrow();
  });
});

describe("minifyXml", () => {
  it("collapses insignificant whitespace", () => {
    expect(minifyXml("<root>\n  <child>text</child>\n</root>")).toBe("<root><child>text</child></root>");
  });

  it("keeps text content and drops whitespace-only nodes", () => {
    expect(minifyXml("<root>\n  <child>hello world</child>\n</root>")).toBe("<root><child>hello world</child></root>");
  });

  it("preserves internal whitespace inside text nodes", () => {
    expect(minifyXml("<root>a  b</root>")).toBe("<root>a  b</root>");
  });

  it("throws for invalid XML", () => {
    expect(() => minifyXml("<root><a></root>")).toThrow();
  });
});
