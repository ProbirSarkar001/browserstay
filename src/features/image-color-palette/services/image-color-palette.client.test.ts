import { describe, expect, it } from "vitest";
import type { PaletteColor } from "../types";
import { buildPaletteSheet, extractPalette, formatColor, paletteToCss, paletteToJson, paletteToTailwind, readImagePixels } from "./image-color-palette.client";
import { computeColorShares, findColorAnchors, samplePixel } from "./palette-layout";

const RED = "#ff0000";
const BLUE = "#0000ff";

async function toObjectUrl(canvas: OffscreenCanvas): Promise<string> {
  const blob = await canvas.convertToBlob({ type: "image/png" });
  return URL.createObjectURL(blob);
}

function drawContext(canvas: OffscreenCanvas): OffscreenCanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context not supported");
  return context;
}

/** Top half red, bottom half blue — an even 50/50 split. */
function halfAndHalf(): OffscreenCanvas {
  const canvas = new OffscreenCanvas(100, 100);
  const context = drawContext(canvas);
  context.fillStyle = RED;
  context.fillRect(0, 0, 100, 50);
  context.fillStyle = BLUE;
  context.fillRect(0, 50, 100, 50);
  return canvas;
}

/** A red square covering the middle quarter of a white background. */
function logoOnWhite(): OffscreenCanvas {
  const canvas = new OffscreenCanvas(100, 100);
  const context = drawContext(canvas);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 100, 100);
  context.fillStyle = RED;
  context.fillRect(25, 25, 50, 50);
  return canvas;
}

describe("extractPalette", () => {
  it("reads the dominant colors with each one's share of the image", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const palette = await extractPalette(url, { colorCount: 6, skipWhite: false });
    URL.revokeObjectURL(url);

    expect(palette.map((color) => color.hex).sort()).toEqual([BLUE, RED].sort());
    for (const color of palette) {
      expect(color.percentage).toBeCloseTo(50, 0);
    }
  });

  it("returns rgb channels alongside every hex", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const palette = await extractPalette(url, { colorCount: 6, skipWhite: false });
    URL.revokeObjectURL(url);

    const red = palette.find((color) => color.hex === RED);
    expect(red?.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("caps the palette at the requested color count", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const palette = await extractPalette(url, { colorCount: 1, skipWhite: false });
    URL.revokeObjectURL(url);

    expect(palette).toHaveLength(1);
  });

  it("leaves a white background out when skipWhite is on", async () => {
    const url = await toObjectUrl(logoOnWhite());

    const withWhite = await extractPalette(url, { colorCount: 6, skipWhite: false });
    expect(withWhite.map((color) => color.hex)).toContain("#ffffff");

    const withoutWhite = await extractPalette(url, { colorCount: 6, skipWhite: true });
    expect(withoutWhite.map((color) => color.hex)).toEqual([RED]);

    URL.revokeObjectURL(url);
  });
});

describe("findColorAnchors", () => {
  it("places one pointer per color, inside the half of the image it occupies", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const palette = await extractPalette(url, { colorCount: 6, skipWhite: false });
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    const anchors = findColorAnchors(pixels, palette);
    expect(anchors).toHaveLength(palette.length);

    const red = anchors.find((anchor) => palette[anchor.index].hex === RED);
    const blue = anchors.find((anchor) => palette[anchor.index].hex === BLUE);

    expect(red?.y).toBeLessThan(0.5);
    expect(blue?.y).toBeGreaterThan(0.5);

    for (const anchor of anchors) {
      expect(anchor.x).toBeGreaterThanOrEqual(0);
      expect(anchor.x).toBeLessThanOrEqual(1);
      expect(anchor.y).toBeGreaterThanOrEqual(0);
      expect(anchor.y).toBeLessThanOrEqual(1);
    }
  });

  it("lands on the middle of the image for a centered logo", async () => {
    const url = await toObjectUrl(logoOnWhite());
    const palette = await extractPalette(url, { colorCount: 6, skipWhite: true });
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    const anchors = findColorAnchors(pixels, palette);

    expect(anchors).toHaveLength(1);
    expect(anchors[0].x).toBeGreaterThan(0.4);
    expect(anchors[0].x).toBeLessThan(0.6);
    expect(anchors[0].y).toBeGreaterThan(0.4);
    expect(anchors[0].y).toBeLessThan(0.6);
  });

  it("returns nothing when there is no palette", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    expect(findColorAnchors(pixels, [])).toEqual([]);
  });
});

