/**
 * Additive import of two Irish universities and their listed programmes, plus a
 * small enrichment of the existing Ireland destination record.
 *
 * Same contract as the UK / US / Canada scripts: never deletes existing rows,
 * inserts only what is missing, and leaves every other collection untouched.
 *
 *   npm run seed:ie
 *
 * Source: the client's Irish listings for South East Technological University
 * and University College Cork. Notes on how the paste was interpreted:
 *
 * 1. 48 pasted rows became 45 courses. Two rows were byte-for-byte repeats
 *    ("BSc in Architectural Technology", "BSc in Applied Health Care") and one
 *    pair was the same programme under two names — "Master of Science Applied
 *    Sports& Exercise Psychology" and "MSc in Applied Sport and Exercise
 *    Psychology" are both SETU, both postgraduate, both 1 year, both €11,500 —
 *    so they were merged onto the canonical "MSc in Applied Sport and Exercise
 *    Psychology".
 *
 * 2. "BEng in ElectricalEngineering" had lost its space; stored as
 *    "BEng in Electrical Engineering".
 *
 * 3. "South East Technological University (WIT)" is stored under its current
 *    legal name. WIT — Waterford Institute of Technology — is the college SETU
 *    was formed from in 2022, and is named in the description so it stays
 *    findable.
 *
 * Every GBP figure in the paste is the euro value at a flat 0.85, so it is
 * derived rather than hand-copied (10,250 -> £8,713; 23,500 -> £19,975).
 */
import dotenv from 'dotenv';
dotenv.config();

import connectDB, { sequelize } from '../server/config/db.js';
import University from '../server/models/University.js';
import Course from '../server/models/Course.js';
import { makeSeoFromEntity } from '../server/utils/seoDefaults.js';
import Destination from '../server/models/Destination.js';

const IE = 'Ireland';
const INTAKE = 'September/October 2027';
const GBP_RATE = 0.85;

const money = (n) => `€${n.toLocaleString('en-IE')}`;
const feeLabel = (n) => `${money(n)} (£${Math.round(n * GBP_RATE).toLocaleString('en-GB')})`;

const INSTITUTIONS = {
  setu: {
    name: 'South East Technological University',
    city: 'Waterford',
    website: 'https://www.setu.ie',
    founded: '2022',
    shortDescription:
      'Public technological university in the south-east of Ireland, formed in 2022 from Waterford Institute of Technology and Institute of Technology Carlow.',
    description:
      "South East Technological University (SETU) is a public technological university in Ireland, established on 1 May 2022 through the merger of Waterford Institute of Technology (WIT) and Institute of Technology Carlow. Ireland's fifth technological university and the only university in the south-east, it is multi-campus, with locations including Waterford, Carlow, Wexford and Wicklow. Programmes listed for the 2027 intake span engineering, computing, science, health, business, sport and the arts.",
    features: ['Technological University', 'Multi-campus', 'Free to apply', 'Scholarship available'],
  },
  ucc: {
    name: 'University College Cork',
    city: 'Cork',
    website: 'https://www.ucc.ie',
    shortDescription:
      'Public university in Cork, Ireland, and a constituent university of the National University of Ireland.',
    description:
      'University College Cork (UCC) is a public university in Cork, Ireland, and a constituent university of the National University of Ireland. The programme listed here for the 2027 intake is BSc (Hons) Genetics.',
    features: ['Public Research University'],
  },
};

const COLLEGE_DEFAULTS = {
  setu: { applicationFee: '€0.00', isFreeToApply: true, scholarship: true },
  ucc: { applicationFee: '€50', isFreeToApply: false, scholarship: false },
};

/** level: 'UG' -> bachelor, 'PG' -> master. */
const LEVEL_TO_ENUM = { UG: 'bachelor', PG: 'master' };
const LEVEL_LABEL = { UG: 'Undergraduate', PG: 'Postgraduate' };

const c = (name, level, fee, years, category) => ({ name, level, fee, duration: `${years} Year${years > 1 ? 's' : ''}`, category });

