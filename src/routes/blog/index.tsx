import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { generateMetaFromKey } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => generateMetaFromKey("blog")
});

function BlogIndex() {
  const sortedPosts = allPosts.sort(
    (a: (typeof allPosts)[number], b: (typeof allPosts)[number]) => new Date(b.published).getTime() - new Date(a.published).getTime()
  );

  return (
    <main className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-muted-foreground mb-8">
          Thoughts on privacy, browser tools, and web technology.
        </p>

        <div className="space-y-8">
          {sortedPosts.map((post: (typeof allPosts)[number]) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="block group"
            >
              <article className="rounded-2xl border border-border/40 bg-card p-6 hover:border-border/80 transition-colors">
                <time className="text-sm text-muted-foreground">
                  {new Date(post.published).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </time>
                <h2 className="text-xl font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-muted-foreground mt-2">{post.description}</p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
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
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
