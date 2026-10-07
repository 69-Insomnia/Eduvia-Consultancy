'use client';

import { Helmet } from 'react-helmet-async';
import { resolveSiteUrl } from '@/utils/siteUrl';

export const SITE_URL = resolveSiteUrl();

// Stable @ids so the graph emitted in index.html for non-JS crawlers merges with
// the graph React emits at runtime instead of appearing as two organizations.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Absolute URL for a site-relative path; leaves absolute URLs untouched. */
export function absoluteUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}/${String(path).replace(/^\/+/, '')}`;
}

/**
 * Maps the `{ label, link }` arrays the pages already build for <Breadcrumb>
 * into a schema.org BreadcrumbList. `Breadcrumb` renders a hardcoded Home crumb
 * first, so it is prepended here too — structured data has to match what is
 * actually on the page.
 */
export function buildBreadcrumbList(items = []) {
  const trail = [{ label: 'Home', link: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      // The trailing crumb is the current page and has no link; its own
      // canonical covers it.
      ...(item.link ? { item: absoluteUrl(item.link) } : {}),
    })),
  };
}

/** The organization node every other graph references by @id. */
export function buildOrganization(settings: any = {}) {
  const company = settings.company || {};
  const contact = settings.contact || {};
  const social = settings.socialMedia || {};
  const phones = contact.phone || [];
  const emails = contact.email || [];

  const node: any = {
    '@type': 'EducationalOrganization',
    '@id': ORGANIZATION_ID,
    name: company.name || settings.siteName || 'Eduvia Consultancy',
    url: SITE_URL,
  };

  if (company.logo || settings.logo) node.logo = absoluteUrl(company.logo || settings.logo);
  if (company.description) node.description = company.description;
  if (phones[0]) node.telephone = phones[0];
  if (emails[0]) node.email = emails[0];

  // Only emit the address when the CMS actually holds one. A placeholder here
  // would ship invented contact data as structured data.
  if (contact.address) {
    node.address = {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressCountry: 'NP',
    };
  }

  const sameAs = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok']
    .map((key) => social[key])
    .filter(Boolean);
  if (sameAs.length) node.sameAs = sameAs;

  return node;
}

/**
 * Renders one <script type="application/ld+json"> per node. Accepts a single
 * object or an array; null/false entries are skipped so callers can inline
 * conditional nodes.
 */
export default function StructuredData({ data }: any) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!nodes.length) return null;

  return (
    <Helmet>
      {nodes.map((node, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(node)}
        </script>
      ))}
    </Helmet>
  );
}
