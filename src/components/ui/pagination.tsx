"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2
  ];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-3", className)}
    >
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Prev
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {visiblePages[0] > 1 ? (
          <>
            <Button type="button" variant="ghost" size="sm" onClick={() => onPageChange(1)}>
              1
            </Button>
            <span className="px-1 text-xs text-muted">...</span>
          </>
        ) : null}

        {visiblePages.map((page) => (
          <Button
            key={page}
            type="button"
            variant={currentPage === page ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages ? (
          <>
            <span className="px-1 text-xs text-muted">...</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        ) : null}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </nav>
  );
}
