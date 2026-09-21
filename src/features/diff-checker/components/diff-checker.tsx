import { useMemo, useState } from "react";
import { ArrowLeftRight, Check, Copy, Eraser, FileDiff, Info } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { cn } from "@/shared/utils";
import { diffText, toUnifiedText } from "../services/diff-checker";
import type { DiffOp } from "../types";
import { SAMPLE_LEFT, SAMPLE_RIGHT } from "../constants";

const MARKER: Record<DiffOp, string> = { equal: " ", delete: "-", insert: "+" };

const ROW_CLASS: Record<DiffOp, string> = {
  equal: "",
  delete: "bg-red-500/10",
  insert: "bg-green-500/10"
};

export function DiffChecker() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const debouncedLeft = useDebouncedValue(left);
  const debouncedRight = useDebouncedValue(right);

  const result = useMemo(() => diffText(debouncedLeft, debouncedRight), [debouncedLeft, debouncedRight]);
  const { additions, deletions, unchanged, identical } = result.summary;
  const hasInput = Boolean(left || right);

  const handleSwap = () => {
    setLeft(right);
    setRight(left);
  };

  const handleClear = () => {
    setLeft("");
    setRight("");
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Diff Checker</CardTitle>
            <CardDescription>Compare two texts and highlight every difference.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              +{additions}
            </Badge>
            <Badge variant="destructive" className="font-mono">
              −{deletions}
            </Badge>
            <Badge variant="outline" className="font-mono">
              ={unchanged}
            </Badge>
            {hasInput && identical && <Badge variant="secondary">Identical</Badge>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLeft(SAMPLE_LEFT);
                setRight(SAMPLE_RIGHT);
              }}
            >
              <FileDiff className="h-4 w-4" />
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSwap} disabled={!left && !right}>
              <ArrowLeftRight className="h-4 w-4" />
              Swap
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!hasInput}>
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diff-left" className="text-sm font-medium">
              Original
            </Label>
            <Textarea
              id="diff-left"
              value={left}
              onChange={(event) => setLeft(event.target.value)}
              placeholder="Paste the original text"
              spellCheck={false}
              className="min-h-48 font-mono text-sm resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diff-right" className="text-sm font-medium">
              Changed
            </Label>
            <Textarea
              id="diff-right"
              value={right}
              onChange={(event) => setRight(event.target.value)}
              placeholder="Paste the changed text"
              spellCheck={false}
              className="min-h-48 font-mono text-sm resize-y"
            />
          </div>
        </div>

        {result.truncated && (
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">
              These inputs are very large, so a faster coarse diff was used. Shared start and end
              lines are still matched exactly.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Differences</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clipboard.copy(toUnifiedText(result))}
              disabled={!hasInput || identical}
              className={cn(clipboard.copied && "text-green-600")}
            >
              {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {clipboard.copied ? "Copied!" : "Copy diff"}
            </Button>
          </div>

          {hasInput ? (
            <div className="max-h-96 overflow-auto rounded-lg border border-border/50 font-mono text-xs">
              {result.lines.map((line, index) => (
                <div key={index} className={cn("flex", ROW_CLASS[line.op])}>
                  <span className="w-10 shrink-0 select-none border-r border-border/40 px-2 text-right text-muted-foreground">
                    {line.leftNumber ?? ""}
                  </span>
                  <span className="w-10 shrink-0 select-none border-r border-border/40 px-2 text-right text-muted-foreground">
                    {line.rightNumber ?? ""}
                  </span>
                  <span className="w-5 shrink-0 select-none px-1 text-center text-muted-foreground">
                    {MARKER[line.op]}
                  </span>
                  <span className="whitespace-pre-wrap break-all px-2">
                    {line.value || <span className="text-muted-foreground">…</span>}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 px-4 py-10 text-center text-sm text-muted-foreground">
              Paste text into both panes to see a line-by-line comparison.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
