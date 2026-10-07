import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import View from '../../../../views/UniversityDetail';
import University from '../../../../server/models/University';
import { getEntityMetadata } from '../../../../server/services/pageMetadata';

const loadUniversity = unstable_cache(
  async (slug: string) => {
    const row: any = await University.findOne({
      where: { slug },
      attributes: ['name', 'slug', 'country', 'city', 'seo', 'coverImage'],
    });
    if (!row) return null;
    return { name: row.name, slug: row.slug, country: row.country, seo: row.seo };
  },
  ['university-page-metadata'],
  { revalidate: 300 }
);

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

  return getEntityMetadata({
    path: `/universities/${params.slug}`,
    seo: university.seo,
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
  try {
    if (!(await loadUniversity(params.slug))) notFound();
  } catch {
    // Database unavailable: render anyway and let the view retry client-side.
  }
  return <View />;
}
