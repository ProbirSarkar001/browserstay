/**
 * Centralized SEO Utility Functions
 *
 * This module provides reusable functions and configurations for managing
 * SEO metadata across the application. All meta tag definitions should
 * use these utilities to ensure consistency and maintainability.
 */

import { AnyRouteMatch } from "@tanstack/react-router";

export interface MetaConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  canonicalUrl: string;
  keywords?: string;
  jsonLd?: {
    name: string;
    description: string;
    featureList?: readonly string[];
    applicationCategory?: string;
  };
}

/**
 * Generates complete SEO metadata configuration for a route
 * @param config - SEO configuration object
 * @returns TanStack Router compatible head configuration
 */
export function generateMeta(config: MetaConfig): {
  links?: AnyRouteMatch["links"];
  meta?: AnyRouteMatch["meta"];
} {
  const {
    title,
    description,
    ogTitle = title,
    ogDescription = description,
    twitterCard = "summary_large_image",
    canonicalUrl,
    keywords
  } = config;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:image", content: `${BASE_URL}/og-image.png` },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { name: "twitter:card", content: twitterCard },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: `${BASE_URL}/og-image.png` }
    ],
    links: [{ rel: "canonical", href: canonicalUrl }]
  };
}

/**
 * Generates canonical URL for a given path
 * @param path - The path (e.g., '/merge-pdf')
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash if present and ensure consistent formatting
  const cleanPath = path.replace(/\/$/, "");
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Predefined SEO configurations for all main routes
 * Add new routes here to maintain centralized SEO management
 */
export const BASE_URL = "https://browserstay.com";

