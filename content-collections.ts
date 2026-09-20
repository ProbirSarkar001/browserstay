import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import matter from "gray-matter";
import { compileBlogMarkdown } from "./src/features/blog/utils/compile-markdown";

const posts = defineCollection({
  name: "posts",
  directory: "./src/blog",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    published: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
  }),
  transform: async (document) => {
    const { content: body } = matter(document.content);
    const html = await compileBlogMarkdown(body);
    const headerImageMatch = body.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    const headerImage = headerImageMatch ? headerImageMatch[2] : undefined;

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

export default defineConfig({
  content: [posts]
});
