// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { z } from "zod";
import matter from "gray-matter";
var posts = defineCollection({
  name: "posts",
  directory: "./src/blog",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    published: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
  }),
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document);
    const { content: body } = matter(document.content);
    const headerImageMatch = document.content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    const headerImage = headerImageMatch ? headerImageMatch[2] : void 0;
    return {
      ...document,
      slug: document._meta.path,
      description: document.description,
      tags: document.tags,
      headerImage,
      content: body,
      html
    };
  }
});
var content_collections_default = defineConfig({
  content: [posts]
});
export {
  content_collections_default as default
};
