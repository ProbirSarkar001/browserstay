import type { XmlIndent } from "../types";

export const INDENT_OPTIONS: { value: XmlIndent; label: string }[] = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tabs" }
];

export const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>Privacy by Design</title><author>Ann Cavoukian</author><price currency="USD">29.99</price></book><book id="2"><title>WebAssembly in Action</title><author>Gerard Gallant</author><price currency="USD">39.99</price></book></catalog>`;
