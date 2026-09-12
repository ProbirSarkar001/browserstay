import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { Link } from "@tanstack/react-router";
import { renderMarkdown, type MarkdownResult } from "@/utils/markdown";

type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null);

  useEffect(() => {
    renderMarkdown(content).then(setResult);
  }, [content]);

  if (!result) {
    return <div className={className}>Loading...</div>;
  }

  return <div className={className}>{parse(result.markup)}</div>;
}
