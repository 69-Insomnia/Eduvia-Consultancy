/**
 * Additive import of University of Arizona and its listed undergraduate degrees.
 *
 * Same contract as `add-uk-universities.js`: never deletes existing rows, inserts
 * only what is missing, and leaves every other collection untouched. Safe to
 * re-run — anything already present is skipped, so admin edits survive.
 *
 *   npm run seed:us
 *
 * Source: the client's Arizona listings. The paste repeated the same 24 rows
 * three times and carried four different spellings of the same award ("BS in",
 * "Bs in", "Bachelor of Science in", "Bachelors of Science in"), so the names
 * below are normalised to "Bachelor of Science in <Subject>" and the three
 * genuinely garbled subjects use the university's own programme names, verified
 * against the UArizona catalogue:
 *
 *   "Bio Informatics :Computer Science Emphasis"   -> Bioinformatics: Computer Science Emphasis
 *   "Bio system Analytic and Technology"           -> Biosystems Analytics and Technology
 *   "Health Science in Physiology and Medical ..." -> Health Sciences: Physiology and Medical Sciences
 *
 * Two rows were the same programme under two names ("Bachelor of Science in
 * Public Health" and "BS in Public Health") and one row repeated verbatim, so
 * 24 pasted rows collapse to 22 distinct degrees.
 */
import dotenv from 'dotenv';
dotenv.config();

import connectDB, { sequelize } from '../server/config/db.js';
import University from '../server/models/University.js';
import Course from '../server/models/Course.js';
import { makeSeoFromEntity } from '../server/utils/seoDefaults.js';

const US = 'United States';

const INSTITUTION = {
  name: 'University of Arizona',
  country: US,
  city: 'Tucson, Arizona',
  website: 'https://www.arizona.edu',
  type: 'public',
  founded: '1885',
  // A real campus photograph, vendored to /public/universities/. See
  // UNIVERSITY_IMAGES in frontend/src/utils/imageAssets.js — it is CC BY 4.0
  // and needs a credit line where it is displayed.
  coverImage: '/universities/university-of-arizona.jpg',
  // Deliberately empty: a university crest is not something to substitute with
  // stock art. Upload the official mark through the admin panel.
  logo: '',
  shortDescription:
    'Public land-grant research university in Tucson, Arizona, chartered in 1885. An Association of American Universities member and Research 1 institution, strong in astronomy, optical sciences, water resources, and agriculture.',
  description:
    'The University of Arizona is a public land-grant research university in Tucson, Arizona. Chartered in 1885 — twenty-seven years before Arizona became a state — it is a member of the Association of American Universities and is classified as a Research 1 institution. Its recognised strengths include astronomy and space sciences, optical sciences, water and environmental science, and agriculture and life sciences; it is also a space-grant institution and operates two independently accredited medical schools. The degrees listed here for the 2027 intake span the sciences, health, agriculture, and public policy.',
  features: [
    'Land-Grant Institution',
    'Association of American Universities Member',
    'Research 1 University',
    'Astronomy & Space Sciences',
    'Optical Sciences',
    'Water & Environmental Science',
    'Agriculture & Life Sciences',
    'Scholarship available',
  ],
  isFeatured: false,
  isActive: true,
};

