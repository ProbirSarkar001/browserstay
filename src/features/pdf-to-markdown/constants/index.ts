import type { PdfToMarkdownFile, PdfToMarkdownSettings } from "../types";
import type { PdfType } from "@/shared/services/pdf-inspector";

export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const DEFAULT_PDF_TO_MARKDOWN_SETTINGS: PdfToMarkdownSettings = {
  profile: "fidelity",
  includePageMarkers: false,
};

export function createPdfToMarkdownFile(file: File): PdfToMarkdownFile {
  return {
    file,
    fileName: file.name.replace(/\.pdf$/i, ""),
    fileSize: file.size,
  };
}

export const PDF_TYPE_LABELS: Record<PdfType, string> = {
  TextBased: "Text-based",
  Scanned: "Scanned",
  ImageBased: "Image-based",
  Mixed: "Mixed",
};
