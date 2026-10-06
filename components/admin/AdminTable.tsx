'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react';

/**
 * Client-side paging for an already-filtered list. Every admin page used to
 * repeat this slice/derive block by hand.
 *
 * `resetKey` should be the page's filter values — when it changes the list is
 * shorter or different, so the pager returns to page 1 rather than leaving the
 * user on a page that no longer exists.
 */
export function useClientPagination(items, { pageSize = 10, resetKey = '' } = {}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  return { page: safePage, setPage, totalPages, paginated, total: items.length };
}

const PANEL = 'overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft';
const HEAD_ROW = 'bg-dark-50 text-xs font-semibold uppercase tracking-wider text-dark-500';
const PAGER_BTN =
  'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-600 transition-colors hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50';

function SkeletonRows({ columns, rows = 5 }: any) {
  return (
    <div className={`${PANEL} space-y-3 p-8`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-dark-100" />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

/**
 * The admin's list table: panel, header, body, empty state and pager.
 *
 * `renderRow` returns the <tr> itself, because the rows vary a lot — some show
 * images, badges or inline toggles. Columns are declared for the header only.
 */
export default function AdminTable({
  columns = [],
  rows = [],
  renderRow,
  loading = false,
  emptyIcon: EmptyIcon = Inbox,
  emptyMessage = 'Nothing here yet',
  page,
  totalPages,
  total,
  onPageChange,
  pageSize = 10,
  minWidth = 'min-w-[720px]',
}: any) {
  if (loading) return <SkeletonRows columns={columns} />;

  const showPager = totalPages > 1 && typeof onPageChange === 'function';
  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, total);

  return (
    <>
      <div className={PANEL}>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${minWidth}`}>
            <thead>
              <tr className={HEAD_ROW}>
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-200/70">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length || 1} className="py-14 text-center text-dark-400">
                    <EmptyIcon className="mx-auto mb-2 h-8 w-8 text-dark-300" aria-hidden="true" />
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map(renderRow)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPager && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            Showing {first}–{last} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className={PAGER_BTN}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="px-3 text-sm text-dark-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className={PAGER_BTN}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** The search + filter row above a table. */
export function AdminToolbar({ children }: any) {
  return <div className="flex flex-col gap-3 sm:flex-row">{children}</div>;
}

/** Search box with the leading icon every admin list screen uses. */
export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }: any) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-9 pr-4 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
      />
    </div>
  );
}

/**
 * Styled native select with a chevron, for toolbar filters. `options` are
 * plain strings or {value,label}.
 */
export function FilterSelect({ value, onChange, options = [], allLabel, ariaLabel }: any) {
  return (
    <div className="relative w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="w-full cursor-pointer appearance-none rounded-xl border border-dark-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-dark-900 shadow-xs transition-all hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
      >
        {allLabel !== undefined && <option value="">{allLabel}</option>}
        {options.map((option) => {
          const val = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option : option.label;
          return <option key={val} value={val}>{label}</option>;
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
    </div>
  );
}
