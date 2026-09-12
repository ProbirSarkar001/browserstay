declare module "content-collections" {
  export const allPosts: Array<{
    _meta: { path: string };
    title: string;
    published: string;
    description?: string;
    tags?: string[];
    slug: string;
    content: string;
    html: string;
    headerImage?: string;
  }>;
}
