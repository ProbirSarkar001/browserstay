import { createFileRoute, notFound } from "@tanstack/react-router";

import { CategoryPage } from "@/shared/components/layout/category-page";
import { TOOLS_CONFIG, getCategoryByHref } from "@/config/tools";
import { generateMeta, getCanonicalUrl } from "@/lib/seo";

const CATEGORY_SLUGS = TOOLS_CONFIG.map((category) => category.href.replace("/", "").replace("-tools", ""));

export const Route = createFileRoute('/{$category}-tools')({
  beforeLoad: ({ params }) => {
    if (!CATEGORY_SLUGS.includes(params.category)) {
      throw notFound();
    }
  },
  component: ToolsCategoryPage,
  head: ({ params }) => {
    const category = getCategoryByHref(`/${params.category}-tools`);
    if (!category) return {};

    return generateMeta({
      title: `${category.title} - Free & Private | BrowserStay`,
      description: category.description,
      canonicalUrl: getCanonicalUrl(`/${params.category}-tools`),
      keywords: category.items.map((tool) => tool.title.toLowerCase()).join(", ")
    });
  }
});

function ToolsCategoryPage() {
  const { category: slug } = Route.useParams();
  const category = getCategoryByHref(`/${slug}-tools`);

  if (!category) {
    throw notFound();
  }

  return <CategoryPage category={category} />;
}