/** All rows share the same fee, duration, intake and scholarship badge. */
const COURSES = [
  { name: 'Bachelor of Science in Hydrology and Atmospheric Science', category: 'Environmental Science' },
  { name: 'Bachelor of Science in Molecular and Cellular Biology', category: 'Science' },
  { name: 'Bachelor of Science in Bioinformatics: Computer Science Emphasis', category: 'Technology' },
  { name: 'Bachelor of Science in Statistics and Data Science', category: 'Technology' },
  { name: 'Bachelor of Science in Neuroscience and Cognitive Science', category: 'Science' },
  { name: 'Bachelor of Science in Astronomy', category: 'Science' },
  { name: 'Bachelor of Science in Agribusiness Economics and Management', category: 'Agriculture' },
  { name: 'Bachelor of Science in Public Health', category: 'Health' },
  { name: 'Bachelor of Science in Agricultural Technology Management and Education', category: 'Agriculture' },
  { name: 'Bachelor of Science in Animal Science', category: 'Agriculture' },
  { name: 'Bachelor of Science in Biology', category: 'Science' },
  { name: 'Bachelor of Science in Environmental and Water Resource Economics', category: 'Environmental Science' },
  { name: 'Bachelor of Science in Physics', category: 'Science' },
  { name: 'Bachelor of Science in Agricultural Systems Management', category: 'Agriculture' },
  { name: 'Bachelor of Science in Applied Biotechnology', category: 'Science' },
  { name: 'Bachelor of Science in Applied Physics', category: 'Science' },
  { name: 'Bachelor of Science in Biosystems Analytics and Technology', category: 'Technology' },
  { name: 'Bachelor of Science in Pharmaceutical Science', category: 'Health' },
  { name: 'Bachelor of Science in Health Sciences: Physiology and Medical Sciences', category: 'Health' },
  { name: 'Bachelor of Science in Precision Nutrition and Wellness', category: 'Health' },
  { name: 'Bachelor of Science in Psychological Science', category: 'Science' },
  { name: 'Bachelor of Science in Public Management and Policy', category: 'Public Policy' },
];

const TUITION = '$22,658 (£17,900)';
const APPLICATION_FEE = '$70';
const DURATION = '4 Years';
const INTAKE = 'Spring 2027, Fall 2027';

const run = async () => {
  try {
    await connectDB();
    console.log('PostgreSQL connected.');

    let university = await University.findOne({ where: { name: INSTITUTION.name } });

    if (university) {
      console.log(`  · university exists, left untouched: ${INSTITUTION.name}`);
    } else {
      university = await University.create({
        ...INSTITUTION,
        seo: makeSeoFromEntity({ type: 'university', name: INSTITUTION.name, country: US }),
        programs: COURSES.map((c) => ({
          name: c.name,
          // The program subdocument has no degree-level enum, so this keeps the
          // source's own wording.
          degree: 'Undergraduate',
          duration: DURATION,
          tuition: TUITION,
          intake: INTAKE,
        })),
        scholarships: [{ name: 'Scholarship available' }],
        tuitionRange: TUITION,
      });
      // create() rather than an update so the beforeCreate hook assigns a slug.
      console.log(`  + university added: ${INSTITUTION.name} (${COURSES.length} programmes)`);
    }

    let added = 0;
    let existing = 0;

    for (const course of COURSES) {
      const found = await Course.findOne({
        where: { name: course.name },
        include: [{ model: University, as: 'universities', where: { id: university.id }, attributes: [], required: true }],
      });
      if (found) {
        existing++;
        console.log(`      · course exists, skipped: ${course.name}`);
        continue;
      }

      const { universities, ...courseData } = {
        seo: makeSeoFromEntity({ type: 'course', name: course.name, country: US }),
        name: course.name,
        category: course.category,
        degreeLevel: 'bachelor',
        countries: [US],
        universities: [university.id],
        tuitionRange: TUITION,
        applicationFee: APPLICATION_FEE,
        // No listing in this batch carried the "Free to apply" badge.
        isFreeToApply: false,
        scholarshipAvailable: true,
        duration: DURATION,
        intake: INTAKE,
        isFeatured: false,
        isActive: true,
      };
      const created = await Course.create(courseData);
      await created.setUniversities(universities);

      added++;
      console.log(`      + course added: ${course.name}`);
    }

    const [uniTotal, courseTotal] = await Promise.all([
      University.count(),
      Course.count(),
    ]);

    console.log('\nSummary');
    console.log(`  courses: ${added} added, ${existing} already present`);
    console.log(`  collection totals now: ${uniTotal} universities, ${courseTotal} courses`);
    console.log(`  university slug: ${university.slug}`);

    await sequelize.close();
    console.log('Done.');
  } catch (error) {
    console.error('Import failed:', error.message);
    await sequelize.close().catch(() => {});
    process.exitCode = 1;
  }
};

run();
