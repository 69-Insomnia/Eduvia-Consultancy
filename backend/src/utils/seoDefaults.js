/**
 * Generators for the `seo` subdocument, used by the seed script, the bulk
 * university/course importers, and scripts/backfill-seo.js.
 *
 * The templates are deliberately generic: they describe what the page is, and
 * never assert outcomes (visa approval rates, placement counts, rankings) that
 * the data does not support. Editors override them per document in the admin.
 */

const clean = (value) => String(value ?? '').trim();

/** Assembles a seo object, dropping empty values so absent fields stay absent. */
export function buildSeo({ title, description, keywords = [], ...overrides } = {}) {
  const seo = {};

  if (clean(title)) seo.title = clean(title);
  if (clean(description)) seo.description = clean(description);

  const list = (Array.isArray(keywords) ? keywords : [keywords]).map(clean).filter(Boolean);
  if (list.length) seo.keywords = list;

  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined && value !== null && clean(value) !== '') seo[key] = value;
  }

  return seo;
}

const TEMPLATES = {
  destination: ({ name }) => ({
    title: `Study in ${name} - Universities, Fees & Student Visa Guide`,
    description: `A complete guide to studying in ${name} for Nepali students: universities and courses, tuition and living costs, scholarships, the student visa process, and what to expect on arrival.`,
    keywords: [`study in ${name}`, `universities in ${name}`, `${name} student visa`, `study ${name} from nepal`],
  }),
  university: ({ name, country }) => ({
    title: `${name}${country ? `, ${country}` : ''} - Programs, Fees & Admission Requirements`,
    description: `${name}: explore available programs, tuition fees, entry requirements, and how to apply as an international student. Get application guidance from Eduvia Consultancy.`,
    keywords: [name, `${name} admissions`, `${name} tuition fees`, `${name} programs`].filter(Boolean),
  }),
  course: ({ name, country }) => ({
    title: `${name}${country ? ` in ${country}` : ''} - Duration, Fees & Requirements`,
    description: `${name}: course duration, tuition fees, entry requirements, and which universities offer it. Get course selection guidance from Eduvia Consultancy.`,
    keywords: [name, `study ${name}`, `${name} requirements`, `${name} fees`].filter(Boolean),
  }),
  scholarship: ({ name, country }) => ({
    title: `${name} - Eligibility, Amount & How to Apply`,
    description: `${name}: eligibility criteria, award amount, required documents, and application deadlines. Get scholarship application support from Eduvia Consultancy.`,
    keywords: [name, `${name} eligibility`, `${name} application`, `scholarships${country ? ` ${country}` : ''}`].filter(Boolean),
  }),
  service: ({ name }) => ({
    title: `${name} - Study Abroad Support from Eduvia Consultancy`,
    description: `${name} at Eduvia Consultancy. Learn what this service covers and how it supports your study abroad application.`,
    keywords: [name, 'study abroad services', 'education consultancy nepal'].filter(Boolean),
  }),
  blog: ({ name }) => ({
    title: name,
    description: `${name} - guidance for Nepali students planning to study abroad, from the team at Eduvia Consultancy.`,
    keywords: ['study abroad', 'nepal', 'student guide'].filter(Boolean),
  }),
};

/**
 * Builds a seo object from a content item's own fields.
 * Unknown types produce an empty object rather than a wrong template.
 */
export function makeSeoFromEntity({ type, name, country } = {}) {
  const template = TEMPLATES[type];
  if (!template || !clean(name)) return {};
  return buildSeo(template({ name: clean(name), country: clean(country) }));
}

export default makeSeoFromEntity;
