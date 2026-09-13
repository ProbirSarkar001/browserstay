import { Fragment, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/shared/components/ui/command";
import { TOOLS_CONFIG } from "@/config/tools";
import { useCommandPalette } from "@/shared/hooks/use-command-palette";

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search tools..." />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          {TOOLS_CONFIG.map((category, categoryIndex) => {
            const items = category.items.filter((tool) => !tool.disabled);
            if (items.length === 0) return null;
            return (
              <Fragment key={category.href}>
                {categoryIndex > 0 && <CommandSeparator />}
                <CommandGroup heading={category.title}>
                  {items.map((tool) => (
                    <CommandItem
                      key={tool.href}
                      value={`${tool.title} ${tool.description} ${tool.tags.join(" ")} ${(tool.keywords ?? []).join(" ")}`}
                      onSelect={() => {
                        setOpen(false);
                        navigate({ to: tool.href });
                      }}
                    >
                      <tool.icon className="text-muted-foreground" />
                      <span>{tool.title}</span>
                      <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">
                        {category.title}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            );
          })}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
