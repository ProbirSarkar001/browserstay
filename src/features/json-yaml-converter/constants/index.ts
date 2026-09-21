import type { ConversionDirection, IndentOption } from "../types";

export const INDENT_OPTIONS: { value: IndentOption; label: string }[] = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" }
];

export const DIRECTION_OPTIONS: { value: ConversionDirection; label: string }[] = [
  { value: "json-to-yaml", label: "JSON → YAML" },
  { value: "yaml-to-json", label: "YAML → JSON" }
];

export const SAMPLE_JSON = `{"name":"BrowserStay","version":"0.1.0","private":true,"tools":["json-yaml-converter","xml-formatter"],"config":{"theme":"dark","telemetry":false},"authors":[{"name":"Ada","role":"maintainer"}],"meta":null}`;

export const SAMPLE_YAML = `name: BrowserStay
version: 0.1.0
private: true
tools:
  - json-yaml-converter
  - xml-formatter
config:
  theme: dark
  telemetry: false
authors:
  - name: Ada
    role: maintainer
meta: null
`;
