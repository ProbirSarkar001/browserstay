---
title: "How to Reduce PDF File Size Without Losing Quality"
published: 2026-09-20
description: "Large PDFs are slow to email and expensive to store. Here's what makes them big — and how to shrink them."
tags: ["pdf", "compression", "how-to"]
---

Your PDF is 45MB. Email won't send it. Cloud storage is filling up. You need a smaller file — but the last time you "compressed" a PDF, the text looked blurry.

PDF size reduction isn't one-size-fits-all. Here's what actually works.

## What Makes PDFs Large

PDF file size usually comes from:

1. **Embedded images** — scanned pages, photos, diagrams. Often 90%+ of the file.
2. **High-resolution scans** — 300 DPI is standard for print; 600 DPI doubles the pixels.
3. **Uncompressed images** — raw bitmap data instead of JPEG compression inside the PDF.
4. **Embedded fonts** — full font files add weight, especially for documents with many typefaces.
5. **Redundant objects** — duplicate images, unused resources from editing history.

Text itself is tiny. A dense page of text might be 5KB. A single full-page scan might be 2MB.

## Strategy 1: Recompress Embedded Images

If your PDF is mostly scans or photos, recompressing those images is the biggest win. Tools can:

- Downscale images above a certain DPI (e.g., 150 DPI for screen use)
- Re-encode JPEG streams at lower quality
- Remove duplicate image objects

This is where most "compress PDF" tools focus — and it works well for scan-heavy documents.

## Strategy 2: Convert Scans to Lower Resolution

A 600 DPI scan of a letter-sized page is overkill for screen viewing and email. 150–200 DPI is usually sufficient for reading on a monitor.

If you control the scanning process, scan at lower resolution from the start. If you already have a large PDF, re-rendering pages at lower DPI shrinks the file.

## Strategy 3: Split and Compress Selectively

A 100-page report might have 10 pages of high-res charts and 90 pages of text. Compressing the whole file uniformly might over-compress text pages or under-compress image pages.

Split the PDF, compress only the image-heavy sections, merge back. More work, but better results for mixed documents.

## Strategy 4: Remove Unnecessary Content

- Delete blank pages
- Remove embedded attachments you don't need
- Strip metadata and hidden layers if your tool supports it

## What Doesn't Help Much

- **Compressing text-only PDFs** — text is already tiny
- **ZIP compression** — PDFs are often already compressed internally; zipping saves little
- **Aggressive quality reduction** — quality 30 JPEG looks terrible; find the minimum acceptable quality instead

## Privacy When Compressing

Compressing a PDF on a website means uploading it first. Financial statements, contracts, and personal scans shouldn't go to a server.

Browser-based compression processes the PDF on your device. For scan-heavy PDFs, converting pages to images, compressing those images, and rebuilding can work entirely locally.

## Try It Yourself

For image-heavy PDFs, try [PDF to Image](/pdf-to-image) → [Image Compressor](/image-compressor) → [Image to PDF](/image-to-pdf) for a fully local workflow. Or use our [PDF tools](/pdf-tools) for merge, split, and more — all in your browser.
