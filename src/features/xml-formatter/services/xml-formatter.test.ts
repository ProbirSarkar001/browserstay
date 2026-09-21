import { describe, expect, it } from "vitest";
import { formatXml, minifyXml } from "./xml-formatter";

describe("formatXml", () => {
  it("indents nested elements", () => {
    expect(formatXml("<root><child>text</child></root>", "2")).toBe(
      ["<root>", "  <child>text</child>", "</root>"].join("\n")
    );
  });

  it("supports tab indentation", () => {
    expect(formatXml("<root><child/></root>", "tab")).toBe(["<root>", "\t<child/>", "</root>"].join("\n"));
  });

  it("preserves CDATA content", () => {
    expect(formatXml("<root><![CDATA[a > b]]></root>", "2")).toBe("<root><![CDATA[a > b]]></root>");
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
    expect(formatXml("<root>a  b</root>", "2")).toBe("<root>a  b</root>");
  });

  it("preserves whitespace-sensitive text such as <pre> content", () => {
    expect(formatXml("<doc><pre>  code  </pre></doc>", "2")).toBe(
      ["<doc>", "  <pre>  code  </pre>", "</doc>"].join("\n")
    );
  });

  it("keeps mixed content on one line so text is not reflowed", () => {
    expect(formatXml("<p>Hello <b>world</b>!</p>", "2")).toBe("<p>Hello <b>world</b>!</p>");
  });

  it("re-indents a child separated only by spaces", () => {
    expect(formatXml("<root> <child/> </root>", "2")).toBe(["<root>", "  <child/>", "</root>"].join("\n"));
  });

  it("handles a DOCTYPE with an internal subset", () => {
    expect(formatXml('<!DOCTYPE root [ <!ELEMENT root (#PCDATA)> ]><root>text</root>', "2")).toBe(
      ["<!DOCTYPE root [ <!ELEMENT root (#PCDATA)> ]>", "<root>text</root>"].join("\n")
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

  it("preserves whitespace-sensitive text such as <pre> content", () => {
    expect(minifyXml("<doc>\n  <pre>  code  </pre>\n</doc>")).toBe("<doc><pre>  code  </pre></doc>");
  });

  it("drops whitespace-only element content", () => {
    expect(minifyXml("<root><x>   </x></root>")).toBe("<root><x></x></root>");
  });

  it("empties an element whose content is only a newline", () => {
    expect(minifyXml("<root><x>\n</x></root>")).toBe("<root><x></x></root>");
  });

  it("drops the separator between inline elements", () => {
    expect(minifyXml("<p><b>a</b> <i>b</i></p>")).toBe("<p><b>a</b><i>b</i></p>");
  });

  it("throws for invalid XML", () => {
    expect(() => minifyXml("<root><a></root>")).toThrow();
  });
});
