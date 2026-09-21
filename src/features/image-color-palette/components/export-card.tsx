import { useState } from "react";
import { FileCode2, FileJson, ImageDown, Loader2, Palette as PaletteIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { downloadBlob } from "@/shared/services/download/download";
import { getBaseName } from "@/shared/services/file/file";
import { useImageColorPaletteContext } from "../context";
import {
  buildPaletteSheet,
  paletteToCss,
  paletteToJson,
  paletteToTailwind,
} from "../services/image-color-palette.client";

const SHEET_FAILED_MESSAGE = "Couldn't render the palette image. Please try again.";

export function PaletteExportCard() {
  const { image, palette, setError } = useImageColorPaletteContext();
  const [isRenderingSheet, setIsRenderingSheet] = useState(false);

  const baseName = image ? getBaseName(image.file) : "image";
  const isEmpty = palette.length === 0;

  const downloadText = (content: string, fileName: string, mimeType: string) => {
    downloadBlob(new Blob([content], { type: mimeType }), `${baseName}-${fileName}`);
  };

  const downloadSheet = async () => {
    setIsRenderingSheet(true);
    try {
      downloadBlob(await buildPaletteSheet(palette), `${baseName}-palette.png`);
    } catch (sheetError) {
      console.error(sheetError);
      setError(SHEET_FAILED_MESSAGE);
    } finally {
      setIsRenderingSheet(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Palette</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          disabled={isEmpty}
          onClick={() => downloadText(paletteToCss(palette), "palette.css", "text/css")}
        >
          <FileCode2 className="mr-2 h-4 w-4" />
          CSS
        </Button>
        <Button
          variant="outline"
          disabled={isEmpty}
          onClick={() =>
            downloadText(paletteToTailwind(palette), "palette.tailwind.css", "text/css")
          }
        >
          <PaletteIcon className="mr-2 h-4 w-4" />
          Tailwind
        </Button>
        <Button
          variant="outline"
          disabled={isEmpty}
          onClick={() => downloadText(paletteToJson(palette), "palette.json", "application/json")}
        >
          <FileJson className="mr-2 h-4 w-4" />
          JSON
        </Button>
        <Button variant="outline" disabled={isEmpty || isRenderingSheet} onClick={downloadSheet}>
          {isRenderingSheet ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImageDown className="mr-2 h-4 w-4" />
          )}
          PNG
        </Button>
      </CardContent>
    </Card>
  );
}
