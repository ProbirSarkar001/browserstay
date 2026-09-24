<!-- intent-skips:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changing.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skips:end -->

## File Naming Conventions

This project follows a consistent file naming convention to improve code organization and discoverability.

### Service Files (`src/shared/services/*/`)
- `types.ts` - Shared types safe to import from SSR/universal code
- `*.client.ts` - Browser-only runtime (PDF, image codecs, DOM APIs). Never imported by route shells or SSR code.
- `*.ts` - Isomorphic implementation (safe on server and client)
- `*.test.ts` - Test files (when applicable)

Example structure (isomorphic):
```
src/shared/services/zip/
├── zip.ts            # Main implementation
└── zip.test.ts       # Tests
```

Example structure (browser-only):
```
src/shared/services/pdf/
├── types.ts          # FileWithInfo, ImageResult, etc.
└── pdf.client.ts     # PdfService, encryptPdf, clawpdf, @cantoo/pdf-lib
```

### Feature Files (`src/features/*`)
- `context.tsx` - Feature state provider (keep free of client-only service imports)
- `components/` - React components
- `services/` - Feature-specific services (`*.client.ts` for browser-only runtime)
- `types/` - TypeScript types
- `utils/` - Utility functions

## Comment Rules

When adding comments or documentation, use JSDoc tags to target different audiences:

### `@ai-agent`
Instructions for AI agents reviewing or suggesting changes to this code. Use this to:
- Prevent redundant optimization suggestions
- Document architectural decisions that agents commonly misunderstand
- Warn against anti-patterns that AI tools frequently suggest

Example:
```ts
/**
 * @ai-agent The `zip` function from `fflate` already runs compression in a Web Worker.
 * Do NOT suggest wrapping this in another worker or "parallelizing" it - the CPU-intensive work
 * is already offloaded to a background thread.
 */
```

### `@human`
Human-readable descriptions of what code does, not how it works. Focus on:
- Purpose and use cases
- Input/output relationships
- Practical examples

Example:
```ts
/**
 * @human Takes an object of filename → Blob mappings and returns a ZIP file as a Blob.
 * Useful for bundling multiple files (images, PDFs, etc.) for download/upload.
 */
```

## Architecture Notes

### Web Workers
- Many operations (ZIP, PDF processing) already use Web Workers internally
- Check for existing worker usage before suggesting worker wrappers
- Libraries like `fflate` handle their own worker management

### Web Worker + Comlink Pattern
For custom workers, use Comlink for type-safe RPC-style communication:

**Worker side** ([example](src/shared/services/image/compression.worker.ts)):
```ts
import * as Comlink from "comlink";

const api = { myMethod };
export type WorkerApi = typeof api;
Comlink.expose(api);
```

**Client side** ([example](src/shared/services/image/compression.client.ts)):
```ts
import * as Comlink from "comlink";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
const api = Comlink.wrap<WorkerApi>(worker);
// Use: await api.myMethod(...args);
```

### Service Pattern
- Implementation details stay in the main file
- Workers are co-located with their service
- Browser-only services split types (`types.ts`) from runtime (`*.client.ts`)

### Client-Only Code & Server Bundle Size (TanStack Start)

All code is **isomorphic by default** in TanStack Start — it is included in both server and client bundles unless constrained. `ClientOnly` only skips **rendering** on the server; it does **not** exclude imported modules from the server bundle.

Use this checklist for tool routes and browser-only libraries (PDF, image codecs, canvas, `localStorage`, etc.):

#### 1. Put runtime in `*.client.ts`

TanStack Start treats `.client.*` files as client-only via [import protection](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model). Feature components that run tools should import runtime from the `.client.ts` file directly:

```ts
// ✅ Feature component
import { PdfService } from "@/shared/services/pdf/pdf.client";

// ✅ Type-only in universal code
import type { FileWithInfo } from "@/shared/services/pdf/types";
```

Import runtime from the `.client.ts` file directly, and types from `types.ts` — never through feature-wide or service-wide aggregations, which pull @cantoo/pdf-lib, clawpdf, etc. into dist/server.

#### 2. Set `ssr: false` on tool routes

Interactive tool pages do not need server-rendered markup. SEO comes from `head()` and prerendering. Disable SSR on the route:

```ts
export const Route = createFileRoute("/split-pdf")({
  
  component: SplitPdfPage,
  head: () => generateToolHead("splitPdf"),
});
```

Apply to all browser-tool routes (PDF tools, image tools, QR generator, password generator, etc.) unless there is a specific reason to SSR the tool UI.

