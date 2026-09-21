export type Base64Alphabet = "standard" | "url-safe";

export interface Base64EncodeOptions {
  /**
   * `url-safe` swaps `+`/`/` for `-`/`_` and drops the `=` padding so the
   * output can live in URLs, filenames, and JWTs.
   */
  alphabet: Base64Alphabet;
}

export function encodeBase64(text: string, options: Base64EncodeOptions = { alphabet: "standard" }): string {
  const bytes = new TextEncoder().encode(text);

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64 = btoa(binary);
  if (options.alphabet === "url-safe") {
    return toBase64Url(base64);
  }

  return base64;
}

/**
 * @ai-agent Decoding accepts both alphabets — `-`/`_` are invalid in standard
 * Base64, so the URL-safe characters are unambiguous. Padding is optional.
 */
export function decodeBase64(base64: string): string {
  const normalized = base64.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  const padding = (4 - (normalized.length % 4)) % 4;

  const binary = atob(normalized.padEnd(normalized.length + padding, "="));

  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