const COURSES = {
  /** 44 programmes after dropping two exact repeats and merging one name pair. */
  setu: [
    c('Bachelor of Arts (Hons)', 'UG', 10250, 3, 'Arts & Humanities'),
    c('MEng in Electronic Engineering', 'PG', 10500, 1, 'Engineering'),
    c('BSc (Hons) in Sports Coaching and Performance', 'UG', 10250, 4, 'Sport'),
    c('BSc (Hons) in Computer Forensics and Security', 'UG', 10250, 4, 'Technology'),
    c('BSc (Hons) in Agricultural Science', 'UG', 10250, 4, 'Agriculture'),
    c('MSc in Computing (Enterprise Software Systems)', 'PG', 10500, 1, 'Technology'),
    c('BSc (Hons) in Software Systems Development', 'UG', 10250, 4, 'Technology'),
    c('BSc (Hons) in Creative Computing', 'UG', 10250, 4, 'Technology'),
    c('BSc (Hons) in Information Technology Management', 'UG', 10250, 1, 'Technology'),
    c('MA in Arts and Heritage Management', 'PG', 11500, 1, 'Arts & Humanities'),
    c('BSc (Hons) in Land Management in Agriculture', 'UG', 10250, 1, 'Agriculture'),
    c('BA (Hons) in Social Science', 'UG', 10250, 3, 'Social Science'),
    c('BEng (Hons) in Sustainable Energy Engineering', 'UG', 10250, 4, 'Engineering'),
    c('BA (Hons) in Social Care Practice', 'UG', 10250, 4, 'Social Science'),
    c('MA in Social Studies', 'PG', 11500, 2, 'Social Science'),
    c('BEng (Hons) in Sustainable Civil Engineering', 'UG', 10250, 4, 'Engineering'),
    c('MA in Applied Spirituality', 'PG', 11500, 1, 'Arts & Humanities'),
    c('BEng (Hons) in Mechanical and Manufacturing Engineering', 'UG', 10250, 4, 'Engineering'),
    c('BA (Hons) in Early Childhood Studies', 'UG', 10250, 3, 'Education'),
    c('BEng (Hons) in Electronic Engineering', 'UG', 10250, 4, 'Engineering'),
    c('BA (Hons) in Music', 'UG', 10250, 4, 'Arts & Humanities'),
    c('LLB Bachelor of Laws', 'UG', 10250, 3, 'Law'),
    c('BEng (Hons) in Electrical Engineering', 'UG', 10250, 4, 'Engineering'),
    c('Bachelor of Engineering (Hons) Common Entry', 'UG', 10250, 4, 'Engineering'),
    c('BSc (Hons) in Applied Computing (Internet of Things)', 'UG', 10250, 4, 'Technology'),
    c('BEng in Electronic Engineering', 'UG', 10250, 3, 'Engineering'),
    c('BEng in Electrical Engineering', 'UG', 10250, 3, 'Engineering'),
    c('BEng in Civil Engineering', 'UG', 10250, 3, 'Engineering'),
    c('BSc in Architectural Technology', 'UG', 10250, 3, 'Built Environment'),
    c('MSc in Global Financial Information Systems (GFIS)', 'PG', 11500, 1, 'Business'),
    c('BSc (Hons) in Health Sciences (Common Entry)', 'UG', 10250, 4, 'Health'),
    c('BSc in Applied Health Care', 'UG', 10250, 3, 'Health'),
    c('BSc (Hons) in Psychiatric Nursing', 'UG', 10250, 4, 'Health'),
    c('BSc (Hons) in Intellectual Disability Nursing', 'UG', 10250, 4, 'Health'),
    c('MSc in Applied Sport and Exercise Psychology', 'PG', 11500, 1, 'Sport'),
    c('Bachelor of Architecture (Hons)', 'UG', 10250, 5, 'Built Environment'),
    c('BSc (Hons) in Applied Computing (Games Development)', 'UG', 10250, 4, 'Technology'),
    c('BSc (Hons) in Physics for Modern Technology', 'UG', 10250, 4, 'Science'),
    c('BSc (Hons) in Exercise Sciences (Common Entry)', 'UG', 10250, 4, 'Sport'),
    c('MSc in Innovative Technology Engineering', 'PG', 10500, 1, 'Engineering'),
    c('BSc (Hons) in Applied Computing (Media Development)', 'UG', 10250, 4, 'Technology'),
    c('BSc (Hons) in General Nursing', 'UG', 10250, 4, 'Health'),
    c('MSc in Construction Project Management', 'PG', 10500, 1, 'Built Environment'),
    c('MSc in Sustainable Energy Engineering', 'PG', 10500, 1, 'Engineering'),
  ],

  /** The single Cork listing carried no Scholarship or Free-to-apply badge, and a €50 fee. */
  ucc: [c('BSc (Hons) Genetics', 'UG', 23500, 4, 'Science')],
};

/**
 * Ireland already exists as a destination. These two institutions are appended to
 * its `popularUniversities` so the destination page reflects what the site now
 * lists. Existing entries are left alone and re-running adds nothing.
 */
