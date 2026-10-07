import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import View from '../../../../views/VisaDetail';
import Destination from '../../../../server/models/Destination';
import { getEntityMetadata } from '../../../../server/services/pageMetadata';

// The visa guide reuses the destination's own name so the head tags match the
// hero the view renders, without a second query on the client.
const loadDestinationName = unstable_cache(
  async (slug: string) => {
    const row: any = await Destination.findOne({
      where: { slug, isActive: true },
      attributes: ['name'],
    });
    return row?.name || null;
  },
  ['visa-page-metadata'],
  { revalidate: 300 }
);

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let name: string | null = null;
  try {
    name = await loadDestinationName(params.slug);
  } catch {
    return {};
  }
  // The guide is built from the destination record, so an unknown slug is a
  // real 404 rather than a page titled with whatever was in the URL.
  if (!name) notFound();

  return getEntityMetadata({
    path: `/student-visa/${params.slug}`,
    fallback: {
      title: `Student Visa for ${name} - Complete Guide`,
      description: `Complete student visa guide for ${name}: requirements, documents checklist, application process, interview preparation, and tips from Eduvia Consultancy.`,
      keywords: [
        `student visa ${name}`,
        `${name} visa requirements`,
        `${name} student visa process`,
      ],
    },
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  // Also checked during render: throwing from `generateMetadata` alone renders
  // the not-found page with a 200 status code.
  try {
    if (!(await loadDestinationName(params.slug))) notFound();
  } catch {
    // Database unavailable: render anyway and let the view retry client-side.
  }
  return <View />;
}
