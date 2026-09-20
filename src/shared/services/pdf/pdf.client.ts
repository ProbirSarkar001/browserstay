import { openPdf } from "clawpdf/browser";
import { PDFDocument } from "@cantoo/pdf-lib";
import pLimit from "p-limit";
import { createZip } from "../zip";
import { getBaseName } from "../file";
import type {
  EncryptPdfResult,
  FileWithInfo,
  ImageResult,
  PdfToImageOptions,
  UnlockPdfResult,
} from "./types";

async function pdfToImages(
  file: File,
  options: PdfToImageOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<ImageResult[]> {
  const { scale = 2, startPage = 1, endPage } = options;
  const baseName = getBaseName(file);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await openPdf(arrayBuffer);
  const lastPage = Math.min(endPage ?? pdf.pageCount, pdf.pageCount);
  const pagesArray = Array.from({ length: lastPage - startPage + 1 }, (_, i) => startPage + i);

  if (pagesArray.length === 0) {
    onProgress?.(1, 1);
    return [];
  }

  const limit = pLimit(10);
  const images: ImageResult[] = [];
  let completed = 0;

  const tasks = pagesArray.map((page) =>
    limit(async () => {
      const png = await pdf.page(page).png({ scale });
      const result = {
        page,
        bytes: png,
        mimeType: "image/png",
        filename: `${baseName}-page-${page}.png`,
        baseName,
      };
      completed++;
      onProgress?.(completed, pagesArray.length);
      return result;
    })
  );

  const results = await Promise.all(tasks);
  images.push(...results);

  return images;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

async function downloadAll(images: ImageResult[]) {
  if (!images.length) return;
  const baseName = images[0].baseName || "document";
  const files = Object.fromEntries(images.map((img) => [`${baseName}/${img.filename}`, img.bytes]));
  const blob = await createZip(files);
  triggerDownload(blob, `${baseName}-images.zip`);
}

async function getFileInfo(file: File): Promise<FileWithInfo> {
  const name = file.name;
  const size = file.size;
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  if (pageCount === 0) {
    throw new Error("The PDF file contains no pages. Please select a valid PDF with at least one page.");
  }

  return {
    name,
    size,
    pages: pageCount,
    file,
  };
}

async function extractPagesAsPdf(file: File, pageIndices: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));
  const pdfBytes = await newPdf.save({
    useObjectStreams: true,
  });
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

async function splitAllPages(file: File, pageCount: number, baseName: string): Promise<Record<string, Blob>> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const limit = pLimit(10);
  const files: Record<string, Blob> = {};

  const tasks = Array.from({ length: pageCount }, (_, i) =>
    limit(async () => {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const pdfBytes = await newPdf.save({
        useObjectStreams: true,
      });

      files[`${baseName}-page-${i + 1}.pdf`] = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    })
  );

  await Promise.all(tasks);

  return files;
}

async function saveToBlob(pdfDoc: PDFDocument, file: File, suffix: string): Promise<EncryptPdfResult> {
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    fileName: `${getBaseName(file)}-${suffix}.pdf`,
  };
}

/** Returns true if the PDF is password-protected. */
export async function isPdfEncrypted(file: File): Promise<boolean> {
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  return doc.isEncrypted;
}

export async function encryptPdf(file: File, password: string): Promise<EncryptPdfResult> {
  const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
  pdfDoc.encrypt({ userPassword: password });

  return saveToBlob(pdfDoc, file, "encrypted");
}

export async function unlockPdf(file: File, password: string): Promise<UnlockPdfResult> {
  if (!(await isPdfEncrypted(file))) {
    throw new Error("This PDF is not password-protected.");
  }

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(await file.arrayBuffer(), { password });
  } catch {
    throw new Error("Incorrect password or unsupported PDF encryption.");
  }

  return saveToBlob(pdfDoc, file, "unlocked");
}

export const PdfService = { pdfToImages, downloadAll, getFileInfo, extractPagesAsPdf, splitAllPages };
