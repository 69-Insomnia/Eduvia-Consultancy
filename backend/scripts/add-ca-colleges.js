/**
 * Additive import of three Ontario colleges and their listed programmes.
 *
 * Same contract as the UK and US scripts: never deletes existing rows, inserts only
 * what is missing, and leaves every other collection untouched. Safe to re-run.
 *
 *   npm run seed:ca
 *
 * Source: the client's Canadian listings for Lambton College, St. Lawrence
 * College and Canadore College. Notes on how the paste was interpreted:
 *
 * 1. One institution record per college, not per campus. Lambton runs the same
 *    college across Sarnia, Toronto, Ottawa and Mississauga, so each programme
 *    carries its campus in the name ("— Toronto"). St. Lawrence has two
 *    campuses, so its programmes are marked too. Canadore lists a single campus,
 *    so its names are left clean.
 *
 * 2. Four Lambton programmes appeared twice at the same campus with different
 *    fees. Where one of the pair carried the college's own catalogue code, that
 *    entry was kept and the uncoded one dropped:
 *      Advanced Photography (APPS)         CAD 25,543  (dropped: 14,000)
 *      Canadian Culinary Operations (CCOS) CAD 23,050  (dropped: 15,000)
 *      Business - Accounting (ACTG)        CAD 29,188  (dropped: 15,000)
 *      Chemical Laboratory Technician (CLAB) CAD 29,188 (dropped: 14,000)
 *    All four need confirming against the college's current fee schedule — the
 *    client's own disclaimer says the figures are indicative only.
 *
 * 3. "Diploma & Certificate" maps to the schema's `diploma`; a college
 *    "Postgraduate" programme is an Ontario College Graduate Certificate, so it
 *    maps to `certificate`; "Undergraduate" maps to `bachelor`.
 *
 * 24 + 6 + 16 pasted rows, less the 4 dropped duplicates, gives 92 courses.
 */
import dotenv from 'dotenv';
dotenv.config();

import connectDB, { sequelize } from '../src/config/db.js';
import University from '../src/models/University.js';
import Course from '../src/models/Course.js';
import { makeSeoFromEntity } from '../src/utils/seoDefaults.js';

const CA = 'Canada';
const SARNIA = 'Sarnia, Ontario';

const INSTITUTIONS = {
  lambton: {
    name: 'Lambton College',
    city: SARNIA,
    website: 'https://www.lambtoncollege.ca',
    shortDescription:
      'Public college of applied arts and technology based in Sarnia, Ontario, with additional campuses in Toronto, Ottawa and Mississauga.',
    description:
      'Lambton College is a public college of applied arts and technology based in Sarnia, Ontario, with additional campuses in Toronto, Ottawa and Mississauga. Programmes listed for the 2027 intake span skilled trades and engineering technology, business, information technology, health and community services, and hospitality.',
    extraFeatures: ['Free to apply', 'Multiple Ontario campuses'],
  },
  'st-lawrence': {
    name: 'St. Lawrence College',
    city: 'Kingston, Ontario',
    website: 'https://www.stlawrencecollege.ca',
    founded: '1967',
    shortDescription:
      'Public college of applied arts and technology based in Kingston, Ontario, with an additional campus in Cornwall.',
    description:
      'St. Lawrence College is a public college of applied arts and technology based in Kingston, Ontario, with an additional campus in Cornwall. Programmes listed for the 2027 intake cover business, health, biotechnology and media.',
    extraFeatures: [],
  },
  canadore: {
    name: 'Canadore College',
    city: 'North Bay, Ontario',
    website: 'https://www.canadorecollege.ca',
    shortDescription:
      'Public college of applied arts and technology based in North Bay, Ontario. The programmes below are taught at its Commerce Court campus.',
    description:
      'Canadore College is a public college of applied arts and technology based in North Bay, Ontario, where the programmes listed here are taught at its Commerce Court campus. Offerings for the 2027 intake cover business, information technology, engineering technology, health, and culinary arts.',
    extraFeatures: [],
  },
};

