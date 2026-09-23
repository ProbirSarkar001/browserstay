import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { usePdfToMarkdownContext } from "../context";
import { convertPdfToMarkdown } from "@/shared/services/pdf-inspector/pdf-inspector.client";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PdfToMarkdownPasswordDialog } from "./password-dialog";

export function PdfToMarkdownActionCard() {
  const {
    fileData,
    settings,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    setResult,
  } = usePdfToMarkdownContext();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleConvert = async (password?: string) => {
    if (!fileData) {
      setError("Please select a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await convertPdfToMarkdown(fileData.file, {
        profile: settings.profile,
        includePageMarkers: settings.includePageMarkers,
        ...(password ? { password } : {}),
      });

      setResult({
        analysis,
        markdown: analysis.markdown ?? "",
      });
      setIsPasswordDialogOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to convert PDF to Markdown.";
      if (message.includes("encrypted")) {
        setIsPasswordDialogOpen(true);
        if (password) setError("Wrong password. Please try again.");
      } else {
        setError(message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Convert to Markdown</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <p className="text-sm text-muted-foreground">
            {fileData
              ? `Extract structured Markdown from "${fileData.fileName}.pdf" with headings, lists, and tables.`
              : "Select a PDF to convert its text content to Markdown."}
          </p>
          {error && !isPasswordDialogOpen && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={() => handleConvert()}
            disabled={!fileData || isProcessing}
          >
            {isProcessing ? "Converting..." : "Convert to Markdown"}
          </Button>
        </CardFooter>
      </Card>

      <PdfToMarkdownPasswordDialog
        open={isPasswordDialogOpen}
        fileName={fileData?.fileName ?? ""}
        error={error}
        isProcessing={isProcessing}
        onOpenChange={(open) => {
          setIsPasswordDialogOpen(open);
          if (!open) setError(null);
        }}
        onClearError={() => setError(null)}
        onSubmit={handleConvert}
      />
    </>
  );
}
