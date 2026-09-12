import { useState, useEffect } from "react";
import parse, { type HTMLReactParserOptions, Element } from "html-react-parser";
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

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === "a") {
          const href = domNode.attribs.href;
          if (href?.startsWith("/")) {
            return <Link to={href}>{domToReact(domNode.children, options)}</Link>;
          }
        }

        if (domNode.name === "img") {
          return (
            <img
              {...domNode.attribs}
              loading="lazy"
              className="rounded-lg shadow-md"
            />
          );
        }
      }
    }
  };

  return <div className={className}>{parse(result.markup, options)}</div>;
}

function domToReact(nodes: any[], options: HTMLReactParserOptions) {
  return parse(
    nodes
      .map((n) => (n.type === "text" ? n.data : n.type === "element" ? `<${n.tagName}>` : ""))
      .join(""),
    options
  );
}
