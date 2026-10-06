'use client';

import { Link } from '../../utils/router';
import { ChevronRight, Home } from 'lucide-react';

/**
 * `light` renders the crumb for use on the dark brand heroes.
 */
export default function Breadcrumb({ items = [], light = false }: any) {
  const linkClass = light
    ? 'text-white/60 transition-colors hover:text-white'
    : 'text-dark-400 transition-colors hover:text-primary-600';
  const separatorClass = light ? 'text-white/30' : 'text-dark-300';
  const currentClass = light ? 'font-medium text-white' : 'font-medium text-dark-700';

  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link to="/" className={`flex items-center gap-1.5 ${linkClass}`}>
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight
                className={`h-3.5 w-3.5 shrink-0 ${separatorClass}`}
                aria-hidden="true"
              />
              {isLast || !item.link ? (
                <span className={currentClass} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.link} className={linkClass}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
