import View from '../../../views/Services';
import { getPageMetadata, getSeoMetaJsonLdByType } from '../../../server/services/pageMetadata';

// Safety-net freshness: admin saves purge this path; 60s covers the rest.
export const revalidate = 60;

export const generateMetadata = () => getPageMetadata('services');

export default async function Page() {
  // Per-service JSON-LD an editor attached in Structured Data (entity type
  // "service") ships with the page's HTML so crawlers see it without JS.
  const serviceRows = await getSeoMetaJsonLdByType('service');
  const serviceJsonLd = serviceRows.map((r) => r.jsonLd);
  return <View serviceJsonLd={serviceJsonLd} />;
}
