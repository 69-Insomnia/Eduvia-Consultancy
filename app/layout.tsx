import type { Metadata } from 'next';
import { Caveat, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Providers from '../components/Providers';
import { resolveSiteUrl } from '../utils/siteUrl';
import getBootstrapData from '../server/services/bootstrapData';
import './globals.css';

// Self-hosted through next/font: the render-blocking fonts.googleapis.com
// stylesheet is gone, the files are served from this deployment with immutable
// caching and `display=swap`, and the metrics are inlined to stop the layout
// shift that webfont swapping used to cause.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});
const caveat = Caveat({ subsets: ['latin'], display: 'swap', variable: '--font-caveat' });

// Metadata is evaluated at build time, where Vercel sets VERCEL_URL to this
// deployment's own host — so a demo build points at itself, and a production
// build with SITE_URL set points at the custom domain.
const SITE_URL = resolveSiteUrl();
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Eduvia Consultancy Pvt. Ltd. | Study Abroad from Nepal',
    template: '%s | Eduvia Consultancy',
  },
  description:
    'Expert guidance for university selection, applications, scholarships and student visas for Nepali students.',
  keywords: [
    'study abroad',
    'education consultancy Nepal',
    'student visa',
    'university selection',
    'scholarship guidance',
  ],
  authors: [{ name: 'Eduvia Consultancy Pvt. Ltd.' }],
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Eduvia Consultancy',
    title: 'Eduvia Consultancy Pvt. Ltd. | Study Abroad from Nepal',
    description:
      'Expert guidance for university selection, applications, scholarships and student visas for Nepali students.',
    url: `${SITE_URL}/`,
    images: [
      { url: OG_IMAGE, width: 1200, height: 630 },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eduvia Consultancy Pvt. Ltd. | Study Abroad from Nepal',
    description:
      'Expert guidance for university selection, applications, scholarships and student visas for Nepali students.',
    images: [OG_IMAGE],
  },
};

// Static social + structured-data fallbacks (same @ids as StructuredData.tsx
// so the two graphs merge into one entity).
const STRUCTURED_DATA = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Eduvia Consultancy Pvt. Ltd.',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.png`,
      description:
        'Education consultancy in Nepal guiding students through university selection, applications, scholarships and student visas.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Eduvia Consultancy',
      url: `${SITE_URL}/`,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
});

export default async function RootLayout({ children }: { children?: React.ReactNode }) {
  // Settings and page-SEO overrides, read once server-side so the client does
  // not have to fetch them on every page load. Cached — see bootstrapData.ts.
  const { settings, pages } = await getBootstrapData();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${caveat.variable}`}
    >
      <head>
        <meta name="theme-color" content="#203890" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }}
        />
      </head>
      <body>
        <Providers initialSettings={settings} initialPageSeo={pages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
