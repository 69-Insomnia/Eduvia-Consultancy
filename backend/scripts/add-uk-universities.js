/**
 * Additive import of UK institutions and their listed courses.
 *
 * Unlike `npm run seed`, this never calls deleteMany() — it inserts only what is
 * missing and leaves every other collection untouched. Safe to re-run: an
 * institution or course that already exists is skipped, so edits made in the
 * admin panel are never clobbered.
 *
 *   npm run seed:uk
 *
 * Source: the 24 UK course listings supplied by the client, covering 21
 * institution records (Anglia Ruskin appears twice — Writtle and London are
 * separate campuses with separate fees, as does the University of Hull's London
 * campus).
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import University from '../src/models/University.js';
import Course from '../src/models/Course.js';
import { makeSeoFromEntity } from '../src/utils/seoDefaults.js';

const UK = 'United Kingdom';

/**
 * The 21 institution records. `campus` is kept for the printed summary only —
 * the schema has a single `city`, so the campus detail lives in the course rows.
 * Website and type are filled from public knowledge of these institutions and
 * are worth a spot-check before launch.
 */
const INSTITUTIONS = {
  'aru-writtle': {
    name: 'Anglia Ruskin University',
    city: 'Writtle, Chelmsford',
    campus: 'ARU Writtle Campus',
    website: 'https://www.aru.ac.uk',
    type: 'public',
  },
  'aru-london': {
    name: 'Anglia Ruskin University - London Campus',
    city: 'London',
    campus: 'ARU London Campus (East India Dock)',
    website: 'https://www.aru.ac.uk',
    type: 'public',
  },
  aston: {
    name: 'Aston University',
    city: 'Birmingham',
    campus: 'Birmingham',
    website: 'https://www.aston.ac.uk',
    type: 'public',
  },
  coventry: {
    name: 'Coventry University',
    city: 'Coventry',
    campus: 'Coventry Campus',
    website: 'https://www.coventry.ac.uk',
    type: 'public',
  },
  napier: {
    name: 'Edinburgh Napier University',
    city: 'Edinburgh',
    campus: 'Edinburgh',
    website: 'https://www.napier.ac.uk',
    type: 'public',
  },
  ljmu: {
    name: 'Liverpool John Moores University',
    city: 'Liverpool',
    campus: 'Liverpool',
    website: 'https://www.ljmu.ac.uk',
    type: 'public',
  },
  newcastle: {
    name: 'Newcastle University',
    city: 'Newcastle',
    campus: 'Newcastle',
    website: 'https://www.ncl.ac.uk',
    type: 'public',
  },
  'northeastern-london': {
    name: 'Northeastern University London',
    city: 'London',
    campus: 'St Katharine Docks & The City, London',
    website: 'https://www.nulondon.ac.uk',
    type: 'private',
  },
  northumbria: {
    name: 'Northumbria University',
    city: 'Newcastle',
    campus: 'City Campus, Newcastle',
    website: 'https://www.northumbria.ac.uk',
    type: 'public',
  },
  'oxford-brookes': {
    name: 'Oxford Brookes University',
    city: 'Oxford',
    campus: 'Headington',
    website: 'https://www.brookes.ac.uk',
    type: 'public',
  },
  regents: {
    name: "Regent's University London",
    city: 'London',
    campus: 'London',
    website: 'https://www.regents.ac.uk',
    type: 'private',
  },
  uea: {
    name: 'University of East Anglia',
    city: 'Norwich',
    campus: 'Norwich',
    website: 'https://www.uea.ac.uk',
    type: 'public',
  },
  uel: {
    name: 'University of East London',
    city: 'London',
    campus: 'London',
    website: 'https://www.uel.ac.uk',
    type: 'public',
  },
  exeter: {
    name: 'University of Exeter',
    city: 'Exeter',
    campus: 'Exeter (Streatham)',
    website: 'https://www.exeter.ac.uk',
    type: 'public',
  },
  greenwich: {
    name: 'University of Greenwich',
    city: 'London',
    campus: 'Greenwich Campus',
    website: 'https://www.gre.ac.uk',
    type: 'public',
  },
  'hull-london': {
    name: 'University of Hull - London',
    city: 'London',
    campus: 'London Campus',
    website: 'https://www.hull.ac.uk',
    type: 'public',
  },
  leicester: {
    name: 'University of Leicester',
    city: 'Leicester',
    campus: 'Leicester',
    website: 'https://le.ac.uk',
    type: 'public',
  },
  liverpool: {
    name: 'University of Liverpool',
    city: 'Liverpool',
    campus: 'Liverpool',
    website: 'https://www.liverpool.ac.uk',
    type: 'public',
  },
  strathclyde: {
    name: 'University of Strathclyde',
    city: 'Glasgow',
    campus: 'Glasgow',
    website: 'https://www.strath.ac.uk',
    type: 'public',
  },
  surrey: {
    name: 'University of Surrey',
    city: 'Guildford',
    campus: 'Stag Hill',
    website: 'https://www.surrey.ac.uk',
    type: 'public',
  },
  sussex: {
    name: 'University of Sussex',
    city: 'Brighton',
    campus: 'Brighton',
    website: 'https://www.sussex.ac.uk',
    type: 'public',
  },
};

