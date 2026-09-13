import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils";
import type { ToolItem } from "@/config/tools";

export function ToolCard({ tool }: { tool: ToolItem }) {
  const iconTile = (
    <div className={cn("p-2.5 rounded-xl transition-colors", tool.color)}>
      <tool.icon className="w-5 h-5" />
    </div>
  );

  const body = (
    <Card className="h-full bg-card hover:bg-accent/5 transition-all duration-300 border-border/40 hover:border-border/80 p-4 flex flex-col gap-4 group-hover:-translate-y-1 group-hover:shadow-lg group-focus:ring-2 ring-primary/20">
      <div className="flex items-start justify-between">
        {iconTile}
        {tool.disabled && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 border-muted-foreground/30 text-muted-foreground"
          >
            Soon
          </Badge>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 flex items-center gap-2">
          {tool.title}
          {!tool.disabled && (
            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground" />
          )}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {tool.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-5 bg-muted/50 text-muted-foreground hover:bg-muted font-normal"
          >
            #{tag}
          </Badge>
        ))}
      </div>
    </Card>
  );

  if (tool.disabled) {
    return <div className="group block">{body}</div>;
  }

  return (
    <Link to={tool.href} className="group block outline-none focus-visible:ring-2 ring-primary/40 rounded-xl">
      {body}
    </Link>
  );
}
