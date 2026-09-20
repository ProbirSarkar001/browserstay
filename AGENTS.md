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
- `index.ts` - Public entry point. For browser-only services, export **types only** here.
- `types.ts` - Shared types safe to import from SSR/universal code
- `*.client.ts` - Browser-only runtime (PDF, image codecs, DOM APIs). Never imported by route shells or SSR code.
- `*.ts` - Isomorphic implementation (safe on server and client)
- `*.test.ts` - Test files (when applicable)

Example structure (isomorphic):
```
src/shared/services/zip/
├── index.ts          # Exports public API
├── zip.ts            # Main implementation
└── zip.test.ts       # Tests
```

Example structure (browser-only):
```
src/shared/services/pdf/
├── index.ts          # export type * from "./types" only
├── types.ts          # FileWithInfo, ImageResult, etc.
└── pdf.client.ts     # PdfService, encryptPdf, clawpdf, @cantoo/pdf-lib
```

### Feature Files (`src/features/*`)
- `context.tsx` - Feature state provider (keep free of client-only service imports)
- `components/` - React components
- `services/` - Feature-specific services (`*.client.ts` for browser-only runtime)
- `types/` - TypeScript types
- `utils/` - Utility functions
- `index.ts` - **Avoid.** Barrel re-exports drag the whole feature graph into whatever imports them. Routes and other SSR-universal modules must import `context`, `components/*`, and `constants` by path instead.

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
- Services export a clean public API via `index.ts`
- Implementation details stay in the main file
- Workers are co-located with their service
- Browser-only services split types (`types.ts`) from runtime (`*.client.ts`); `index.ts` re-exports types only so `export * from "./pdf"` in `shared/services/index.ts` cannot pull heavy libs into the server bundle

### Client-Only Code & Server Bundle Size (TanStack Start)

All code is **isomorphic by default** in TanStack Start — it is included in both server and client bundles unless constrained. `ClientOnly` only skips **rendering** on the server; it does **not** exclude imported modules from the server bundle.

Use this checklist for tool routes and browser-only libraries (PDF, image codecs, canvas, `localStorage`, etc.):

#### 1. Put runtime in `*.client.ts`

TanStack Start treats `.client.*` files as client-only via [import protection](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model). Feature components that run tools should import runtime from the `.client.ts` file directly:

```ts
// ✅ Feature component
import { PdfService } from "@/shared/services/pdf/pdf.client";

// ✅ Type-only in universal code
import type { FileWithInfo } from "@/shared/services/pdf";
```

```ts
// ❌ Pulls @cantoo/pdf-lib, clawpdf, etc. into dist/server
import { PdfService } from "@/shared/services/pdf";
import { PdfService } from "@/shared/services";
```

Keep `shared/services/index.ts` as `export type * from "./pdf"` (not `export *`) for browser-only services.

#### 2. Set `ssr: false` on tool routes

Interactive tool pages do not need server-rendered markup. SEO comes from `head()` and prerendering. Disable SSR on the route:

```ts
export const Route = createFileRoute("/split-pdf")({
  ssr: false,
  component: SplitPdfPage,
  head: () => generateToolHead("splitPdf"),
});
```

Apply to all browser-tool routes (PDF tools, image tools, QR generator, password generator, etc.) unless there is a specific reason to SSR the tool UI.

#### 3. Avoid barrel (`index.ts`) imports — especially in routes

**Barrel files are an anti-pattern in this codebase.** Route modules are always part of the server graph, so importing `@/features/foo` (the feature `index.ts`) re-exports the entire feature — context, components, services — and can pull client-only deps into the SSR bundle or trigger import-protection build errors. The same applies to `@/shared/services` and feature `index.ts` barrels in `context.tsx` or other universal code.

Import the concrete module you need:

```ts
// ✅ Route file — provider from context, components by path
import { EncryptPdfProvider } from "@/features/encrypt-pdf/context";
import { EncryptPdfDropZone } from "@/features/encrypt-pdf/components/drop-zone";

// ❌ Barrel pulls drop-zone → constants → pdf.client into server graph
import { EncryptPdfProvider, EncryptPdfDropZone } from "@/features/encrypt-pdf";

// ❌ Universal service barrel can pull browser-only runtime into dist/server
import { createZip, downloadBlob } from "@/shared/services";
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
| Types in SSR/universal code | `types.ts` / `import type` from `index.ts` |
| Tool route default | `ssr: false` + direct path imports (never feature/service barrels) |
| SEO for tool pages | `head()` + prerender (unchanged) |

### Utilities
- Use `es-toolkit/compat` for utility functions - it provides the same API as Lodash
- Use `immer` for immutable state updates, especially with complex nested objects
- Immer's `produce` function allows writing "mutable-style" code that produces immutable updates

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4
- **State**: Immer for immutable updates
- **Utilities**: es-toolkit/compat (Lodash-compatible API)
- **Deployment**: Cloudflare Workers

## Common Anti-Patterns to Avoid

1. **Don't wrap already-async operations in workers** - Check if the library handles its own threading
2. **Don't add unnecessary abstractions** - Prefer simple functions over complex class hierarchies
3. **Never use dynamic imports** - TanStack Router's per-route code splitting already emits third-party libraries (e.g., `@cantoo/pdf-lib`) as their own separate chunks when they're statically imported, so `await import()` gymnastics are unnecessary and cause dev-server module fetch failures. Always use plain static imports.
4. **Don't manually spread nested objects for immutability** - Use Immer's `produce` instead
5. **Don't import from `lodash`** - Use `es-toolkit/compat` for the same API with better performance
6. **Don't rely on `ClientOnly` to shrink the server bundle** - It only defers rendering; use `*.client.ts`, `ssr: false`, and direct route imports for browser-only code
7. **Don't re-export browser runtime from service `index.ts`** - Use `export type *` so universal barrels (`shared/services/index.ts`) cannot pull heavy libs into `dist/server`
8. **Don't use barrel (`index.ts`) imports in routes, contexts, or other SSR-universal code** - Import `context`, `components/*`, `constants`, and service files by path (`@/features/foo/context`, `@/shared/services/zip/zip`). Feature `index.ts` barrels and `@/shared/services` are for convenience only and must not appear in the server import graph.
