import type { FileWithInfo, ImageResult } from "@/shared/services/pdf/types";

export type { FileWithInfo, ImageResult };

export interface PdfToImageSettings {
  scale: number;
  startPage: number;
  endPage: number | null;
}
