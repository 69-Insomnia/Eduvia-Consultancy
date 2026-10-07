/**
 * Built-in metadata for every static site page.
 *
 * These literals used to live only inside each view's `useMergedSeo(key, {...})`
 * call, where they were handed to the Helmet-based `<SEO>` component — which the
 * App Router never renders into the document head. Server-side `generateMetadata`
 * reads them from here instead, so the title, description and keywords reach the
 * HTML on first byte. The values are kept next to the path they belong to and are
 * overridden per page by the `page_seo` rows an editor saves in admin › SEO › Pages.
 *
 * Keys match the `page_seo.key` values the admin stores, so one lookup covers
 * both the compiled default and the stored override.
 */

export type PageSeoDefaults = {
  title?: string;
  description?: string;
  /** Comma-separated, matching what the admin keyword field stores. */
  keywords?: string;
  image?: string;
  robots?: string;
};

export const PAGE_SEO: Record<string, PageSeoDefaults> = {
  home: {
    title: 'Eduvia Consultancy - Study Abroad Consultancy in Nepal',
    description:
      "Eduvia Consultancy is Nepal's trusted study abroad consultancy providing expert counseling, university selection, visa assistance, and scholarship guidance for Nepali students.",
    keywords:
      'study abroad Nepal, study abroad consultancy, education consultancy Nepal, study in Australia, study in Canada, study in UK',
  },
  about: {
    title: "About Eduvia Consultancy - Nepal's Trusted Study Abroad Partner",
    description:
      "Learn about Eduvia Consultancy - Nepal's leading study abroad consultancy with over a decade of experience helping students achieve their global education dreams.",
    keywords:
      'about Eduvia, study abroad consultancy Nepal, education consultancy, our story, our team',
  },
  blogs: {
    title: 'Blog & Insights - Study Abroad Tips & News',
    description:
      'Stay informed with the latest study abroad news, university guides, scholarship updates, visa tips, and expert advice from Eduvia Consultancy.',
    keywords:
      'study abroad blog, education news, university guides, visa tips, scholarship updates',
  },
  contact: {
    title: 'Contact Us - Get in Touch with Eduvia Consultancy',
    description:
      'Contact Eduvia Consultancy for free study abroad counseling. Visit our office in Kathmandu, call us, or fill out the contact form. We are here to help.',
    keywords:
      'contact Eduvia, study abroad counseling, education consultancy contact, Kathmandu office',
  },
  'course-finder': {
    title: 'Find Your Course - Browse Courses Worldwide',
    description:
      'Search and find courses from top universities worldwide. Filter by country, degree level, and intake. Expert guidance from Eduvia Consultancy.',
    keywords: 'find course, study abroad courses, university courses, course search',
  },
  disclaimer: {
    title: 'Disclaimer - Eduvia Consultancy',
    description:
      'Important disclaimers regarding visa decisions, university admissions, and information accuracy at Eduvia Consultancy.',
    keywords: 'disclaimer, visa disclaimer, admission disclaimer, information accuracy',
  },
  'privacy-policy': {
    title: 'Privacy Policy - Eduvia Consultancy',
    description:
      'Eduvia Consultancy privacy policy. Learn how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, personal information',
  },
  scholarships: {
    title: 'Scholarships for Nepali Students',
    description:
      'Find scholarships and financial aid for Nepali students studying abroad. Explore merit-based, need-based, and government scholarships for study in Australia, Canada, UK, and more.',
    keywords:
      'scholarships for Nepali students, study abroad scholarships, financial aid, merit scholarships, need-based scholarships',
  },
  services: {
    title: 'Our Services - Complete Study Abroad Support',
    description:
      'Eduvia Consultancy offers comprehensive study abroad services including career counseling, university selection, visa processing, test preparation, and scholarship assistance.',
    keywords:
      'study abroad services, career counseling, visa processing, university selection, test preparation, scholarship assistance',
  },
  'student-visa': {
    title: 'Student Visa Services - Expert Visa Guidance',
    description:
      'Get expert student visa assistance from Eduvia Consultancy. We help Nepali students with visa documentation, application, interview preparation for Australia, Canada, UK, USA, and more.',
    keywords:
      'student visa, visa services, student visa assistance, visa processing, study abroad visa',
  },
  'study-abroad': {
    title: 'Study Abroad - Top Destinations for Nepali Students',
    description:
      'Explore top study abroad destinations for Nepali students including Australia, Canada, UK, USA, New Zealand, Germany, and more. Expert guidance from Eduvia Consultancy.',
    keywords:
      'study abroad, study abroad destinations, study in Australia, study in Canada, study in UK, study in USA',
  },
  'success-stories': {
    title: 'Success Stories - Students Who Achieved Their Dreams',
    description:
      'Read inspiring success stories from Nepali students who achieved their dream of studying abroad with guidance from Eduvia Consultancy.',
    keywords: 'success stories, student testimonials, study abroad success, Eduvia reviews',
  },
  team: {
    title: 'Our Team - Meet the Eduvia Consultancy Team',
    description:
      'Meet the experienced team behind Eduvia Consultancy. Our expert counselors and staff are dedicated to helping students achieve their study abroad dreams.',
    keywords: 'Eduvia team, our team, counselors, study abroad experts, education consultants',
  },
  'terms-conditions': {
    title: 'Terms & Conditions - Eduvia Consultancy',
    description:
      'Eduvia Consultancy terms and conditions. Read our service terms, fee policies, liability, and more.',
    keywords: 'terms and conditions, service terms, fee policy, liability',
  },
  'test-preparation': {
    title: 'Test Preparation - IELTS, PTE, TOEFL, GRE, GMAT, SAT Coaching',
    description:
      'Expert coaching for IELTS, PTE, TOEFL, GRE, GMAT, SAT, and Duolingo at Eduvia Consultancy. Achieve your target scores with our proven preparation methods.',
    keywords:
      'IELTS preparation, PTE coaching, TOEFL classes, GRE preparation, GMAT coaching, SAT prep, Duolingo test',
  },
  universities: {
    title: 'Find Your University - Top Universities Worldwide',
    description:
      'Search and explore thousands of universities worldwide. Find the perfect university for your study abroad journey with expert guidance from Eduvia Consultancy.',
    keywords: 'universities abroad, find university, study abroad universities, university search',
  },
};

/** Canonical path for a page key; `home` is the site root. */
export function pagePath(key: string): string {
  return key === 'home' ? '/' : `/${key}`;
}

export default PAGE_SEO;
