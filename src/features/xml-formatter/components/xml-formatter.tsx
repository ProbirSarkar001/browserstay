import { useMemo } from "react";
import { Check, CircleAlert, Copy, Eraser, FileCode2, Minimize2, Wand2 } from "lucide-react";
import { useImmer } from "use-immer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { cn, safeSync } from "@/shared/utils";
import { formatXml, minifyXml } from "../services/xml-formatter";
import type { XmlFormatterState, XmlIndent, XmlOperation } from "../types";
import { INDENT_OPTIONS, SAMPLE_XML } from "../constants";

export function XmlFormatter() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [state, updateState] = useImmer<XmlFormatterState>({
    input: "",
    indent: "2",
    operation: "format"
  });
  const { input, indent, operation } = state;

  const setInput = (value: string) => updateState((draft) => { draft.input = value; });
  const setIndent = (value: XmlIndent) => updateState((draft) => { draft.indent = value; });
  const setOperation = (value: XmlOperation) => updateState((draft) => { draft.operation = value; });

  const debouncedInput = useDebouncedValue(input);
  const inputStats = useMemo(
    () => ({ lines: input ? input.split("\n").length : 0, chars: input.length }),
    [input]
  );

  const { output, error } = useMemo(() => {
    if (!debouncedInput.trim()) {
      return { output: "", error: "" };
    }
    const [formatted, failure] = safeSync(() =>
      operation === "minify" ? minifyXml(debouncedInput) : formatXml(debouncedInput, indent)
    );
    return failure ? { output: "", error: failure.message } : { output: formatted, error: "" };
  }, [debouncedInput, operation, indent]);

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>XML Formatter</CardTitle>
            <CardDescription>Format, validate, or minify XML — entirely in your browser.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="xml-indent" className="text-sm text-muted-foreground">
                Indent
              </Label>
              <Select
                value={indent}
                items={INDENT_OPTIONS}
                onValueChange={(value) => value && setIndent(value)}
                disabled={operation === "minify"}
              >
                <SelectTrigger id="xml-indent" className="w-32">
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
              disabled={!input.trim()}
            >
              <Wand2 className="h-4 w-4" />
              Format
            </Button>
            <Button
              size="sm"
              variant={operation === "minify" ? "default" : "secondary"}
              onClick={() => setOperation("minify")}
              disabled={!input.trim()}
            >
              <Minimize2 className="h-4 w-4" />
              Minify
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {input && error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Invalid XML</p>
              <p className="mt-0.5 text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="xml-input" className="text-sm font-medium">
                Input
              </Label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {inputStats.lines} lines · {inputStats.chars} chars
                </span>
                <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE_XML)}>
                  <FileCode2 className="h-4 w-4" />
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
                  <Eraser className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              id="xml-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='<?xml version="1.0"?><root>…</root>'
              spellCheck={false}
              className={cn("min-h-64 font-mono text-sm resize-y", input && error && "border-destructive/50")}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="xml-output" className="text-sm font-medium">
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
            <Textarea
              id="xml-output"
              readOnly
              value={output}
              placeholder="Formatted XML appears here"
              spellCheck={false}
              className="min-h-64 font-mono text-sm resize-y bg-muted/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
