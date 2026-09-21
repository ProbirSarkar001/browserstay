import { useMemo, useState } from "react";
import { Check, CircleAlert, Copy, Eraser, Regex } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { cn } from "@/shared/utils";
import { MAX_MATCHES, applyReplacement, testRegex } from "../services/regex-tester";
import type { RegexFlag } from "../types";
import { FLAG_OPTIONS, SAMPLE_PATTERN, SAMPLE_TEXT } from "../constants";

const MAX_VISIBLE_MATCHES = 200;

export function RegexTester() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [replacement, setReplacement] = useState("");

  const debouncedPattern = useDebouncedValue(pattern);
  const debouncedText = useDebouncedValue(text);

  const result = useMemo(
    () => testRegex(debouncedPattern, flags, debouncedText),
    [debouncedPattern, flags, debouncedText]
  );
  const matches = result.ok ? result.matches : [];
  const truncated = result.ok && result.truncated;

  const replaced = useMemo(
    () => applyReplacement(debouncedPattern, flags, replacement, debouncedText),
    [debouncedPattern, flags, replacement, debouncedText]
  );

  const segments = useMemo(() => {
    const parts: { value: string; match: boolean }[] = [];
    let cursor = 0;
    for (const match of matches) {
      if (match.end <= match.index || match.index < cursor) {
        continue;
      }
      if (match.index > cursor) {
        parts.push({ value: debouncedText.slice(cursor, match.index), match: false });
      }
      parts.push({ value: debouncedText.slice(match.index, match.end), match: true });
      cursor = match.end;
    }
    if (cursor < debouncedText.length) {
      parts.push({ value: debouncedText.slice(cursor), match: false });
    }
    return parts;
  }, [matches, debouncedText]);

  const toggleFlag = (flag: RegexFlag) => {
    setFlags((current) =>
      current.includes(flag)
        ? current.replace(flag, "")
        : FLAG_OPTIONS.map((option) => option.value)
            .filter((value) => value === flag || current.includes(value))
            .join("")
    );
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Regex Tester</CardTitle>
            <CardDescription>Test and debug regular expressions live, with match positions and groups.</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPattern(SAMPLE_PATTERN);
                setFlags("g");
                setText(SAMPLE_TEXT);
              }}
            >
              <Regex className="h-4 w-4" />
              Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPattern("");
                setText("");
                setReplacement("");
              }}
              disabled={!pattern && !text}
            >
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="regex-pattern" className="text-sm font-medium">
            Pattern
          </Label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">/</span>
            <Input
              id="regex-pattern"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              placeholder="\\w+@\\w+\\.\\w+"
              spellCheck={false}
              className={cn("min-w-64 flex-1 font-mono text-sm", pattern && !result.ok && "border-destructive/50")}
            />
            <span className="font-mono text-sm text-muted-foreground">/{flags}</span>
            <div className="flex items-center gap-1">
              {FLAG_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={flags.includes(option.value) ? "default" : "secondary"}
                  title={option.description}
                  aria-pressed={flags.includes(option.value)}
                  onClick={() => toggleFlag(option.value)}
                  className="w-9 px-0 font-mono"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {pattern && !result.ok && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Invalid regular expression</p>
              <p className="mt-0.5 text-muted-foreground">{result.message}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="regex-text" className="text-sm font-medium">
              Test string
            </Label>
            <Badge variant={matches.length > 0 ? "secondary" : "outline"}>
              {matches.length.toLocaleString()}
              {truncated ? "+" : ""} {matches.length === 1 ? "match" : "matches"}
            </Badge>
          </div>
          <Textarea
            id="regex-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste the text to search"
            spellCheck={false}
            className="min-h-40 font-mono text-sm resize-y"
          />
        </div>

        {text && matches.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Highlighted matches</Label>
            <div className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-border/50 bg-muted/20 p-3 font-mono text-sm">
              {segments.map((segment, index) =>
                segment.match ? (
                  <mark key={index} className="rounded bg-yellow-500/30 text-inherit">
                    {segment.value}
                  </mark>
                ) : (
                  <span key={index}>{segment.value}</span>
                )
              )}
            </div>
          </div>
        )}

        {matches.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Match details</Label>
            <div className="max-h-64 overflow-auto rounded-lg border border-border/50 text-sm">
              {matches.slice(0, MAX_VISIBLE_MATCHES).map((match, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border/40 px-3 py-2 last:border-b-0"
                >
                  <span className="w-8 shrink-0 text-xs text-muted-foreground">#{index + 1}</span>
                  <span className="text-xs text-muted-foreground">@{match.index}</span>
                  <span className="font-mono break-all">{match.value || "(empty)"}</span>
                  {match.groups.length > 0 && (
                    <span className="flex flex-wrap gap-1">
                      {match.groups.map((group, groupIndex) => (
                        <Badge key={groupIndex} variant="outline" className="font-mono text-[10px]">
                          ${groupIndex + 1}={group ?? "—"}
                        </Badge>
                      ))}
                    </span>
                  )}
                  {match.namedGroups &&
                    Object.entries(match.namedGroups).map(([name, value]) => (
                      <Badge key={name} variant="outline" className="font-mono text-[10px]">
                        {name}={value ?? "—"}
                      </Badge>
                    ))}
                </div>
              ))}
              {matches.length > MAX_VISIBLE_MATCHES && (
                <div className="space-y-1 px-3 py-2 text-xs text-muted-foreground">
                  <p>
                    Showing the first {MAX_VISIBLE_MATCHES} of {matches.length.toLocaleString()}
                    {truncated ? "+" : ""} matches.
                  </p>
                  {truncated && (
                    <p>
                      Matching stopped at the {MAX_MATCHES.toLocaleString()}-match limit — narrow the
                      pattern to see the rest.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="regex-replacement" className="text-sm font-medium">
              Replace with
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clipboard.copy(replaced.ok ? replaced.output : "")}
              disabled={!replaced.ok || !debouncedText}
              className={cn(clipboard.copied && "text-green-600")}
            >
              {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {clipboard.copied ? "Copied!" : "Copy result"}
            </Button>
          </div>
          <Input
            id="regex-replacement"
            value={replacement}
            onChange={(event) => setReplacement(event.target.value)}
            placeholder="Use $1, $2, or $& for capture references"
            spellCheck={false}
            className="font-mono text-sm"
          />
          <Textarea
            readOnly
            value={replaced.ok ? replaced.output : ""}
            placeholder="Replaced output appears here"
            spellCheck={false}
            className="min-h-28 font-mono text-sm resize-y bg-muted/30"
          />
        </div>
      </CardContent>
    </Card>
  );
}
