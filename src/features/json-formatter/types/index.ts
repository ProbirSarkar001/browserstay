export interface JsonValidationSuccess {
  valid: true;
  value: unknown;
}

export interface JsonValidationError {
  valid: false;
  message: string;
}

export type JsonValidationResult = JsonValidationSuccess | JsonValidationError;

export type JsonIndent = "2" | "4" | "tab";

export type JsonOperation = "format" | "minify";
