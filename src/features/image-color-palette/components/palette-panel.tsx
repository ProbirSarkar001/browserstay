import { Check, Copy, Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useClipboard } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { COLOR_COUNT_RANGE, COLOR_FORMATS } from "../constants";
import { useImageColorPaletteContext } from "../context";
import { formatColor } from "../services/image-color-palette.client";
import { PaletteBar } from "./palette-bar";
import { PaletteSwatchRow } from "./palette-swatch";

export function PalettePanel() {
  const {
    image,
    palette,
    settings,
    updateSettings,
    isExtracting,
    highlightedIndex,
    setHighlightedIndex,
  } = useImageColorPaletteContext();
  const clipboard = useClipboard({ timeout: 2000 });

  const copyAll = palette.map((color) => formatColor(color, settings.format)).join("\n");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Palette</CardTitle>
        <CardAction>
          <Tabs
            value={settings.format}
            onValueChange={(value) => {
              const selected = COLOR_FORMATS.find((format) => format.value === value);
              if (selected) updateSettings({ format: selected.value });
            }}
          >
            <TabsList>
              {COLOR_FORMATS.map((format) => (
                <TabsTrigger key={format.value} value={format.value}>
                  {format.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {palette.length > 0 ? (
          <>
            <div className="flex gap-2">
              <PaletteBar
                palette={palette}
                format={settings.format}
                highlightedIndex={highlightedIndex}
                onHighlight={setHighlightedIndex}
                onCopy={clipboard.copy}
              />
              <ColorCountStepper />
            </div>

            <div className="space-y-2">
              {palette.map((color, index) => (
                <PaletteSwatchRow
                  key={index}
                  swatch={color}
                  index={index}
                  format={settings.format}
                  percentage={color.percentage}
                  highlighted={highlightedIndex === index}
                  onHighlight={setHighlightedIndex}
                />
              ))}
            </div>
          </>
        ) : (
          <PalettePlaceholder
            isExtracting={isExtracting}
            hasImage={Boolean(image)}
            requestedCount={settings.colorCount}
          />
        )}

      </CardContent>

      <CardFooter className="justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {palette.length} {palette.length === 1 ? "color" : "colors"}
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled={palette.length === 0}
          onClick={() => clipboard.copy(copyAll)}
        >
          {clipboard.copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copy all
        </Button>
      </CardFooter>
    </Card>
  );
}

/** @human Steps the color count one at a time, like the palette bar's own control. */
function ColorCountStepper() {
  const { settings, updateSettings } = useImageColorPaletteContext();
  const { min, max } = COLOR_COUNT_RANGE;

  const step = (delta: number) => {
    updateSettings({ colorCount: Math.min(max, Math.max(min, settings.colorCount + delta)) });
  };

  return (
    <div className="flex shrink-0 flex-col overflow-hidden rounded-lg border border-border">
      <StepperButton
        label="More colors"
        disabled={settings.colorCount >= max}
        onClick={() => step(1)}
      >
        <Plus className="h-3.5 w-3.5" />
      </StepperButton>
      <StepperButton
        label="Fewer colors"
        disabled={settings.colorCount <= min}
        onClick={() => step(-1)}
        className="border-t border-border"
      >
        <Minus className="h-3.5 w-3.5" />
      </StepperButton>
    </div>
  );
}

interface StepperButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

function StepperButton({ label, disabled, onClick, className, children }: StepperButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-7 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

interface PalettePlaceholderProps {
  isExtracting: boolean;
  hasImage: boolean;
  requestedCount: number;
}

function PalettePlaceholder({ isExtracting, hasImage, requestedCount }: PalettePlaceholderProps) {
  if (isExtracting) {
    return (
      <div className="space-y-2">
        {Array.from({ length: requestedCount }, (_, index) => (
          <Skeleton key={index} className="h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <p className="py-8 text-center text-sm text-muted-foreground">
      {hasImage
        ? "No colors found — try turning off “Skip near-white background”."
        : "Upload an image to extract its color palette."}
    </p>
  );
}
