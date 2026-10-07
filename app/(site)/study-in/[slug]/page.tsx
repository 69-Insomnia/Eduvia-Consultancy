import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import View from '../../../../views/DestinationDetail';
import Destination from '../../../../server/models/Destination';
import { getEntityMetadata } from '../../../../server/services/pageMetadata';

const loadDestination = unstable_cache(
  async (slug: string) => {
    const row: any = await Destination.findOne({
      where: { slug, isActive: true },
      attributes: ['name', 'slug', 'seo', 'image', 'coverImage'],
    });
    if (!row) return null;
    return { name: row.name, slug: row.slug, seo: row.seo };
  },
  ['destination-page-metadata'],
  { revalidate: 300 }
);

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let destination: any = null;
  try {
    destination = await loadDestination(params.slug);
  } catch {
    return {};
  }
  if (!destination) notFound();
  const name = destination.name;

  return getEntityMetadata({
    path: `/study-in/${params.slug}`,
    seo: destination.seo,
    fallback: {
      title: `Study in ${name} - Complete Guide for Nepali Students`,
      description: `Everything you need to know about studying in ${name}: universities, tuition fees, scholarships, visa process, and student life. Expert guidance from Eduvia Consultancy.`,
      keywords: [
        `study in ${name}`,
        `universities in ${name}`,
        `${name} student visa`,
        `${name} scholarships`,
      ],
    },
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  // Also checked during render: throwing from `generateMetadata` alone renders
  // the not-found page with a 200 status code.
  try {
    if (!(await loadDestination(params.slug))) notFound();
  } catch {
    // Database unavailable: render anyway and let the view retry client-side.
  }
  return <View />;
}
