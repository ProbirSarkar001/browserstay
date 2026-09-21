import { useMemo, useState } from "react";
import { ArrowLeftRight, Check, CircleAlert, Copy, Eraser } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { cn, safeSync } from "@/shared/utils";
import { decodeUrl, encodeUrl } from "../services/url-encoder";
import type { SpaceEncoding, UrlEncodeMode } from "../services/url-encoder";

type Mode = "encode" | "decode";

const MODE_OPTIONS: { value: UrlEncodeMode; label: string }[] = [
  { value: "component", label: "Component (query params)" },
  { value: "full", label: "Full URL" }
];

const SPACE_OPTIONS: { value: SpaceEncoding; label: string }[] = [
  { value: "percent", label: "%20" },
  { value: "plus", label: "+" }
];

const DECODE_SPACE_OPTIONS: { value: SpaceEncoding; label: string }[] = [
  { value: "percent", label: "Keep + literal" },
  { value: "plus", label: "Decode + as a space" }
];

export function UrlEncoder() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [direction, setDirection] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [encodeMode, setEncodeMode] = useState<UrlEncodeMode>("full");
  const [space, setSpace] = useState<SpaceEncoding>("percent");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    const [result, failure] = safeSync(() =>
      direction === "encode"
        ? encodeUrl(input, { mode: encodeMode, space })
        : decodeUrl(input, { plusAsSpace: space === "plus" })
    );
    return failure
      ? { output: "", error: "Malformed percent-encoding — check for stray % characters." }
      : { output: result, error: "" };
  }, [input, direction, encodeMode, space]);

  const spaceOptions = direction === "encode" ? SPACE_OPTIONS : DECODE_SPACE_OPTIONS;

  const switchDirection = () => {
    if (output) {
      setInput(output);
    }
    setDirection(direction === "encode" ? "decode" : "encode");
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>URL Encoder / Decoder</CardTitle>
            <CardDescription>Percent-encode URLs and query strings — entirely in your browser.</CardDescription>
          </div>
          <Tabs value={direction} onValueChange={(value) => setDirection(value as Mode)}>
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {direction === "encode" && (
            <div className="space-y-2">
              <Label htmlFor="url-mode" className="text-sm text-muted-foreground">
                Mode
              </Label>
              <Select value={encodeMode} items={MODE_OPTIONS} onValueChange={(value) => value && setEncodeMode(value)}>
                <SelectTrigger id="url-mode" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="url-space" className="text-sm text-muted-foreground">
              {direction === "encode" ? "Space encoding" : "Plus handling"}
            </Label>
            <Select value={space} items={spaceOptions} onValueChange={(value) => value && setSpace(value)}>
              <SelectTrigger id="url-space" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spaceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="font-medium text-destructive">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="url-input" className="text-sm font-medium">
                {direction === "encode" ? "Plain URL / text" : "Encoded URL"}
              </Label>
              <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
                <Eraser className="h-4 w-4" />
                Clear
              </Button>
            </div>
            <Textarea
              id="url-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                direction === "encode"
                  ? "https://example.com/search?q=hello world"
                  : "https://example.com/search?q=hello%20world"
              }
              spellCheck={false}
              className="min-h-64 font-mono text-sm resize-y"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="url-output" className="text-sm font-medium">
                Result
              </Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={switchDirection} disabled={!output}>
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
            <Textarea
              id="url-output"
              readOnly
              value={output}
              placeholder="Result appears here as you type"
              spellCheck={false}
              className="min-h-64 font-mono text-sm resize-y bg-muted/30 break-all"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