#### 3. Import by direct path — especially in routes

Route modules are always part of the server graph, so any module a route imports must be safe for SSR. Import the concrete module you need by path; importing feature-wide or service-wide aggregations can pull client-only deps into the SSR bundle or trigger import-protection build errors.

```ts
// ✅ Route file — provider from context, components by path
import { EncryptPdfProvider } from "@/features/encrypt-pdf/context";
import { EncryptPdfDropZone } from "@/features/encrypt-pdf/components/drop-zone";
```

`ClientOnly` around tool UI is still useful for a loading fallback during hydration, but it is not a substitute for `ssr: false`, direct imports, or `.client.ts` / `client-only` markers.

#### 4. Verify the server bundle after changes

```bash
bun run build
du -sh dist/server dist/client
# No PDF/image codec libs should appear under dist/server
rg "cantoo|clawpdf|@jsquash" dist/server
```

Target: `dist/server` stays small for Cloudflare Workers limits; heavy libs live only in `dist/client`.

#### Quick reference

| Concern | Use |
| --- | --- |
| Browser-only utility | `*.client.ts` or `createClientOnlyFn()` |
| Browser-only component | `ClientOnly` + `ssr: false` on the route |
| Types in SSR/universal code | `types.ts` / `import type` from the module path |
| Tool route default | `ssr: false` + direct path imports |
| SEO for tool pages | `head()` + prerender (unchanged) |

### Utilities
- Use `es-toolkit/compat` for utility functions - it provides the same API as Lodash
- Use `immer` for immutable state updates, especially with complex nested objects
- Immer's `produce` function allows writing "mutable-style" code that produces immutable updates

## Dependencies & Libraries

**Don't reinvent the wheel.** If an established library already does the job, use it — never hand-roll a parser, tokenizer, encoder, formatter, or validator. Delete the custom implementation rather than keeping it alongside the library.

- Configure the library's own options to match the behavior you need; don't reimplement its output.
- Prefer surfacing the library's own error over rebuilding it just for friendlier messages.
- Only write custom code when no maintained library covers the job.

Preferred libraries for common jobs:

| Job | Use |
| --- | --- |
| Base64 encode/decode | `js-base64` (`encode`, `decode`, `isValid`) |
| XML format / minify / well-formedness | `xml-formatter` (`xmlFormat`, `xmlFormat.minify`, `strictMode: true`) |
| YAML parse/serialize | `js-yaml` (`load`, `dump`, `YAMLException`) |
| ZIP archive | `fflate` |
| Hashing | `hash-wasm` |
| Generic utilities | `es-toolkit/compat` (Lodash-compatible API) |
| Immutable updates | `immer` |
| Bounded concurrency | `p-limit` |

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4
- **State**: Immer for immutable updates
- **Utilities**: es-toolkit/compat (Lodash-compatible API)
- **Parsing & encoding**: js-yaml, js-base64, xml-formatter
- **Deployment**: Cloudflare Workers

## Common Anti-Patterns to Avoid

1. **Don't wrap already-async operations in workers** - Check if the library handles its own threading
2. **Don't add unnecessary abstractions** - Prefer simple functions over complex class hierarchies
3. **Never use dynamic imports** - TanStack Router's per-route code splitting already emits third-party libraries (e.g., `@cantoo/pdf-lib`) as their own separate chunks when they're statically imported, so `await import()` gymnastics are unnecessary and cause dev-server module fetch failures. Always use plain static imports.
4. **Don't manually spread nested objects for immutability** - Use Immer's `produce` instead
5. **Don't import from `lodash`** - Use `es-toolkit/compat` for the same API with better performance
6. **Don't rely on `ClientOnly` to shrink the server bundle** - It only defers rendering; use `*.client.ts`, `ssr: false`, and direct route imports for browser-only code
7. **Don't import feature-wide or service-wide aggregations in routes, contexts, or other SSR-universal code** - Import `context`, `components/*`, `constants`, and service files by direct path (`@/features/foo/context`, `@/shared/services/zip/zip`) so client-only runtime never reaches the server import graph.
9. **Don't hand-roll what a library already does** - No custom tokenizers, parsers, encoders, formatters, or validators when a maintained package covers the job (e.g. `js-base64` over `TextEncoder`/`btoa` byte-walking, `xml-formatter` over a hand-written XML tree). Never keep both; delete the custom code. See [Dependencies & Libraries](#dependencies--libraries).
