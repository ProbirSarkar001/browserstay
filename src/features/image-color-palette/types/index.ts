export interface PaletteImageFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
}

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface PaletteRgb {
  r: number;
  g: number;
  b: number;
}

/** A color with no provenance — enough to render and format it. */
export interface PaletteSwatch {
  hex: string;
  rgb: PaletteRgb;
}

/** A color extracted from the image. */
export interface PaletteColor extends PaletteSwatch {
  /** Share of the sampled pixels this color covers, 0–100. */
  percentage: number;
}

export interface PaletteSettings {
  colorCount: number;
  skipWhite: boolean;
  format: ColorFormat;
}

/** A downscaled RGBA copy of the image, used to locate and sample colors locally. */
export interface ImagePixels {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

/** A movable pointer marking where a palette color is taken from. */
export interface ColorAnchor {
  /** Index into the palette this pointer belongs to. */
  index: number;
  /** Position within the image, normalized to 0–1. */
  x: number;
  y: number;
}
