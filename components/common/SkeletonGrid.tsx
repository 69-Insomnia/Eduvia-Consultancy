'use client';

/**
 * Card-grid placeholder shown while list data loads.
 *
 * Pass the same `className` grid as the real content so the loading state
 * occupies the same space — that is what keeps the swap from shifting layout.
 */
export default function SkeletonGrid({
  count = 6,
  className = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  variant = 'media',
}: any) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading content</span>
      <div className={className} aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft"
          >
            {variant === 'media' && <div className="skeleton aspect-[16/10] rounded-none" />}
            <div className="space-y-3 p-5">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
              {variant === 'plain' && <div className="skeleton h-3 w-1/2" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