export const metaConfigs = {
  home: {
    title: "BrowserStay - Free Privacy-First PDF & Image Tools, No Uploads",
    description:
      "Free, private PDF and image tools that run entirely in your browser. Your files never leave your PC — no uploads, no accounts, no servers, no limits.",
    canonicalUrl: `${BASE_URL}/`,
    keywords: "pdf tools, image tools, merge pdf, compress image, privacy tools, no upload, browser pdf, browserstay"
  },
  pdfToImage: {
    title: "PDF to Image Converter - Free & Private | BrowserStay",
    description:
      "Convert PDF pages to high-quality JPG or PNG images for free. 100% in your browser with WebAssembly — no uploads, and nothing ever leaves your PC.",
    canonicalUrl: `${BASE_URL}/pdf-to-image`,
    keywords: "pdf to image, convert pdf to jpg, pdf to png, pdf converter, local pdf to image, browserstay",
    jsonLd: {
      name: "PDF to Image Converter",
      description: "Convert PDF pages to high-quality JPG or PNG images. 100% in your browser with WebAssembly — no uploads.",
      featureList: ["PDF to JPG conversion", "PDF to PNG conversion", "Batch page extraction", "Local WebAssembly processing"]
    }
  },
  pdfToMarkdown: {
    title: "PDF to Markdown Converter - Free & Private | BrowserStay",
    description:
      "Convert PDF documents to structured Markdown for free. Headings, tables, and lists preserved — 100% in your browser with WebAssembly, no uploads.",
    canonicalUrl: `${BASE_URL}/pdf-to-markdown`,
    keywords:
      "pdf to markdown, convert pdf to md, pdf text extractor, pdf to text, markdown converter, local pdf converter, browserstay",
    jsonLd: {
      name: "PDF to Markdown Converter",
      description:
        "Convert PDF documents to structured Markdown. Headings, tables, and lists preserved — processed entirely in your browser.",
      featureList: [
        "Structured Markdown output",
        "Table and heading detection",
        "Compact mode for AI workflows",
        "Local WebAssembly processing"
      ]
    }
  },
  mergePdf: {
    title: "Merge PDF Files - Free Online PDF Combiner | BrowserStay",
    description:
      "Combine multiple PDF files into one document for free. Merge PDFs in seconds — no uploads, no registration, 100% private and processed locally in your browser.",
    canonicalUrl: `${BASE_URL}/merge-pdf`,
    keywords: "merge pdf, combine pdf, join pdf, pdf combiner, merge pdf files free, local merge pdf, browserstay",
    jsonLd: {
      name: "Merge PDF Files",
      description: "Combine multiple PDF files into one document. Merge PDFs in seconds — no uploads, 100% private.",
      featureList: ["Merge multiple PDFs", "Drag-and-drop reordering", "Instant local processing"]
    }
  },
  splitPdf: {
    title: "Split PDF File - Extract Pages Free Online | BrowserStay",
    description:
      "Split PDF files and extract pages for free. Separate a PDF into individual pages or extract specific ranges — all locally in your browser, no uploads, 100% private.",
    canonicalUrl: `${BASE_URL}/split-pdf`,
    keywords: "split pdf, extract pages from pdf, split pdf online, pdf page extractor, local split pdf, browserstay",
    jsonLd: {
      name: "Split PDF File",
      description: "Split PDF files and extract pages. Separate a PDF into individual pages or extract specific ranges — all locally.",
      featureList: ["Extract specific pages", "Split into multiple files", "Page range selection", "Local processing"]
    }
  },
  unlockPdf: {
    title: "Unlock PDF - Remove Password Free Online | BrowserStay",
    description:
      "Remove password protection from PDFs for free. Unlock your PDF instantly — the password and file are processed entirely in your browser, never uploaded, 100% private.",
    canonicalUrl: `${BASE_URL}/unlock-pdf`,
    keywords: "unlock pdf, remove pdf password, pdf password remover, decrypt pdf, unlock pdf online, local pdf unlock, browserstay",
    jsonLd: {
      name: "Unlock PDF",
      description: "Remove password protection from PDFs. Unlock your PDF instantly — processed entirely in your browser.",
      featureList: ["Remove PDF passwords", "Decrypt protected PDFs", "Instant local processing"]
    }
  },
  encryptPdf: {
    title: "Encrypt PDF - Password Protect PDF Free Online | BrowserStay",
    description:
      "Protect your PDF with a password for free. Encrypt your PDF instantly — everything happens in your browser, never uploaded, 100% private.",
    canonicalUrl: `${BASE_URL}/encrypt-pdf`,
    keywords: "encrypt pdf, password protect pdf, add password to pdf, protect pdf, pdf encryption, local pdf encrypt, browserstay",
    jsonLd: {
      name: "Encrypt PDF",
      description: "Protect your PDF with a password. Encrypt your PDF instantly — everything happens in your browser.",
      featureList: ["Add password protection", "Encrypt PDF files", "Local secure processing"]
    }
  },
  imageConverter: {
    title: "Image Converter - Convert Images Online Free | BrowserStay",
    description:
      "Convert JPG, PNG, WebP, AVIF, and HEIC images free. High-quality WebAssembly encoding runs entirely in your browser — no uploads, no limits, 100% private.",
    canonicalUrl: `${BASE_URL}/image-converter`,
    keywords:
      "image converter, convert jpg to png, webp to jpg, avif converter, heic to jpg, image format converter, local image converter, browserstay",
    jsonLd: {
      name: "Image Converter",
      description: "Convert JPG, PNG, WebP, AVIF, and HEIC images. High-quality WebAssembly encoding runs entirely in your browser.",
      featureList: ["JPG, PNG, WebP, AVIF, HEIC support", "Batch conversion", "Quality control", "WebAssembly encoding"]
    }
  },
  imageToPdf: {
    title: "Image to PDF Converter - Convert Images to PDF Free | BrowserStay",
    description:
      "Convert images (JPG, PNG, WebP) to PDF documents. Sortable pages, custom settings, fully local processing. Free and private — your images never leave your device.",
    canonicalUrl: `${BASE_URL}/image-to-pdf`,
    keywords:
      "image to pdf, jpg to pdf, png to pdf, photos to pdf, image to pdf converter, local image to pdf, browserstay",
    jsonLd: {
      name: "Image to PDF Converter",
      description: "Convert images to PDF documents. Sortable pages, custom settings, fully local processing.",
      featureList: ["Images to PDF", "Page sorting", "Custom page settings", "Batch conversion"]
    }
  },
  imageResize: {
    title: "Image Resizer - Resize Images Online Free | BrowserStay",
    description:
      "Resize images to any dimension for free. Maintain aspect ratio, batch process multiple images, convert formats — all in your browser with no uploads.",
    canonicalUrl: `${BASE_URL}/image-resize`,
    keywords:
      "image resizer, resize image, resize jpg, resize png, image dimensions, batch resize images, local resizer, browserstay",
    jsonLd: {
      name: "Image Resizer",
      description: "Resize images to any dimension. Maintain aspect ratio, batch process multiple images — all in your browser.",
      featureList: ["Resize to any dimension", "Aspect ratio lock", "Batch resizing", "Format conversion"]
    }
  },
  imageCompressor: {
    title: "Image Compressor - Compress Images Online Free | BrowserStay",
    description:
      "Compress images to reduce file size while keeping quality. Smart compression, batch processing, multiple formats — 100% free, private, and processed locally.",
    canonicalUrl: `${BASE_URL}/image-compressor`,
    keywords:
      "image compressor, compress image, reduce image size, compress jpg, compress png, photo compressor, local compression, browserstay",
    jsonLd: {
      name: "Image Compressor",
      description: "Compress images to reduce file size while keeping quality. Smart compression, batch processing, multiple formats.",
      featureList: ["Smart compression", "Batch processing", "Multiple formats", "Quality control"]
    }
  },
  removeImageMetadata: {
    title: "Remove Image Metadata - Strip EXIF & GPS Free Online | BrowserStay",
    description:
      "Remove EXIF metadata, GPS location, and hidden camera data from photos. Re-encode images locally at maximum quality — no uploads, batch support, 100% private.",
    canonicalUrl: `${BASE_URL}/remove-image-metadata`,
    keywords:
      "remove exif, strip image metadata, remove gps from photo, exif remover, photo metadata cleaner, remove location from image, local exif remover, browserstay",
    jsonLd: {
      name: "Remove Image Metadata",
      description: "Remove EXIF metadata, GPS location, and hidden camera data from photos. Re-encode images locally at maximum quality.",
      featureList: ["Strip EXIF and GPS data", "Preserve original format", "Batch processing", "Local browser processing"]
    }
  },
  qrGenerator: {
    title: "QR Code Generator - Create Custom QR Codes Free | BrowserStay",
    description:
      "Generate custom QR codes for URLs, text, WiFi, and contacts. Customizable colors, sizes, and error correction. 100% free, private, and generated in your browser.",
    canonicalUrl: `${BASE_URL}/qr-generator`,
    keywords:
      "qr code generator, create qr code, wifi qr code, qr code for url, custom qr code, free qr generator, browserstay",
    jsonLd: {
      name: "QR Code Generator",
      description: "Generate custom QR codes for URLs, text, WiFi, and contacts. Customizable colors, sizes, and error correction.",
      featureList: ["URL, text, WiFi, contact QR codes", "Custom colors and sizes", "Error correction levels", "PNG and SVG export"]
    }
  },
  passwordGenerator: {
    title: "Secure Password Generator - Free Online Tool | BrowserStay",
    description:
      "Generate strong, secure passwords instantly in your browser using the Web Crypto API. Customizable length and character types. Fully local — nothing is stored or sent.",
    canonicalUrl: `${BASE_URL}/password-generator`,
    keywords:
      "password generator, strong password, random password, secure password, password creator, local password generator, browserstay",
    jsonLd: {
      name: "Secure Password Generator",
      description: "Generate strong, secure passwords using the Web Crypto API. Customizable length and character types.",
      featureList: ["Cryptographic randomness", "Customizable length", "Character type options", "One-click generation"]
    }
  },
  hashGenerator: {
    title: "Hash Generator - MD5, SHA-1, SHA-256, SHA-512 Online Free | BrowserStay",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files instantly. Everything is computed locally in your browser — your data never leaves your device.",
    canonicalUrl: `${BASE_URL}/hash-generator`,
    keywords:
      "hash generator, md5 generator, sha256 hash, sha512 checksum, sha1, checksum tool, file checksum, local hash generator, browserstay",
    jsonLd: {
      name: "Hash Generator",
      description:
        "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files. Computed locally in your browser.",
      featureList: ["MD5, SHA-1, SHA-256, SHA-384, SHA-512", "Text and file input", "One-click copy", "Local WebCrypto processing"]
    }
  },
  uuidGenerator: {
    title: "UUID Generator - Bulk UUID v4 Online Free | BrowserStay",
    description:
      "Generate random UUIDs (v4) in bulk for free. Custom formatting options with one-click copy — created with your browser's cryptographic random number generator, nothing is sent to a server.",
    canonicalUrl: `${BASE_URL}/uuid-generator`,
    keywords:
      "uuid generator, guid generator, uuid v4, random uuid, bulk uuid, online uuid creator, local uuid generator, browserstay",
    jsonLd: {
      name: "UUID Generator",
      description: "Generate random UUIDs (v4) in bulk using your browser's cryptographic random number generator.",
      featureList: ["Bulk UUID v4 generation", "Uppercase and hyphen options", "One-click copy", "Cryptographic randomness"]
    }
  },
  jsonFormatter: {
    title: "JSON Formatter & Validator - Beautify, Minify JSON Online Free | BrowserStay",
    description:
      "Format, validate, and minify JSON for free. Precise error locations, adjustable indentation — all parsing happens locally in your browser, nothing is uploaded.",
    canonicalUrl: `${BASE_URL}/json-formatter`,
    keywords:
      "json formatter, json validator, json beautifier, json pretty print, minify json, format json online, local json formatter, browserstay",
    jsonLd: {
      name: "JSON Formatter & Validator",
      description: "Format, validate, and minify JSON. Precise error locations, adjustable indentation.",
      featureList: ["Format and beautify JSON", "Validate with error location", "Minify JSON", "Adjustable indentation"]
    }
  },
  xmlFormatter: {
    title: "XML Formatter & Validator - Beautify, Minify XML Online Free | BrowserStay",
    description:
      "Format, validate, and minify XML for free. Precise error locations, adjustable indentation — all parsing happens locally in your browser, nothing is uploaded.",
    canonicalUrl: `${BASE_URL}/xml-formatter`,
    keywords:
      "xml formatter, xml validator, xml beautifier, xml pretty print, minify xml, format xml online, local xml formatter, browserstay",
    jsonLd: {
      name: "XML Formatter & Validator",
      description: "Format, validate, and minify XML. Precise error locations, adjustable indentation.",
      featureList: ["Format and beautify XML", "Validate with error location", "Minify XML", "Adjustable indentation"]
    }
  },
  jsonYamlConverter: {
    title: "JSON to YAML Converter - Convert JSON & YAML Online Free | BrowserStay",
    description:
      "Convert JSON to YAML and YAML to JSON for free. Precise error locations, adjustable indentation — all conversion happens locally in your browser, nothing is uploaded.",
    canonicalUrl: `${BASE_URL}/json-yaml-converter`,
    keywords:
      "json to yaml, yaml to json, yaml converter, json yaml converter, yaml formatter, convert yaml online, local yaml converter, browserstay",
    jsonLd: {
      name: "JSON to YAML Converter",
      description: "Convert JSON to YAML and YAML back to JSON. Precise error locations, adjustable indentation.",
      featureList: ["Convert JSON to YAML", "Convert YAML to JSON", "Validate with error location", "Adjustable indentation"]
    }
  },
  regexTester: {
    title: "Regex Tester - Test Regular Expressions Online Free | BrowserStay",
    description:
      "Test and debug regular expressions for free. Live highlighting, match positions, capture groups, and replacement previews — all matching runs locally in your browser.",
    canonicalUrl: `${BASE_URL}/regex-tester`,
    keywords:
      "regex tester, regular expression tester, regex online, test regex, regexp debugger, capture groups, regex replace, browserstay",
    jsonLd: {
      name: "Regex Tester",
      description: "Test regular expressions with live highlighting, match positions, capture groups, and replacements.",
      featureList: ["Live match highlighting", "Match positions and capture groups", "Flag toggles", "Replacement preview"]
    }
  },
  diffChecker: {
    title: "Diff Checker - Compare Two Texts Online Free | BrowserStay",
    description:
      "Compare two texts and highlight added, removed, and unchanged lines for free. Line numbers on both sides — the comparison runs locally in your browser, nothing is uploaded.",
    canonicalUrl: `${BASE_URL}/diff-checker`,
    keywords:
      "diff checker, compare text, text difference, diff tool, compare two files, online diff, line diff, browserstay",
    jsonLd: {
      name: "Diff Checker",
      description: "Compare two texts line by line and highlight additions, deletions, and unchanged lines.",
      featureList: ["Line-by-line comparison", "Added and removed highlighting", "Line numbers per side", "Copy unified diff"]
    }
  },
  jwtDecoder: {
    title: "JWT Decoder - Decode JSON Web Tokens Online Free | BrowserStay",
    description:
      "Decode a JSON Web Token's header, payload, and claims for free. Registered claims are shown as readable dates — everything runs locally in your browser, nothing is uploaded.",
    canonicalUrl: `${BASE_URL}/jwt-decoder`,
    keywords:
      "jwt decoder, decode jwt, json web token, jwt parser, bearer token, jwt claims, exp iat, online jwt tool, browserstay",
    jsonLd: {
      name: "JWT Decoder",
      description: "Decode a JSON Web Token's header, payload, and registered claims. Local processing only.",
      featureList: ["Decode JWT header and payload", "Readable date for time claims", "Expiry status", "Local processing"]
    }
  },
  base64Encoder: {
    title: "Base64 Encoder/Decoder - Encode & Decode Online Free | BrowserStay",
    description:
      "Encode text to Base64 or decode Base64 back to text for free. Supports Unicode and URL-safe alphabet — all conversion happens locally in your browser, nothing is uploaded.",
    canonicalUrl: `${BASE_URL}/base64-encoder`,
    keywords:
      "base64 encode, base64 decode, base64 converter, base64 encoder decoder, url safe base64, online base64 tool, browserstay",
    jsonLd: {
      name: "Base64 Encoder/Decoder",
      description: "Encode text to Base64 or decode Base64 back to text. Supports Unicode and URL-safe alphabet.",
      featureList: ["Encode and decode Base64", "Unicode support", "Live conversion", "Local processing"]
    }
  },
  urlEncoder: {
    title: "URL Encoder/Decoder - Percent Encoding Online Free | BrowserStay",
    description:
      "Encode and decode URLs and query strings for free. Component and full-URL modes, plus space encoding options — everything runs locally in your browser.",
    canonicalUrl: `${BASE_URL}/url-encoder`,
    keywords:
      "url encode, url decode, percent encoding, uri encoder, url encoder decoder, query string encode, online url tool, browserstay",
    jsonLd: {
      name: "URL Encoder/Decoder",
      description: "Encode and decode URLs and query strings with percent encoding. Component and full-URL modes.",
      featureList: ["Encode and decode URLs", "Component and full-URL modes", "Space encoding options", "Local processing"]
    }
  },
  timestampConverter: {
    title: "Unix Timestamp Converter - Epoch to Date Online Free | BrowserStay",
    description:
      "Convert Unix timestamps to human-readable dates and back for free. Seconds or milliseconds, local or UTC — all conversion happens locally in your browser.",
    canonicalUrl: `${BASE_URL}/timestamp-converter`,
    keywords:
      "unix timestamp converter, epoch converter, timestamp to date, date to timestamp, unix time, epoch time converter, browserstay",
    jsonLd: {
      name: "Unix Timestamp Converter",
      description: "Convert Unix timestamps to human-readable dates and back. Seconds or milliseconds, local or UTC.",
      featureList: ["Timestamp to date conversion", "Date to timestamp conversion", "Seconds and milliseconds", "Live current timestamp"]
    }
  },
  blog: {
    title: "Blog - Privacy, Browser Tools & Web Technology | BrowserStay",
    description:
      "Thoughts on privacy, browser-based tools, and web technology. Learn how WebAssembly and modern browsers enable private, local processing.",
    canonicalUrl: `${BASE_URL}/blog`,
    keywords: "blog, privacy, browser tools, webassembly, local processing, web technology, browserstay"
  },
  privacy: {
    title: "Privacy Policy - No Data Collection, Ever | BrowserStay",
    description:
      "BrowserStay processes everything in your browser. We have no servers, no accounts, and no tracking. Your files and data never leave your device.",
    canonicalUrl: `${BASE_URL}/privacy`,
    keywords: "privacy policy, no data collection, no tracking, browser privacy, local processing, no uploads, browserstay"
  },
  about: {
    title: "About BrowserStay - Free, Private, Open-Source Browser Tools",
    description:
      "Learn about BrowserStay: a free, open-source collection of PDF and image tools that run entirely in your browser. No uploads, no accounts, no servers — built for privacy by design.",
    canonicalUrl: `${BASE_URL}/about`,
    keywords: "about browserstay, open source tools, privacy tools, browser pdf tools, local processing, no uploads"
  }
} as const;

