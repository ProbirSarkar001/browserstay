import { FileText } from "lucide-react";
import { usePdfToMarkdownContext } from "../context";
import { DropZone } from "@/shared/components/common/drop-zone";
import { createPdfToMarkdownFile, ACCEPTED_FILE_TYPES } from "../constants";

export function PdfToMarkdownDropZone() {
  const { setFile } = usePdfToMarkdownContext();

  const handleFile = (file: File) => {
    setFile(createPdfToMarkdownFile(file));
  };

  return (
    <DropZone accept={ACCEPTED_FILE_TYPES[0]} onDrop={handleFile}>
      <DropZone.Icon icon={FileText} className="text-orange-600" />
      <DropZone.Title>Drop PDF here or click to select</DropZone.Title>
      <DropZone.Description>
        Select a text-based PDF to convert to structured Markdown
      </DropZone.Description>
      <DropZone.Button>Select PDF</DropZone.Button>
    </DropZone>
  );
}
