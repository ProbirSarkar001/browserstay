import { Search, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Card } from "@/shared/components/ui/card";
import { TOOLS_CONFIG, ALL_TOOLS } from "@/config/tools";
import { useCommandPalette } from "@/shared/hooks/use-command-palette";
import { ToolCard } from "@/shared/components/layout/tool-card";

export function ToolsSection() {
  const { setOpen } = useCommandPalette();

  const popularTools = ALL_TOOLS.filter((tool) => tool.popular && !tool.disabled);

  return (
    <section className="container mx-auto px-6 pb-24 relative z-10">
      {/* Search trigger */}
      <div className="max-w-2xl mx-auto mb-16">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center bg-muted/40 border border-border/50 rounded-full px-5 h-14 shadow-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary hover:bg-muted/60 hover:border-border transition-all text-left"
        >
          <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
          <span className="flex-1 text-base text-muted-foreground/70">Search all tools...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {TOOLS_CONFIG.map((category) => {
          const enabledTools = category.items.filter((tool) => !tool.disabled);
          const topTools = enabledTools.slice(0, 3);

          return (
            <Card
              key={category.href}
              className="group bg-card hover:bg-accent/5 transition-all duration-300 border-border/40 hover:border-border/80 p-6 flex flex-col gap-4 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <category.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {enabledTools.length} of {category.items.length} live
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1.5">{category.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {topTools.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="px-2.5 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {tool.title}
                  </Link>
                ))}
              </div>

              <Link
                to={category.href}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
              >
                View all {category.items.length}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Popular tools */}
      {popularTools.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Popular tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
