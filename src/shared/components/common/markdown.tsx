import "@tanstack/react-start/client-only";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/shared/utils";

export interface MarkdownProps {
  source: string;
  className?: string;
}

const components: Components = {
  a({ href, children, ...props }) {
    const external = /^https?:\/\//i.test(href || "");

    return (
      <a
        {...props}
        href={href}
        rel={external ? "nofollow noopener noreferrer" : props.rel}
        target={external ? "_blank" : props.target}
      >
        {children}
      </a>
    );
  },
};

/**
 * @human Renders a Markdown string as styled HTML with GFM support (tables, task lists, etc.).
 */
export function Markdown({ source, className }: MarkdownProps) {
  return (
    <div className={cn("prose max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
