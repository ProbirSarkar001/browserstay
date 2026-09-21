export type ConversionDirection = "json-to-yaml" | "yaml-to-json";

export type IndentOption = "2" | "4";

export interface ConversionSuccess {
  ok: true;
  output: string;
}

export interface ConversionFailure {
  ok: false;
  message: string;
}

export type ConversionResult = ConversionSuccess | ConversionFailure;
