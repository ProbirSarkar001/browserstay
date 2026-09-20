import type { ImageFormat } from "@/shared/services/image/types";
import type { ImageFile } from "../types";

const SUPPORTED_FORMATS: readonly ImageFormat[] = ["jpeg", "png", "webp", "avif"];

export function createImageFile(file: File): ImageFile {
  const preview = URL.createObjectURL(file);
  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    preview,
    originalSize: file.size,
  };
}

/**
 * @human Picks an output format that strips metadata while staying as close to the
 * original file type as the encoder supports. HEIC and other exotic inputs fall
 * back to JPEG because the worker cannot re-encode them.
 */
export function resolveOutputFormat(
  file: File,
  preserveFormat: boolean
): ImageFormat {
  if (!preserveFormat) return "png";

  const mimeSubtype = file.type.split("/")[1];
  if (mimeSubtype && SUPPORTED_FORMATS.includes(mimeSubtype as ImageFormat)) {
    return mimeSubtype as ImageFormat;
  }

  return "jpeg";
}
