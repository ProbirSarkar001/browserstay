import "@tanstack/react-start/client-only";

/**
 * @ai-agent Browser-only Python runtime (Pyodide in a module worker, loaded from
 * the jsDelivr CDN). Import from feature components only — never from route
 * shells or universal barrels. See AGENTS.md.
 */
import * as Comlink from "comlink";
import type {
  PythonRunOptions,
  PythonRunResult,
  PythonRuntimeInfo,
  PythonWorkerApi
} from "./types";

let worker: Worker | undefined;
let api: Comlink.Remote<PythonWorkerApi> | undefined;

function getApi(): Comlink.Remote<PythonWorkerApi> {
  if (!api) {
    worker = new Worker("/workers/python.worker.js", {
      type: "module"
    });
    api = Comlink.wrap<PythonWorkerApi>(worker);
  }
  return api;
}

/**
 * @human Boots the Python runtime. The first call downloads the Pyodide
 * WebAssembly runtime (~10 MB) from the CDN; later calls reuse the loaded
 * instance. Nothing you run is uploaded — execution stays in the worker.
 */
export function initPythonRuntime(): Promise<PythonRuntimeInfo> {
  return getApi().init();
}

/**
 * @human Runs a Python script in the worker and resolves with everything it
 * wrote to stdout/stderr, the value of its last expression, and any traceback.
 */
export function runPython(
  code: string,
  options: PythonRunOptions = {}
): Promise<PythonRunResult> {
  return getApi().run(code, options);
}

export function terminatePythonWorker(): void {
  worker?.terminate();
  worker = undefined;
  api = undefined;
}