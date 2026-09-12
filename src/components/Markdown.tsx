type MarkdownProps = {
  html: string;
  className?: string;
};

export function Markdown({ html, className }: MarkdownProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
