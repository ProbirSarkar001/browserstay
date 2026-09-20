import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import type { PdfToMarkdownFile, PdfToMarkdownResult, PdfToMarkdownSettings } from "./types";
import { DEFAULT_PDF_TO_MARKDOWN_SETTINGS } from "./constants";
import { useProcessingState } from "@/shared/hooks";

interface PdfToMarkdownContextValue {
  fileData: PdfToMarkdownFile | null;
  settings: PdfToMarkdownSettings;
  result: PdfToMarkdownResult | null;
  isProcessing: boolean;
  error: string | null;
  setFile: (file: PdfToMarkdownFile | null) => void;
  updateSettings: (settings: Partial<PdfToMarkdownSettings>) => void;
  setResult: (result: PdfToMarkdownResult | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const PdfToMarkdownContext = createContext<PdfToMarkdownContextValue | null>(null);

export function PdfToMarkdownProvider({ children }: { children: ReactNode }) {
  const [fileData, setFileData] = useState<PdfToMarkdownFile | null>(null);
  const [settings, setSettings] = useState<PdfToMarkdownSettings>(DEFAULT_PDF_TO_MARKDOWN_SETTINGS);
  const [result, setResult] = useState<PdfToMarkdownResult | null>(null);
  const processingState = useProcessingState();

  const setFile = useCallback(
    (file: PdfToMarkdownFile | null) => {
      setFileData(file);
      setResult(null);
      processingState.setError(null);
    },
    [processingState]
  );

  const updateSettings = useCallback((newSettings: Partial<PdfToMarkdownSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const reset = useCallback(() => {
    setFileData(null);
    setResult(null);
    setSettings(DEFAULT_PDF_TO_MARKDOWN_SETTINGS);
    processingState.setError(null);
    processingState.setIsProcessing(false);
  }, [processingState]);

  const setError = useCallback(
    (error: string | null) => {
      processingState.setError(error);
    },
    [processingState]
  );

  const value: PdfToMarkdownContextValue = {
    fileData,
    settings,
    result,
    isProcessing: processingState.isProcessing,
    error: processingState.error,
    setFile,
    updateSettings,
    setResult,
    setIsProcessing: processingState.setIsProcessing,
    setError,
    reset,
  };

  return (
    <PdfToMarkdownContext.Provider value={value}>{children}</PdfToMarkdownContext.Provider>
  );
}

export function usePdfToMarkdownContext(): PdfToMarkdownContextValue {
  const context = useContext(PdfToMarkdownContext);
  if (!context) {
    throw new Error("usePdfToMarkdownContext must be used within PdfToMarkdownProvider");
  }
  return context;
}
