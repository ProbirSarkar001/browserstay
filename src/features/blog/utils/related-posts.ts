import { BLOG_RELATED_POSTS_LIMIT } from "../constants";

export interface BlogPostSummary {
  slug: string;
  title: string;
  description?: string;
  published: string;
  tags?: string[];
}

export interface RelatedPost extends BlogPostSummary {
  matchedTags: string[];
}

export function getRelatedPosts(
  current: BlogPostSummary,
  posts: BlogPostSummary[],
  limit = BLOG_RELATED_POSTS_LIMIT
): RelatedPost[] {
  const currentTags = current.tags ?? [];
  const others = posts.filter((post) => post.slug !== current.slug);

  if (currentTags.length === 0) {
    return getRecentPosts(others, limit);
  }

  const ranked = others
    .map((post) => {
      const postTags = post.tags ?? [];
      const matchedTags = currentTags.filter((tag) => postTags.includes(tag));
      return { post, matchedTags, score: matchedTags.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.published).getTime() - new Date(a.post.published).getTime();
    })
    .slice(0, limit)
    .map(({ post, matchedTags }) => ({ ...post, matchedTags }));

  if (ranked.length >= limit) return ranked;

  const usedSlugs = new Set([current.slug, ...ranked.map((post) => post.slug)]);
  const filler = getRecentPosts(
    others.filter((post) => !usedSlugs.has(post.slug)),
    limit - ranked.length
  );

  return [...ranked, ...filler];
}

function getRecentPosts(posts: BlogPostSummary[], limit: number): RelatedPost[] {
  return [...posts]
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, limit)
    .map((post) => ({ ...post, matchedTags: [] }));
}
