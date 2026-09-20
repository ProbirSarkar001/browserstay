import type { QRSettings, QRContentType, WiFiConfig, VCardConfig, SmsConfig, GeoConfig } from "../types";

export interface GenerateQROptions {
  content: string;
  contentType: QRContentType;
  wifiConfig: WiFiConfig;
  vcardConfig: VCardConfig;
  smsConfig: SmsConfig;
  geoConfig: GeoConfig;
  settings: QRSettings;
}

export interface GenerateQRResult {
  /** SVG string for crisp, scalable output and copy-to-clipboard. */
  svg: string;
  /** PNG data URL rendered at the configured size. */
  png: string;
  /** The exact payload that was encoded. */
  payload: string;
}

/** Splits a hex color like `#RRGGBB` into `[r, g, b]` values. */
function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/**
 * Computes a rough luminance contrast ratio (WCAG-style) between two hex colors.
 * Returns `null` when either color is invalid, so callers can skip the check.
 */
export function getContrastRatio(dark: string, light: string): number | null {
  const a = hexToRgb(dark);
  const b = hexToRgb(light);
  if (!a || !b) return null;

  const luminance = (rgb: [number, number, number]) => {
    const [r, g, bl] = rgb.map((channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };

  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
