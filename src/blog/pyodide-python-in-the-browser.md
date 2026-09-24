---
title: "Pyodide: Real Python, Running in Your Browser"
published: 2026-09-24
description: "Pyodide is the actual CPython interpreter compiled to WebAssembly — not a Python-to-JavaScript transpiler. How it works, how packages load, and why it belongs in a Web Worker."
tags: ["python", "pyodide", "webassembly", "web-workers"]
---

Ask someone to run a Python script and they'll reach for an install, a notebook server, or a cloud REPL that uploads their code. Pyodide removes all three: it is the real CPython interpreter compiled to WebAssembly, running inside a browser tab. No server, no setup, and nothing leaves the machine.

## It's Not a Transpiler — It's the Interpreter

Plenty of tools "run Python in JavaScript" by translating Python syntax into JS. Pyodide is different: it is CPython itself — the reference implementation — built to WebAssembly with Emscripten. Your `.py` file is compiled to Python bytecode and executed by the same interpreter loop that runs on your laptop.

That means the semantics are exactly Python's: reference counting, dynamic dispatch, tracebacks, even the quirks. `import json` behaves identically because it *is* the same `json` module. When something fails, you get the real Python exception, not an approximation.

## Booting It Takes Three Lines

```html
<script type="module">
  import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

  const pyodide = await loadPyodide();
  pyodide.runPython("print('hello from CPython')");
</script>
```

The first call downloads the WebAssembly runtime and the standard library — roughly 10 MB — after which the interpreter is warm and subsequent runs start instantly. The browser's HTTP cache means the cost is paid once, not per visit.

## The Standard Library Comes Free

Because CPython ships with its standard library, Pyodide does too. `os`, `json`, `re`, `math`, `statistics`, `datetime`, `collections`, `itertools` — all present from the first byte. Much of what people use Python for day to day needs nothing else.

## Third-Party Packages, Two Ways

This is where it gets interesting, because numpy can't just be pip-installed into WebAssembly — its wheels contain native machine code.

1. **The Pyodide index.** The project pre-builds hundreds of the most-wanted packages — numpy, pandas, scipy, matplotlib, scikit-learn — to WebAssembly. `pyodide.loadPackagesFromImports(code)` scans your script, figures out which ones it needs, and fetches them before running.
2. **micropip.** Pure-Python wheels from PyPI install at runtime, which covers a long tail of smaller packages.

The boundary: anything requiring arbitrary native libraries won't work unless the Pyodide team has built it. For the scientific Python stack, they very much have.

## Python and JavaScript Can Talk

The border between the two worlds is porous, in both directions:

- `runPythonAsync(code)` supports top-level `await` and returns the value of the last expression — a REPL falls out of this almost by accident
- Python objects cross into JavaScript as proxies whose methods you can call directly
- `import js` inside Python reaches the other way, so `js.document.title = "set from Python"` just works

## Run It in a Worker, Not on the Page

An interpreter this heavy has no business on the UI thread — a numpy call would freeze the page exactly like any other blocking JavaScript. The right shape is the standard one from [WASM + Web Workers](/blog/wasm-and-web-workers): the worker owns the interpreter, the main thread sends code and renders results.

[Comlink](https://github.com/GoogleChromeLabs/comlink) turns that into a typed async API — `await run(code)` reads like a local function call. Capturing output is a few lines on the Python side:

```js
pyodide.setStdout({ batched: (text) => output += text });
pyodide.setStderr({ batched: (text) => errors += text });
```

One honest problem: there is no `KeyboardInterrupt` across a Web Worker boundary. If a script hits `while True: pass`, the interpreter never yields and no message will stop it. The only reliable stop button is to terminate the worker and boot a fresh interpreter on the next run.

## The Honest Limitations

- **First-load weight** — ~10 MB before the first run; fine for a tool, wrong for a landing page
- **Speed** — noticeably slower than native CPython, which is already slower than compiled languages
- **No sockets, no OS** — networking goes through browser APIs and the filesystem is an in-memory sandbox
- **One thread** — a single interpreter with the GIL, not a cluster

None of these matter for the sweet spot: interactive experiments, teaching, quick data wrangling, and privacy-sensitive processing.

## The Privacy Angle

Every cloud REPL has the same property: your code is executed on someone else's computer, and so is your data. Pyodide inverts that. The interpreter downloads *to* you, and execution happens in your tab — the script and its output never leave the browser.

That's the whole idea behind BrowserStay's [Python Playground](/python-playground): Pyodide in a Web Worker, packages auto-installed from your imports, stdout and tracebacks captured live — and nothing uploaded, ever.

> A full CPython interpreter, 10 MB, one script tag away. When the runtime moves to the client, "running Python" stops being a service and becomes a feature of the page.
