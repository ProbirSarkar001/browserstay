export type XmlIndent = "2" | "4" | "tab";

export type XmlOperation = "format" | "minify";

export interface XmlFormatterState {
  input: string;
  indent: XmlIndent;
  operation: XmlOperation;
}
