import type { PaletteImageFile } from "../types";

const HEIC_TYPES = ["image/heic", "image/heif"];
const HEIC_EXTENSIONS = [".heic", ".heif"];

/**
 * @human Whether this browser can decode the file without help. HEIC/HEIF need a
 * WASM decoder, which only the image worker has — this tool deliberately stays on
 * the plain browser decoder, so those files are rejected up front.
 */
export function isBrowserDecodableImage(file: File): boolean {
  if (HEIC_TYPES.includes(file.type)) return false;
  const name = file.name.toLowerCase();
  if (HEIC_EXTENSIONS.some((extension) => name.endsWith(extension))) return false;
  return file.type.startsWith("image/");
}

export function createImageFile(file: File): PaletteImageFile {
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    file,
    preview: URL.createObjectURL(file),
    originalSize: file.size,
  };
}
