import { useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import { cn } from "@/shared/utils";
import { useImageColorPaletteContext } from "../context";
import { computeColorShares, samplePixel } from "../services/palette-layout";
import type { ColorAnchor } from "../types";

const MIN_MARKER_SIZE = 18;
const MARKER_SIZE_RANGE = 22;
/** Fraction of the image an arrow key moves a pointer. */
const NUDGE_STEP = 0.02;

const NUDGE_DIRECTIONS: Record<string, [number, number]> = {
  ArrowLeft: [-NUDGE_STEP, 0],
  ArrowRight: [NUDGE_STEP, 0],
  ArrowUp: [0, -NUDGE_STEP],
  ArrowDown: [0, NUDGE_STEP],
};

interface ColorAnchorsProps {
  /** The element the image fills, used to turn pointer coordinates into image-relative ones. */
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * @human One draggable pointer per palette color. Dragging a pointer takes the color
 * under it, so the palette can be steered to the parts of the image you care about.
 * Arrows nudge a focused pointer for keyboard use.
 */
export function ColorAnchors({ containerRef }: ColorAnchorsProps) {
  const {
    palette,
    anchors,
    imagePixels,
    highlightedColor,
    setPalette,
    setAnchors,
    setHighlightedColor,
  } = useImageColorPaletteContext();
  const [dragging, setDragging] = useState<number | null>(null);

  const largestShare = Math.max(...palette.map((color) => color.percentage), 1);

  const movePointer = (index: number, x: number, y: number) => {
    if (!imagePixels) return;
    const swatch = samplePixel(imagePixels, x, y);

    setAnchors((current) =>
      current.map((anchor) => (anchor.index === index ? { ...anchor, x, y } : anchor))
    );
    setPalette((current) =>
      current.map((color, position) =>
        position === index ? { ...color, hex: swatch.hex, rgb: swatch.rgb } : color
      )
    );
  };

  // Moving a pointer changes which pixels each color owns, so the shares are
  // recomputed once the pointer settles rather than on every move event.
  const refreshShares = () => {
    if (!imagePixels) return;
    setPalette((current) => {
      const shares = computeColorShares(imagePixels, current);
      return current.map((color, index) => ({ ...color, percentage: shares[index] ?? 0 }));
    });
  };

  const positionFromEvent = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    return {
      x: clamp01((event.clientX - bounds.left) / bounds.width),
      y: clamp01((event.clientY - bounds.top) / bounds.height),
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (!imagePixels) return;
    // Focuses explicitly because preventDefault would otherwise suppress it, and
    // prevents the drag from selecting text in the page behind the image.
    event.currentTarget.focus({ preventScroll: true });
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(index);
    setHighlightedColor(palette[index]?.hex ?? null);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (dragging !== index) return;
    const position = positionFromEvent(event);
    if (position) movePointer(index, position.x, position.y);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (dragging !== index) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(null);
    setHighlightedColor(null);
    refreshShares();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, anchor: ColorAnchor) => {
    const direction = NUDGE_DIRECTIONS[event.key];
    if (!direction) return;

    event.preventDefault();
    movePointer(anchor.index, clamp01(anchor.x + direction[0]), clamp01(anchor.y + direction[1]));
    refreshShares();
  };

  return (
    <>
      {anchors.map((anchor) => {
        const color = palette[anchor.index];
        if (!color) return null;

        const size = MIN_MARKER_SIZE + (color.percentage / largestShare) * MARKER_SIZE_RANGE;
        const isDragging = dragging === anchor.index;
        const isDimmed = highlightedColor !== null && highlightedColor !== color.hex;

        return (
          <button
            key={anchor.index}
            type="button"
            aria-label={`Move pointer ${anchor.index + 1} — ${color.hex}`}
            onPointerDown={(event) => handlePointerDown(event, anchor.index)}
            onPointerMove={(event) => handlePointerMove(event, anchor.index)}
            onPointerUp={(event) => handlePointerUp(event, anchor.index)}
            onPointerCancel={(event) => handlePointerUp(event, anchor.index)}
            onKeyDown={(event) => handleKeyDown(event, anchor)}
            onMouseEnter={() => setHighlightedColor(color.hex)}
            onMouseLeave={() => dragging === null && setHighlightedColor(null)}
            style={{
              left: `${anchor.x * 100}%`,
              top: `${anchor.y * 100}%`,
              width: size,
              height: size,
              backgroundColor: color.hex,
            }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-white shadow-lg transition-opacity focus-visible:outline-2 focus-visible:outline-ring",
              isDragging ? "cursor-grabbing" : "cursor-grab",
              isDimmed ? "opacity-25" : "opacity-100"
            )}
          />
        );
      })}
    </>
  );
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
