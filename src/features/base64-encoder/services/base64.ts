import { decode, encode, isValid } from "js-base64";

export type Base64Alphabet = "standard" | "url-safe";

export interface Base64EncodeOptions {
  /**
   * `url-safe` swaps `+`/`/` for `-`/`_` and drops the `=` padding so the
   * output can live in URLs, filenames, and JWTs.
   */
  alphabet: Base64Alphabet;
}

export function encodeBase64(text: string, options: Base64EncodeOptions = { alphabet: "standard" }): string {
  return encode(text, options.alphabet === "url-safe");
}

/**
 * @ai-agent Decoding accepts both alphabets — `-`/`_` are invalid in standard
 * Base64, so the URL-safe characters are unambiguous. Padding is optional.
 * `js-base64` silently drops invalid characters, so `isValid` is checked first
 * to keep malformed input an error instead of decoding to garbage.
 */
export function decodeBase64(base64: string): string {
  if (!isValid(base64)) {
    throw new Error("Input is not valid Base64.");
  }

  return decode(base64);
}
