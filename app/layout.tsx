import type { Metadata } from 'next';
import Providers from '../components/Providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://eduviaconsultancy.com'),
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
    url: 'https://eduviaconsultancy.com/',
    images: [
      { url: 'https://eduviaconsultancy.com/og-image.jpg', width: 1200, height: 630 },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eduvia Consultancy Pvt. Ltd. | Study Abroad from Nepal',
    description:
      'Expert guidance for university selection, applications, scholarships and student visas for Nepali students.',
    images: ['https://eduviaconsultancy.com/og-image.jpg'],
  },
};

// Static social + structured-data fallbacks (same @ids as StructuredData.tsx
// so the two graphs merge into one entity).
const STRUCTURED_DATA = `{"@context":"https://schema.org","@graph":[{"@type":"EducationalOrganization","@id":"https://eduviaconsultancy.com/#organization","name":"Eduvia Consultancy Pvt. Ltd.","url":"https://eduviaconsultancy.com/","logo":"https://eduviaconsultancy.com/logo.png","description":"Education consultancy in Nepal guiding students through university selection, applications, scholarships and student visas."},{"@type":"WebSite","@id":"https://eduviaconsultancy.com/#website","name":"Eduvia Consultancy","url":"https://eduviaconsultancy.com/","publisher":{"@id":"https://eduviaconsultancy.com/#organization"}}]}`;

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
