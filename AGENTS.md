<!-- intent-skips:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changing.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skips:end -->

# AGENTS.md

BrowserStay — privacy-first PDF/image/dev tools running entirely in the browser (WebAssembly + Web Workers). Nothing is uploaded to servers.

## File Conventions

### Services (`src/shared/services/*/`)

| File | Purpose |
| --- | --- |
| `types.ts` | Shared types, safe to import from universal code |
| `*.client.ts` | Browser-only runtime (PDF, image codecs, DOM APIs). Never imported by route shells or server code. |
| `*.ts` | Isomorphic implementation (safe on server and client) |
| `*.test.ts` | Tests |

```
src/shared/services/zip/
├── zip.ts            # Main implementation
└── zip.test.ts       # Tests

src/shared/services/pdf/          # browser-only service
├── types.ts          # FileWithInfo, ImageResult, etc.
└── pdf.client.ts     # PdfService, encryptPdf, clawpdf, @cantoo/pdf-lib
```

### Features (`src/features/<feature>/`)

| Path | Purpose |
| --- | --- |
| `context.tsx` | Feature state provider (keep free of client-only service imports) |
| `components/` | React components |
| `services/` | Feature-specific services (`*.client.ts` for browser-only runtime) |
| `types/` | TypeScript types |
| `utils/` | Utility functions |

## Comments

Use JSDoc tags to target different audiences:

```ts
/**
 * @ai-agent The `zip` function from `fflate` already runs compression in a Web Worker.
 * Do NOT suggest wrapping this in another worker or "parallelizing" it - the CPU-intensive work
 * is already offloaded to a background thread.
 */
```

```ts
/**
 * @human Takes an object of filename → Blob mappings and returns a ZIP file as a Blob.
 * Useful for bundling multiple files (images, PDFs, etc.) for download/upload.
 */
```

## Imports & the Server Bundle

All code is **isomorphic by default** in TanStack Start — it lands in both server and client bundles unless constrained. `ClientOnly` only skips **rendering**; it does not exclude modules from the server bundle. Target: `dist/server` stays small for Cloudflare Workers; heavy libs (PDF/image codecs) live only in `dist/client`.

1. **Runtime goes in `*.client.ts`** — TanStack Start treats them as client-only via import protection. Import runtime from the `.client.ts` file directly; import types from `types.ts`.

   ```ts
   import { PdfService } from "@/shared/services/pdf/pdf.client";
   import type { FileWithInfo } from "@/shared/services/pdf/types";
   ```

2. **Import by direct path, especially in routes** — route modules are always part of the server graph, so everything they import must be server-safe. Never import feature-wide or service-wide aggregations; import the concrete module.

   ```ts
   import { EncryptPdfProvider } from "@/features/encrypt-pdf/context";
   import { EncryptPdfDropZone } from "@/features/encrypt-pdf/components/drop-zone";
   ```

3. **Static imports only** — TanStack Router's per-route code splitting already emits third-party libraries as their own chunks; `await import()` causes dev-server module fetch failures.

4. **Verify after changes touching imports or heavy libs:**

   ```bash
   bun run build
   rg "cantoo|clawpdf|@jsquash" dist/server   # must be empty
   ```

| Concern | Use |
| --- | --- |
| Browser-only utility | `*.client.ts` or `createClientOnlyFn()` |
| Browser-only component | `ClientOnly` |
| Types in universal code | `types.ts` / `import type` from the module path |
| Route imports | Direct path to the concrete module |
| SEO for tool pages | `head()` + prerender |

## Web Workers

- Many operations (ZIP, PDF processing) already run in Web Workers internally — check before suggesting worker wrappers. Libraries like `fflate` manage their own workers.
- For custom workers, use Comlink (RPC-style communication):

  ```ts
  // worker side — src/shared/services/image/compression.worker.ts
  import * as Comlink from "comlink";
  const api = { myMethod };
  export type WorkerApi = typeof api;
  Comlink.expose(api);

  // client side — compression.client.ts
  const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
  const api = Comlink.wrap<WorkerApi>(worker);
  ```

## Libraries

**Don't reinvent the wheel.** If an established library does the job, use it — never hand-roll a parser, tokenizer, encoder, formatter, or validator, and never keep custom code alongside the library; delete it. Configure the library's own options instead of reimplementing its output, and surface the library's own error rather than rebuilding it.

| Job | Use |
| --- | --- |
| Base64 encode/decode | `js-base64` (`encode`, `decode`, `isValid`) |
| XML format / minify | `xml-formatter` (`xmlFormat`, `xmlFormat.minify`, `strictMode: true`) |
| YAML parse/serialize | `js-yaml` (`load`, `dump`) |
| ZIP archive | `fflate` |
| Hashing | `hash-wasm` |
| Generic utilities | `es-toolkit/compat` (Lodash-compatible API) |
| Immutable updates | `useImmer` for complex React state (`use-immer`); `immer`'s `produce` elsewhere |
| Bounded concurrency | `p-limit` |

## Anti-Patterns

1. **Don't wrap already-async operations in workers** — check whether the library handles its own threading first.
2. **Don't add unnecessary abstractions** — prefer simple functions over complex class hierarchies.
3. **Don't hand-roll what a library already does** — see [Libraries](#libraries).
4. **Don't import from `lodash`** — use `es-toolkit/compat` (same API, better performance).
5. **Don't manually spread nested objects for immutability** — use Immer's `produce`.
6. **Don't rely on `ClientOnly` to shrink the server bundle** — it only defers rendering; use `*.client.ts` and direct path imports for browser-only code.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Routing**: TanStack Router / TanStack Start
- **Styling**: Tailwind CSS v4
- **State**: `useImmer` for complex React state
- **Deployment**: Cloudflare Workers
