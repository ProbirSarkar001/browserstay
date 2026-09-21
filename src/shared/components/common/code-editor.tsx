import "@tanstack/react-start/client-only";
import { useMemo } from "react";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { cn } from "@/shared/utils";

export type CodeLanguage = "json" | "yaml";

const LANGUAGES: Record<CodeLanguage, () => ReturnType<typeof json>> = {
  json,
  yaml
};

export interface CodeEditorProps {
  id?: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  className?: string;
  language?: CodeLanguage;
}

/**
 * @human A browser-only CodeMirror editor with line numbers, code folding, and
 * syntax highlighting for JSON or YAML. Pass `language` to pick the grammar; use the
 * `readOnly` mode to render output as a viewer. Import by path
 * (`@/shared/components/common/code-editor`) rather than through the barrel, so
 * CodeMirror stays out of the server bundle.
 */
export function CodeEditor({
  id,
  value,
  onChange,
  readOnly = false,
  placeholder,
  height = "20rem",
  className,
  language = "json"
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(() => [LANGUAGES[language]()], [language]);

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