/**
 * Type-safe meta configuration keys
 */
export type MetaConfigKey = keyof typeof metaConfigs;

/**
 * Generates SoftwareApplication JSON-LD structured data for a tool route.
 * Helps AI systems and search engines understand each tool's purpose and capabilities.
 */
function buildToolJsonLd(config: MetaConfig, canonicalUrl: string) {
  const { jsonLd } = config;
  if (!jsonLd) return undefined;

  return [
    {
      type: "application/ld+json" as const,
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: jsonLd.name,
        url: canonicalUrl,
        description: jsonLd.description,
        applicationCategory: jsonLd.applicationCategory ?? "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        ...(jsonLd.featureList?.length ? { featureList: jsonLd.featureList } : {})
      })
    }
  ];
}

/**
 * Generates combined head config (meta tags + JSON-LD) for a tool route.
 * Reads everything from the single metaConfigs source of truth.
 * @param key - The meta config key matching the tool
 * @returns TanStack Router compatible head configuration with structured data
 */
export function generateToolHead(key: MetaConfigKey) {
  const config = metaConfigs[key];
  const meta = generateMeta(config);
  const scripts = buildToolJsonLd(config, config.canonicalUrl);

  return scripts ? { ...meta, scripts } : meta;
}

/**
 * Helper function to get meta config by key
 * @param key - The meta config key
 * @returns The meta configuration object
 */
export function getMetaConfig(key: MetaConfigKey): MetaConfig {
  return metaConfigs[key];
}

/**
 * Generates meta tags for a specific route using predefined config
 * @param key - The meta config key
 * @returns TanStack Router compatible head configuration
 */
export function generateMetaFromKey(key: MetaConfigKey) {
  return generateMeta(metaConfigs[key]);
}
