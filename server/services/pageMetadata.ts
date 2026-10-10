import type { Metadata } from 'next';
import getBootstrapData from './bootstrapData';
import { PAGE_SEO, pagePath, type PageSeoDefaults } from '../../utils/pageSeoDefaults';
import { resolveSiteUrl } from '../../utils/siteUrl';
import SeoMeta from '../models/SeoMeta';

/**
 * Server-side page metadata.
 *
 * `<SEO>` used to push title/description/canonical/Open Graph tags through
 * react-helmet-async, which the App Router never writes into the document head —
 * crawlers (and the browser tab) only ever saw the root layout's default. Every
 * page now exports `generateMetadata` from here instead, so the tags ship in the
 * first byte of HTML and Next keeps them correct across client navigations.
 *
 * The merge order is: admin override (`page_seo` row) → compiled default
 * (`utils/pageSeoDefaults`) → root layout fallbacks.
 */

const SITE_NAME = 'Eduvia Consultancy';
const DEFAULT_OG_IMAGE = '/og-image.jpg';
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

type StoredSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
};

function absoluteUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${resolveSiteUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
}

function toKeywords(value?: string[] | string): string[] | undefined {
  if (!value) return undefined;
  const list = Array.isArray(value)
    ? value
    : String(value)
        .split(',')
        .map((part) => part.trim());
  const cleaned = list.filter(Boolean);
  return cleaned.length ? cleaned : undefined;
}

/**
 * Titles that already carry the brand keep themselves: the root layout appends
 * `| Eduvia Consultancy` through its title template, and running a branded title
 * through the template renders the brand twice. The trailing brand is stripped
 * first so a stored `… | Eduvia` is upgraded to the full `… | Eduvia
 * Consultancy` instead of being duplicated.
 */
const TRAILING_BRAND = /\s*[|·—–-]\s*Eduvia(\s+Consultancy)?\s*$/i;

function applyTitleTemplate(title?: string): Metadata['title'] {
  if (!title) return undefined;
  const trimmed = title.replace(TRAILING_BRAND, '').trim() || title;
  return trimmed.includes(SITE_NAME) ? { absolute: trimmed } : trimmed;
}

function buildMetadata(input: {
  path: string;
  stored?: StoredSeo;
  defaults?: PageSeoDefaults;
  type?: string;
  article?: Record<string, any>;
  fallbackKeywords?: string[];
  settings?: any;
}): Metadata {
  const { path, stored = {}, defaults = {}, type, article, fallbackKeywords, settings } = input;

  const title = applyTitleTemplate(stored.title || defaults.title);
  const description = stored.description || defaults.description;
  const keywords = toKeywords(stored.keywords) || toKeywords(defaults.keywords) || fallbackKeywords;
  const robots = stored.robots || defaults.robots;
  const ogImage = absoluteUrl(stored.ogImage || defaults.image || settings?.seo?.ogImage || DEFAULT_OG_IMAGE);
  const canonical = absoluteUrl(stored.canonical) || `${resolveSiteUrl()}${path === '/' ? '' : path}`;
  const ogType = stored.ogType || type || 'website';

  const meta: Metadata = {
    alternates: { canonical: canonical },
  };

  if (title) meta.title = title;
  if (description) meta.description = description;
  if (keywords) meta.keywords = keywords;
  if (robots) meta.robots = robots;

  // Social copy can be authored separately from the meta title/description
  // (the admin's "Social Title"/"Social Description" fields); fall back in
  // order so a share card is never empty.
  const socialTitle =
    stored.ogTitle || (title as any)?.absolute || (typeof title === 'string' ? title : undefined) || description;
  const socialDescription = stored.ogDescription || description;
  const social = {
    type: ogType,
    title: socialTitle,
    description: socialDescription,
    url: canonical,
    siteName: SITE_NAME,
    locale: 'en_US',
    images: ogImage ? [{ url: ogImage, width: OG_WIDTH, height: OG_HEIGHT, alt: socialTitle }] : undefined,
    ...(ogType === 'article' && article ? { article } : {}),
  } as const;

  meta.openGraph = social;
  meta.twitter = {
    card: 'summary_large_image',
    title: socialTitle,
    description: socialDescription,
    images: ogImage ? [ogImage] : undefined,
  };

  return meta;
}

/**
 * Metadata for one of the compiled-in static pages (`utils/pageSeoDefaults`).
 */
export async function getPageMetadata(key: string): Promise<Metadata> {
  const { pages, settings } = await getBootstrapData();
  const stored = pages?.find((page: any) => page.key === key)?.seo || {};
  return buildMetadata({ path: pagePath(key), stored, defaults: PAGE_SEO[key], settings });
}

/**
 * Reads the admin-authored `seo_meta` row for one entity and maps its columns
 * onto the stored-seo shape `buildMetadata` consumes. Returns `{}` when no row
 * exists (or the table is unreachable) so the record's own `seo` subdocument
 * and the page fallbacks keep working untouched.
 */
export async function getSeoMetaStored(entityType: string, entityId: string): Promise<StoredSeo> {
  try {
    const row = await SeoMeta.findOne({ where: { entityType, entityId } });
    if (!row) return {};
    return {
      title: row.metaTitle || undefined,
      description: row.metaDescription || undefined,
      ogImage: row.ogImageUrl || undefined,
      ogTitle: row.ogTitle || undefined,
      ogDescription: row.ogDescription || undefined,
      canonical: row.canonicalUrl || undefined,
      robots: row.noindex ? 'noindex,follow' : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Returns just the custom JSON-LD node(s) an editor attached to one entity
 * (object or array), or null. Pages pass this into the view as a prop so the
 * extra <script type="application/ld+json"> ships in the server HTML rather
 * than only after the client mounts.
 */
export async function getSeoMetaJsonLd(entityType: string, entityId: string): Promise<any> {
  try {
    const row = await SeoMeta.findOne({ where: { entityType, entityId } });
    return row?.jsonLd ?? null;
  } catch {
    return null;
  }
}

/** Every custom JSON-LD row for one entity type (e.g. all `service` rows). */
export async function getSeoMetaJsonLdByType(entityType: string): Promise<any[]> {
  try {
    const rows = await SeoMeta.findAll({ where: { entityType } });
    return rows.map((row) => ({ entityId: row.entityId, jsonLd: row.jsonLd })).filter((r) => r.jsonLd);
  } catch {
    return [];
  }
}

/**
 * Metadata for an entity page (university, blog, destination, …).
 *
 * `seo` is the record's own admin-editable subdocument; `fallback` is the copy
 * the view renders when that subdocument is empty, so the head tags and the
 * on-page title never disagree.
 */
export async function getEntityMetadata(input: {
  path: string;
  seo?: StoredSeo | null;
  fallback: { title?: string; description?: string; keywords?: string[] };
  type?: string;
  article?: Record<string, any>;
}): Promise<Metadata> {
  const { settings } = await getBootstrapData();
  return buildMetadata({
    path: input.path,
    stored: input.seo || {},
    defaults: {
      title: input.fallback.title,
      description: input.fallback.description,
      keywords: input.fallback.keywords?.join(', '),
    },
    fallbackKeywords: input.fallback.keywords,
    type: input.type,
    article: input.article,
    settings,
  });
}

export default getPageMetadata;
