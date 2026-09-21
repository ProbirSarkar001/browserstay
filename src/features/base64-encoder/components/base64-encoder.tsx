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
import { decodeBase64, encodeBase64 } from "../services/base64";
import type { Base64Alphabet } from "../services/base64";

type Mode = "encode" | "decode";

const SAMPLE_TEXT = "Hello, BrowserStay! 🔒";

const ALPHABET_OPTIONS: { value: Base64Alphabet; label: string }[] = [
  { value: "standard", label: "Standard (+, /)" },
  { value: "url-safe", label: "URL-safe (-, _)" }
];

export function Base64Encoder() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [mode, setMode] = useState<Mode>("encode");
  const [alphabet, setAlphabet] = useState<Base64Alphabet>("standard");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    const [result, failure] = safeSync(() =>
      mode === "encode" ? encodeBase64(input, { alphabet }) : decodeBase64(input)
    );
    return failure ? { output: "", error: failure.message } : { output: result, error: "" };
  }, [input, mode, alphabet]);

  const switchMode = () => {
    if (output) {
      setInput(output);
    }
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Base64 Encoder / Decoder</CardTitle>
            <CardDescription>Convert text to and from Base64 — entirely in your browser.</CardDescription>
          </div>
          <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {mode === "encode"
              ? "Text is encoded as UTF-8, so emoji and non-Latin characters work correctly."
              : "Standard and URL-safe Base64 are both decoded — padding is optional."}
          </p>
          {mode === "encode" && (
            <div className="space-y-2">
              <Label htmlFor="base64-alphabet" className="text-sm text-muted-foreground">
                Alphabet
              </Label>
              <Select
                value={alphabet}
                items={ALPHABET_OPTIONS}
                onValueChange={(value) => value && setAlphabet(value)}
              >
                <SelectTrigger id="base64-alphabet" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALPHABET_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
              <Label htmlFor="base64-input" className="text-sm font-medium">
                {mode === "encode" ? "Plain text" : "Base64 input"}
              </Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE_TEXT)}>
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
                  <Eraser className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              id="base64-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={mode === "encode" ? "Type text to encode…" : "Paste Base64 to decode…"}
              spellCheck={false}
              className="min-h-64 font-mono text-sm resize-y"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="base64-output" className="text-sm font-medium">
                {mode === "encode" ? "Base64 output" : "Decoded text"}
              </Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={switchMode} disabled={!output}>
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
              id="base64-output"
              readOnly
              value={output}
              placeholder="Result appears here as you type"
              spellCheck={false}
              className="min-h-64 font-mono text-sm resize-y bg-muted/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
