import "@tanstack/react-start/client-only";
import { useMemo } from "react";
import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { cn } from "@/shared/utils";

export interface JsonEditorProps {
  id?: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  className?: string;
}

/**
 * @human A browser-only CodeMirror editor with JSON syntax highlighting, line numbers,
 * and code folding. Supports an editable mode for input and a read-only mode for output.
 * Import by path (`@/shared/components/common/json-editor`) rather than through the barrel,
 * so CodeMirror stays out of the server bundle.
 */
export function JsonEditor({
  id,
  value,
  onChange,
  readOnly = false,
  placeholder,
  height = "20rem",
  className
}: JsonEditorProps) {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(() => [json()], []);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input text-sm",
        readOnly && "bg-muted/30",
        className
      )}
    >
      <CodeMirror
        id={id}
        value={value}
        height={height}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        extensions={extensions}
        editable={!readOnly}
        readOnly={readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          highlightSelectionMatches: true,
          autocompletion: false
        }}
        onChange={onChange}
      />
    </div>
  );
}
