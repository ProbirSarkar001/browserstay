import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/utils";
import { dateToTimestamps, formatDateParts, parseTimestamp } from "../services/timestamp-converter";
import type { TimestampUnit } from "../services/timestamp-converter";

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <span className="w-28 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 flex-1 break-all font-mono text-sm">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className={cn("h-8 w-8 shrink-0", copied && "text-green-600")}
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

function useCurrentTimestamp(live: boolean) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (!live) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [live]);

  return now;
}

export function TimestampConverter() {
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  const now = useCurrentTimestamp(true);
  const parsedDate = useMemo(
    () => (timestampInput ? parseTimestamp(timestampInput, unit) : null),
    [timestampInput, unit]
  );
  const dateParts = useMemo(
    () => (parsedDate ? formatDateParts(parsedDate) : null),
    [parsedDate]
  );
  const timestamps = useMemo(() => dateToTimestamps(dateInput), [dateInput]);

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Unix Timestamp Converter</CardTitle>
          <CardDescription>Convert between Unix timestamps and human-readable dates — entirely in your browser.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Current time */}
        <section className="space-y-3">
          <Label className="text-sm font-medium">Current Unix time</Label>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
            <span className="font-mono text-2xl font-semibold tabular-nums">
              {now !== null ? Math.floor(now / 1000) : "—"}
            </span>
            <span className="text-xs text-muted-foreground">seconds · updates live</span>
            {now !== null && (
              <div className="ml-auto flex items-center gap-2">
                <code className="font-mono text-xs text-muted-foreground">{now} ms</code>
                <InlineCopyButton value={String(Math.floor(now / 1000))} />
              </div>
            )}
          </div>
        </section>

        {/* Timestamp → Date */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="ts-input" className="text-sm font-medium">
              Timestamp → Date
            </Label>
            <Tabs value={unit} onValueChange={(value) => setUnit(value as TimestampUnit)}>
              <TabsList>
                <TabsTrigger value="seconds">Seconds</TabsTrigger>
                <TabsTrigger value="milliseconds">Milliseconds</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Input
            id="ts-input"
            value={timestampInput}
            onChange={(event) => setTimestampInput(event.target.value)}
            placeholder={unit === "seconds" ? "e.g. 1771372800" : "e.g. 1771372800000"}
            inputMode="numeric"
            className="font-mono"
          />
          {timestampInput && !parsedDate && (
            <p role="alert" className="text-sm font-medium text-destructive">
              Enter a valid integer {unit === "seconds" ? "in seconds" : "in milliseconds"}.
            </p>
          )}
          {dateParts && (
            <div className="space-y-2">
              <CopyableRow label="Local" value={dateParts.local} />
              <CopyableRow label="UTC" value={dateParts.utc} />
              <CopyableRow label="ISO 8601" value={dateParts.iso} />
              <CopyableRow label="Relative" value={dateParts.relative} />
            </div>
          )}
        </section>

        {/* Date → Timestamp */}
        <section className="space-y-3">
          <Label htmlFor="date-input" className="text-sm font-medium">
            Date → Timestamp
          </Label>
          <Input
            id="date-input"
            type="datetime-local"
            value={dateInput}
            onChange={(event) => setDateInput(event.target.value)}
            className="font-mono"
          />
          {dateInput && !timestamps && (
            <p role="alert" className="text-sm font-medium text-destructive">
              Enter a valid date and time.
            </p>
          )}
          {timestamps && (
            <div className="space-y-2">
              <CopyableRow label="Seconds" value={String(timestamps.seconds)} />
              <CopyableRow label="Milliseconds" value={String(timestamps.milliseconds)} />
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

function InlineCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => setCopied(false), 2000);
        });
      }}
      className={cn(copied && "bg-green-600 hover:bg-green-700 text-white")}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