/**
 * The 24 course rows, verbatim from the client's listings.
 *   level          -> stored on the university program as `degree`
 *   degreeLevel    -> canonical Course enum: bachelor | master | phd | diploma | certificate
 *   isFreeToApply  -> the "Free to apply" badge, i.e. an application fee of £0.00
 *   scholarship    -> the "Scholarship" badge
 */
const COURSES = [
  {
    institution: 'aru-writtle',
    name: 'BSc (Hons) Equine Performance Science',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Animal Science',
    tuition: '£17,500',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'aru-london',
    name: 'MSc Accounting and Financial Management',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Business',
    tuition: '£18,600',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'September/October 2027, January/February 2027',
  },
  {
    institution: 'aston',
    name: 'PgDip/MSc Postgraduate Diploma for Overseas Pharmacists (OSPAP)',
    level: 'Postgraduate',
    degreeLevel: 'diploma',
    category: 'Health',
    tuition: '£14,950',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'September/October 2027',
  },
  {
    institution: 'coventry',
    name: 'Law with International Legal Study (Top up) LLB',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Law',
    tuition: '£16,800',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'January/February 2027, March/April 2027',
  },
  {
    institution: 'napier',
    name: 'MSc User Experience Design F/T',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Design',
    tuition: '£22,290',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '12–18 Months',
    intake: 'September/October 2027, January/February 2027',
  },
  {
    institution: 'ljmu',
    name: 'Accounting and Finance, BSc (Hons)',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Business',
    tuition: '£17,750',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'newcastle',
    name: 'Accounting and Finance BSc Honours',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Business',
    tuition: '£25,750',
    applicationFee: '£29',
    isFreeToApply: false,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'northeastern-london',
    name: 'MSc Artificial Intelligence and Engineering and Systems',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Technology',
    tuition: '£25,522',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: false,
    duration: '1 Year',
    intake: 'September/October 2027',
  },
  {
    institution: 'northumbria',
    name: 'Advanced Computer Science MSc',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Technology',
    tuition: '£21,500',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '16 Months',
    intake: 'September/October 2027, January/February 2027',
  },
  {
    institution: 'oxford-brookes',
    name: 'Architecture (Parts 1 and 2) - MArch',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Architecture',
    tuition: '£18,250',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '4 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'regents',
    name: 'Business and Sustainability BA (Hons)',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Business',
    tuition: '£25,000',
    applicationFee: '£35',
    isFreeToApply: false,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'uea',
    name: 'BSc (Hons) Accounting & Finance',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Business',
    tuition: '£23,100',
    applicationFee: '£35',
    isFreeToApply: false,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'uel',
    name: 'LLM Business and Financial Law with Placement',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Law',
    tuition: '£20,720',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '2 Years',
    intake: 'September/October 2027, May/June 2027',
  },
  {
    institution: 'exeter',
    name: 'MSc Accounting and Taxation',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Business',
    tuition: '£25,550',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'September/October 2027',
  },
  {
    institution: 'greenwich',
    name: 'Accounting and Business Analytics, BA (Hons)',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Business',
    tuition: '£17,975',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'hull-london',
    name: 'MSc Artificial Intelligence and Data Science (3 Trimesters)',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Technology',
    tuition: '£18,000',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'January/February 2027, September/October 2027',
  },
  {
    institution: 'leicester',
    name: 'Aerospace Engineering MSc',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Engineering',
    tuition: '£24,250',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '12–16 Months',
    intake: 'September/October 2027, January/February 2027',
  },
  {
    institution: 'liverpool',
    name: 'Aerospace Engineering MEng',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Engineering',
    tuition: '£32,000',
    applicationFee: '£35',
    isFreeToApply: false,
    scholarship: true,
    duration: '4 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'strathclyde',
    name: 'MSc International Banking and Finance',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Business',
    tuition: '£31,900',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'September/October 2027',
  },
  {
    institution: 'surrey',
    name: 'Accounting and Finance MSc FT',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Business',
    tuition: '£25,900',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'September/October 2027, January/February 2027',
  },
  {
    institution: 'sussex',
    name: 'Accounting and Finance BSc (Hons)',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Business',
    tuition: '£23,500',
    applicationFee: '£29',
    isFreeToApply: false,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'aru-writtle',
    name: 'BSc (Hons) Equine Performance and Business Management',
    level: 'Undergraduate',
    degreeLevel: 'bachelor',
    category: 'Business',
    tuition: '£17,500',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '3 Years',
    intake: 'September/October 2027',
  },
  {
    institution: 'aru-london',
    name: 'MSc International Project Management',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Business',
    tuition: '£19,500',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'September/October 2027, January/February 2027',
  },
  {
    institution: 'aston',
    name: 'MSc Business and Management (September)',
    level: 'Postgraduate',
    degreeLevel: 'master',
    category: 'Business',
    tuition: '£23,500',
    applicationFee: '£0.00',
    isFreeToApply: true,
    scholarship: true,
    duration: '1 Year',
    intake: 'September/October 2027',
  },
];

