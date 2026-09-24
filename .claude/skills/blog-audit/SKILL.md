---
name: blog-audit
description: Audit BrowserStay blog articles (src/blog/*.md) for wrong or missing info — browser render/link checks via agent-browser, then fact-check claims against the codebase and web sources. Use when asked to audit, fact-check, or verify blog articles, or to re-audit after content changes.
---

# Blog Content Audit

Audit blog articles for factual errors, wrong tool claims, and missing info.
Before auditing, read `.claude/skills/blog-audit/manifest.md` and **skip any article whose
`content` column is ✅** unless it was substantially edited since its audit date
(then audit only the changed parts and update the row).

## Workflow

### 1. Setup

- Create a working branch (e.g. `chore/blog-content-audit`).
- Start the dev server: `bun run dev` (serves at http://localhost:3000).
- Use a named browser session for every agent-browser command:
  `export AGENT_BROWSER_SESSION=blog-audit`

### 2. Render + link sweep (browser)

For each article slug:

```bash
agent-browser open "http://localhost:3000/blog/$slug"
agent-browser read                              # dumped rendered text; check for 404/truncation
agent-browser eval "JSON.stringify([...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')))"
```

Verify every internal href resolves to a real route (`src/routes/`, including the
`{$category}-tools` dynamic pages `/pdf-tools` and `/image-tools`, and
`/image-converter/<from>-to-<to>` slugs) or an existing `src/blog/*.md` slug.

### 3. Extract ground truth from the code

Article claims about BrowserStay's own tools are the most common error source.
Check against the code, not memory:

- Tool routes: `src/routes/*.tsx` (this is the definitive tool inventory)
- Image converter inputs/outputs: `src/features/image-converter/constants/index.ts`
  (inputs jpeg/png/webp/avif/gif/heic/heif; **outputs jpeg/png/webp/avif only**)
- Per-tool accepted formats and options: each feature's `constants/`, `context.tsx`,
  and services (e.g. pdf-to-image hardcodes PNG output in
  `src/shared/services/pdf/pdf.client.ts`)

### 4. Fact-check content (parallel agents)

Fan out ~6 general-purpose agents, ~10 articles each. Give every agent:

- The current tool inventory (from step 3)
- The checklist below
- Instruction to verify uncertain third-party claims (pricing, free-tier limits,
  platform specs) via WebSearch and only report confident findings

Checklist per article:

- **Wrong tool claims**: formats/options the tool doesn't actually support; tools
  listed that don't exist; feature lists missing tools (e.g. `pdf-to-markdown`)
- **Stale third-party facts**: competitor pricing/limits, platform limits (email
  attachment sizes, social media image dimensions), discontinued services
- **Math/spec errors**: entropy and pixel/DPI arithmetic, format capabilities
  (lossy vs lossless), aspect ratios
- **Impossible mechanics**: e.g. AirDrop-to-Windows; messaging apps and EXIF
- **Missing key info**: escaping rules (WiFi QR `;` `:` `,` `\`), paid-vs-free
  steps in how-tos, important caveats
- **Internal contradictions** and future `published:` dates (flag, don't silently
  change scheduled posts)

Do not flag style/tone, SEO wording, or intentional BrowserStay promotion.

### 5. Fix, verify, record

1. Apply fixes to the `.md` files.
2. Re-open each edited article in agent-browser and confirm the corrected text
   renders (guards against stale build).
3. Update `.claude/skills/blog-audit/manifest.md`: set `content ✅` with the date and a
   one-line note per fixed article.
4. Commit on the branch.
