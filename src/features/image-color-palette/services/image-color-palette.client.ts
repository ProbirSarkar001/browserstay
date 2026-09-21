import "@tanstack/react-start/client-only";

/**
 * @ai-agent Browser-only palette runtime (extract-colors + canvas). Import from
 * feature components only — never from context.tsx, route shells, or universal
 * barrels, or the library lands in the server bundle. See AGENTS.md.
 */
import { extractColors } from "extract-colors";
import { COLOR_DISTANCE, PIXEL_MAP_MAX_SIZE, SAMPLE_PIXELS, WHITE_CHANNEL_THRESHOLD } from "../constants";
import type { ColorFormat, ImagePixels, PaletteColor, PaletteRgb, PaletteSwatch } from "../types";

export interface ExtractPaletteOptions {
  /** Maximum number of colors to return. */
  colorCount: number;
  /** Ignore near-white pixels, e.g. a logo sitting on a white background. */
  skipWhite: boolean;
}

/**
 * @human Reads the dominant colors out of an already-rendered image URL — pass the
 * preview object URL and the library handles loading, downscaling and sampling.
 * Colors come back ordered by prominence, most prominent first.
 */
export async function extractPalette(
  imageUrl: string,
  options: ExtractPaletteOptions
): Promise<PaletteColor[]> {
  const colors = await extractColors(imageUrl, {
    pixels: SAMPLE_PIXELS,
    distance: COLOR_DISTANCE,
    colorValidator: (red, green, blue, alpha) =>
      alpha > 250 && !(options.skipWhite && isNearWhite(red, green, blue)),
  });

  return colors.slice(0, options.colorCount).map((color) => ({
    hex: color.hex,
    rgb: { r: color.red, g: color.green, b: color.blue },
    percentage: color.area * 100,
  }));
}

/**
 * @human Downscales the image into a plain RGBA buffer once, so locating colors and
 * sampling under a dragged pointer are both flat array lookups afterwards.
 */
export async function readImagePixels(
  imageUrl: string,
  maxSize = PIXEL_MAP_MAX_SIZE
): Promise<ImagePixels | null> {
  const image = new Image();
  image.src = imageUrl;
  await image.decode();

  const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  return { width, height, data };
}

export function formatColor(swatch: PaletteSwatch, format: ColorFormat): string {
  if (format === "hex") return swatch.hex;
  if (format === "rgb") return `rgb(${swatch.rgb.r}, ${swatch.rgb.g}, ${swatch.rgb.b})`;

  const { h, s, l } = toHsl(swatch.rgb);
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function paletteToCss(colors: PaletteColor[]): string {
  const variables = colors
    .map((color, index) => `  --color-${index + 1}: ${color.hex};`)
    .join("\n");
  return `:root {\n${variables}\n}\n`;
}

export function paletteToTailwind(colors: PaletteColor[]): string {
  const variables = colors
    .map((color, index) => `  --color-palette-${index + 1}: ${color.hex};`)
    .join("\n");
  return `/* Adds bg-palette-1, text-palette-1, … */\n@theme {\n${variables}\n}\n`;
}

export function paletteToJson(colors: PaletteColor[]): string {
  return JSON.stringify(
    colors.map((color, index) => ({
      name: `Color ${index + 1}`,
      hex: color.hex,
      rgb: color.rgb,
      share: Number(color.percentage.toFixed(2)),
    })),
    null,
    2
  );
}

const SHEET_SWATCH_WIDTH = 160;
const SHEET_HEIGHT = 200;
const SHEET_LABEL_HEIGHT = 48;

/** @human Renders the palette as a shareable PNG swatch strip. */
export async function buildPaletteSheet(colors: PaletteColor[]): Promise<Blob> {
  const canvas = new OffscreenCanvas(colors.length * SHEET_SWATCH_WIDTH, SHEET_HEIGHT);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context not supported");

  colors.forEach((color, index) => {
    const left = index * SHEET_SWATCH_WIDTH;
    context.fillStyle = color.hex;
    context.fillRect(left, 0, SHEET_SWATCH_WIDTH, SHEET_HEIGHT - SHEET_LABEL_HEIGHT);
    context.fillStyle = "#111827";
    context.font = "600 18px sans-serif";
    context.fillText(color.hex, left + 16, SHEET_HEIGHT - 18);
  });

  return canvas.convertToBlob({ type: "image/png" });
}

function isNearWhite(red: number, green: number, blue: number): boolean {
  return (
    red > WHITE_CHANNEL_THRESHOLD &&
    green > WHITE_CHANNEL_THRESHOLD &&
    blue > WHITE_CHANNEL_THRESHOLD
  );
}

/** @human All values are 0–1, matching CSS' own hue/saturation/lightness ranges. */
function toHsl({ r, g, b }: PaletteRgb): { h: number; s: number; l: number } {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) return { h: 0, s: 0, l };

  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h: number;
  if (max === red) h = ((green - blue) / delta + (green < blue ? 6 : 0)) / 6;
  else if (max === green) h = ((blue - red) / delta + 2) / 6;
  else h = ((red - green) / delta + 4) / 6;

  return { h, s, l };
}
