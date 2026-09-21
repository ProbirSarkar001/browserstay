import { describe, expect, it } from "vitest";
import { decodeBase64, encodeBase64 } from "./base64";

describe("encodeBase64", () => {
  it("encodes UTF-8 text as standard Base64 by default", () => {
    expect(encodeBase64("Hello, BrowserStay! 🔒")).toBe("SGVsbG8sIEJyb3dzZXJTdGF5ISDwn5SS");
    expect(encodeBase64("foobar")).toBe("Zm9vYmFy");
  });

  it("swaps + and / for - and _ and drops padding in URL-safe mode", () => {
    expect(encodeBase64("??>>", { alphabet: "url-safe" })).toBe("Pz8-Pg");
    expect(encodeBase64("ÿÿ", { alphabet: "url-safe" })).toBe("w7_Dvw");
    expect(encodeBase64("foob", { alphabet: "url-safe" })).toBe("Zm9vYg");
  });

  it("leaves padded output in standard mode", () => {
    expect(encodeBase64("??>>")).toBe("Pz8+Pg==");
    expect(encodeBase64("ÿÿ")).toBe("w7/Dvw==");
  });
});

describe("decodeBase64", () => {
  it("decodes standard Base64 with padding", () => {
    expect(decodeBase64("SGVsbG8sIEJyb3dzZXJTdGF5ISDwn5SS")).toBe("Hello, BrowserStay! 🔒");
  });

  it("decodes URL-safe Base64 with - and _ and no padding", () => {
    expect(decodeBase64("Pz8-Pg")).toBe("??>>");
    expect(decodeBase64("w7_Dvw")).toBe("ÿÿ");
    expect(decodeBase64("c3ViamVjdHM_X2Q")).toBe("subjects?_d");
  });

  it("ignores whitespace and accepts missing padding", () => {
    expect(decodeBase64("Zm9vYmE")).toBe("fooba");
    expect(decodeBase64("SGVs\nbG8=")).toBe("Hello");
  });

  it("round-trips text through both alphabets", () => {
    const text = "Grüße, 🌍 — 42";

    expect(decodeBase64(encodeBase64(text))).toBe(text);
    expect(decodeBase64(encodeBase64(text, { alphabet: "url-safe" }))).toBe(text);
  });

  it("throws on characters that are not Base64", () => {
    expect(() => decodeBase64("not base64!!")).toThrow();
  });
});
