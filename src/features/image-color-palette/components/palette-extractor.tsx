import { useEffect } from "react";
import { useDebouncedValue } from "@/shared/hooks";
import { EXTRACT_FAILED_MESSAGE } from "../constants";
import { useImageColorPaletteContext } from "../context";
import { extractPalette, readImagePixels } from "../services/image-color-palette.client";
import { computeColorShares, findColorAnchors } from "../services/palette-layout";

/**
 * @human Runs extraction whenever the image or the extraction settings change, which
 * is also what makes extraction automatic on upload. Renders nothing.
 *
 * @ai-agent This exists as a component, not inside the context, because the
 * extraction service is client-only and `context.tsx` is part of the server graph
 * (the route imports the provider). Keep the `extract-colors` import out of context.
 */
export function PaletteExtractor() {
  const {
    image,
    settings,
    setPalette,
    setAnchors,
    setImagePixels,
    setIsExtracting,
    setError,
  } = useImageColorPaletteContext();
  // Debounced so dragging the color count up and down does not queue a run per tick.
  const colorCount = useDebouncedValue(settings.colorCount);

  useEffect(() => {
    if (!image) {
      setPalette(() => []);
      setAnchors(() => []);
      setImagePixels(null);
      setIsExtracting(false);
      return;
    }

    // Cleanup cancels this run on every re-run and on unmount. That covers the image
    // being removed mid-flight: without it, work that resolves afterwards would
    // restore the palette, anchors and pixels of an image that is no longer shown.
    let cancelled = false;
    const isCurrent = () => !cancelled;

    setIsExtracting(true);
    setError(null);

    const extract = async () => {
      const pixels = await readImagePixels(image.preview);
      if (!pixels) throw new Error("Could not read the image pixels");

      const colors = await extractPalette(image.preview, {
        colorCount,
        skipWhite: settings.skipWhite,
      });
      const shares = computeColorShares(pixels, colors);

      if (!isCurrent()) return;
      setImagePixels(pixels);
      setPalette(() =>
        colors.map((color, index) => ({ ...color, percentage: shares[index] ?? 0 }))
      );
      setAnchors(() => findColorAnchors(pixels, colors));
    };

    extract()
      .catch((error: unknown) => {
        if (!isCurrent()) return;
        console.error(error);
        setPalette(() => []);
        setAnchors(() => []);
        setError(EXTRACT_FAILED_MESSAGE);
      })
      .finally(() => {
        if (isCurrent()) setIsExtracting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    image,
    colorCount,
    settings.skipWhite,
    setPalette,
    setAnchors,
    setImagePixels,
    setIsExtracting,
    setError,
  ]);

  return null;
}
