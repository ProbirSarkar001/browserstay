export type UrlEncodeMode = "component" | "full";
export type SpaceEncoding = "percent" | "plus";

export interface UrlEncodeOptions {
  mode: UrlEncodeMode;
  space: SpaceEncoding;
}

export interface UrlDecodeOptions {
  /**
   * Form-encoded query strings write a space as `+`. Enable this to decode
   * that convention; leave it off to keep `+` as the literal character it is
   * in a URL, so `a+b` survives a round trip.
   */
  plusAsSpace: boolean;
}

export function encodeUrl(input: string, options: UrlEncodeOptions): string {
  const encode = options.mode === "component" ? encodeURIComponent : encodeURI;
  const encoded = encode(input);
  if (options.space === "plus") {
    return encoded.replace(/%20/g, "+");
  }
  return encoded;
}

export function decodeUrl(input: string, options: UrlDecodeOptions = { plusAsSpace: false }): string {
  return decodeURIComponent(options.plusAsSpace ? input.replace(/\+/g, "%20") : input);
}
