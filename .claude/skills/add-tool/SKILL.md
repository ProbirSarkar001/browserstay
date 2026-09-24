---
name: add-tool
description: Add a new tool/feature to BrowserStay — feature directory, context provider, components, tools config, SEO, route, and verification. Use when creating a new tool page or scaffolding a new PDF/image/dev utility.
---

# Add a New Tool

Architecture rules (file naming, client-only imports, SSR, barrels) are in
`AGENTS.md` and always apply. This skill is the step-by-step recipe. Code
templates for each step: [references/templates.md](references/templates.md).

## Steps

1. **Scaffold** `src/features/<name>/{components,constants,types}` (+ `services/` if needed).

2. **Types** in `types/index.ts`: feature `File`, `Settings`, `Result` interfaces.

3. **Constants** in `constants/index.ts`: `DEFAULT_*_SETTINGS`, `*_LIMITS`.

4. **Context provider** in `context.tsx`: build on `useFileHandler` + `useProcessingState` from `@/shared/hooks`. No client-only service imports here. Export a `use<Name>Context()` hook that throws outside the provider.

5. **Components**: reuse shared primitives — `DropZoneBase`, `FileListBase` from `@/shared/components/common`. Standard flow: drop → list → settings → action card (process → download single file or ZIP via `createZip` + `downloadBlob`).

6. **Tools config**: add entry to `src/config/tools.ts` (title, href, description, icon, color, tags).

7. **SEO**: add to `metaConfigs` in `src/lib/seo.ts` (title, description, canonicalUrl, keywords).

8. **Route** at `src/routes/<name>.tsx`: wire `component` and `head: () => generateToolHead("<key>")`. Import context, components, constants, and services by direct path.

9. **Verify**:
   ```bash
   bun run build
   du -sh dist/server dist/client
   rg "cantoo|clawpdf|@jsquash" dist/server   # must be empty
   bun run test
   ```

## Checklist

- [ ] Feature structure correct
- [ ] Types / constants / context implemented
- [ ] Shared primitives reused; runtime in `*.client.ts` where browser-only
- [ ] Tools config + SEO config added
- [ ] Route: `head()` + direct imports
- [ ] Error handling + file validation
- [ ] Server bundle clean of heavy libs
- [ ] Accessibility + edge cases tested (empty/large/multiple files)
