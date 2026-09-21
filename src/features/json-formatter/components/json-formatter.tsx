import { useMemo, useState } from "react";
import { Braces, Check, CircleAlert, Copy, Eraser, Minimize2, Wand2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { cn, safeSync } from "@/shared/utils";
import { CodeEditor } from "@/shared/components/common/code-editor";
import { formatJson, minifyJson, validateJson } from "../services/json-formatter";
import type { JsonIndent, JsonOperation } from "../types";
import { INDENT_OPTIONS, SAMPLE_JSON } from "../constants";

export function JsonFormatter() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<JsonIndent>("2");
  const [operation, setOperation] = useState<JsonOperation>("format");

  const validation = useMemo(() => validateJson(input), [input]);
  const inputStats = useMemo(
    () => ({ lines: input ? input.split("\n").length : 0, chars: input.length }),
    [input]
  );

  const output = useMemo(() => {
    if (!validation.valid) {
      return "";
    }
    const [formatted, error] = safeSync(() =>
      operation === "minify" ? minifyJson(input) : formatJson(input, indent)
    );
    return error ? "" : formatted;
  }, [validation.valid, input, operation, indent]);

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>JSON Formatter</CardTitle>
            <CardDescription>Format, validate, or minify JSON — entirely in your browser.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="json-indent" className="text-sm text-muted-foreground">
                Indent
              </Label>
              <Select
                value={indent}
                items={INDENT_OPTIONS}
                onValueChange={(value) => value && setIndent(value)}
                disabled={operation === "minify"}
              >
                <SelectTrigger id="json-indent" className="w-32">
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
            <Button
              size="sm"
              variant={operation === "format" ? "default" : "secondary"}
              onClick={() => setOperation("format")}
              disabled={!validation.valid}
            >
              <Wand2 className="h-4 w-4" />
              Format
            </Button>
            <Button
              size="sm"
              variant={operation === "minify" ? "default" : "secondary"}
              onClick={() => setOperation("minify")}
              disabled={!validation.valid}
            >
              <Minimize2 className="h-4 w-4" />
              Minify
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {input && !validation.valid && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Invalid JSON</p>
              <p className="mt-0.5 text-muted-foreground">{validation.message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="json-input" className="text-sm font-medium">
                Input
              </Label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {inputStats.lines} lines · {inputStats.chars} chars
                </span>
                <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE_JSON)}>
                  <Braces className="h-4 w-4" />
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
                  <Eraser className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
            <CodeEditor
              id="json-input"
              value={input}
              onChange={setInput}
              placeholder='{"paste": "your JSON here"}'
              className={cn(input && !validation.valid && "border-destructive/50")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="json-output" className="text-sm font-medium">
                {operation === "minify" ? "Minified output" : "Formatted output"}
              </Label>
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
            <CodeEditor
              id="json-output"
              readOnly
              value={output}
              placeholder="Formatted JSON appears here"
              className="bg-muted/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
