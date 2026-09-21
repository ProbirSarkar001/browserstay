import type { ColorFormat, PaletteSettings } from "../types";

export const DEFAULT_PALETTE_SETTINGS: PaletteSettings = {
  colorCount: 6,
  skipWhite: false,
  format: "hex",
};

export const COLOR_COUNT_RANGE = { min: 2, max: 12, step: 1 };

/** How many pixels the extractor samples. Fewer is faster, more is more accurate. */
export const SAMPLE_PIXELS = 10000;

/** Colors closer to each other than this are merged into one. */
export const COLOR_DISTANCE = 0.22;

/** A pixel with all three channels above this is treated as a white background. */
export const WHITE_CHANNEL_THRESHOLD = 245;

export const UNSUPPORTED_IMAGE_MESSAGE =
  "HEIC and HEIF images can't be read in the browser. Convert them first with the Image Converter.";

export const EXTRACT_FAILED_MESSAGE =
  "Couldn't read colors from this image. Try a different file.";

export const COLOR_FORMATS: ReadonlyArray<{ label: string; value: ColorFormat }> = [
  { label: "HEX", value: "hex" },
  { label: "RGB", value: "rgb" },
  { label: "HSL", value: "hsl" },
];

/** Longest edge of the coverage map's working resolution. */
export const PIXEL_MAP_MAX_SIZE = 240;
