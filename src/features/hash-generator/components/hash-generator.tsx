import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Eraser, File as FileIcon, Loader2, Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import prettyBytes from "pretty-bytes";
import { cn } from "@/shared/utils";
import { hashBytes, hashText } from "../services/hash-generator";
import type { HashResult } from "../services/hash-generator";

type InputMode = "text" | "file";

export function HashGenerator() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [results, setResults] = useState<HashResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  const compute = useCallback(
    async (getBytes: () => Uint8Array<ArrayBuffer> | Promise<Uint8Array<ArrayBuffer>>, name = "", size = 0) => {
    setBusy(true);
    setFileName(name);
    setFileSize(size);
    try {
      const bytes = await getBytes();
      setResults(await hashBytes(bytes));
    } finally {
      setBusy(false);
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      compute(
        async () => new Uint8Array(await file.arrayBuffer()),
        file.name,
        file.size
      );
    },
    [compute]
  );

  const copyRow = (digest: string) => {
    clipboard.copy(digest);
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Hash Generator</CardTitle>
          <CardDescription>
            Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 in one pass — entirely in your browser.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="text">
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hash-input" className="text-sm font-medium">
                Input
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setText("");
                  setResults([]);
                  setFileName("");
                  setFileSize(0);
                }}
                disabled={!text && !results.length}
              >
                <Eraser className="h-4 w-4" />
                Clear
              </Button>
            </div>
            <Textarea
              id="hash-input"
              value={text}
              onChange={(event) => {
                const value = event.target.value;
                setText(value);
                if (value) {
                  compute(() => new TextEncoder().encode(value));
                } else {
                  setResults([]);
                  setFileName("");
                  setFileSize(0);
                }
              }}
              placeholder="Type or paste text to hash…"
              spellCheck={false}
              className="min-h-40 font-mono text-sm resize-y"
            />
          </TabsContent>

          <TabsContent value="file" className="mt-4">
            <label
              className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const file = event.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
            >
              <input
                type="file"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Drop a file here or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  The file is read locally to compute its checksums — nothing is uploaded.
                </p>
              </div>
              {fileName && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileIcon className="h-3.5 w-3.5" />
                  {fileName}
                  {fileSize > 0 && ` · ${prettyBytes(fileSize)}`}
                </p>
              )}
            </label>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          {busy && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Computing hashes…
            </div>
          )}
          {!busy &&
            results.map((result) => (
              <div
                key={result.algorithm}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {result.algorithm}
                </span>
                <code className="min-w-0 flex-1 break-all font-mono text-sm">{result.digest}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyRow(result.digest)}
                  className={cn("shrink-0 h-8 w-8", clipboard.copied && "text-green-600")}
                  aria-label={`Copy ${result.algorithm} hash`}
                >
                  {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          {!busy && !results.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Hashes appear here once you enter text or choose a file.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
