import { createFileRoute } from "@tanstack/react-router";
import { TOOLS_CONFIG } from "@/config/tools";
import { SITE_CONFIG } from "@/config/site";
import { BASE_URL } from "@/lib/seo";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const toolsSection = TOOLS_CONFIG.map((category) => {
          const lines = category.items
            .filter((tool) => !tool.disabled)
            .map((tool) => `- ${tool.title}: ${tool.description} ${tool.href}`);
          return `### ${category.title}\n${lines.join("\n")}`;
        }).join("\n\n");

        const content = `# BrowserStay

> Free, private, open-source tools that run entirely in the browser. No uploads, no accounts, no servers.

## What is BrowserStay?

BrowserStay is a collection of browser-based tools for working with PDFs, images, and everyday developer tasks. All processing happens locally in the browser — nothing ever leaves the user's device.

## Tools

${toolsSection}

## Key Facts

- Heavy processing (PDF, image, Python) uses WebAssembly; other tools use native browser APIs (Web Crypto, Canvas, etc.)
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
- Python Runtime: Pyodide (CPython on WebAssembly), Web Workers + Comlink
- Build: Vite 8 with Cloudflare Workers plugin

## Links

- Homepage: ${BASE_URL}
- GitHub: ${SITE_CONFIG.links.github}
- Feedback & issues: ${SITE_CONFIG.links.feedback}
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
