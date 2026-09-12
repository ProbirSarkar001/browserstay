import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const content = `# BrowserStay

> Free, private, open-source PDF and image tools that run entirely in the browser. No uploads, no accounts, no servers.

## What is BrowserStay?

BrowserStay is a collection of browser-based tools for working with PDFs and images. Every tool processes files locally using WebAssembly — nothing ever leaves the user's device.

## Tools

### PDF Tools
- Merge PDF: Combine multiple PDFs into one. /merge-pdf
- Split PDF: Extract pages or split into separate files. /split-pdf
- PDF to Image: Convert PDF pages to JPG or PNG. /pdf-to-image
- Image to PDF: Turn images into a PDF document. /image-to-pdf
- Unlock PDF: Remove password protection from a PDF. /unlock-pdf
- Encrypt PDF: Add password protection to a PDF. /encrypt-pdf

### Image Tools
- Image Converter: Convert between JPG, PNG, WebP, AVIF, and HEIC. /image-converter
- Image Resizer: Resize images to any dimension. /image-resize
- Image Compressor: Reduce image file size while keeping quality. /image-compressor

### Other Tools
- QR Code Generator: Create QR codes for URLs, text, WiFi, contacts, and more. /qr-generator
- Password Generator: Generate strong, secure passwords locally. /password-generator

## Key Facts

- All processing happens locally in the browser via WebAssembly
- No files are uploaded to any server
- No accounts, sign-ups, or watermarks
- Free and open source under Apache 2.0
- Built with React, TanStack Router, and Vite
- Deployed on Cloudflare Workers

## Tech Stack

- Frontend: React 19, TypeScript, Tailwind CSS v4
- Routing: TanStack Router (file-based)
- PDF Processing: PDF.js, pdf-lib, jsPDF
- Image Processing: @jsquash/* (WebAssembly), Web Workers + Comlink
- Build: Vite 8 with Cloudflare Workers plugin

## Links

- Homepage: https://browserstay.com
- GitHub: https://github.com/probir-sarkar/browserstay
- Issues: https://github.com/probir-sarkar/browserstay/issues
- License: Apache 2.0
`;

        return new Response(content, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      }
    }
  }
});
