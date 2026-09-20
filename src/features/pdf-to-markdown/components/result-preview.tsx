import { useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Markdown } from "@/shared/components/common/markdown";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useClipboard, useDownload } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { usePdfToMarkdownContext } from "../context";
import { PDF_TYPE_LABELS } from "../constants";

type ViewMode = "preview" | "raw";

const outputClassName =
  "max-h-[32rem] overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-sm";

function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function PdfToMarkdownResultPreview() {
  const { result, fileData } = usePdfToMarkdownContext();
  const clipboard = useClipboard({ timeout: 2000 });
  const { downloadFile } = useDownload();
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  useEffect(() => {
    setViewMode("preview");
  }, [result]);

  if (!result || !fileData) return null;

  const { analysis, markdown } = result;
  const needsOcr =
    analysis.pdfType === "Scanned" ||
    analysis.pdfType === "ImageBased" ||
    analysis.pagesNeedingOcr.length > 0;

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    downloadFile(blob, { filename: `${fileData.fileName}.md` });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Markdown Output</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{PDF_TYPE_LABELS[analysis.pdfType]}</Badge>
          <Badge variant="outline">{analysis.pageCount} pages</Badge>
          <Badge variant="outline">{formatConfidence(analysis.confidence)} confidence</Badge>
          {analysis.processingTimeMs > 0 && (
            <Badge variant="outline">{analysis.processingTimeMs}ms</Badge>
          )}
        </div>
      </div>

      {needsOcr && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">
                This PDF may not convert well without OCR
              </p>
              <p className="text-muted-foreground">
                {analysis.pagesNeedingOcr.length > 0
                  ? `${analysis.pagesNeedingOcr.length} page(s) appear to need OCR. `
                  : "This document looks scanned or image-based. "}
                Text extraction works best on native text PDFs. For scanned documents, try{" "}
                <Link to="/pdf-to-image" className="text-primary underline-offset-4 hover:underline">
                  PDF to Image
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis.hasEncodingIssues && (
        <p className="text-sm text-amber-600">
          Some fonts may have encoding issues — extracted text could be incomplete.
        </p>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
          <CardTitle className="text-base">
            {analysis.title ? analysis.title : `${fileData.fileName}.md`}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-border p-0.5">
              <Button
                type="button"
                variant={viewMode === "preview" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode("preview")}
                disabled={!markdown}
              >
                Preview
              </Button>
              <Button
                type="button"
                variant={viewMode === "raw" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode("raw")}
                disabled={!markdown}
              >
                Raw
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clipboard.copy(markdown)}
              disabled={!markdown}
            >
              {clipboard.copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!markdown}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {markdown ? (
            viewMode === "preview" ? (
              <Markdown source={markdown} className={outputClassName} />
            ) : (
              <pre
                className={cn(
                  outputClassName,
                  "leading-relaxed whitespace-pre-wrap break-words font-mono text-foreground",
                )}
              >
                {markdown}
              </pre>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              No text could be extracted from this PDF. It may be scanned or image-only.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
