import { BASE_URL } from "@/lib/seo";
import type { ConversionSettings } from "../types";

export const DEFAULT_CONVERSION_SETTINGS: ConversionSettings = {
  outputFormat: "webp",
  quality: 100,
};

export const OUTPUT_FORMATS = [
  { value: "webp", label: "WebP", desc: "Best compression & quality" },
  { value: "jpeg", label: "JPEG", desc: "Universal format" },
  { value: "png", label: "PNG", desc: "Lossless format" },
  { value: "avif", label: "AVIF", desc: "Next-gen format" },
] as const;

export const QUALITY_RANGE = { min: 1, max: 100, step: 1 };

export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/heic", "image/heif"] as const;

// ---------------------------------------------------------------------------
// SEO conversion slugs  (e.g. /image-converter/heic-to-jpeg)
// ---------------------------------------------------------------------------

const INPUT_FORMATS = ["jpeg", "png", "webp", "avif", "gif", "heic", "heif"] as const;
const OUTPUT_FORMATS_ONLY = ["jpeg", "png", "webp", "avif"] as const;

const FORMAT_LABELS: Record<string, string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
  heic: "HEIC",
  heif: "HEIF",
  gif: "GIF",
};

export interface ConversionSlug {
  slug: string;
  from: string;
  to: string;
  title: string;
  description: string;
  keywords: string;
}

function buildSlug(from: string, to: string): ConversionSlug {
  const fromLabel = FORMAT_LABELS[from];
  const toLabel = FORMAT_LABELS[to];
  return {
    slug: `${from}-to-${to}`,
    from,
    to,
    title: `Convert ${fromLabel} to ${toLabel} Online Free | BrowserStay`,
    description: `Convert ${fromLabel} images to ${toLabel} format online for free. High-quality WebAssembly encoding runs entirely in your browser — no uploads, no limits, 100% private.`,
    keywords: `${fromLabel} to ${toLabel}, convert ${fromLabel} to ${toLabel}, ${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} online, ${fromLabel.toLowerCase()} converter, browserstay`,
  };
}

export const CONVERSION_SLUGS: ConversionSlug[] = INPUT_FORMATS.flatMap((from) =>
  OUTPUT_FORMATS_ONLY.filter((to) => to !== from).map((to) => buildSlug(from, to))
);

const CONVERSION_SLUG_MAP = new Map(CONVERSION_SLUGS.map((s) => [s.slug, s]));

export function getConversionBySlug(slug: string): ConversionSlug | undefined {
  return CONVERSION_SLUG_MAP.get(slug);
}

export function getSeoForSlug(slug: string) {
  const combo = getConversionBySlug(slug);
  if (!combo) return null;
  return {
    meta: [
      { title: combo.title },
      { name: "description", content: combo.description },
      { name: "keywords", content: combo.keywords },
      { property: "og:title", content: combo.title },
      { property: "og:description", content: combo.description },
      { property: "og:image", content: `${BASE_URL}/og-image.png` },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/image-converter/${combo.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: combo.title },
      { name: "twitter:description", content: combo.description },
      { name: "twitter:image", content: `${BASE_URL}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/image-converter/${combo.slug}` }],
  };
}
