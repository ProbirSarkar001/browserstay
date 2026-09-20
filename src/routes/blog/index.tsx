import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { generateMetaFromKey } from "@/lib/seo";
import { BLOG_POSTS_PER_PAGE } from "@/features/blog/constants";
import { Pagination } from "@/shared/components/layout/pagination";
import { paginate } from "@/shared/utils/pagination";

type BlogSearch = {
  page: number;
};

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    const raw = Number(search.page);
    return {
      page: Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1
    };
  },
  component: BlogIndex,
  head: ({ match }) => {
    const meta = generateMetaFromKey("blog");
    const page = match.search.page;
    if (page <= 1) return meta;

    const pageTitle = `Blog - Page ${page} | BrowserStay`;
    return {
      ...meta,
      meta: meta.meta?.map((tag) => (tag?.title ? { title: pageTitle } : tag))
    };
  }
});

function BlogIndex() {
  const { page } = Route.useSearch();

  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
  );

  const {
    items: posts,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex
  } = paginate(sortedPosts, page, BLOG_POSTS_PER_PAGE);

  return (
    <main className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-muted-foreground mb-2">
          Thoughts on privacy, browser tools, and web technology.
        </p>
        {totalItems > 0 && (
          <p className="text-sm text-muted-foreground mb-8">
            Showing {startIndex}–{endIndex} of {totalItems} articles
            {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
          </p>
        )}

        <div className="space-y-8">
          {posts.map((post) => (
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          to="/blog"
          className="mt-12"
        />
      </div>
    </main>
  );
}
