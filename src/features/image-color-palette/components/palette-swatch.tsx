import { Check, Copy } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { useClipboard } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { formatColor } from "../services/image-color-palette.client";
import type { ColorFormat, PaletteSwatch } from "../types";

interface PaletteSwatchRowProps {
  swatch: PaletteSwatch;
  format: ColorFormat;
  /** Omitted for hand-picked colors, which have no share of the image. */
  percentage?: number;
  highlighted?: boolean;
  onHighlight?: (hex: string | null) => void;
}

export function PaletteSwatchRow({
  swatch,
  format,
  percentage,
  highlighted,
  onHighlight,
}: PaletteSwatchRowProps) {
  const clipboard = useClipboard({ timeout: 2000 });
  const value = formatColor(swatch, format);

  const highlightProps = onHighlight
    ? {
        onMouseEnter: () => onHighlight(swatch.hex),
        onMouseLeave: () => onHighlight(null),
      }
    : {};

  return (
    <div
      {...highlightProps}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border p-2 transition-colors",
        highlighted && "border-primary/60 bg-primary/5"
      )}
    >
      <span
        className="size-9 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: swatch.hex }}
      />

      <div className="min-w-0 flex-1 space-y-1">
        <button
          type="button"
          title={`Copy ${value}`}
          onClick={() => clipboard.copy(value)}
          className="flex w-full items-center justify-between gap-2 rounded-sm text-left transition-colors hover:text-primary"
        >
          <code className="truncate font-mono text-xs">{value}</code>
          {clipboard.copied ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
        </button>

        {percentage !== undefined && (
          <div className="flex items-center gap-2">
            <Progress value={percentage} className="flex-1" />
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {percentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
