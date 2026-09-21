import type { ColorAnchor, ImagePixels, PaletteColor, PaletteSwatch } from "../types";

const TRANSPARENT = 255;
const MIN_ALPHA = 125;

/**
 * @human Reads the color at a normalized position (0–1) of the image.
 * Used while dragging a pointer, so it stays a flat lookup rather than a redraw.
 */
export function samplePixel(pixels: ImagePixels, x: number, y: number): PaletteSwatch {
  const column = clamp(Math.floor(x * pixels.width), 0, pixels.width - 1);
  const row = clamp(Math.floor(y * pixels.height), 0, pixels.height - 1);
  const offset = (row * pixels.width + column) * 4;

  const red = pixels.data[offset];
  const green = pixels.data[offset + 1];
  const blue = pixels.data[offset + 2];
  return { hex: rgbToHex(red, green, blue), rgb: { r: red, g: green, b: blue } };
}

/**
 * @human Share of the image whose nearest palette color is each entry, 0–100, in
 * palette order. Recomputed after a pointer moves so the percentages keep
 * describing the palette actually on screen.
 */
export function computeColorShares(pixels: ImagePixels, palette: PaletteColor[]): number[] {
  if (palette.length === 0) return [];

  const counts = palette.map(() => 0);
  let counted = 0;

  for (const index of assignPixels(pixels, palette)) {
    if (index === TRANSPARENT) continue;
    counts[index]++;
    counted++;
  }

  return counts.map((count) => (counted === 0 ? 0 : (count / counted) * 100));
}

/**
 * @human One pointer per palette color, placed at the pixel nearest that color's
 * own center of mass so a pointer always starts on real coverage of its color.
 * Every color gets a pointer, so pointers and palette entries always line up.
 */
export function findColorAnchors(pixels: ImagePixels, palette: PaletteColor[]): ColorAnchor[] {
  if (palette.length === 0) return [];

  const assignments = assignPixels(pixels, palette);
  const { width, height } = pixels;
  const sums = palette.map(() => ({ count: 0, totalX: 0, totalY: 0 }));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = assignments[y * width + x];
      if (index === TRANSPARENT) continue;

      const sum = sums[index];
      sum.count++;
      sum.totalX += x;
      sum.totalY += y;
    }
  }

  const closest = palette.map(() => ({ distance: Number.POSITIVE_INFINITY, x: 0.5, y: 0.5 }));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = assignments[y * width + x];
      if (index === TRANSPARENT) continue;

      const sum = sums[index];
      const distance = (x - sum.totalX / sum.count) ** 2 + (y - sum.totalY / sum.count) ** 2;
      if (distance < closest[index].distance) {
        closest[index] = { distance, x: (x + 0.5) / width, y: (y + 0.5) / height };
      }
    }
  }

  return palette.map((_, index) => ({ index, x: closest[index].x, y: closest[index].y }));
}

/** @human Nearest palette color for every pixel; `TRANSPARENT` where the image has none. */
function assignPixels(pixels: ImagePixels, palette: PaletteColor[]): Uint8Array {
  const assignments = new Uint8Array(pixels.width * pixels.height);

  for (let pixel = 0; pixel < assignments.length; pixel++) {
    const offset = pixel * 4;
    assignments[pixel] =
      pixels.data[offset + 3] < MIN_ALPHA
        ? TRANSPARENT
        : nearestColorIndex(
            pixels.data[offset],
            pixels.data[offset + 1],
            pixels.data[offset + 2],
            palette
          );
  }

  return assignments;
}

function nearestColorIndex(red: number, green: number, blue: number, palette: PaletteColor[]): number {
  let closest = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < palette.length; index++) {
    const { r, g, b } = palette[index].rgb;
    const distance = (red - r) ** 2 + (green - g) ** 2 + (blue - b) ** 2;
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = index;
    }
  }

  return closest;
}

function rgbToHex(red: number, green: number, blue: number): string {
  const channels = [red, green, blue].map((channel) => channel.toString(16).padStart(2, "0"));
  return `#${channels.join("")}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
