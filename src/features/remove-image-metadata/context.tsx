import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import type { ImageFile, MetadataRemovalSettings } from "./types";
import { DEFAULT_METADATA_SETTINGS } from "./constants";
import { createImageFile } from "./services/remove-image-metadata";
import { useFileHandler } from "@/shared/hooks";
import { useProcessingState } from "@/shared/hooks";
import { isSupportedImageFile } from "@/shared/services/image";

interface RemoveImageMetadataContextValue {
  files: ImageFile[];
  settings: MetadataRemovalSettings;
  isProcessing: boolean;
  error: string | null;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateSettings: (settings: Partial<MetadataRemovalSettings>) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  updateCleanedSize: (id: string, size: number) => void;
}

const RemoveImageMetadataContext = createContext<RemoveImageMetadataContextValue | null>(null);

export function RemoveImageMetadataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MetadataRemovalSettings>(DEFAULT_METADATA_SETTINGS);

  const fileHandler = useFileHandler<ImageFile>({
    createFile: createImageFile,
    validateFile: isSupportedImageFile,
  });

  const processingState = useProcessingState();

  const updateCleanedSize = useCallback(
    (id: string, size: number) => {
      fileHandler.setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === id ? { ...f, cleanedSize: size } : f))
      );
    },
    [fileHandler]
  );

  const updateSettings = useCallback((newSettings: Partial<MetadataRemovalSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const setError = useCallback(
    (error: string | null) => {
      fileHandler.setError(error);
      processingState.setError(error);
    },
    [fileHandler, processingState]
  );

  const value: RemoveImageMetadataContextValue = {
    files: fileHandler.files,
    settings,
    isProcessing: processingState.isProcessing,
    error: fileHandler.error || processingState.error,
    addFiles: fileHandler.addFiles,
    removeFile: fileHandler.removeFile,
    clearFiles: fileHandler.clearFiles,
    updateSettings,
    setIsProcessing: processingState.setIsProcessing,
    setError,
    updateCleanedSize,
  };

  return (
    <RemoveImageMetadataContext.Provider value={value}>
      {children}
    </RemoveImageMetadataContext.Provider>
  );
}

export function useRemoveImageMetadataContext(): RemoveImageMetadataContextValue {
  const context = useContext(RemoveImageMetadataContext);
  if (!context) {
    throw new Error("useRemoveImageMetadataContext must be used within RemoveImageMetadataProvider");
  }
  return context;
}
