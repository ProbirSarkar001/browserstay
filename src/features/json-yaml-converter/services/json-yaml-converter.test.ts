import { describe, expect, it } from "vitest";
import { convert } from "./json-yaml-converter";

describe("convert JSON to YAML", () => {
  it("converts a flat object", () => {
    expect(convert('{"name":"BrowserStay","private":true,"meta":null}', "json-to-yaml", "2")).toEqual({
      ok: true,
      output: "name: BrowserStay\nprivate: true\nmeta: null"
    });
  });

  it("indents nested mappings with the selected width", () => {
    const two = convert('{"a":{"b":1}}', "json-to-yaml", "2");
    const four = convert('{"a":{"b":1}}', "json-to-yaml", "4");

    expect(two).toEqual({ ok: true, output: ["a:", "  b: 1"].join("\n") });
    expect(four).toEqual({ ok: true, output: ["a:", "    b: 1"].join("\n") });
  });

  it("rejects invalid JSON with a location", () => {
    const result = convert('{"a": }', "json-to-yaml", "2");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message.length).toBeGreaterThan(0);
      expect(result.line).toBe(1);
      expect(result.column).toBeGreaterThan(0);
    }
  });

  it("reports the line of an error inside a multi-line document", () => {
    const result = convert('{\n  "a": 1,\n  "b": }\n}', "json-to-yaml", "2");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.line).toBe(3);
      expect(result.column).toBe(8);
    }
  });
});

describe("convert YAML to JSON", () => {
  it("converts a flat mapping with the selected indentation", () => {
    expect(convert("name: BrowserStay\nprivate: true\nmeta: null\n", "yaml-to-json", "2")).toEqual({
      ok: true,
      output: '{\n  "name": "BrowserStay",\n  "private": true,\n  "meta": null\n}'
    });
  });

  it("round-trips nested data", () => {
    const source = { a: [1, 2, { b: "x" }], c: { d: false } };
    const yaml = convert(JSON.stringify(source), "json-to-yaml", "2");
    expect(yaml.ok).toBe(true);
    if (!yaml.ok) {
      return;
    }

    const back = convert(yaml.output, "yaml-to-json", "2");
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(JSON.parse(back.output)).toEqual(source);
    }
  });

  it("rejects invalid YAML with a location", () => {
    const result = convert("key: [1, 2", "yaml-to-json", "2");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message.length).toBeGreaterThan(0);
      expect(result.line).toBeGreaterThan(0);
    }
  });
});

describe("convert", () => {
  it("rejects empty input", () => {
    expect(convert("   ", "json-to-yaml", "2")).toEqual({
      ok: false,
      message: "Input is empty",
      line: 0,
      column: 0
    });
  });
});
