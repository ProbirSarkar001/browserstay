import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useFileHandler, useProcessingState } from "@/shared/hooks";
import { DEFAULT_PALETTE_SETTINGS, UNSUPPORTED_IMAGE_MESSAGE } from "./constants";
import { createImageFile, isBrowserDecodableImage } from "./services/image-file";
import type {
  ColorAnchor,
  ImagePixels,
  PaletteColor,
  PaletteImageFile,
  PaletteSettings,
} from "./types";

interface ImageColorPaletteContextValue {
  image: PaletteImageFile | null;
  settings: PaletteSettings;
  palette: PaletteColor[];
  /** Movable pointer per palette color, index-aligned with `palette`. */
  anchors: ColorAnchor[];
  /** Downscaled image once per file, shared by the pointers' drag handling. */
  imagePixels: ImagePixels | null;
  /** Hex of the swatch under the pointer, used to spotlight it on the preview. */
  highlightedColor: string | null;
  isExtracting: boolean;
  error: string | null;
  selectImage: (file: File) => void;
  removeImage: () => void;
  updateSettings: (patch: Partial<PaletteSettings>) => void;
  setHighlightedColor: (hex: string | null) => void;
  setPalette: (update: (palette: PaletteColor[]) => PaletteColor[]) => void;
  setAnchors: (update: (anchors: ColorAnchor[]) => ColorAnchor[]) => void;
  setImagePixels: (pixels: ImagePixels | null) => void;
  setIsExtracting: (isExtracting: boolean) => void;
  setError: (error: string | null) => void;
}

const ImageColorPaletteContext = createContext<ImageColorPaletteContextValue | null>(null);

export function ImageColorPaletteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PaletteSettings>(DEFAULT_PALETTE_SETTINGS);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [anchors, setAnchors] = useState<ColorAnchor[]>([]);
  const [imagePixels, setImagePixels] = useState<ImagePixels | null>(null);
  const [highlightedColor, setHighlightedColor] = useState<string | null>(null);
  const fileHandler = useFileHandler<PaletteImageFile>({ createFile: createImageFile });
  const processingState = useProcessingState();

  const { addFiles, clearFiles, setError: setFileError } = fileHandler;
  const { setError: setProcessingError, setIsProcessing } = processingState;

  // Both sources are useState setters, so this stays referentially stable and the
  // extraction effect does not re-run on every render.
  const setError = useCallback(
    (message: string | null) => {
      setFileError(message);
      setProcessingError(message);
    },
    [setFileError, setProcessingError]
  );

  const selectImage = useCallback(
    (file: File) => {
      if (!isBrowserDecodableImage(file)) {
        setError(UNSUPPORTED_IMAGE_MESSAGE);
        return;
      }
      setAnchors([]);
      setImagePixels(null);
      clearFiles();
      addFiles([file]);
    },
    [addFiles, clearFiles, setError]
  );

  const removeImage = useCallback(() => {
    setPalette([]);
    setAnchors([]);
    setImagePixels(null);
    clearFiles();
    setError(null);
  }, [clearFiles, setError]);

  const updateSettings = useCallback((patch: Partial<PaletteSettings>) => {
    setSettings((previous) => ({ ...previous, ...patch }));
  }, []);

  const value: ImageColorPaletteContextValue = {
    image: fileHandler.files[0] ?? null,
    settings,
    palette,
    anchors,
    imagePixels,
    highlightedColor,
    isExtracting: processingState.isProcessing,
    error: fileHandler.error || processingState.error,
    selectImage,
    removeImage,
    updateSettings,
    setHighlightedColor,
    setPalette,
    setAnchors,
    setImagePixels,
    setIsExtracting: setIsProcessing,
    setError,
  };

  return (
    <ImageColorPaletteContext.Provider value={value}>{children}</ImageColorPaletteContext.Provider>
  );
}

export function useImageColorPaletteContext(): ImageColorPaletteContextValue {
  const context = useContext(ImageColorPaletteContext);
  if (!context) {
    throw new Error("useImageColorPaletteContext must be used within ImageColorPaletteProvider");
  }
  return context;
}
