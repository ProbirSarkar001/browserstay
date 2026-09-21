import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { useDownload } from "@/shared/hooks/useDownload";
import { cn } from "@/shared/utils";
import { formatUuid, generateUuids } from "../services/uuid-generator";
import type { UuidFormatOptions } from "../services/uuid-generator";

const COUNT_LIMIT = 500;

export function UuidGenerator() {
  const clipboard = useClipboard({ timeout: 2000 });
  const download = useDownload();
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [options, setOptions] = useState<UuidFormatOptions>({
    uppercase: false,
    noHyphens: false,
    braces: false
  });

  const regenerate = useCallback(() => {
    const safeCount = Math.min(Math.max(count || 0, 1), COUNT_LIMIT);
    setUuids(generateUuids(safeCount));
    clipboard.reset();
  }, [count, clipboard]);

  useEffect(() => {
    regenerate();
  }, []);

  const formatted = uuids.map((uuid) => formatUuid(uuid, options));

  const copyAll = () => clipboard.copy(formatted.join("\n"));

  const downloadTxt = () => {
    download.downloadFile(new Blob([formatted.join("\n")], { type: "text/plain" }), {
      filename: "uuids",
      extension: "txt"
    });
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>UUID Generator</CardTitle>
          <CardDescription>
            Generate random UUIDs (v4) with your browser's cryptographic random number generator.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="uuid-count" className="text-sm font-medium">
              Quantity
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="uuid-count"
                type="number"
                min={1}
                max={COUNT_LIMIT}
                value={count}
                onChange={(event) => setCount(event.target.valueAsNumber)}
                onBlur={() => {
                  if (!count || count < 1) setCount(1);
                  if (count > COUNT_LIMIT) setCount(COUNT_LIMIT);
                }}
                className="w-24"
              />
              <Button onClick={regenerate}>
                <RefreshCw className="h-4 w-4" />
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Up to {COUNT_LIMIT} at a time.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Format</Label>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-3 text-sm">
                <Switch
                  id="uuid-uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, uppercase: checked === true }))}
                />
                Uppercase
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Switch
                  id="uuid-no-hyphens"
                  checked={options.noHyphens}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, noHyphens: checked === true }))}
                />
                Remove hyphens
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Switch
                  id="uuid-braces"
                  checked={options.braces}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, braces: checked === true }))}
                />
                Wrap in braces
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Results <span className="font-normal text-muted-foreground">({formatted.length})</span>
            </Label>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadTxt}
                disabled={!formatted.length}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAll}
                disabled={!formatted.length}
                className={cn(clipboard.copied && "text-green-600")}
              >
                {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {clipboard.copied ? "Copied all!" : "Copy all"}
              </Button>
            </div>
          </div>
          <ul className="max-h-96 overflow-y-auto rounded-lg border border-border divide-y divide-border/60">
            {formatted.map((uuid, index) => (
              <li key={`${uuid}-${index}`} className="group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40">
                <code className="flex-1 font-mono text-sm break-all">{uuid}</code>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => clipboard.copy(uuid)}
                        aria-label="Copy UUID"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
