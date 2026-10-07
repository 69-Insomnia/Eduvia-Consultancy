import { notFound } from 'next/navigation';
import View from '../../../../views/TestDetail';
import { getEntityMetadata } from '../../../../server/services/pageMetadata';

// Mirrors TEST_DATA in views/TestDetail.tsx — the guide pages are built from
// this local copy rather than the database, so only the labels are needed here
// to title the document before the client component mounts.
const TESTS: Record<string, { name: string; fullName: string }> = {
  ielts: { name: 'IELTS', fullName: 'International English Language Testing System' },
  pte: { name: 'PTE', fullName: 'Pearson Test of English' },
  toefl: { name: 'TOEFL', fullName: 'Test of English as a Foreign Language' },
  gre: { name: 'GRE', fullName: 'Graduate Record Examinations' },
  gmat: { name: 'GMAT', fullName: 'Graduate Management Admission Test' },
  sat: { name: 'SAT', fullName: 'Scholastic Assessment Test' },
  duolingo: { name: 'Duolingo', fullName: 'Duolingo English Test' },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const test = TESTS[params.slug];
  // Guide pages only exist for the tests above — anything else is a 404.
  if (!test) notFound();
  const { name, fullName } = test;

  return getEntityMetadata({
    path: `/test-preparation/${params.slug}`,
    fallback: {
      title: fullName ? `${name} (${fullName}) - Preparation Guide` : `${name} - Preparation Guide`,
      description: `Complete preparation guide for ${name}: test format, sections, scoring system, study materials, and expert tips from Eduvia Consultancy.`,
      keywords: [
        `${name} preparation`,
        `${name} format`,
        `${name} scoring`,
        `${name} tips`,
      ],
    },
  });
}

export default function Page({ params }: { params: { slug: string } }) {
  // Also checked during render: throwing from `generateMetadata` alone renders
  // the not-found page with a 200 status code.
  if (!TESTS[params.slug]) notFound();
  return <View />;
}
