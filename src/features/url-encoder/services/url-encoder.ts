export type UrlEncodeMode = "component" | "full";
export type SpaceEncoding = "percent" | "plus";

export interface UrlEncodeOptions {
  mode: UrlEncodeMode;
  space: SpaceEncoding;
}

export function encodeUrl(input: string, options: UrlEncodeOptions): string {
  const encode = options.mode === "component" ? encodeURIComponent : encodeURI;
  const encoded = encode(input);
  if (options.space === "plus") {
    return encoded.replace(/%20/g, "+");
  }
  return encoded;
}

export function decodeUrl(input: string): string {
  return decodeURIComponent(input.replace(/\+/g, "%20"));
}
