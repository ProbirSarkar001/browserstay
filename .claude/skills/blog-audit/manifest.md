# Blog Content Audit Manifest

Tracks which articles have been verified so future audits can skip them.

## How to use this file

- **Skip** any article whose row shows `content ✅` (and the checks you care about) — it was already audited.
- After auditing an article, update its row and the "Last full audit" date below.
- If an article gets **substantially edited** after its audit (new claims, new numbers, new product comparisons), reset its `content` cell to `⬜` so it gets re-checked.

## Checks performed

| Check | Meaning |
| --- | --- |
| `render` | Article opens in a browser, renders fully, no 404 / console errors |
| `links` | All internal links resolve to real routes (verified with agent-browser) |
| `content` | Facts checked: numbers, product claims, BrowserStay tool claims vs. actual inventory, missing caveats, internal contradictions |

## BrowserStay tool inventory used as ground truth (2026-09-24)

- Category pages: `/pdf-tools`, `/image-tools`
- PDF: `merge-pdf`, `split-pdf`, `encrypt-pdf`, `unlock-pdf`, `pdf-to-image`, `pdf-to-markdown`
- Image: `image-compressor`, `image-converter` (in: jpeg/png/webp/avif/gif/heic/heif → out: jpeg/png/webp/avif only), `image-resize`, `image-to-pdf`, `remove-image-metadata`, `image-color-palette`
- Dev/other: `base64-encoder`, `diff-checker`, `hash-generator`, `json-formatter`, `json-yaml-converter`, `jwt-decoder`, `password-generator`, `qr-generator`, `regex-tester`, `timestamp-converter`, `url-encoder`, `uuid-generator`, `xml-formatter`

If a tool is added/removed/renamed, re-check any article row marked `content ✅` that mentions it.

## Article status

| Article | render | links | content | Last audited | Notes |
| --- | --- | --- | --- | --- | --- |
| `anatomy-of-a-strong-password` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `batch-image-conversion-guide` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-alternatives-to-ilovepdf` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: added PDF to Markdown to covers list |
| `best-alternatives-to-smallpdf` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: added PDF to Markdown to feature list |
| `best-free-online-tools-for-privacy` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-free-pdf-tools-compared` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: added PDF→Markdown to comparison table |
| `best-heic-to-jpg-converters-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-image-compressor-websites-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-image-converter-websites-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-image-resizer-tools-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-image-to-pdf-converters-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-password-generator-tools-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-pdf-compressor-tools-compared` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: pdf-to-image outputs PNG only, not JPG/PNG |
| `best-pdf-encrypt-and-unlock-tools-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-pdf-merger-websites-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-pdf-splitter-websites-compared` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `best-pdf-to-image-converters-compared` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: tool is PNG-only; removed JPG/format-choice claims |
| `best-qr-code-generator-tools-compared` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: QR Code Monkey SVG is free; removed defunct Google Charts row |
| `browser-based-vs-server-upload-tools` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `documents-you-should-never-upload` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `exif-metadata-privacy-in-photos` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: WhatsApp strips EXIF for image sends; email preserved |
| `free-pdf-tools-without-watermarks` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `gdpr-and-online-file-tools` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `heic-photos-wont-open-on-windows` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: noted HEVC Video Extensions costs ~$0.99 |
| `how-pdf-files-work` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-qr-codes-work` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-check-if-a-website-uploads-your-files` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-compress-images-for-email` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-convert-images-to-pdf` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: clarified HEIC must be converted first (tool takes JPEG/PNG/WebP/GIF) |
| `how-to-convert-pdf-to-images` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-create-qr-codes-for-business` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-email-large-pdfs-safely` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: Outlook.com limit is 20MB not 25MB; safe threshold 18MB |
| `how-to-merge-pdfs-without-uploading` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-password-protect-a-pdf` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-reduce-pdf-file-size` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: 600 DPI quadruples pixels, not doubles |
| `how-to-remove-pdf-password` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `how-to-resize-images-for-web` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: 4000px→800px wastes ~94% of pixels, not 75% |
| `how-to-split-pdf-extract-pages` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `ilovepdf-vs-smallpdf-vs-browserstay` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `image-compression-guide` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: AVIF supports lossy and lossless |
| `is-it-safe-to-use-online-pdf-tools` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `jpeg-vs-png-vs-webp-vs-avif` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: converter inputs incl. HEIC/GIF; outputs JPEG/PNG/WebP/AVIF only |
| `merge-pdf-on-mac-and-windows` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `organize-pdf-pages-before-merging` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: fixed future publish date to 2026-09-24 |
| `passphrase-vs-password-which-is-better` | ✅ | ✅ | ✅ | 2026-09-24 | clean; publish date 2026-09-25 (scheduled?) |
| `pdf-tools-for-small-business` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: pdf-to-image outputs PNG only |
| `png-vs-jpg-for-screenshots` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `privacy-policy-red-flags-online-tools` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `social-media-image-sizes-guide` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: FB cover ratio ~2.6:1 not ~2.7:1 |
| `static-vs-dynamic-qr-codes` | ✅ | ✅ | ✅ | 2026-09-24 | clean; publish date 2026-09-26 (scheduled?) |
| `turn-phone-photos-into-pdf-documents` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: reframed compress workaround (no direct PDF compressor) |
| `understanding-pdf-encryption` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `wasm-and-web-workers` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `wasm-is-changing-web-development` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: Figma WASM cut load ~3x, not 'near-instant' |
| `webassembly-for-image-processing` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: Comlink description; 30-50% overhead range; HEIC wording |
| `what-happens-when-you-upload-to-free-tools` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `what-is-client-side-processing` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `why-apple-uses-heic-for-photos` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: AirDrop cannot send to Windows; reworded transfer |
| `why-browser-tools-matter` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: 'five years ago' → 'a decade ago' (WASM 2017) |
| `why-open-source-matters-for-online-tools` | ✅ | ✅ | ✅ | 2026-09-24 | clean |
| `wifi-qr-codes-explained` | ✅ | ✅ | ✅ | 2026-09-24 | fixed: added special-character escaping note |
