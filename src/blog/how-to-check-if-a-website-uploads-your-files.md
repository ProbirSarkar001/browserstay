---
title: "How to Check If a Website Uploads Your Files (Developer Tools Method)"
published: 2026-09-23
description: "Privacy claims are easy to write. Here's a practical way to verify whether a file tool actually sends your data to a server."
tags: ["privacy", "how-to", "browser-tools"]
---

A PDF tool says "100% secure" and "we respect your privacy." The privacy policy mentions "temporary processing." You want to know the truth before uploading your tax return.

You can verify this yourself in about 60 seconds using your browser's built-in developer tools. No technical expertise required — just follow the steps.

## What You're Looking For

When a tool **uploads** your file, your browser sends an HTTP request containing the file data to a remote server. That request shows up in the Network tab.

When a tool **processes locally**, selecting a file should produce zero (or negligible) upload traffic. The file stays in browser memory.

## Step-by-Step: Chrome or Edge

1. Open the tool website
2. Press **F12** (or right-click → Inspect) to open Developer Tools
3. Click the **Network** tab
4. Check **Disable cache** (optional but helpful)
5. Click the filter for **Fetch/XHR** or **All**
6. Clear any existing entries (the 🚫 icon)
7. Now select or drop your test file into the tool
8. Watch the Network tab

**If you see a large POST request** (several KB to MB) to the tool's domain or a CDN — your file was uploaded.

**If nothing significant appears** (maybe a few tiny analytics requests) — the file likely stayed local.

## Step-by-Step: Firefox

Same process. **F12** → **Network** tab → clear → add your file → observe.

Firefox labels upload requests clearly. Look for POST requests with a size matching your file.

## The Offline Test

A stronger verification:

1. Open the tool and wait for the page to fully load
2. Disconnect from the internet (turn off WiFi or unplug ethernet)
3. Try processing your file

If it still works, processing is client-side. The code already loaded; it doesn't need the server.

If it fails immediately or shows "uploading," it's server-dependent.

**Caveat:** Some hybrid tools load the UI locally but upload for processing. The offline test catches those.

## What About Analytics?

You'll often see small requests to Google Analytics, Sentry, or similar. These are telemetry — not your file. A 1KB analytics ping is normal. A 5MB POST to `api.example.com/upload` is your PDF.

## Red Flags in Network Activity

- POST requests to `/upload`, `/process`, `/convert`, `/api/file`
- Request payload size matching your file size
- Requests to cloud storage domains (S3, GCS, Azure Blob)
- WebSocket connections that spike when you add a file

## Green Flags

- No network activity when selecting files
- Processing works offline after page load
- Open-source code with no fetch/XMLHttpRequest sending file blobs

## Test With a Harmless File First

Use a small, non-sensitive test file — a blank PDF or a public image. You're checking network behavior, not actually processing sensitive data. Once you trust the tool's architecture, use it for real documents.

## Privacy Policies vs Reality

"We delete files after processing" means they still received your file. "Bank-level encryption" means the upload was encrypted — but they still have the decrypted copy on their server.

Network inspection shows what actually happens, regardless of marketing copy.

## Try It Yourself

Verify BrowserStay yourself: open any tool, check the Network tab, drop a file. You'll see no upload requests. [Merge a PDF](/merge-pdf), [compress an image](/image-compressor), or [generate a password](/password-generator) — all client-side, open source, auditable on [GitHub](https://github.com/probir-sarkar/browserstay).
