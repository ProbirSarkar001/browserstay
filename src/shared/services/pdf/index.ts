/**
 * @ai-agent Types only. Runtime lives in `pdf.client.ts`. Do not re-export PdfService
 * or pdf-lib/clawpdf here — that pulls ~1.5 MB into dist/server. See AGENTS.md.
 */
export type {
  EncryptPdfResult,
  FileWithInfo,
  ImageResult,
  PdfToImageOptions,
  UnlockPdfResult,
} from "./types";
