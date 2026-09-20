import { Link } from "@tanstack/react-router";
import type { RelatedPost } from "../utils/related-posts";

interface RelatedArticlesProps {
  posts: RelatedPost[];
  currentTags?: string[];
}

/**
 * @human Suggests other blog posts that share tags with the article you're reading.
 */
export function RelatedArticles({ posts, currentTags = [] }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  const hasTagMatches = posts.some((post) => post.matchedTags.length > 0);

  return (
    <section className="mt-16 pt-10 border-t border-border/60">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {hasTagMatches ? "Related articles" : "More to read"}
      </h2>
      {hasTagMatches && currentTags.length > 0 && (
        <p className="text-sm text-muted-foreground mb-6">
          Based on shared topics:{" "}
          {currentTags.map((tag) => (
            <span
              key={tag}
              className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary mr-1.5 mb-1"
            >
              {tag}
            </span>
          ))}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="block group rounded-xl border border-border/40 bg-card p-5 hover:border-border/80 transition-colors"
          >
            <time className="text-xs text-muted-foreground">
              {new Date(post.published).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </time>
            <h3 className="text-base font-semibold text-foreground mt-1.5 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.description}</p>
            )}
            {post.matchedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.matchedTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
