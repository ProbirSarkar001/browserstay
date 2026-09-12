/** Extensions for HEIC/HEIF, which browsers cannot decode natively. */
const HEIC_EXTENSIONS = [".heic", ".heif"];

/**
 * @human Whether the image worker can decode the given file. HEIC/HEIF files
 * are matched by extension as well as MIME type, because some platforms report
 * an empty type for them.
 */
export function isSupportedImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const name = file.name.toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => name.endsWith(ext));
}
