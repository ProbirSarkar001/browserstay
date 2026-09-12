---
title: "WASM + Web Workers: A Perfect Combination"
published: 2026-07-28
description: "Why WebAssembly and Web Workers are better together — keeping heavy computation fast and the UI perfectly smooth."
tags: ["webassembly", "web-workers", "performance", "concurrency"]
---

WebAssembly gives you speed. Web Workers give you smoothness. Separately, each solves half the problem of heavy client-side computation. Together, they're the architecture behind every serious browser-based tool.

## The Problem Each One Solves Alone

**WASM alone** runs fast — but on the main thread, it blocks the UI just like JavaScript would. A 500ms image decode means 500ms of frozen interface. Clicks don't register, animations stutter, the page feels broken.

**Workers alone** free the main thread — but JavaScript in a worker is still slow for CPU-bound work. Moving the heavy lifting off the main thread doesn't make it fast; it just makes the jank invisible... until the user waits.

Combine them and you get both: near-native computation that never touches the UI thread.

## The Architecture

The canonical setup looks like this:

```
Main thread (UI)
    │  sends File bytes
    ▼
Worker thread
    │  loads WASM module
    ▼
WASM memory (linear buffer)
    │  decodes / processes / encodes
    ▼
Result → transferred back (zero-copy)
```

The worker instantiates the WASM module, feeds bytes into WASM's linear memory, calls the exported functions, and hands the result back. The main thread never runs heavy code — it only dispatches work and renders results.

## Zero-Copy: The Hidden Superpower

The detail that separates naive implementations from good ones is **transferable objects**. When you pass an `ArrayBuffer` between threads with `postMessage(buffer, [buffer])`, ownership transfers instead of copying — a multi-megabyte image crosses threads instantly.

Since the WASM module reads and writes its own linear memory, the full pipeline can be copy-free:

1. Read the file into an `ArrayBuffer`
2. Transfer it to the worker (zero-copy)
3. Copy into WASM memory (a fast `memcpy`)
4. Process natively
5. Return a result buffer via transfer

For a 10MB image, the overhead is milliseconds.

## Parallelism: One Worker Per Core

Here's where it gets really good: `navigator.hardwareConcurrency` tells you how many logical cores the device has. Spin up a worker pool and you can process N images in parallel:

- 8-core machine, 20 images to compress → ~2-3 batches instead of 20 sequential runs
- Each worker owns its own WASM instance, so there's no shared-state locking
- Progress messages stream back to the UI as each task completes

This is true multithreading in the browser — without a single shared mutable variable.

## SharedArrayBuffer and True Shared Memory

For workloads where even one copy is too much, `SharedArrayBuffer` lets the main thread and workers reference the *same* memory — and WASM modules can operate directly on it with atomics for synchronization. This is how projects like ffmpeg.wasm implement multithreaded encoding.

It requires cross-origin isolation headers (COOP/COEP), but when you control the deployment — as static sites on Cloudflare Pages or similar do — it's a config line.

## Making It Ergonomic

Raw worker plumbing is verbose. Tools that make it pleasant:

- **Comlink** — exposes a worker as a typed async API via proxies; `await worker.compress(img)` reads like local code
- **Vite/Webpack worker imports** — `new Worker(new URL('./worker.ts', import.meta.url))` with full bundler support
- **wasm-bindgen** — generates the JS glue so the WASM exports feel like normal functions

The result: architecture that used to require deep systems knowledge is now a few imports.

## The Pattern to Remember

Any CPU-heavy browser feature — image processing, PDF manipulation, cryptography, media encoding — should follow the same shape:

> WASM module, loaded in a worker pool, zero-copy transfers in, results out, UI never blocked.

If your tool feels instant and the page never freezes, this is almost certainly why.
