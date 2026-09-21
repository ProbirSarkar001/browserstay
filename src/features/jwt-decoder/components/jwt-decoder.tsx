import { useMemo, useState } from "react";
import { Check, CircleAlert, Copy, Eraser, KeyRound, ShieldAlert } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useClipboard } from "@/shared/hooks/use-clipboard";
import { cn } from "@/shared/utils";
import { decodeJwt } from "../services/jwt-decoder";
import { REGISTERED_CLAIMS, SAMPLE_JWT } from "../constants";

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function formatUnixTime(seconds: number): string {
  return new Date(seconds * 1000).toLocaleString();
}

export function JwtDecoder() {
  const clipboard = useClipboard({ timeout: 2000 });
  const [token, setToken] = useState("");

  const decoded = useMemo(() => decodeJwt(token), [token]);
  const payload = decoded.ok ? asRecord(decoded.payload) : undefined;

  const claims = useMemo(() => {
    if (!payload) {
      return [];
    }
    return REGISTERED_CLAIMS.filter((claim) => payload[claim.key] !== undefined).map((claim) => ({
      ...claim,
      value: payload[claim.key]
    }));
  }, [payload]);

  const expired =
    typeof payload?.exp === "number" ? payload.exp * 1000 < Date.now() : undefined;

  const headerJson = decoded.ok ? JSON.stringify(decoded.header, null, 2) : "";
  const payloadJson = decoded.ok ? JSON.stringify(decoded.payload, null, 2) : "";

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>JWT Decoder</CardTitle>
            <CardDescription>Inspect a token's header, payload, and claims — locally.</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setToken(SAMPLE_JWT)}>
              <KeyRound className="h-4 w-4" />
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setToken("")} disabled={!token}>
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {token && !decoded.ok && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Invalid token</p>
              <p className="mt-0.5 text-muted-foreground">{decoded.message}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="jwt-input" className="text-sm font-medium">
            JSON Web Token
          </Label>
          <Textarea
            id="jwt-input"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
            spellCheck={false}
            className={cn(
              "min-h-28 font-mono text-sm resize-y break-all",
              token && !decoded.ok && "border-destructive/50"
            )}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jwt-header" className="text-sm font-medium">
                Header
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clipboard.copy(headerJson)}
                disabled={!headerJson}
                className={cn(clipboard.copied && "text-green-600")}
              >
                {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {clipboard.copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Textarea
              id="jwt-header"
              readOnly
              value={headerJson}
              placeholder="Header appears here"
              spellCheck={false}
              className="min-h-40 font-mono text-sm resize-y bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jwt-payload" className="text-sm font-medium">
                Payload
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clipboard.copy(payloadJson)}
                disabled={!payloadJson}
                className={cn(clipboard.copied && "text-green-600")}
              >
                {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {clipboard.copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Textarea
              id="jwt-payload"
              readOnly
              value={payloadJson}
              placeholder="Payload appears here"
              spellCheck={false}
              className="min-h-40 font-mono text-sm resize-y bg-muted/30"
            />
          </div>
        </div>

        {claims.length > 0 && (
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Registered claims</p>
              {expired !== undefined && (
                <Badge variant={expired ? "destructive" : "secondary"}>
                  {expired ? "Expired" : "Not expired"}
                </Badge>
              )}
            </div>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {claims.map((claim) => (
                <div key={claim.key} className="flex items-baseline justify-between gap-4 sm:block">
                  <dt className="text-muted-foreground">
                    {claim.label} <span className="font-mono text-xs">({claim.key})</span>
                  </dt>
                  <dd className="font-mono break-all">
                    {claim.time && typeof claim.value === "number"
                      ? formatUnixTime(claim.value)
                      : JSON.stringify(claim.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {decoded.ok && decoded.signature && (
          <div className="rounded-lg border border-border/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              Signature
            </div>
            <p className="font-mono text-xs break-all text-muted-foreground">{decoded.signature}</p>
            <p className="text-xs text-muted-foreground">
              The signature is shown as-is and is not verified. Verifying it requires the signing
              secret or public key, which stays out of this tool.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
