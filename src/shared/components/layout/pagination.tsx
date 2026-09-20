import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getPageNumbers } from "@/shared/utils/pagination";
import { cn } from "@/shared/utils/index";

interface PaginationLinkProps {
  to: string;
  page: number;
  search?: Record<string, unknown>;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
}

function PaginationLink({
  to,
  page,
  search,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent
}: PaginationLinkProps) {
  const linkSearch = page <= 1 ? {} : { page, ...search };

  return (
    <Link
      to={to}
      search={linkSearch}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-colors",
        className
      )}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </Link>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  to: string;
  search?: Record<string, unknown>;
  className?: string;
}

/**
 * @human Page navigation for lists split across multiple pages.
 */
export function Pagination({ currentPage, totalPages, to, search, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      {currentPage > 1 ? (
        <PaginationLink
          to={to}
          page={currentPage - 1}
          search={search}
          aria-label="Previous page"
          className="size-8 border-border bg-background hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
        </PaginationLink>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {pages[0] > 1 && (
        <>
          <PaginationLink
            to={to}
            page={1}
            search={search}
            className="size-8 border-border bg-background hover:bg-muted"
          >
            1
          </PaginationLink>
          {pages[0] > 2 && <span className="px-1 text-muted-foreground">…</span>}
        </>
      )}

      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-primary bg-primary text-sm font-medium text-primary-foreground"
          >
            {page}
          </span>
        ) : (
          <PaginationLink
            key={page}
            to={to}
            page={page}
            search={search}
            className="size-8 border-border bg-background hover:bg-muted"
          >
            {page}
          </PaginationLink>
        )
      )}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-muted-foreground">…</span>
          )}
          <PaginationLink
            to={to}
            page={totalPages}
            search={search}
            className="size-8 border-border bg-background hover:bg-muted"
          >
            {totalPages}
          </PaginationLink>
        </>
      )}

      {currentPage < totalPages ? (
        <PaginationLink
          to={to}
          page={currentPage + 1}
          search={search}
          aria-label="Next page"
          className="size-8 border-border bg-background hover:bg-muted"
        >
          <ChevronRight className="size-4" />
        </PaginationLink>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Next page">
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
