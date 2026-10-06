/**
 * Additive import of nine UAE branch campuses and their listed degrees.
 *
 * Same contract as the other batch scripts: never calls deleteMany(), inserts
 * only what is missing, leaves other collections alone. Safe to re-run.
 *
 *   npm run seed:ae
 *
 * Source: the client's UAE listings. 144 pasted rows, 144 courses — no row was
 * a duplicate of another.
 *
 * Notes on how the paste was interpreted:
 *
 * 1. Country is stored as "United Arab Emirates", not "Dubai". The destination
 *    record, the Course Finder's country list and the flag map were renamed to
 *    match (see frontend/src/utils/imageAssets.js and
 *    frontend/src/utils/constants.js). The UAE flag and hero image are unchanged.
 *
 * 2. Each institution here is a single-campus UAE branch, so the campus is held
 *    on the institution record rather than repeated in every course name —
 *    unlike the Australian and Canadian batches, which spanned several cities.
 *
 * 3. Two campus values in the paste were wrong and are not stored:
 *      Hult International Business School - UAE  -> "Nanaimo, Cowichan"
 *        (both are in British Columbia, Canada — nothing to do with the UAE)
 *      University of Bolton Academic Centre      -> "Bolton"
 *        (the UK town; the institution's own name says Ras Al Khaimah, which is
 *        what the institution record uses)
 *
 * 4. Symbiosis pasted bare abbreviations. BBA/BCA/B.Com. were expanded to their
 *    standard awards; "BAMC (Hons)" was left exactly as pasted because its
 *    expansion is not certain.
 *
 * 5. Heriot-Watt's "EngD Energy" is an Engineering Doctorate. The paste labelled
 *    it "Postgraduate", but calling a doctorate a Master's would mislead the
 *    level filter, so it is stored as `phd`. Its AED 9,750 fee — roughly a tenth
 *    of the same institution's other listed fees — looks like a bad figure and
 *    needs confirming.
 *
 * 6. Amity lists both "Bachelor of Business Administration" (AED 45,000) and
 *    "Bachelor of Business Administration (Dubai)" (AED 50,000). Both were kept:
 *    since every Amity programme here is in Dubai, one of them is likely a stray
 *    listing, but there is no code to tell which, so neither was discarded.
 *
 * GBP figures are the AED value at a flat 0.215, derived rather than copied
 * (155,000 -> £33,325; 156,718 -> £33,694).
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import University from '../src/models/University.js';
import Course from '../src/models/Course.js';
import { makeSeoFromEntity } from '../src/utils/seoDefaults.js';

const AE = 'United Arab Emirates';
const GBP_RATE = 0.215;

const money = (n) => `AED ${n.toLocaleString('en-AE')}`;
const feeLabel = (n) => `${money(n)} (£${Math.round(n * GBP_RATE).toLocaleString('en-GB')})`;

const INSTITUTIONS = {
  murdoch: {
    name: 'Murdoch University - UAE',
    city: 'Dubai',
    website: 'https://www.murdoch.edu.au',
    type: 'public',
    intake: 'January/February 2027',
    scholarship: true,
    shortDescription: 'Dubai branch campus of Murdoch University, a public university in Perth, Western Australia.',
    description: 'Murdoch University - UAE is the Dubai branch campus of Murdoch University, a public university based in Perth, Western Australia. Degrees listed for the 2027 intake cover business, communication, information technology, psychology and criminology.',
  },
  heriotwatt: {
    name: 'Heriot-Watt University - UAE',
    city: 'Dubai',
    website: 'https://www.hw.ac.uk',
    type: 'public',
    intake: 'January/February 2027',
    scholarship: true,
    shortDescription: 'Dubai campus of Heriot-Watt University, a public university based in Edinburgh, Scotland.',
    description: 'Heriot-Watt University - UAE is the Dubai campus of Heriot-Watt University, a public university based in Edinburgh, Scotland. Degrees listed for the 2027 intake cover business and management, engineering, actuarial and data science, and fashion.',
  },
  dmu: {
    name: 'De Montfort University - UAE',
    city: 'Dubai',
    website: 'https://www.dmu.ac.uk',
    type: 'public',
    intake: 'January/February 2027, September/October 2026',
    scholarship: true,
    shortDescription: 'Dubai campus of De Montfort University, a public university based in Leicester, England.',
    description: 'De Montfort University - UAE is the Dubai campus of De Montfort University, a public university based in Leicester, England. Degrees listed for the 2027 intake cover business, accounting and finance, computing and cyber security, engineering, law, psychology, architecture and design.',
  },
  amity: {
    name: 'Amity University - UAE',
    city: 'Dubai',
    website: 'https://www.amityuniversity.ae',
    type: 'private',
    intake: 'January/February 2027',
    scholarship: true,
    shortDescription: 'Dubai campus of Amity University, a private Indian university, offering undergraduate technology, business and design degrees.',
    description: 'Amity University - UAE is the Dubai campus of Amity University, a private university in India. Degrees listed for the 2027 intake cover engineering and technology, business and commerce, forensic science, design, media, psychology and hospitality.',
  },
  birmingham: {
    name: 'University of Birmingham - UAE',
    city: 'Dubai',
    website: 'https://www.birmingham.ac.uk',
    type: 'public',
    intake: 'January/February 2027',
    scholarship: true,
    shortDescription: 'Dubai campus of the University of Birmingham, a public university based in Birmingham, England.',
    description: 'University of Birmingham - UAE is the Dubai campus of the University of Birmingham, a public university based in Birmingham, England. Degrees listed for the 2027 intake cover business and management, economics and finance, computer science and artificial intelligence, engineering, psychology and biomedical science, most with an integrated foundation year option.',
  },
  bolton: {
    name: 'University of Bolton Academic Centre - Ras Al Khaimah - UAE',
    city: 'Ras Al Khaimah',
    website: 'https://www.bolton.ac.uk',
    type: 'public',
    intake: 'January/February 2027',
    scholarship: false,
    shortDescription: 'Academic centre of the University of Bolton, a public university based in Bolton, England, located in Ras Al Khaimah.',
    description: 'The University of Bolton Academic Centre in Ras Al Khaimah is part of the University of Bolton, a public university based in Bolton, England. Degrees listed for the 2027 intake cover engineering, law, business and psychology.',
  },
  symbiosis: {
    name: 'Symbiosis International University - UAE',
    city: 'Dubai',
    website: 'https://www.siu.edu.in',
    type: 'private',
    intake: 'January/February 2027',
    scholarship: false,
    shortDescription: 'Dubai campus of Symbiosis International University, a private deemed university in Pune, India.',
    description: 'Symbiosis International University - UAE is the Dubai campus of Symbiosis International University, a private deemed university based in Pune, India. Degrees listed for the 2027 intake cover business administration, computer applications, commerce and psychology.',
  },
  middlesex: {
    name: 'Middlesex University - UAE',
    city: 'Dubai',
    website: 'https://www.mdx.ac.ae',
    type: 'public',
    intake: 'January/February 2027',
    scholarship: true,
    shortDescription: 'Dubai campus of Middlesex University, a public university based in London, England.',
    description: 'Middlesex University - UAE is the Dubai campus of Middlesex University, a public university based in London, England. Degrees listed for the 2027 intake cover business and management, accounting and finance, computing and cyber security, law, psychology with a range of combined subjects, education and the creative arts.',
  },
  hult: {
    name: 'Hult International Business School - UAE',
    city: 'Dubai',
    website: 'https://www.hult.edu',
    type: 'private',
    intake: 'January/February 2027',
    scholarship: false,
    shortDescription: 'UAE campus of Hult International Business School, a private business school with campuses in several countries.',
    description: 'Hult International Business School - UAE is the UAE campus of Hult International Business School, a private business school. The degree listed for the 2027 intake is its Bachelor of Business Administration.',
  },
};

/** ug -> bachelor, pg -> master, doc -> phd. */
const LEVEL_TO_ENUM = { ug: 'bachelor', pg: 'master', doc: 'phd' };
const LEVEL_LABEL = { ug: 'Undergraduate', pg: 'Postgraduate', doc: 'Postgraduate' };

