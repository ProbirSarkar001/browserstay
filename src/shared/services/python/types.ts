export interface PythonRunOptions {
  /**
   * Detect imports in the code and load matching packages from the Pyodide
   * distribution before running. Defaults to true.
   */
  autoLoadPackages?: boolean;
}

export interface PythonRunResult {
  /** Text written to `sys.stdout` during the run. */
  stdout: string;
  /** Text written to `sys.stderr` during the run. */
  stderr: string;
  /** String form of the final expression's value, or null when there was none. */
  result: string | null;
  /** Python traceback when execution raised, or null on success. */
  error: string | null;
  /** Wall-clock execution time in milliseconds. */
  durationMs: number;
}

export interface PythonRuntimeInfo {
  /** Pyodide version, e.g. "314.0.7". */
  pyodideVersion: string;
  /** CPython version reported by `sys.version`, e.g. "3.14.0". */
  pythonVersion: string;
}

/** API exposed by the Python worker. */
export interface PythonWorkerApi {
  init(): Promise<PythonRuntimeInfo>;
  run(code: string, options: PythonRunOptions): Promise<PythonRunResult>;
}