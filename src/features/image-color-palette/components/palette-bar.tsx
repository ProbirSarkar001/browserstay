import { cn } from "@/shared/utils";
import { formatColor } from "../services/image-color-palette.client";
import type { ColorFormat, PaletteColor } from "../types";

interface PaletteBarProps {
  palette: PaletteColor[];
  format: ColorFormat;
  highlightedIndex: number | null;
  onHighlight: (index: number | null) => void;
  onCopy: (value: string) => void;
}

/** @human The palette as one continuous strip, with a segment per color. */
export function PaletteBar({
  palette,
  format,
  highlightedIndex,
  onHighlight,
  onCopy,
}: PaletteBarProps) {
  return (
    <div className="flex h-14 min-w-0 flex-1 overflow-hidden rounded-lg border border-border">
      {palette.map((color, index) => {
        const value = formatColor(color, format);
        const isDimmed = highlightedIndex !== null && highlightedIndex !== index;

        return (
          <button
            key={index}
            type="button"
            aria-label={`Copy ${value}`}
            title={`${value} — ${color.percentage.toFixed(1)}% of image`}
            onClick={() => onCopy(value)}
            onMouseEnter={() => onHighlight(index)}
            onMouseLeave={() => onHighlight(null)}
            onFocus={() => onHighlight(index)}
            onBlur={() => onHighlight(null)}
            style={{ backgroundColor: color.hex }}
            className={cn("h-full flex-1 transition-opacity", isDimmed && "opacity-30")}
          />
        );
      })}
    </div>
  );
}