/** r(name, fee, duration, category, level) */
const r = (name, fee, duration, category, level = 'ug') => ({ name, fee, duration, category, level });

const COURSES = {
  /** 9 degrees. */
  murdoch: [
    r('Bachelor of Arts (BA) in Psychology', 155000, '3 Years', 'Science'),
    r('Bachelor of Business (Accounting)', 179880, '3 Years', 'Business'),
    r('Bachelor of Business (Finance)', 179880, '3 Years', 'Business'),
    r('Bachelor of Business (Management)', 179880, '3 Years', 'Business'),
    r('Bachelor of Business (BBus) in Marketing', 179880, '3 Years', 'Business'),
    r('Bachelor of Communication in Strategic Communication', 179880, '3 Years', 'Arts & Media'),
    r('Bachelor of Communication in Web Communication', 174600, '3 Years', 'Arts & Media'),
    r('Bachelor of Information Technology in Business Information Systems', 179880, '3 Years', 'Technology'),
    // Named as it was pasted: this is a second major, not a standalone award.
    r('Criminology (Second Major only)', 179880, '3 Years', 'Law'),
  ],

  /** 14 degrees, including one doctorate. */
  heriotwatt: [
    r('Marketing, MA (Hons)', 71500, '4 Years', 'Business'),
    r('International Business Management, MA (Hons)', 71500, '4 Years', 'Business'),
    r('Automotive Engineering, BEng (Hons)', 82264, '4 Years', 'Engineering'),
    r('BSc (Hons) Statistical Data Science', 82264, '4 Years', 'Science'),
    r('Actuarial Data Science, BSc (Hons)', 82264, '4 Years', 'Science'),
    r('Accountancy and Finance, MA (Hons)', 63598, '4 Years', 'Business'),
    r('MA (Hons) Accounting and Business Finance', 58800, '4 Years', 'Business'),
    r('Business Administration, BBA (Hons)', 82264, '4 Years', 'Business'),
    r('Business and Finance, MA (Hons)', 71500, '4 Years', 'Business'),
    r('MA (Hons) International Business Management with Enterprise/Marketing/Operations Management', 58800, '4 Years', 'Business'),
    r('MA (Hons) International Business Management with Human Resource Management HRM', 58800, '4 Years', 'Business'),
    r('BA (Hons) Fashion', 65100, '4 Years', 'Arts & Design'),
    r('BA (Hons) Fashion Marketing and Retailing', 65100, '4 Years', 'Arts & Design'),
    r('EngD Energy', 9750, '4 Years', 'Engineering', 'doc'),
  ],

  /** 11 degrees, the only institution here with a second intake. */
  dmu: [
    r('Biomedical Science BSc (Hons)', 94500, '3 Years', 'Science'),
    r('BSc (Hons) Computer Science', 75191, '3 Years', 'Technology'),
    r('BSc (Hons) Cyber Security', 75191, '3 Years', 'Technology'),
    r('Mechanical Engineering BEng (Hons)', 75191, '3 Years', 'Engineering'),
    r('Law LLB (Hons)', 75191, '3 Years', 'Law'),
    r('BSc (Hons) Architecture', 77338, '3 Years', 'Built Environment'),
    r('BA (Hons) Business Management', 63614, '3 Years', 'Business'),
    r('BSc (Hons) Accounting and Finance', 63614, '3 Years', 'Business'),
    r('BSc (Hons) Psychology', 75191, '3 Years', 'Science'),
    r('BA (Hons) Interior Design', 75191, '3 Years', 'Arts & Design'),
    r('Fashion Communication and Styling BA (Hons)', 68250, '3 Years', 'Arts & Design'),
  ],

  /** 25 degrees. Two BBA listings kept — see the header note. */
  amity: [
    r('Bachelor of Finance', 64575, '4 Years', 'Business'),
    r('Bachelor of Science (Honours) Forensic Sciences', 45000, '3 Years', 'Science'),
    r('Bachelor of Technology (Nanotechnology)', 48000, '4 Years', 'Engineering'),
    r('Bachelor of Business Administration', 45000, '3 Years', 'Business'),
    r('Bachelor of Commerce in Accounting', 64575, '4 Years', 'Business'),
    r('Bachelor of Business Administration (Dubai)', 50000, '3 Years', 'Business'),
    r('Bachelor of Business Administration (Family Business and Entrepreneurship)', 40000, '3 Years', 'Business'),
    r('Bachelor of Business Administration (Insurance and Banking)', 40000, '3 Years', 'Business'),
    r('Bachelor of Arts (Honours) Economics', 40000, '3 Years', 'Business'),
    r('Bachelor of Technology (Mechatronics)', 50000, '4 Years', 'Engineering'),
    r('Bachelor of Technology (Computer Science and Engineering)', 50000, '4 Years', 'Technology'),
    r('Bachelor of Technology (Electrical and Electronics Engineering)', 50000, '4 Years', 'Engineering'),
    r('Bachelor of Technology (Civil Engineering)', 50000, '4 Years', 'Engineering'),
    r('Bachelor of Technology (Aerospace Engineering)', 60000, '4 Years', 'Engineering'),
    r('Bachelor of Technology (Solar and Alternate Energy)', 60000, '4 Years', 'Engineering'),
    r('Bachelor of Technology (Mechanical Engineering)', 50000, '4 Years', 'Engineering'),
    r('Bachelor of Science in Information Technology', 45000, '3 Years', 'Technology'),
    r('Bachelor of Interior Design', 40000, '4 Years', 'Arts & Design'),
    r('Bachelor of Fine Arts (Animation)', 40000, '4 Years', 'Arts & Media'),
    r('Bachelor of Design (Fashion Design)', 40000, '4 Years', 'Arts & Design'),
    r('Bachelor of Arts (Honours) Applied Psychology', 42000, '3 Years', 'Science'),
    r('Bachelor of Arts (Journalism and Mass Communication)', 45000, '3 Years', 'Arts & Media'),
    r('Bachelor of Arts (Film and Television Production)', 45000, '3 Years', 'Arts & Media'),
    r('Bachelor of Hotel Management', 40000, '4 Years', 'Hospitality & Tourism'),
    r('Bachelor of Arts (Tourism Administration)', 40000, '3 Years', 'Hospitality & Tourism'),
  ],

  /** 36 degrees — the largest single listing in this batch. */
  birmingham: [
    r('Psychology BSc', 149106, '3 Years', 'Science'),
    r('Psychology with Integrated Foundation Year BSc', 134922, '4 Years', 'Science'),
    r('Business Management with Economics BSc', 114602, '3 Years', 'Business'),
    r('Business Management with Economics with Integrated Foundation Year BSc', 123506, '4 Years', 'Business'),
    r('Business Management with Finance BSc', 114602, '3 Years', 'Business'),
    r('Business Management with Finance with Integrated Foundation Year BSc', 123506, '4 Years', 'Business'),
    r('Business Management with Marketing BSc', 114602, '3 Years', 'Business'),
    r('Business Management with Marketing and Integrated Foundation Year BSc', 123506, '4 Years', 'Business'),
    r('Business Management with Marketing and Industrial Placement BSc', 114602, '4 Years', 'Business'),
    r('Business Management with Psychology with Integrated Foundation Year BSc', 123506, '4 Years', 'Business'),
    r('Business Management with Psychology BSc', 114602, '3 Years', 'Business'),
    r('Economics BSc', 128695, '3 Years', 'Business'),
    r('Economics with Integrated Foundation Year BSc', 123506, '4 Years', 'Business'),
    r('Money, Banking and Finance BSc', 114602, '3 Years', 'Business'),
    r('Money, Banking and Finance with Integrated Foundation Year BSc', 123506, '4 Years', 'Business'),
    r('Psychology with Business Management BSc', 149106, '3 Years', 'Science'),
    r('Marketing with industrial Placement BSc', 143297, '3 Years', 'Business'),
    r('Psychology with Business Management with Integrated Foundation Year BSc', 123506, '4 Years', 'Science'),
    r('Computer Engineering BSc', 132778, '3 Years', 'Engineering'),
    r('Computer Engineering with Integrated Foundation Year BSc', 134922, '4 Years', 'Engineering'),
    r('Computer Science and Software Engineering MEng', 156718, '4 Years', 'Technology'),
    r('Computer Science with Integrated Foundation Year BSc', 134922, '4 Years', 'Technology'),
    r('Computer Science BSc', 156718, '3 Years', 'Technology'),
    r('Mechanical Engineering BEng', 149106, '3 Years', 'Engineering'),
    r('Mechanical Engineering with Integrated Foundation Year BEng', 124343, '4 Years', 'Engineering'),
    r('Mechanical Engineering MEng', 132778, '4 Years', 'Engineering'),
    r('Artificial Intelligence (AI) and Computer Science BSc', 156718, '3 Years', 'Technology'),
    r('Artificial Intelligence (AI) and Computer Science with Integrated Foundation Year BSc', 134922, '4 Years', 'Technology'),
    r('Biomedical Science BSc', 126309, '3 Years', 'Science'),
    r('Biomedical Science BSc with Integrated Foundation Year', 138456, '4 Years', 'Science'),
    r('Business Management with Integrated Foundation Year BSc', 123506, '4 Years', 'Business'),
    r('Biomedical Science MSci', 126309, '4 Years', 'Science'),
    r('Accounting and Finance BSc with Integrated Foundation Year', 106592, '4 Years', 'Business'),
    r('Accounting and Finance BSc', 141852, '3 Years', 'Business'),
    r('Business Management BSc', 114602, '3 Years', 'Business'),
    r('Business Management with Industrial Placement BSc', 106592, '4 Years', 'Business'),
  ],

  /** 7 degrees. No Scholarship badge in the paste. */
  bolton: [
    r('BEng (Hons) Software Engineering', 32300, '3 Years', 'Engineering'),
    r('BEng (Hons) Mechanical Engineering', 32300, '3 Years', 'Engineering'),
    r('LLB / BA (Hons) Law', 32300, '3 Years', 'Law'),
    r('BSc (Hons) Business Management', 27500, '3 Years', 'Business'),
    r('BSc (Hons) Psychology', 32300, '3 Years', 'Science'),
    r('BA (Hons) Accountancy', 27500, '3 Years', 'Business'),
    r('BEng (Hons) Civil Engineering', 32300, '3 Years', 'Engineering'),
  ],

  /** 7 degrees. Abbreviations expanded except BAMC — see the header note. */
  symbiosis: [
    r('Bachelor of Business Administration', 42000, '4 Years', 'Business'),
    r('Bachelor of Business Administration (Dual Degree)', 42000, '4 Years', 'Business'),
    r('Bachelor of Computer Applications', 42000, '4 Years', 'Technology'),
    r('BAMC (Hons)', 42000, '4 Years', 'Arts & Media'),
    r('Bachelor of Commerce with ACCA Preparation', 42000, '3 Years', 'Business'),
    r('Bachelor of Commerce (Hons) with ACCA Preparation', 42000, '4 Years', 'Business'),
    r('BSc (Hons) Psychology', 42000, '4 Years', 'Science'),
  ],

  /** 34 degrees — the largest listing for a single UAE campus here. */
  middlesex: [
    r('BSc Honours Business Accounting', 64557, '3 Years', 'Business'),
    r('BSc Honours Business Information Systems', 62982, '3 Years', 'Technology'),
    r('BSc Honours Cyber Security and Digital Forensics', 64557, '3 Years', 'Technology'),
    r('BSc (Honours) Information Technology', 64557, '3 Years', 'Technology'),
    r('BSc Honours International Tourism Management', 175455, '3 Years', 'Hospitality & Tourism'),
    r('BSc Honours Psychology with Counselling Skills', 64557, '3 Years', 'Science'),
    r('BSc Honours Psychology with Criminology', 64557, '3 Years', 'Science'),
    r('BSc Honours Psychology with Education', 64557, '3 Years', 'Science'),
    r('BSc Honours Psychology with Human Resource Management', 64557, '3 Years', 'Science'),
    r('BSc Honours Psychology with Marketing', 64557, '3 Years', 'Science'),
    r('LLB Honours Commercial Law', 175455, '3 Years', 'Law'),
    r('LLB Honours Law', 64557, '3 Years', 'Law'),
    r('LLB Honours Law with Criminology', 64557, '3 Years', 'Law'),
    r('LLB Honours Law with International Relations', 64557, '3 Years', 'Law'),
    r('BA Honours Business Management (Innovation and Entrepreneurship)', 64557, '3 Years', 'Business'),
    r('BA Honours Business Management (Marketing)', 64557, '3 Years', 'Business'),
    r('BA Honours Accounting and Finance', 64557, '3 Years', 'Business'),
    r('BA Honours Advertising, PR and Branding', 64557, '3 Years', 'Arts & Media'),
    r('BA Honours Business Management', 64557, '3 Years', 'Business'),
    r('BA Honours Business Management (Finance)', 64557, '3 Years', 'Business'),
    r('BA Honours Business Management (Human Resource Management)', 64557, '3 Years', 'Business'),
    r('BA (Honours) Business Management (Project Management)', 64557, '3 Years', 'Business'),
    r('BA Honours Business Management (Supply Chain and Logistics)', 64557, '3 Years', 'Business'),
    r('BA Honours Creative Writing and Journalism', 175455, '3 Years', 'Arts & Media'),
    r('BA Honours Digital Media and Communications', 64557, '3 Years', 'Arts & Media'),
    r('BA Honours Early Childhood Studies', 175455, '3 Years', 'Education'),
    r('BA Honours Education Studies', 64557, '3 Years', 'Education'),
    r('BA Honours Fashion', 64557, '3 Years', 'Arts & Design'),
    r('BA Honours Film', 64557, '3 Years', 'Arts & Media'),
    r('BA Honours Graphic Design', 64557, '3 Years', 'Arts & Design'),
    r('BA Honours International Business', 64557, '3 Years', 'Business'),
    r('BA Honours Marketing', 64557, '3 Years', 'Business'),
    r('BEng Honours Computer Systems Engineering', 64557, '3 Years', 'Engineering'),
    r('BEng Honours Electronic Engineering', 64557, '3 Years', 'Engineering'),
  ],

  /** 1 degree. The paste's campus ("Nanaimo, Cowichan") is in Canada, so none is stored. */
  hult: [
    r('Bachelor of Business Administration (BBA)', 139000, '3 Years', 'Business'),
  ],
};

