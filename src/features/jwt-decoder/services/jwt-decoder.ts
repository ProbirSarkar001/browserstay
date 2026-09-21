import type { JwtDecodeResult } from "../types";

/**
 * @human Splits a JWT and decodes its header and payload. The signature is
 * returned as-is; this tool never verifies it, since that requires the secret
 * or public key.
 */
export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, message: "Paste a JSON Web Token to decode." };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      message: `A JWT has three dot-separated parts (header.payload.signature); this token has ${parts.length}.`
    };
  }

  const [headerPart, payloadPart, signature] = parts;

  try {
    const header = JSON.parse(base64UrlDecode(headerPart));
    const payload = JSON.parse(base64UrlDecode(payloadPart));
    return { ok: true, header, payload, signature };
  } catch {
    return {
      ok: false,
      message: "Could not decode this token. The header and payload must be valid Base64URL-encoded JSON."
    };
  }
}

/**
 * @ai-agent Base64URL replaces `+`/`/` with `-`/`_` and omits padding. Decode
 * through bytes, not `atob` alone, so multi-byte UTF-8 payloads survive.
 */
export function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  const binary = atob(normalized.padEnd(normalized.length + padding, "="));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
