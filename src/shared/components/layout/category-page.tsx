import { Badge } from "@/shared/components/ui/badge";
import type { ToolCategory, ToolItem } from "@/config/tools";
import { ToolCard } from "@/shared/components/layout/tool-card";

function ToolGrid({ tools }: { tools: ToolItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tools.map((tool) => (
        <ToolCard key={tool.href} tool={tool} />
      ))}
    </div>
  );
}

export function CategoryPage({ category }: { category: ToolCategory }) {

  const enabled = category.items.filter((tool) => !tool.disabled);
  const disabled = category.items.filter((tool) => tool.disabled);

  const groups: { name: string; tools: ToolItem[] }[] = [];
  for (const tool of enabled) {
    const name = tool.group ?? "";
    const existing = groups.find((group) => group.name === name);
    if (existing) {
      existing.tools.push(tool);
    } else {
      groups.push({ name, tools: [tool] });
    }
  }
  const hasGroups = groups.length > 1 || (groups.length === 1 && groups[0].name !== "");

  return (
    <div className="container mx-auto px-6 py-16 relative z-10">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex p-3 rounded-2xl mb-6 border border-border/40 bg-primary/10 text-primary">
          <category.icon className="w-7 h-7" />
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{category.title}</h1>
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
            {enabled.length} {enabled.length === 1 ? "tool" : "tools"}
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">{category.description}</p>
      </div>

      {hasGroups ? (
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.name || "default"}>
              {group.name && (
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {group.name}
                </h2>
              )}
              <ToolGrid tools={group.tools} />
            </section>
          ))}
        </div>
      ) : (
        <ToolGrid tools={enabled} />
      )}

      {disabled.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Coming soon
          </h2>
          <ToolGrid tools={disabled} />
        </section>
      )}
    </div>
  );
}
