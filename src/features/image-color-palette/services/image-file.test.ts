import { describe, expect, it } from "vitest";
import { createImageFile, isBrowserDecodableImage } from "./image-file";

const asFile = (name: string, type: string) => new File(["x"], name, { type });

describe("isBrowserDecodableImage", () => {
  it("accepts formats the browser can decode itself", () => {
    const decodable = [
      ["photo.jpg", "image/jpeg"],
      ["photo.png", "image/png"],
      ["photo.webp", "image/webp"],
      ["photo.avif", "image/avif"],
      ["logo.svg", "image/svg+xml"],
    ] as const;

    for (const [name, type] of decodable) {
      expect(isBrowserDecodableImage(asFile(name, type))).toBe(true);
    }
  });

  it("rejects HEIC and HEIF by mime type", () => {
    expect(isBrowserDecodableImage(asFile("photo.heic", "image/heic"))).toBe(false);
    expect(isBrowserDecodableImage(asFile("photo.heif", "image/heif"))).toBe(false);
  });

  it("rejects HEIC by extension when the mime type is missing", () => {
    expect(isBrowserDecodableImage(asFile("IMG_0042.HEIC", ""))).toBe(false);
  });

  it("rejects files that are not images", () => {
    expect(isBrowserDecodableImage(asFile("report.pdf", "application/pdf"))).toBe(false);
  });
});

describe("createImageFile", () => {
  it("keeps the original file and exposes its size and a preview url", () => {
    const file = asFile("palette.png", "image/png");
    const imageFile = createImageFile(file);

    expect(imageFile.file).toBe(file);
    expect(imageFile.originalSize).toBe(file.size);
    expect(imageFile.preview).toMatch(/^blob:/);

    URL.revokeObjectURL(imageFile.preview);
  });
});
