import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { Markdown } from "@/components/Markdown";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = allPosts.find((p: (typeof allPosts)[number]) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.title} | BrowserStay Blog` },
        { name: "description", content: loaderData.description || loaderData.title },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description || loaderData.title },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: loaderData.published }
      ]
    };
  },
  component: BlogPost
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <main className="container mx-auto p-6">
      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← Back to blog
        </Link>

        <header className="mb-8">
          <time className="text-sm text-muted-foreground">
            {new Date(post.published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </time>
          <h1 className="text-4xl font-bold text-foreground mt-2">{post.title}</h1>
          {post.description && (
            <p className="text-lg text-muted-foreground mt-3">{post.description}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Markdown html={post.html} />
        </div>
      </article>
    </main>
  );
}
