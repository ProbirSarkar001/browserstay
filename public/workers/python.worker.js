// @ts-check
// This worker is served as a static module from /workers/python.worker.js, so
// every import must resolve in the browser at runtime (hence the CDN URLs). The
// shared types below are referenced via JSDoc `import()` only — TypeScript
// resolves them at compile time and emits nothing, keeping client and worker in
// sync without breaking the runtime module graph.
import * as Comlink from "https://cdn.jsdelivr.net/npm/comlink@4.4.2/+esm";
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

/** @typedef {import("../../src/shared/services/python/types").PythonRunOptions} PythonRunOptions */
/** @typedef {import("../../src/shared/services/python/types").PythonRunResult} PythonRunResult */
/** @typedef {import("../../src/shared/services/python/types").PythonRuntimeInfo} PythonRuntimeInfo */
/** @typedef {import("pyodide").PyodideAPI} PyodideAPI */

/** @type {Promise<PyodideAPI> | undefined} */
let pyodidePromise;

/**
 * Loads Pyodide once and caches the promise. `indexURL` defaults to the
 * directory `pyodide.mjs` was served from, so the matching wasm and stdlib are
 * fetched from the same CDN release.
 * @returns {Promise<PyodideAPI>}
 */
function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide();
  }
  return pyodidePromise;
}

/**
 * @returns {Promise<PythonRuntimeInfo>}
 */
async function init() {
  const pyodide = await getPyodide();
  const pythonVersion = pyodide.runPython("import sys; sys.version.split()[0]");
  return {
    pyodideVersion: pyodide.version,
    pythonVersion: String(pythonVersion)
  };
}

/**
 * Runs a script, capturing stdout/stderr and the value of the final expression.
 * Imported packages are loaded from the Pyodide distribution first so a script
 * can `import numpy` without any setup.
 * @param {string} code
 * @param {PythonRunOptions} [options]
 * @returns {Promise<PythonRunResult>}
 */
async function run(code, options = {}) {
  const pyodide = await getPyodide();
  const { autoLoadPackages = true } = options;

  let stdout = "";
  let stderr = "";
  // `batched` receives a chunk each time a newline is written or the stream is
  // flushed, so we concatenate as-is instead of adding our own newlines.
  pyodide.setStdout({
    batched: (text) => {
      stdout += text;
    }
  });
  pyodide.setStderr({
    batched: (text) => {
      stderr += text;
    }
  });

  const started = performance.now();
  try {
    if (autoLoadPackages) {
      await pyodide.loadPackagesFromImports(code);
    }
    const value = await pyodide.runPythonAsync(code);
    let result = null;
    if (value !== undefined && value !== null) {
      result = String(value);
      if (typeof value.destroy === "function") {
        value.destroy();
      }
    }
    return {
      stdout,
      stderr,
      result,
      error: null,
      durationMs: performance.now() - started
    };
  } catch (error) {
    return {
      stdout,
      stderr,
      result: null,
      error: error instanceof Error ? error.message : String(error),
      durationMs: performance.now() - started
    };
  }
}

Comlink.expose({ init, run });