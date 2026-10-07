import type { Metadata } from 'next';
import Providers from '../components/Providers';
import { resolveSiteUrl } from '../utils/siteUrl';
import './globals.css';

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
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
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

export default function RootLayout({ children }: { children?: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#203890" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
