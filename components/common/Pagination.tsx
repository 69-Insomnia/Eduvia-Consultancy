'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push(1);
    pages.push('...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('...');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  }
  return pages;
}

const NAV_BUTTON =
  'flex h-9 w-9 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-500 transition-colors hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-dark-200 disabled:hover:text-dark-500';

export default function Pagination({ currentPage, totalPages, onPageChange }: any) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={NAV_BUTTON}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-dark-300" aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 min-w-[2.25rem] rounded-xl px-2 text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-primary-500 text-white shadow-xs'
                : 'border border-dark-200 bg-white text-dark-600 hover:border-primary-300 hover:text-primary-600'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={NAV_BUTTON}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
