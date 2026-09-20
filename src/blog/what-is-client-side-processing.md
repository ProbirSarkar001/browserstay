---
title: "What Is Client-Side Processing? (And Why It Matters for Your Privacy)"
published: 2026-09-20
description: "Client-side means your device does the work. Server-side means someone else's computer does. Here's why the difference matters."
tags: ["privacy", "browser-tools", "web-technology"]
---

You've seen "processed locally" and "runs in your browser" on tool websites. Maybe you've wondered what that actually means — and whether it's just marketing speak.

It's not. Client-side processing is a real architectural difference that changes who can see your files.

## Two Ways to Process a File

**Server-side (traditional):**
1. You upload your file to a website
2. Their server receives it, processes it, stores it temporarily
3. You download the result

Your file traveled to another computer. That computer had full access to the contents.

**Client-side (browser-based):**
1. The website loads software into your browser (JavaScript, WebAssembly)
2. You select a file from your device — it stays in browser memory
3. Your device's CPU does the processing
4. You download the result directly from memory

Your file never left your computer. The website's server only sent you the page and the processing code.

## What "Client" Means

In networking, the **client** is your device — your laptop, phone, or tablet. The **server** is a remote computer that responds to requests.

Client-side processing = the work happens on your device.
Server-side processing = the work happens on their device.

## Why Browsers Can Do This Now

Ten years ago, browsers could barely run a calculator. Today they can:

- **WebAssembly** — run near-native speed code for image and PDF processing
- **Web Workers** — heavy tasks in background threads without freezing the page
- **File API** — read files from your device without uploading
- **Web Crypto** — generate secure random passwords locally

The gap between "web app" and "desktop app" has closed for many file-processing tasks.

## What Client-Side Can't Do (Honestly)

Client-side processing has limits:

- **Very large files** may strain older devices or browsers with memory limits
- **First load** requires downloading the processing code (WASM modules can be several MB)
- **No persistence** — if you close the tab, unsaved work is gone (no cloud backup)
- **Connection needed initially** — to load the page and code (though processing itself doesn't need ongoing internet)

These are tradeoffs, not dealbreakers. For most PDF and image tasks, client-side works well.

## How to Verify a Tool Is Client-Side

1. **No upload progress bar** — if files load instantly into the tool without "uploading," they're staying local
2. **Works offline after load** — disconnect WiFi mid-task; if processing continues, it's client-side
3. **Open source** — you can read the code and confirm no network requests send your file
4. **Privacy policy** — should explicitly state files are not uploaded

## The Privacy Bottom Line

Client-side processing isn't magic — it's architecture. When a tool runs on your device, the tool provider never sees your file. That's the strongest privacy guarantee a web tool can offer.

## Try It Yourself

BrowserStay is built entirely on client-side processing. [PDF tools](/pdf-tools), [image tools](/image-tools), and more — your files never leave your PC. Free, open source, no accounts.
