import { createFileRoute } from "@tanstack/react-router";
import { TOOLS_CONFIG } from "@/config/tools";
import { SITE_CONFIG } from "@/config/site";
import { BASE_URL } from "@/lib/seo";

export const Route = createFileRoute("/api/tools.json")({
  server: {
    handlers: {
      GET: async () => {
        const itemList = TOOLS_CONFIG.flatMap((category) =>
          category.items
            .filter((tool) => !tool.disabled)
            .map((tool) => ({
            "@type": "ListItem",
            position: TOOLS_CONFIG.indexOf(category) * 10 + category.items.indexOf(tool) + 1,
            item: {
              "@type": "SoftwareApplication",
              name: tool.title,
              url: `${BASE_URL}${tool.href}`,
              description: tool.description,
              applicationCategory: `${category.title} > ${tool.title}`,
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD"
              }
            }
          }))
        );

        return Response.json({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${SITE_CONFIG.name} Tools`,
          description: SITE_CONFIG.description,
          numberOfItems: itemList.length,
          itemListElement: itemList
        });
      }
    }
  }
});
