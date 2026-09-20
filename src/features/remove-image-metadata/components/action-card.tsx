import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { useRemoveImageMetadataContext } from "../context";
import { resolveOutputFormat } from "../services/remove-image-metadata";
import { METADATA_QUALITY } from "../constants";
import { encodeImages } from "@/shared/services/image/image.client";
import type { ImageFormat } from "@/shared/services/image/types";
import { createZip } from "@/shared/services/zip/zip";
import { downloadBlob } from "@/shared/services/download/download";
import { getBaseName } from "@/shared/services/file/file";

const FORMAT_EXTENSION: Record<ImageFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
};

export function RemoveImageMetadataActionCard() {
  const { files, settings, isProcessing, setIsProcessing, setError, updateCleanedSize } =
    useRemoveImageMetadataContext();

  const handleRemoveMetadata = async () => {
    if (files.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const inputs = files.map((imageFile) => {
        const outputFormat = resolveOutputFormat(imageFile.file, settings.preserveFormat);
        return {
          file: imageFile.file,
          id: imageFile.id,
          options: {
            outputFormat,
            quality: METADATA_QUALITY,
          },
        };
      });

      const results = await encodeImages(inputs);

      const cleanedFiles: Record<string, File> = {};
      for (const { input, result } of results) {
        if (input.id) {
          updateCleanedSize(input.id, result.outputSize);
        }

        const outputFormat = resolveOutputFormat(input.file, settings.preserveFormat);
        const ext = FORMAT_EXTENSION[outputFormat];
        const baseName = `${getBaseName(input.file)}_clean`;
        let fileName = `${baseName}.${ext}`;
        let counter = 2;
        while (fileName in cleanedFiles) {
          fileName = `${baseName}_${counter}.${ext}`;
          counter++;
        }
        cleanedFiles[fileName] = result.outputFile;
      }

      if (files.length === 1) {
        const [[fileName, file]] = Object.entries(cleanedFiles);
        downloadBlob(file, fileName);
      } else {
        const zipBlob = await createZip(cleanedFiles);
        downloadBlob(zipBlob, `clean_images_${Date.now()}.zip`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while removing metadata. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Remove Metadata</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          Strip hidden EXIF data from {files.length} image{files.length !== 1 ? "s" : ""} before
          sharing. Processing happens entirely in your browser.
        </p>
        {files.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {settings.preserveFormat
              ? "Original format preserved at maximum quality"
              : "Converting to lossless PNG"}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleRemoveMetadata}
          disabled={files.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Removing metadata...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Remove & Download
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