describe("samplePixel", () => {
  it("reads the color at a normalized position", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    // Top half is red, bottom half is blue.
    expect(samplePixel(pixels, 0.5, 0.25).hex).toBe(RED);
    expect(samplePixel(pixels, 0.5, 0.75).hex).toBe(BLUE);
  });

  it("clamps positions at and beyond the edges", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    expect(samplePixel(pixels, 0, 0).hex).toBe(RED);
    expect(samplePixel(pixels, 1, 1).hex).toBe(BLUE);
  });
});

describe("computeColorShares", () => {
  it("splits an even two-color image down the middle", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const palette = await extractPalette(url, { colorCount: 6, skipWhite: false });
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    const shares = computeColorShares(pixels, palette);

    expect(shares).toHaveLength(2);
    for (const share of shares) {
      expect(share).toBeCloseTo(50, 0);
    }
  });

  it("gives every pixel to the only color when the palette has one entry", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const palette = await extractPalette(url, { colorCount: 6, skipWhite: false });
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    expect(computeColorShares(pixels, [palette[0]])).toEqual([100]);
  });

  it("returns nothing for an empty palette", async () => {
    const url = await toObjectUrl(halfAndHalf());
    const pixels = await readImagePixels(url);
    URL.revokeObjectURL(url);
    if (!pixels) throw new Error("pixels missing");

    expect(computeColorShares(pixels, [])).toEqual([]);
  });
});

describe("formatColor", () => {
  const red = { hex: RED, rgb: { r: 255, g: 0, b: 0 } };

  it("formats hex, rgb and hsl from the same color", () => {
    expect(formatColor(red, "hex")).toBe("#ff0000");
    expect(formatColor(red, "rgb")).toBe("rgb(255, 0, 0)");
    expect(formatColor(red, "hsl")).toBe("hsl(0, 100%, 50%)");
  });

  it("formats a neutral gray", () => {
    expect(formatColor({ hex: "#808080", rgb: { r: 128, g: 128, b: 128 } }, "hsl")).toBe(
      "hsl(0, 0%, 50%)"
    );
  });

  it("formats colors in the green and blue hue sectors", () => {
    expect(formatColor({ hex: "#00ff00", rgb: { r: 0, g: 255, b: 0 } }, "hsl")).toBe(
      "hsl(120, 100%, 50%)"
    );
    expect(formatColor({ hex: BLUE, rgb: { r: 0, g: 0, b: 255 } }, "hsl")).toBe(
      "hsl(240, 100%, 50%)"
    );
  });
});

describe("palette exports", () => {
  const palette: PaletteColor[] = [
    { hex: RED, rgb: { r: 255, g: 0, b: 0 }, percentage: 60 },
    { hex: BLUE, rgb: { r: 0, g: 0, b: 255 }, percentage: 40 },
  ];

  it("writes css custom properties", () => {
    expect(paletteToCss(palette)).toBe(":root {\n  --color-1: #ff0000;\n  --color-2: #0000ff;\n}\n");
  });

  it("writes a tailwind theme block", () => {
    const tailwind = paletteToTailwind(palette);
    expect(tailwind).toContain("@theme");
    expect(tailwind).toContain("--color-palette-1: #ff0000;");
    expect(tailwind).toContain("--color-palette-2: #0000ff;");
  });

  it("writes json that parses back to the palette", () => {
    expect(JSON.parse(paletteToJson(palette))).toEqual([
      { name: "Color 1", hex: RED, rgb: { r: 255, g: 0, b: 0 }, share: 60 },
      { name: "Color 2", hex: BLUE, rgb: { r: 0, g: 0, b: 255 }, share: 40 },
    ]);
  });

  it("renders a png swatch sheet", async () => {
    const sheet = await buildPaletteSheet(palette);

    expect(sheet).toBeInstanceOf(Blob);
    expect(sheet.type).toBe("image/png");
  });
});
