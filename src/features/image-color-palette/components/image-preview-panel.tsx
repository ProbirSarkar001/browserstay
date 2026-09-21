import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ImagePreview } from "@/shared/components/common/image-preview";
import { useImageColorPaletteContext } from "../context";
import { ColorAnchors } from "./color-anchors";

export function ImagePreviewPanel() {
  const { image, removeImage } = useImageColorPaletteContext();
  const containerRef = useRef<HTMLDivElement>(null);

  if (!image) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={removeImage}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* The inner box shrink-wraps the image so the pointers line up with it.
            `select-none` stops a pointer drag from dragging a text selection across
            the page behind it. */}
        <div className="flex justify-center">
          <div className="relative select-none" ref={containerRef}>
            <ImagePreview
              file={image.file}
              src={image.preview}
              alt={image.file.name}
              className="block max-h-128 max-w-full rounded-lg"
            />

            <ColorAnchors containerRef={containerRef} />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Drag a circle to take its color from somewhere else in the image. Hover a color in the
          palette to spotlight its circle.
        </p>
      </CardContent>
    </Card>
  );
}
