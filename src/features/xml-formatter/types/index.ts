export interface XmlValidationSuccess {
  valid: true;
}

export interface XmlValidationError {
  valid: false;
  message: string;
  line: number;
  column: number;
}

export type XmlValidationResult = XmlValidationSuccess | XmlValidationError;

export type XmlIndent = "2" | "4" | "tab";

export type XmlOperation = "format" | "minify";
