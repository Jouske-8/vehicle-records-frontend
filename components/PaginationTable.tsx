"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

interface PaginationTableProps {
  rootUrl: string; // e.g. "/user/view-certificates"
  totalPages: number;
  pageSize?: number; // new prop
  maxPagesToShow?: number;
}

export default function PaginationTable({
  rootUrl,
  totalPages,
  pageSize = 20,
  maxPagesToShow = 5,
}: PaginationTableProps) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string, 10)
    : 1;

  const startPage = Math.max(
    1,
    currentPage - Math.floor(maxPagesToShow / 2)
  );
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // generate relative URL with page and pageSize
  const makeUrl = (page: number) => {
    return `${rootUrl}?page=${page}&pageSize=${pageSize}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href={makeUrl(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {/* First page */}
        {startPage > 1 && (
          <PaginationItem>
            <PaginationLink href={makeUrl(1)}>1</PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis if gap */}
        {startPage > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page numbers */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={makeUrl(page)}
              className={page === currentPage ? "bg-blue-500 text-white" : ""}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis if gap */}
        {endPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last page */}
        {endPage < totalPages && (
          <PaginationItem>
            <PaginationLink href={makeUrl(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href={makeUrl(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
