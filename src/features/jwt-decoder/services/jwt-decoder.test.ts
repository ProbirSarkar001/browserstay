import { describe, expect, it } from "vitest";
import { decodeJwt } from "./jwt-decoder";
import { SAMPLE_JWT, UNICODE_JWT } from "../constants";

describe("decodeJwt", () => {
  it("decodes the header and payload of a valid token", () => {
    const result = decodeJwt(SAMPLE_JWT);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.header).toEqual({ alg: "HS256", typ: "JWT" });
      expect(result.payload).toMatchObject({
        sub: "1234567890",
        name: "Ada Lovelace",
        iat: 1516239022,
        exp: 4102444800
      });
      expect(result.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    }
  });

  it("decodes non-ASCII payloads", () => {
    const result = decodeJwt(UNICODE_JWT);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload).toEqual({ name: "— naïve ✓" });
    }
  });

  it("tolerates surrounding whitespace", () => {
    const result = decodeJwt(`  ${SAMPLE_JWT}\n`);
    expect(result.ok).toBe(true);
  });

  it("rejects empty input", () => {
    expect(decodeJwt("   ")).toEqual({ ok: false, message: "Paste a JSON Web Token to decode." });
  });

  it("rejects tokens that do not have three parts", () => {
    const result = decodeJwt("abc.def");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("three dot-separated parts");
    }
  });

  it("rejects parts that are not Base64URL-encoded JSON", () => {
    const result = decodeJwt("!!!.!!!.sig");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("Could not decode");
    }
  });
});