/** Fee strings are all "£17,500" shaped, so a numeric sort gives the range. */
const feeValue = (fee) => Number(String(fee).replace(/[^0-9.]/g, '')) || 0;

const tuitionRangeFor = (rows) => {
  const fees = rows.map((r) => r.tuition).sort((a, b) => feeValue(a) - feeValue(b));
  const low = fees[0];
  const high = fees[fees.length - 1];
  return low === high ? low : `${low} – ${high}`;
};

/** Descriptions name only what the listings themselves assert — no invented rankings. */
const describe = (institution, rows) => {
  const programmes = rows.map((r) => r.name).join('; ');
  const campus = institution.campus === institution.city ? institution.city : institution.campus;
  return `${institution.name} is a UK institution based in ${campus}. Programmes listed for the 2027 intake: ${programmes}.`;
};

const buildUniversity = (key, rows) => {
  const institution = INSTITUTIONS[key];
  const description = describe(institution, rows);
  const features = [];
  if (rows.some((r) => r.isFreeToApply)) features.push('Free to apply');
  if (rows.some((r) => r.scholarship)) features.push('Scholarship available');

  return {
    name: institution.name,
    country: UK,
    seo: makeSeoFromEntity({ type: 'university', name: institution.name, country: UK }),
    city: institution.city,
    website: institution.website,
    type: institution.type,
    shortDescription: description.slice(0, 300),
    description,
    programs: rows.map((r) => ({
      name: r.name,
      degree: r.level,
      duration: r.duration,
      tuition: r.tuition,
      intake: r.intake,
    })),
    scholarships: rows.some((r) => r.scholarship) ? [{ name: 'Scholarship available' }] : [],
    tuitionRange: tuitionRangeFor(rows),
    features,
    isFeatured: false,
    isActive: true,
  };
};

const buildCourse = (row, universityId) => ({
  name: row.name,
  seo: makeSeoFromEntity({ type: 'course', name: row.name, country: UK }),
  category: row.category,
  degreeLevel: row.degreeLevel,
  countries: [UK],
  universities: [universityId],
  tuitionRange: row.tuition,
  applicationFee: row.applicationFee,
  isFreeToApply: row.isFreeToApply,
  scholarshipAvailable: row.scholarship,
  duration: row.duration,
  intake: row.intake,
  isFeatured: false,
  isActive: true,
});

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected.');

    // Group the course rows under their institution, preserving listing order.
    const grouped = new Map();
    for (const row of COURSES) {
      if (!INSTITUTIONS[row.institution]) {
        throw new Error(`Course "${row.name}" references unknown institution "${row.institution}"`);
      }
      if (!grouped.has(row.institution)) grouped.set(row.institution, []);
      grouped.get(row.institution).push(row);
    }

    let unisAdded = 0;
    let unisExisting = 0;
    let coursesAdded = 0;
    let coursesExisting = 0;

    for (const [key, rows] of grouped) {
      const data = buildUniversity(key, rows);
      let university = await University.findOne({ name: data.name });

      if (university) {
        unisExisting++;
        console.log(`  · university exists, left untouched: ${data.name}`);
      } else {
        university = new University(data);
        // save() rather than findOneAndUpdate so the pre-save hook assigns a slug.
        await university.save();
        unisAdded++;
        console.log(`  + university added: ${data.name} (${rows.length} programme${rows.length > 1 ? 's' : ''})`);
      }

      for (const row of rows) {
        const existing = await Course.findOne({ name: row.name, universities: university._id });
        if (existing) {
          coursesExisting++;
          console.log(`      · course exists, skipped: ${row.name}`);
          continue;
        }
        await new Course(buildCourse(row, university._id)).save();
        coursesAdded++;
        console.log(`      + course added: ${row.name}`);
      }
    }

    const [uniTotal, courseTotal] = await Promise.all([
      University.countDocuments(),
      Course.countDocuments(),
    ]);

    console.log('\nSummary');
    console.log(`  universities: ${unisAdded} added, ${unisExisting} already present`);
    console.log(`  courses:      ${coursesAdded} added, ${coursesExisting} already present`);
    console.log(`  collection totals now: ${uniTotal} universities, ${courseTotal} courses`);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (error) {
    console.error('Import failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  }
};

run();
