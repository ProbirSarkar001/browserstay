export interface PdfToImageOptions {
  scale?: number;
  startPage?: number;
  endPage?: number | null;
}

export interface ImageResult {
  page: number;
  bytes: Uint8Array;
  mimeType: string;
  filename: string;
  baseName: string;
}

export interface FileWithInfo {
  name: string;
  size: number;
  pages: number;
  file: File;
}

export interface EncryptPdfResult {
  blob: Blob;
  fileName: string;
}

export interface UnlockPdfResult {
  blob: Blob;
  fileName: string;
}
