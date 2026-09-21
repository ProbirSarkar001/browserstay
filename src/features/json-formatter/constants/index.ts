import type { JsonIndent } from "../types";

export const INDENT_OPTIONS: { value: JsonIndent; label: string }[] = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tabs" }
];

export const SAMPLE_JSON = `{"name":"BrowserStay","privacy":{"uploads":false,"servers":0,"tracking":false},"tools":["merge-pdf","split-pdf","json-formatter"],"limits":null}`;