const DESTINATION_ADDITIONS = [
  { name: 'South East Technological University', programs: ['Engineering', 'Computing', 'Science', 'Sport', 'Business'] },
  { name: 'University College Cork', programs: ['Genetics', 'Science'] },
];

/**
 * A university with one fee has no range to show, so the min/max collapse to the
 * single figure rather than reading back as "€23,500 - €23,500".
 */
const tuitionRangeFor = (fees) => {
  const low = money(Math.min(...fees));
  const high = money(Math.max(...fees));
  return low === high ? low : `${low} - ${high} per year`;
};

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
      let university = await University.findOne({ where: { name: institution.name } });

      if (university) {
        unisExisting++;
        console.log(`  · university exists, left untouched: ${institution.name}`);
      } else {
        university = await University.create({
          seo: makeSeoFromEntity({ type: 'university', name: institution.name, country: IE }),
          name: institution.name,
          country: IE,
          city: institution.city,
          website: institution.website,
          type: 'public',
          founded: (institution as any).founded || undefined,
          shortDescription: institution.shortDescription,
          description: institution.description,
          programs: rows.map((r) => ({
            name: r.name,
            degree: LEVEL_LABEL[r.level],
            duration: r.duration,
            tuition: money(r.fee),
            intake: INTAKE,
          })),
          scholarships: defaults.scholarship ? [{ name: 'Scholarship available' }] : [],
          tuitionRange: tuitionRangeFor(fees),
          features: institution.features,
          isFeatured: false,
          isActive: true,
        });
        // create() rather than an update so the beforeCreate hook assigns a slug.
        unisAdded++;
        console.log(`  + university added: ${institution.name} (${rows.length} programmes)`);
      }

      for (const row of rows) {
        const found = await Course.findOne({
          where: { name: row.name },
          include: [{ model: University, as: 'universities', where: { id: university.id }, attributes: [], required: true }],
        });
        if (found) {
          coursesExisting++;
          continue;
        }

        const { universities, ...courseData } = {
          seo: makeSeoFromEntity({ type: 'course', name: row.name, country: IE }),
          name: row.name,
          category: row.category,
          degreeLevel: LEVEL_TO_ENUM[row.level],
          countries: [IE],
          universities: [university.id],
          tuitionRange: feeLabel(row.fee),
          applicationFee: defaults.applicationFee,
          isFreeToApply: defaults.isFreeToApply,
          scholarshipAvailable: defaults.scholarship,
          duration: row.duration,
          intake: INTAKE,
          isFeatured: false,
          isActive: true,
        };
        const course = await Course.create(courseData);
        await course.setUniversities(universities);

        coursesAdded++;
      }
    }

    // Destination enrichment.
    const destination = await Destination.findOne({ where: { name: IE } });
    if (!destination) {
      console.log(`  ! no "${IE}" destination found — skipping enrichment`);
    } else {
      const existing = new Set((destination.popularUniversities || []).map((u) => u.name));
      const toAdd = DESTINATION_ADDITIONS.filter((u) => !existing.has(u.name));
      if (toAdd.length) {
        destination.popularUniversities = [...(destination.popularUniversities || []), ...toAdd];
        await destination.save();
        console.log(`  + ${IE} destination: added ${toAdd.map((u) => u.name).join(', ')} to popular universities`);
      } else {
        console.log(`  · ${IE} destination already lists both institutions`);
      }
      console.log(`    destination: code=${destination.code} flag=${destination.flag} slug=${destination.slug} active=${destination.isActive}`);
      console.log(`    popular universities now: ${destination.popularUniversities.map((u) => u.name).join(', ')}`);
    }

    const [uniTotal, courseTotal] = await Promise.all([
      University.count(),
      Course.count(),
    ]);

    console.log('\nSummary');
    console.log(`  universities: ${unisAdded} added, ${unisExisting} already present`);
    console.log(`  courses:      ${coursesAdded} added, ${coursesExisting} already present`);
    console.log(`  collection totals now: ${uniTotal} universities, ${courseTotal} courses`);
    console.log(`  source rows: 48 pasted -> ${COURSES.setu.length} SETU + ${COURSES.ucc.length} UCC = ${COURSES.setu.length + COURSES.ucc.length} courses`);

    await sequelize.close();
    console.log('Done.');
  } catch (error) {
    console.error('Import failed:', error.message);
    await sequelize.close().catch(() => {});
    process.exitCode = 1;
  }
};

run();
