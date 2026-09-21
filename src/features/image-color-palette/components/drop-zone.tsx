import { useCallback, type ChangeEvent, type DragEvent } from "react";
import { RefreshCw, Upload } from "lucide-react";
import { useImageColorPaletteContext } from "../context";

/**
 * @human Upload target for the one image this tool works on. It collapses to a
 * slim strip once an image is loaded, where it doubles as the replace action.
 */
export function ImageColorPaletteDropZone() {
  const { image, selectImage } = useImageColorPaletteContext();

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) selectImage(file);
    },
    [selectImage]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) selectImage(file);
      // Cleared so picking the same file again still fires a change event.
      event.target.value = "";
    },
    [selectImage]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="cursor-pointer rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary/50"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="image-color-palette-input"
      />
      <label htmlFor="image-color-palette-input" className="block cursor-pointer">
        {image ? (
          <span className="flex items-center justify-center gap-2 p-3 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            Drop or click to replace the image
          </span>
        ) : (
          <span className="flex flex-col items-center gap-4 p-12 text-center">
            <span className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </span>
            <span>
              <span className="mb-2 block text-lg font-medium text-foreground">
                Drop your image here
              </span>
              <span className="block text-sm text-muted-foreground">
                or click to browse • JPG, PNG, WebP, GIF, AVIF, SVG
              </span>
            </span>
          </span>
        )}
      </label>
    </div>
  );
}
