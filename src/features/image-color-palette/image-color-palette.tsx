import { CircleAlert } from "lucide-react";
import { useImageColorPaletteContext } from "./context";
import { ImageColorPaletteDropZone } from "./components/drop-zone";
import { ImagePreviewPanel } from "./components/image-preview-panel";
import { PaletteExtractor } from "./components/palette-extractor";
import { PalettePanel } from "./components/palette-panel";
import { PaletteSettings } from "./components/settings";
import { PaletteExportCard } from "./components/export-card";

/**
 * @human Image on the left, palette and its controls on the right. The image
 * column sticks to the viewport on wide screens so the preview stays visible
 * while the palette is scrolled.
 */
export function ImageColorPalette() {
  const { image, error } = useImageColorPaletteContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-6">
          <ImageColorPaletteDropZone />

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
            >
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="font-medium text-destructive">{error}</p>
            </div>
          )}

          {/* Keyed on the file so the eyedropper marker resets on every new image. */}
          {image && <ImagePreviewPanel key={image.id} />}
        </div>

        <div className="space-y-6">
          <PaletteSettings />
          <PalettePanel />
          <PaletteExportCard />
        </div>
      </div>

      <PaletteExtractor />
    </>
  );
}
