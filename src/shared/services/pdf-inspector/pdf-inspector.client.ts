import "@tanstack/react-start/client-only";

/**
 * @ai-agent Browser-only pdf-inspector WASM runtime. Import from feature components
 * only — never from route shells, contexts, or universal barrels. See AGENTS.md.
 */
import init, { processPdf } from "@firecrawl/pdf-inspector-wasm";
import type { PdfProcessResult, ProcessOptions } from "./types";

let initialized = false;

async function ensureInit(): Promise<void> {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

export async function convertPdfToMarkdown(
  file: File,
  options?: ProcessOptions
): Promise<PdfProcessResult> {
  await ensureInit();
  const data = new Uint8Array(await file.arrayBuffer());
  return processPdf(data, options);
}
