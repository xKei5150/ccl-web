import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PaginationContent = ({ className, ...props }) => (
  <div className={cn("flex items-center gap-1", className)} {...props} />
);

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({
  className,
  isActive,
  children,
  ...props
}) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "default" : "outline"}
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  >
    {children}
  </Button>
);

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <Button
    variant="outline"
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Go to previous page</span>
  </Button>
);

const PaginationNext = ({
  className,
  ...props
}) => (
  <Button
    variant="outline"
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Go to next page</span>
  </Button>
);

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  className,
}) {
  // Create a function to handle URL generation with existing search params
  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  // Determine which page numbers to show
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show on each side of current page
    const pages = [];
    
    // Always include page 1
    pages.push(1);
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    
    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Add ellipses
    const result = [];
    let prev = 0;
    
    for (const page of pages) {
      if (page - prev > 1) {
        result.push(-prev); // Negative number indicates ellipsis after this position
      }
      result.push(page);
      prev = page;
    }
    
    return result;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex justify-center items-center", className)}
    >
      <div className="flex items-center gap-1">
        {/* Previous page button */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          asChild={currentPage > 1}
        >
          {currentPage > 1 ? (
            <Link href={createPageUrl(currentPage - 1)} aria-label="Go to previous page">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => {
            // If negative, it's an ellipsis indicator
            if (pageNum < 0) {
              return (
                <span key={`ellipsis-${index}`} className="px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isCurrentPage = pageNum === currentPage;
            
            return (
              <Button
                key={`page-${pageNum}`}
                variant={isCurrentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                disabled={isCurrentPage}
                asChild={!isCurrentPage}
              >
                {!isCurrentPage ? (
                  <Link href={createPageUrl(pageNum)} aria-label={`Go to page ${pageNum}`}>
                    {pageNum}
                  </Link>
                ) : (
                  <span>{pageNum}</span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Next page button */}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          asChild={currentPage < totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={createPageUrl(currentPage + 1)} aria-label="Go to next page">
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </nav>
  );
}

export {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};