/**
 * Shared per-college defaults: an institution's intake, application fee and
 * "Free to apply" badge are the same across all of its rows.
 */
const COLLEGE_DEFAULTS = {
  lambton: {
    applicationFee: 'CAD 0.00',
    isFreeToApply: true,
    intake: 'January/February 2027, May/June 2027',
  },
  'st-lawrence': {
    applicationFee: 'CAD 100',
    isFreeToApply: false,
    intake: 'January/February 2027, September/October 2027',
  },
  canadore: {
    applicationFee: 'CAD 100',
    isFreeToApply: false,
    intake: 'January/February 2027',
  },
};

/** "Diploma & Certificate" -> diploma, "Postgraduate" -> certificate, "Undergraduate" -> bachelor. */
const LEVEL_TO_ENUM = {
  'Diploma & Certificate': 'diploma',
  Postgraduate: 'certificate',
  Undergraduate: 'bachelor',
};

/** `s = true` marks the four rows that carried a "Scholarship" badge. */
const c = (name, level, fee, duration, category, s = false) => ({ name, level, fee, duration, category, scholarship: s });

const COURSES = {
  /*
   * Lambton College — 70 programmes.
   * `campus` is appended to the stored name because the college spans four cities.
   */
  lambton: [
    // Sarnia
    { campus: 'Sarnia', ...c('Millwright Mechanical Technician', 'Diploma & Certificate', 14000, '2 Years', 'Trades & Apprenticeship') },
    { campus: 'Sarnia', ...c('Police Foundations', 'Diploma & Certificate', 16000, '2 Years', 'Community Services') },
    { campus: 'Sarnia', ...c('Power Engineering Techniques (PETQ)', 'Diploma & Certificate', 6611, '1 Year', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Protection, Security and Investigation', 'Diploma & Certificate', 14000, '2 Years', 'Community Services') },
    { campus: 'Sarnia', ...c('Liberal Studies', 'Diploma & Certificate', 16000, '2 Years', 'Arts & Media') },
    { campus: 'Sarnia', ...c('Office Administration - Health Services', 'Diploma & Certificate', 14000, '2 Years', 'Business') },
    { campus: 'Sarnia', ...c('Personal Support Worker (PSWK)', 'Diploma & Certificate', 14637, '1 Year', 'Health') },
    { campus: 'Sarnia', ...c('Quality Engineering Management (QEMS)', 'Postgraduate', 27844, '2 Years', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Recreation Therapy (TREC)', 'Diploma & Certificate', 29188, '2 Years', 'Health') },
    { campus: 'Sarnia', ...c('Renovation Construction Technician (RENT)', 'Diploma & Certificate', 16000, '2 Years', 'Trades & Apprenticeship') },
    { campus: 'Sarnia', ...c('Social Service Worker (SSWK)', 'Diploma & Certificate', 14000, '2 Years', 'Community Services') },
    { campus: 'Sarnia', ...c('Agricultural Automation Technician - Greenhouse System Controls (AGTS)', 'Diploma & Certificate', 30275, '2 Years', 'Agriculture') },
    { campus: 'Sarnia', ...c('Welding Techniques (WELD)', 'Diploma & Certificate', 14000, '1 Year', 'Trades & Apprenticeship') },
    { campus: 'Sarnia', ...c('Sports and Recreation Management (SRAM)', 'Diploma & Certificate', 41748, '3 Years', 'Community Services') },
    { campus: 'Sarnia', ...c('Advanced Photography (APPS)', 'Postgraduate', 25543, '2 Years', 'Arts & Media', true) },
    { campus: 'Sarnia', ...c('Food Safety and Quality Assurance Management (FSQS)', 'Postgraduate', 27360, '2 Years', 'Science') },
    { campus: 'Sarnia', ...c('Hairstylist', 'Diploma & Certificate', 22500, '1 Year', 'Trades & Apprenticeship') },
    { campus: 'Sarnia', ...c('Heating, Refrigeration and Air Conditioning Technician (HVAC)', 'Diploma & Certificate', 30238, '2 Years', 'Trades & Apprenticeship') },
    { campus: 'Sarnia', ...c('Advanced Project Management - Environmental (PMES)', 'Postgraduate', 27607, '2 Years', 'Environmental') },
    { campus: 'Sarnia', ...c('Business - Sustainable Agriculture (BSAS)', 'Diploma & Certificate', 30308, '2 Years', 'Agriculture') },
    { campus: 'Sarnia', ...c('Business - Accounting (ACTG)', 'Diploma & Certificate', 29188, '2 Years', 'Business') },
    { campus: 'Sarnia', ...c('Instrumentation and Control Engineering Technology - Industrial Automation', 'Diploma & Certificate', 24000, '3 Years', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Instrumentation and Control Engineering Technician - Industrial Automation', 'Diploma & Certificate', 14000, '2 Years', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Instrumentation and Control Engineering Technology', 'Diploma & Certificate', 16000, '2 Years', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Developmental Services Worker', 'Diploma & Certificate', 22500, '1 Year', 'Community Services') },
    { campus: 'Sarnia', ...c('Canadian Culinary Operations (CCOS)', 'Postgraduate', 23050, '2 Years', 'Hospitality & Tourism', true) },
    { campus: 'Sarnia', ...c('Early Childhood Education (ECEP)', 'Diploma & Certificate', 14000, '2 Years', 'Education') },
    { campus: 'Sarnia', ...c('Chemical Laboratory Technician (CLAB)', 'Diploma & Certificate', 29188, '2 Years', 'Science') },
    { campus: 'Sarnia', ...c('Occupational Health and Safety Management (OHST)', 'Postgraduate', 17000, '2 Years', 'Health') },
    { campus: 'Sarnia', ...c('Pharmacy Technician (PHRM)', 'Diploma & Certificate', 29613, '2 Years', 'Health') },
    { campus: 'Sarnia', ...c('Office Administration - Executive', 'Diploma & Certificate', 14000, '2 Years', 'Business') },
    { campus: 'Sarnia', ...c('Photography', 'Diploma & Certificate', 16000, '2 Years', 'Arts & Media') },
    { campus: 'Sarnia', ...c('Office Administration - General', 'Diploma & Certificate', 16000, '1 Year', 'Business') },
    { campus: 'Sarnia', ...c('Occupational Therapist Assistant and Physiotherapist Assistant (OPTA)', 'Diploma & Certificate', 14000, '2 Years', 'Health') },
    { campus: 'Sarnia', ...c('Business Administration - Accounting', 'Diploma & Certificate', 14000, '3 Years', 'Business') },
    { campus: 'Sarnia', ...c('Chemical Production and Power Engineering Technology - Accelerated (CPEX)', 'Diploma & Certificate', 35624, '2 Years', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Child and Youth Care (CYCP)', 'Diploma & Certificate', 14000, '3 Years', 'Community Services') },
    { campus: 'Sarnia', ...c('Construction Project Management (CPMS)', 'Postgraduate', 27454, '2 Years', 'Business') },
    { campus: 'Sarnia', ...c('Construction Carpentry Techniques (CACT)', 'Diploma & Certificate', 14000, '1 Year', 'Trades & Apprenticeship') },
    { campus: 'Sarnia', ...c('Chemical Production and Power Engineering Technology (CPET)', 'Diploma & Certificate', 53393, '3 Years', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Cyber Infrastructure Specialist', 'Postgraduate', 17000, '2 Years', 'Technology') },
    { campus: 'Sarnia', ...c('Electrical Engineering Technician - Power Protection and Control', 'Diploma & Certificate', 15000, '2 Years', 'Engineering Technology') },
    { campus: 'Sarnia', ...c('Electrical Techniques (ELTC)', 'Diploma & Certificate', 14000, '1 Year', 'Trades & Apprenticeship') },
    { campus: 'Sarnia', ...c('Global Business Management (GBBO)', 'Postgraduate', 27547, '2 Years', 'Business') },
    { campus: 'Sarnia', ...c('Environmental Technician - Water and Wastewater Systems Operations (EWSO)', 'Diploma & Certificate', 25364, '2 Years', 'Environmental') },
    { campus: 'Sarnia', ...c('Esports Entrepreneurship and Administration', 'Diploma & Certificate', 14000, '2 Years', 'Business') },
    { campus: 'Sarnia', ...c('Interprofessional Practice - Gerontology (IPGS)', 'Postgraduate', 30646, '2 Years', 'Health') },
    { campus: 'Sarnia', ...c('Business Administration', 'Diploma & Certificate', 14000, '3 Years', 'Business') },
    { campus: 'Sarnia', ...c('Business Management - International Business (BMIB)', 'Postgraduate', 23050, '2 Years', 'Business') },
    // Multi-campus
    { campus: 'Sarnia / Mississauga', ...c('Tourism – Operations Management (TMAN)', 'Diploma & Certificate', 23050, '2 Years', 'Hospitality & Tourism') },
    { campus: 'Sarnia / Toronto / Mississauga', ...c('Business Management - Human Resources (BMHT)', 'Postgraduate', 17000, '2 Years', 'Business') },
    { campus: 'Sarnia / Mississauga', ...c('E-Learning Design and Training Development', 'Postgraduate', 17000, '2 Years', 'Technology') },
    { campus: 'Sarnia / Toronto / Mississauga', ...c('Advanced Project Management and Strategic Leadership (PMLT)', 'Postgraduate', 17000, '2 Years', 'Business') },
    // Toronto
    { campus: 'Toronto', ...c('Mobile Application Design and Development', 'Postgraduate', 18000, '2 Years', 'Technology') },
    { campus: 'Toronto', ...c('Advanced Health Care Leadership', 'Postgraduate', 16000, '2 Years', 'Health') },
    { campus: 'Toronto', ...c('Chemical Laboratory Analysis', 'Postgraduate', 18000, '2 Years', 'Science') },
    { campus: 'Toronto', ...c('DevOps for Cloud Computing', 'Postgraduate', 18000, '2 Years', 'Technology') },
    { campus: 'Toronto', ...c('Business (BSNT)', 'Diploma & Certificate', 17000, '2 Years', 'Business') },
    { campus: 'Toronto', ...c('Quality Engineering Management (QEMT)', 'Diploma & Certificate', 9340, '1 Year', 'Engineering Technology') },
    // Ottawa
    { campus: 'Ottawa', ...c('Financial Planning and Wealth Management (FPWO)', 'Postgraduate', 28634, '2 Years', 'Business') },
    { campus: 'Ottawa', ...c('Hospitality Management (HMAN)', 'Postgraduate', 27760, '2 Years', 'Hospitality & Tourism', true) },
    { campus: 'Ottawa', ...c('Advanced Project Management and Strategy Leadership (PMLO)', 'Postgraduate', 27405, '2 Years', 'Business') },
    { campus: 'Ottawa', ...c('Artificial Intelligence and Machine Learning (AIMO)', 'Postgraduate', 27105, '2 Years', 'Technology') },
    // Mississauga
    { campus: 'Mississauga', ...c('Wireless Networking', 'Postgraduate', 18000, '2 Years', 'Technology') },
    { campus: 'Mississauga', ...c('Hotel and Resort Management', 'Postgraduate', 17000, '2 Years', 'Hospitality & Tourism') },
    { campus: 'Mississauga', ...c('International Business', 'Diploma & Certificate', 16000, '2 Years', 'Business') },
    { campus: 'Mississauga', ...c('Business Development and B2B Sales', 'Postgraduate', 17000, '2 Years', 'Business') },
    { campus: 'Mississauga', ...c('Computer Programmer (CPCM)', 'Diploma & Certificate', 16000, '2 Years', 'Technology') },
    { campus: 'Mississauga', ...c('Cyber Security and Computer Forensics', 'Postgraduate', 18000, '2 Years', 'Technology') },
    // Ottawa / Mississauga
    { campus: 'Ottawa / Mississauga', ...c('Supply Chain Management (SCMO)', 'Postgraduate', 27817, '2 Years', 'Business') },
  ],

  /** St. Lawrence College — 6 programmes across Kingston and Cornwall. */
  'st-lawrence': [
    { campus: 'Kingston', ...c('Advertising and Marketing Communications (0263)', 'Diploma & Certificate', 19724, '2 Years', 'Arts & Media') },
    { campus: 'Kingston', ...c('Bachelor of Business Administration (1043)', 'Undergraduate', 23714, '4 Years', 'Business') },
    { campus: 'Kingston', ...c('Biotechnology Advanced (0437)', 'Diploma & Certificate', 18234, '3 Years', 'Science') },
    { campus: 'Kingston', ...c('Business (0295)', 'Diploma & Certificate', 18234, '2 Years', 'Business') },
    { campus: 'Kingston', ...c('Business - Accounting (0259)', 'Diploma & Certificate', 18234, '2 Years', 'Business') },
    { campus: 'Cornwall Campus', ...c('Practical Nursing (0491)', 'Diploma & Certificate', 17883, '2 Years', 'Health') },
  ],

  /** Canadore College — 16 programmes, all at the Commerce Court campus. */
  canadore: [
    c('Business (020115)', 'Diploma & Certificate', 17490, '2 Years', 'Business', true),
    c('Business - Accounting (020113)', 'Diploma & Certificate', 16724, '2 Years', 'Business'),
    c('Computer Systems - Networking Technician (020403)', 'Diploma & Certificate', 16707, '2 Years', 'Technology'),
    c('Early Childhood Education (010205)', 'Diploma & Certificate', 17490, '2 Years', 'Education'),
    c('Mechanical Engineering - Technician (030630)', 'Diploma & Certificate', 17490, '2 Years', 'Engineering Technology'),
    c('Public Relations (020112)', 'Diploma & Certificate', 16000, '2 Years', 'Arts & Media'),
    c('Civil Engineering - Technician (030628)', 'Diploma & Certificate', 17490, '2 Years', 'Engineering Technology'),
    c('Culinary Management (020203)', 'Diploma & Certificate', 17457, '2 Years', 'Hospitality & Tourism'),
    c('Human Resources Management (020149)', 'Postgraduate', 17490, '1 Year', 'Business'),
    c('Project Management - Information Technology (020409)', 'Postgraduate', 17490, '1 Year', 'Technology'),
    c('Logistics And Supply Chain Management (020150)', 'Postgraduate', 17490, '1 Year', 'Business'),
    c('Business Management (020122)', 'Postgraduate', 16707, '1 Year', 'Business'),
    c('Health Care Administration (040109)', 'Postgraduate', 17490, '1 Year', 'Health'),
    c('Construction Project Management (030620)', 'Postgraduate', 17490, '1 Year', 'Business'),
    c('Mobile Application Development', 'Postgraduate', 14600, '1 Year', 'Technology'),
    c('Culinary Skills - Chef Training (020212)', 'Diploma & Certificate', 18290, '1 Year', 'Hospitality & Tourism'),
  ],
};

/** 14000 -> "CAD 14,000" */
const money = (n) => `CAD ${n.toLocaleString('en-CA')}`;

/**
 * Every GBP figure in the client's paste is the CAD value at a flat 0.58 rate,
 * rounded (14,000 -> £8,120; 41,748 -> £24,214; 6,611 -> £3,834). Deriving it
 * reproduces all of them without hand-copying 92 conversions.
 */
const GBP_RATE = 0.58;
const feeLabel = (n) => `${money(n)} (£${Math.round(n * GBP_RATE).toLocaleString('en-CA')})`;

/** Displayed name carries the campus, since a college can span several cities. */
const storedName = (college, row) =>
  college === 'canadore' || !row.campus ? row.name : `${row.name} — ${row.campus}`;

const run = async () => {
  try {
    await connectDB();
    console.log('PostgreSQL connected.');

    let unisAdded = 0;
    let unisExisting = 0;
    let coursesAdded = 0;
    let coursesExisting = 0;

    for (const [key, institution] of Object.entries(INSTITUTIONS)) {
      const rows = COURSES[key];
      const defaults = COLLEGE_DEFAULTS[key];
      const fees = rows.map((r) => r.fee);
      let college = await University.findOne({ where: { name: institution.name } });

      if (college) {
        unisExisting++;
        console.log(`  · college exists, left untouched: ${institution.name}`);
      } else {
        const features = [...institution.extraFeatures];
        if (rows.some((r) => r.scholarship)) features.push('Scholarship available');

        college = await University.create({
          seo: makeSeoFromEntity({ type: 'university', name: institution.name, country: CA }),
          name: institution.name,
          country: CA,
          city: institution.city,
          website: institution.website,
          // Ontario colleges are publicly funded; the schema's enum is public|private.
          type: 'public',
          founded: institution.founded || undefined,
          shortDescription: institution.shortDescription,
          description: institution.description,
          programs: rows.map((r) => ({
            name: storedName(key, r),
            degree: r.level,
            duration: r.duration,
            tuition: money(r.fee),
            intake: defaults.intake,
          })),
          scholarships: rows.some((r) => r.scholarship) ? [{ name: 'Scholarship available' }] : [],
          tuitionRange: `${money(Math.min(...fees))} - ${money(Math.max(...fees))} per year`,
          features,
          isFeatured: false,
          isActive: true,
        });
        // create() rather than an update so the beforeCreate hook assigns a slug.
        unisAdded++;
        console.log(`  + college added: ${institution.name} (${rows.length} programmes)`);
      }

      for (const row of rows) {
        const name = storedName(key, row);
        const found = await Course.findOne({
          where: { name },
          include: [{ model: University, as: 'universities', where: { id: college.id }, attributes: [], required: true }],
        });
        if (found) {
          coursesExisting++;
          continue;
        }

        const { universities, ...courseData } = {
          seo: makeSeoFromEntity({ type: 'course', name, country: CA }),
          name,
          category: row.category,
          degreeLevel: LEVEL_TO_ENUM[row.level],
          countries: [CA],
          universities: [college.id],
          tuitionRange: feeLabel(row.fee),
          applicationFee: defaults.applicationFee,
          isFreeToApply: defaults.isFreeToApply,
          scholarshipAvailable: row.scholarship,
          duration: row.duration,
          intake: defaults.intake,
          isFeatured: false,
          isActive: true,
        };
        const course = await Course.create(courseData);
        await course.setUniversities(universities);

        coursesAdded++;
      }

      console.log(`      ${rows.length} programmes processed | ${institution.description.length} char description`);
    }

    const [uniTotal, courseTotal] = await Promise.all([
      University.count(),
      Course.count(),
    ]);

    console.log('\nSummary');
    console.log(`  colleges: ${unisAdded} added, ${unisExisting} already present`);
    console.log(`  courses:  ${coursesAdded} added, ${coursesExisting} already present`);
    console.log(`  collection totals now: ${uniTotal} universities, ${courseTotal} courses`);

    for (const key of Object.keys(COURSES)) {
      console.log(`  ${INSTITUTIONS[key].name}: ${COURSES[key].length} rows in source`);
    }

    await sequelize.close();
    console.log('Done.');
  } catch (error) {
    console.error('Import failed:', error.message);
    await sequelize.close().catch(() => {});
    process.exitCode = 1;
  }
};

run();
