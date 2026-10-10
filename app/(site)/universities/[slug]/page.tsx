import { notFound } from 'next/navigation';
import View from '../../../../views/UniversityDetail';
import University from '../../../../server/models/University';
import { getEntityMetadata, getSeoMetaStored, getSeoMetaJsonLd } from '../../../../server/services/pageMetadata';

// Safety-net freshness: the admin purges this path on write; 60s covers
// anything that never goes through the API.
export const revalidate = 60;

async function loadUniversity(slug: string) {
  const row: any = await University.findOne({
    where: { slug },
    attributes: ['name', 'slug', 'country', 'city', 'seo', 'coverImage'],
  });
  if (!row) return null;
  return { name: row.name, slug: row.slug, country: row.country, seo: row.seo };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let university: any = null;
  try {
    university = await loadUniversity(params.slug);
  } catch {
    return {};
  }
  // Unknown slugs used to render a page titled from the URL itself — a soft
  // 404 that search engines count as thin content.
  if (!university) notFound();
  const name = university.name;

  // Admin-authored `seo_meta` overrides sit on top of the record's own seo.
  const overrides = await getSeoMetaStored('university', university.slug);

  return getEntityMetadata({
    path: `/universities/${params.slug}`,
    seo: { ...(university.seo || {}), ...overrides },
    fallback: {
      title: `${name} - University Details & Admissions`,
      description: `Learn about ${name}: programs, admission requirements, tuition fees, scholarships, and how to apply. Expert guidance from Eduvia Consultancy.`,
      keywords: [name, 'university', 'programs', 'admission', 'tuition fees', 'scholarships'],
    },
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  // Also checked during render: throwing from `generateMetadata` alone renders
  // the not-found page with a 200 status code.
  let customJsonLd = null;
  try {
    if (!(await loadUniversity(params.slug))) notFound();
    // Extra JSON-LD an editor attached to this university ships in the HTML.
    customJsonLd = await getSeoMetaJsonLd('university', params.slug);
  } catch {
    // Database unavailable: render anyway and let the view retry client-side.
  }
  return <View customJsonLd={customJsonLd} />;
}
