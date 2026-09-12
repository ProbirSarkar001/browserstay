declare module "content-collections" {
  export const allPosts: Array<{
    _meta: { path: string };
    title: string;
    published: string;
    description?: string;
    tags?: string[];
    excerpt: string;
    headerImage?: string;
    content: string;
    slug: string;
  }>;
}
