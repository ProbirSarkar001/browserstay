import type { MarkdownProfile, PdfProcessResult } from "@/shared/services/pdf-inspector";

export interface PdfToMarkdownFile {
  file: File;
  fileName: string;
  fileSize: number;
}

export interface PdfToMarkdownSettings {
  profile: MarkdownProfile;
  includePageMarkers: boolean;
}

export interface PdfToMarkdownResult {
  markdown: string;
  analysis: PdfProcessResult;
}
