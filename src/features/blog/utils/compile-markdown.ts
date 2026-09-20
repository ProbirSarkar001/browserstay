import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/**
 * @human Compiles blog markdown to HTML with GFM support (tables, strikethrough, etc.).
 * Uses a direct pipeline instead of content-collections' cached compiler so plugin
 * changes always take effect immediately.
 */
export async function compileBlogMarkdown(content: string): Promise<string> {
  const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  return String(html);
}
