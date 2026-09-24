# add-tool Templates

Ready-to-adapt code for each step in [SKILL.md](SKILL.md). Replace
`YourFeature`/`your-feature` with the real feature name.

## Types — `types/index.ts`

```typescript
export interface YourFeatureFile {
  id: string;
  file: File;
  // feature-specific properties
}

export interface YourFeatureSettings {
  // settings properties
}

export interface YourFeatureResult {
  // result structure
}
```

## Constants — `constants/index.ts`

```typescript
import type { YourFeatureSettings } from "../types";

export const DEFAULT_YOUR_FEATURE_SETTINGS: YourFeatureSettings = {
  // default values
};

export const YOUR_FEATURE_LIMITS = {
  MAX_FILES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};
```

## Context Provider — `context.tsx`

```typescript
import { createContext, useContext, ReactNode, useState } from "react";
import type { YourFeatureFile, YourFeatureSettings } from "./types";
import { DEFAULT_YOUR_FEATURE_SETTINGS } from "./constants";
import { useFileHandler, useProcessingState } from "@/shared/hooks";

interface YourFeatureContextValue {
  files: YourFeatureFile[];
  settings: YourFeatureSettings;
  isProcessing: boolean;
  error: string | null;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateSettings: (settings: Partial<YourFeatureSettings>) => void;
  setError: (error: string | null) => void;
}

const YourFeatureContext = createContext<YourFeatureContextValue | null>(null);

export function YourFeatureProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<YourFeatureSettings>(
    DEFAULT_YOUR_FEATURE_SETTINGS
  );

  const fileHandler = useFileHandler<YourFeatureFile>({
    validateFile: (file) => true, // add validation
    createFile: (file) => ({ id: generateId(), file }),
  });

  const processingState = useProcessingState();

  const value: YourFeatureContextValue = {
    files: fileHandler.files,
    settings,
    isProcessing: processingState.isProcessing,
    error: fileHandler.error || processingState.error,
    addFiles: fileHandler.addFiles,
    removeFile: fileHandler.removeFile,
    clearFiles: fileHandler.clearFiles,
    updateSettings: (newSettings) =>
      setSettings((prev) => ({ ...prev, ...newSettings })),
    setError: (error) => {
      fileHandler.setError(error);
      processingState.setError(error);
    },
  };

  return (
    <YourFeatureContext.Provider value={value}>
      {children}
    </YourFeatureContext.Provider>
  );
}

export function useYourFeatureContext(): YourFeatureContextValue {
  const context = useContext(YourFeatureContext);
  if (!context) {
    throw new Error("useYourFeatureContext must be used within YourFeatureProvider");
  }
  return context;
}
```

## Components — `components/`

```tsx
// drop-zone.tsx
import { DropZoneBase } from "@/shared/components/common";

<DropZoneBase
  onDrop={(files) => addFiles(files)}
  accept={{ "application/pdf": [".pdf"] }}
  multiple={true}
  maxFiles={10}
/>

// file-list.tsx
import { FileListBase } from "@/shared/components/common";

<FileListBase
  files={files}
  onRemove={(id) => removeFile(id)}
  renderItem={(file) => (
    <YourFileItem file={file} onRemove={() => removeFile(file.id)} />
  )}
/>
```

Processing pattern:

```typescript
async function processFiles() {
  startProcessing();
  setError(null);

  try {
    const results = await Promise.all(
      files.map(async (file) => await processFile(file))
    );

    setSuccessWithStop();
    return results;
  } catch (error) {
    setErrorWithStop(error instanceof Error ? error.message : "Processing failed");
    return null;
  }
}
```

Download pattern (ZIP when multiple):

```typescript
import { downloadBlob } from "@/shared/services/download/download";
import { createZip } from "@/shared/services/zip/zip";

if (results.length === 1) {
  downloadBlob(results[0].blob, results[0].filename);
} else {
  const zip = await createZip(
    Object.fromEntries(results.map((r) => [r.filename, r.blob]))
  );
  downloadBlob(zip, "results.zip");
}
```

## Tools Config — `src/config/tools.ts`

```typescript
{
  title: "Your Feature",
  href: "/your-feature",
  description: "Brief description",
  icon: YourIcon,
  color: "bg-color-500/10 text-color-600",
  tags: ["tag1", "tag2"]
}
```

## SEO — `src/lib/seo.ts` (`metaConfigs`)

```typescript
yourFeature: {
  title: "Your Feature - Free Online | BrowserStay",
  description: "Description",
  canonicalUrl: `${BASE_URL}/your-feature`,
  keywords: "keyword1, keyword2, keyword3"
}
```

## Route — `src/routes/your-feature.tsx`

```typescript
export const Route = createFileRoute("/your-feature")({
  component: YourFeaturePage,
  head: () => generateToolHead("yourFeature"),
});
```

## Shared APIs

```typescript
// PDF (browser-only runtime)
import { PdfService, encryptPdf, unlockPdf, isPdfEncrypted } from "@/shared/services/pdf/pdf.client";
import type { FileWithInfo } from "@/shared/services/pdf/types";

const info = await PdfService.getFileInfo(file);
const images = await PdfService.pdfToImages(file, { scale: 2 });
const encrypted = await encryptPdf(file, password);

// File helpers
import { getBaseName, getFileExtension } from "@/shared/services/file/file";

// Class merging
import { cn } from "@/shared/utils";
```

`useFileHandler` returns: `files, error, addFiles, removeFile, clearFiles, setFiles, setError`.

`useProcessingState` returns: `isProcessing, error, success, startProcessing, stopProcessing, setError, setSuccess, setErrorWithStop, setSuccessWithStop, reset`.
