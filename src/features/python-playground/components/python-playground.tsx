import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import {
  Check,
  Copy,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { CodeEditor } from "@/shared/components/common/code-editor";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { cn } from "@/shared/utils";
import {
  initPythonRuntime,
  runPython
} from "@/shared/services/python/python.client";
import type {
  PythonRunResult,
  PythonRuntimeInfo
} from "@/shared/services/python/types";
import {
  DEFAULT_AUTO_LOAD_PACKAGES,
  DEFAULT_PYTHON_CODE,
  PYTHON_EXAMPLES,
  PYTHON_LIMITS
} from "../constants";
import type { RuntimeStatus } from "../types";

const EXAMPLE_ITEMS = PYTHON_EXAMPLES.map((example) => ({
  value: example.id,
  label: example.label
}));

/**
 * @human Client-side Python playground. The interpreter (Pyodide/CPython on
 * WebAssembly) boots lazily in a Web Worker the first time you run code, then
 * stays warm for subsequent runs. Scripts and output never leave the browser.
 */
export function PythonPlayground() {
  const clipboard = useClipboard({ timeout: 2000 });

  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const [exampleId, setExampleId] = useState(PYTHON_EXAMPLES[0].id);
  const [output, setOutput] = useState<PythonRunResult | null>(null);
  const [runtime, setRuntime] = useState<PythonRuntimeInfo | null>(null);
  const [status, setStatus] = useState<RuntimeStatus>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [workerError, setWorkerError] = useState<string | null>(null);
  const [autoLoadPackages, setAutoLoadPackages] = useState(
    DEFAULT_AUTO_LOAD_PACKAGES
  );

  const isRunningRef = useRef(false);

  const run = useCallback(async () => {
    if (isRunningRef.current) return;
    if (!code.trim()) return;

    isRunningRef.current = true;
    setIsRunning(true);
    setWorkerError(null);

    try {
      if (!runtime) {
        setStatus("loading");
        const info = await initPythonRuntime();
        setRuntime(info);
      }
      setStatus("ready");

      const result = await runPython(code.slice(0, PYTHON_LIMITS.MAX_CODE_LENGTH), {
        autoLoadPackages
      });
      setOutput(result);
    } catch (error) {
      setStatus(runtime ? "ready" : "idle");
      setWorkerError(
        error instanceof Error
          ? error.message
          : "The Python runtime failed to start."
      );
    } finally {
      isRunningRef.current = false;
      setIsRunning(false);
    }
  }, [autoLoadPackages, code, runtime]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void run();
    }
  };

  const selectExample = (value: string | null) => {
    if (!value) return;
    const example = PYTHON_EXAMPLES.find((item) => item.id === value);
    if (!example) return;
    setExampleId(example.id);
    setCode(example.code);
    setOutput(null);
    setWorkerError(null);
  };

  const outputText = buildOutputText(output, workerError, isRunning);
  const hasOutput =
    Boolean(workerError) ||
    (output !== null &&
      (output.stdout !== "" ||
        output.stderr !== "" ||
        output.result !== null ||
        output.error !== null));

  return (
    <Card
      className="w-full shadow-lg border-border/50"
      onKeyDown={handleKeyDown}
    >
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-muted-foreground" />
              Python Playground
            </CardTitle>
            <CardDescription>
              Write and run Python in a Web Worker. Standard-library and
              popular scientific packages load automatically.
            </CardDescription>
          </div>
          <RuntimeBadge status={status} runtime={runtime} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={exampleId}
            items={EXAMPLE_ITEMS}
            onValueChange={selectExample}
          >
            <SelectTrigger size="sm" className="w-44" aria-label="Load an example">
              <Sparkles className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PYTHON_EXAMPLES.map((example) => (
                <SelectItem key={example.id} value={example.id}>
                  {example.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => void run()} disabled={isRunning || !code.trim()}>
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? "Running" : "Run"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setOutput(null);
              setWorkerError(null);
            }}
            disabled={!hasOutput || isRunning}
          >
            <RotateCcw className="h-4 w-4" />
            Clear output
          </Button>

          <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Ctrl/Cmd
            </kbd>
            <span>+</span>
            <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>
            <span>to run</span>
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="python-code" className="text-sm font-medium">
            Script
          </Label>
          <CodeEditor
            id="python-code"
            language="python"
            value={code}
            onChange={setCode}
            height="24rem"
            placeholder="print('Hello from Python')"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-sm font-medium">Output</Label>
            <div className="flex items-center gap-3">
              {output && !isRunning && (
                <span className="text-xs text-muted-foreground">
                  finished in {(output.durationMs / 1000).toFixed(2)}s
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clipboard.copy(outputText)}
                disabled={!outputText}
                className={cn(clipboard.copied && "text-green-600")}
              >
                {clipboard.copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {clipboard.copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div
            role="log"
            aria-live="polite"
            className="min-h-32 max-h-96 overflow-auto rounded-lg border border-border/50 bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-100"
          >
            {isRunning && (
              <p className="flex items-center gap-2 text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                {status === "loading"
                  ? "Downloading and starting the Python runtime…"
                  : "Running…"}
              </p>
            )}

            {!isRunning && workerError && (
              <pre className="whitespace-pre-wrap break-words text-red-400">
                {workerError}
              </pre>
            )}

            {!isRunning && !hasOutput && (
              <p className="text-zinc-500">
                Output appears here. Press Run, or Ctrl/Cmd + Enter.
              </p>
            )}

            {output?.stdout && (
              <pre className="whitespace-pre-wrap break-words text-zinc-100">
                {output.stdout}
              </pre>
            )}

            {output?.stderr && (
              <pre className="whitespace-pre-wrap break-words text-amber-400">
                {output.stderr}
              </pre>
            )}

            {output && output.result !== null && (
              <pre className="whitespace-pre-wrap break-words text-emerald-400">
                {"=> "}
                {output.result}
              </pre>
            )}

            {output?.error && (
              <pre className="whitespace-pre-wrap break-words text-red-400">
                {output.error}
              </pre>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
          <div className="space-y-0.5">
            <Label htmlFor="auto-load-packages" className="text-sm font-medium">
              Auto-install imports
            </Label>
            <p className="text-xs text-muted-foreground">
              Load matching packages (e.g. numpy, pandas) from the Pyodide index
              before running. Turn off to run against what&apos;s already loaded.
            </p>
          </div>
          <Switch
            id="auto-load-packages"
            checked={autoLoadPackages}
            onCheckedChange={(checked) => setAutoLoadPackages(checked === true)}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          The first run downloads the ~10&nbsp;MB WebAssembly runtime. Python and
          every package are fetched from the public Pyodide CDN, executed in your
          browser, and never uploaded.
        </p>
      </CardContent>
    </Card>
  );
}

function RuntimeBadge({
  status,
  runtime
}: {
  status: RuntimeStatus;
  runtime: PythonRuntimeInfo | null;
}) {
  if (status === "loading") {
    return (
      <Badge variant="secondary">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading Python…
      </Badge>
    );
  }

  if (runtime) {
    return (
      <Badge variant="secondary">
        Python {runtime.pythonVersion} · Pyodide {runtime.pyodideVersion}
      </Badge>
    );
  }

  return <Badge variant="outline">Runtime loads on first run</Badge>;
}

function buildOutputText(
  output: PythonRunResult | null,
  workerError: string | null,
  isRunning: boolean
): string {
  if (isRunning) return "";
  const parts: string[] = [];
  if (workerError) parts.push(workerError);
  if (output) {
    if (output.stdout) parts.push(output.stdout.trimEnd());
    if (output.stderr) parts.push(output.stderr.trimEnd());
    if (output.result !== null) parts.push(`=> ${output.result}`);
    if (output.error) parts.push(output.error);
  }
  return parts.join("\n");
}