/** A single fee has no range to show. */
const tuitionRangeFor = (fees) => {
  const low = money(Math.min(...fees));
  const high = money(Math.max(...fees));
  return low === high ? low : `${low} - ${high} per year`;
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected.');

    let unisAdded = 0;
    let unisExisting = 0;
    let coursesAdded = 0;
    let coursesExisting = 0;

    for (const [key, institution] of Object.entries(INSTITUTIONS)) {
      const rows = COURSES[key];
      const fees = rows.map((row) => row.fee);
      let university = await University.findOne({ name: institution.name });

      if (university) {
        unisExisting++;
        console.log(`  · institution exists, left untouched: ${institution.name}`);
      } else {
        const features = ['Free to apply'];
        if (institution.scholarship) features.push('Scholarship available');

        university = new University({
          seo: makeSeoFromEntity({ type: 'university', name: institution.name, country: AE }),
          name: institution.name,
          country: AE,
          city: institution.city,
          website: institution.website,
          type: institution.type,
          shortDescription: institution.shortDescription,
          description: institution.description,
          programs: rows.map((row) => ({
            name: row.name,
            degree: LEVEL_LABEL[row.level],
            duration: row.duration,
            tuition: money(row.fee),
            intake: institution.intake,
          })),
          scholarships: institution.scholarship ? [{ name: 'Scholarship available' }] : [],
          tuitionRange: tuitionRangeFor(fees),
          features,
          isFeatured: false,
          isActive: true,
        });
        // save() rather than findOneAndUpdate so the pre-save hook assigns a slug.
        await university.save();
        unisAdded++;
        console.log(`  + institution added: ${institution.name} (${rows.length} degrees)`);
      }

      for (const row of rows) {
        const found = await Course.findOne({ name: row.name, universities: university._id });
        if (found) {
          coursesExisting++;
          continue;
        }

        await new Course({
          seo: makeSeoFromEntity({ type: 'course', name: row.name, country: AE }),
          name: row.name,
          category: row.category,
          degreeLevel: LEVEL_TO_ENUM[row.level],
          countries: [AE],
          universities: [university._id],
          tuitionRange: feeLabel(row.fee),
          // Every row in this batch was AED 0.00 with a "Free to apply" badge.
          applicationFee: 'AED 0.00',
          isFreeToApply: true,
          scholarshipAvailable: institution.scholarship,
          duration: row.duration,
          intake: institution.intake,
          isFeatured: false,
          isActive: true,
        }).save();

        coursesAdded++;
      }
    }

    const [uniTotal, courseTotal] = await Promise.all([
      University.countDocuments(),
      Course.countDocuments(),
    ]);

    console.log('\nSummary');
    console.log(`  institutions: ${unisAdded} added, ${unisExisting} already present`);
    console.log(`  courses:      ${coursesAdded} added, ${coursesExisting} already present`);
    console.log(`  collection totals now: ${uniTotal} universities, ${courseTotal} courses`);

    let total = 0;
    for (const [key, rows] of Object.entries(COURSES)) {
      total += rows.length;
      console.log(`  ${INSTITUTIONS[key].name}: ${rows.length}`);
    }
    console.log(`  total in this batch: ${total}`);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (error) {
    console.error('Import failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  }
};

run();
