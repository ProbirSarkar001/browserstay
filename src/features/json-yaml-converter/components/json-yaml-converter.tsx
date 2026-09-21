import { useMemo, useState } from "react";
import { ArrowLeftRight, Check, CircleAlert, Copy, Eraser, FileJson } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { cn } from "@/shared/utils";
import { CodeEditor } from "@/shared/components/common/code-editor";
import { convert } from "../services/json-yaml-converter";
import type { ConversionDirection, IndentOption } from "../types";
import { DIRECTION_OPTIONS, INDENT_OPTIONS, SAMPLE_JSON, SAMPLE_YAML } from "../constants";

export function JsonYamlConverter() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<ConversionDirection>("json-to-yaml");
  const [indent, setIndent] = useState<IndentOption>("2");

  const debouncedInput = useDebouncedValue(input);
  const result = useMemo(() => convert(debouncedInput, direction, indent), [debouncedInput, direction, indent]);
  const output = result.ok ? result.output : "";

  // The debounced value trails the editor while typing or pasting. Until the
  // conversion catches up, `result` still describes the previous input (often
  // empty), so hide the error to avoid flashing "Invalid JSON" on a valid paste.
  const isPending = debouncedInput !== input;
  const showError = Boolean(input) && !result.ok && !isPending;

  const inputStats = useMemo(
    () => ({ lines: input ? input.split("\n").length : 0, chars: input.length }),
    [input]
  );

  const toYaml = direction === "json-to-yaml";
  const sample = toYaml ? SAMPLE_JSON : SAMPLE_YAML;

  const handleSwap = () => {
    if (!output) {
      return;
    }
    setInput(output);
    setDirection(toYaml ? "yaml-to-json" : "json-to-yaml");
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>JSON ⇄ YAML Converter</CardTitle>
            <CardDescription>Convert JSON to YAML and back — entirely in your browser.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DIRECTION_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={direction === option.value ? "default" : "secondary"}
                onClick={() => setDirection(option.value)}
              >
                {option.label}
              </Button>
            ))}
            <div className="flex items-center gap-2">
              <Label htmlFor="converter-indent" className="text-sm text-muted-foreground">
                Indent
              </Label>
              <Select
                value={indent}
                items={INDENT_OPTIONS}
                onValueChange={(value) => value && setIndent(value)}
              >
                <SelectTrigger id="converter-indent" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">
                Invalid {toYaml ? "JSON" : "YAML"}
              </p>
              <p className="mt-0.5 text-muted-foreground">{result.message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="converter-input" className="text-sm font-medium">
                {toYaml ? "JSON input" : "YAML input"}
              </Label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {inputStats.lines} lines · {inputStats.chars} chars
                </span>
                <Button variant="ghost" size="sm" onClick={() => setInput(sample)}>
                  <FileJson className="h-4 w-4" />
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
                  <Eraser className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
            <CodeEditor
              id="converter-input"
              value={input}
              onChange={setInput}
              language={toYaml ? "json" : "yaml"}
              placeholder={toYaml ? '{"key": "value"}' : "key: value"}
              className={cn(showError && "border-destructive/50")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="converter-output" className="text-sm font-medium">
                {toYaml ? "YAML output" : "JSON output"}
              </Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handleSwap} disabled={!output}>
                  <ArrowLeftRight className="h-4 w-4" />
                  Swap
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clipboard.copy(output)}
                  disabled={!output}
                  className={cn(clipboard.copied && "text-green-600")}
                >
                  {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {clipboard.copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <CodeEditor
              id="converter-output"
              readOnly
              value={output}
              language={toYaml ? "yaml" : "json"}
              placeholder={toYaml ? "YAML appears here" : "JSON appears here"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
