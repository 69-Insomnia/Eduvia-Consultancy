'use client';

import { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Fetches the admin-authored `seo_meta` row for one entity (custom JSON-LD
 * plus meta overrides stored outside the record itself).
 *
 * Returns `null` while loading or when no row exists — callers treat null as
 * "render the defaults" so a missing row or a dead API never blanks a page.
 */
export default function useSeoMeta(entityType?: string, entityId?: string) {
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    if (!entityType || !entityId) return;
    let cancelled = false;
    api
      .get(`/seo-meta/entity/${entityType}/${encodeURIComponent(entityId)}`)
      .then((res) => {
        if (!cancelled) setMeta(res.data?.seoMeta || null);
      })
      .catch(() => {
        /* no custom row — defaults stay in effect */
      });
    return () => {
      cancelled = true;
    };
  }, [entityType, entityId]);

  return meta;
}

/**
 * Appends custom JSON-LD node(s) to a view's built-in nodes. Accepts the
 * single object or array a view already passes to `<SEO jsonLd>`, plus the
 * extra node(s) — either a single object or an array — fetched from the
 * `seo_meta` row. Null/empty extras are ignored.
 */
export function withCustomJsonLd(base: any, extra: any) {
  if (!extra) return base;
  const baseList = (Array.isArray(base) ? base : [base]).filter(Boolean);
  const extraList = (Array.isArray(extra) ? extra : [extra]).filter(Boolean);
  return extraList.length ? [...baseList, ...extraList] : base;
}
