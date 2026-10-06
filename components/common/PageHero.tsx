'use client';

import Breadcrumb from './Breadcrumb';

/**
 * Shared page header.
 *
 * Replaces the dark hero that used to be duplicated (identically) across every
 * page, and adopts the homepage hero's visual language instead: a soft brand
 * wash, a large organic stroke, and a dotted texture — light, not dark.
 */
export default function PageHero({
  title,
  subtitle,
  eyebrow,
  icon: Icon,
  breadcrumb,
  size = 'md',
  centered = true,
}: any) {
  const compact = size === 'sm';

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      {/* Decorative field, echoing the homepage hero */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute -right-28 -top-32 h-[28rem] w-[28rem] text-primary-100"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M430 30 C 300 55, 245 185, 300 320 C 332 400, 385 430, 440 445"
            stroke="currentColor"
            strokeWidth="46"
            strokeLinecap="round"
          />
          <path
            d="M470 200 C 380 220, 350 320, 395 420"
            stroke="currentColor"
            strokeWidth="30"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        <div
          className="absolute left-[5%] top-6 h-40 w-64 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(#9fb0e9 1.5px, transparent 1.5px)',
            backgroundSize: '13px 13px',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, #000 40%, transparent 76%)',
            maskImage: 'radial-gradient(ellipse at 50% 50%, #000 40%, transparent 76%)',
          }}
        />
      </div>

      <div
        className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          compact ? 'py-8 md:py-12' : 'py-10 md:py-14'
        }`}
      >
        <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
          {breadcrumb?.length > 0 && (
            <div className={centered ? 'flex justify-center' : ''}>
              <Breadcrumb items={breadcrumb} />
            </div>
          )}

          {eyebrow && (
            <span className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary-100 bg-white px-4 py-2 text-xs font-semibold text-dark-700 shadow-soft">
              {Icon && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                  <Icon className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                </span>
              )}
              {eyebrow}
            </span>
          )}

          <h1
            className={`text-3xl font-display font-bold tracking-tight text-dark-900 md:text-4xl ${
              compact ? '' : 'lg:text-5xl'
            }`}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`mt-4 max-w-2xl text-base leading-relaxed text-dark-500 md:text-lg ${
                centered ? 'mx-auto' : ''
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
