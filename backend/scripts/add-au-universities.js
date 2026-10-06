/**
 * Additive import of five Australian universities and their listed degrees.
 *
 * Same contract as the UK / US / Canada / Ireland scripts: never deletes
 * existing rows, inserts only what is missing, leaves other collections alone.
 *
 *   npm run seed:au
 *
 * Source: the client's Australian listings. 144 pasted rows became 131 courses.
 *
 * 1. Thirteen rows were duplicates and were dropped:
 *      Victoria University  - 5 pairs repeated identically (Data Science,
 *                             Outdoor Leadership, Exercise Science (Sport
 *                             Practice), Sport Science/Sport Management, Sport
 *                             Science/Psychological Studies)
 *      Sunshine Coast       - 8 programmes listed twice. Where the two entries
 *                             named different campuses (e.g. "Sunshine Coast"
 *                             vs "Sunshine Coast, Moreton Bay") the wider list
 *                             was kept, since it is one degree taught in more
 *                             than one place.
 *
 * 2. Scraping damage corrected:
 *      "BBACHELOR OF NURSING"                    -> "Bachelor of Nursing"
 *      "&quot;Sunshine Coast, Moreton Bay&quot"  -> "Sunshine Coast / Moreton Bay"
 *      "Moretan Bay"                             -> "Moreton Bay"
 *      "Campbell town"                           -> "Campbelltown"
 *      "( Japanese Studies)"                     -> "(Japanese Studies)"
 *
 * 3. Naming: CQUniversity pasted everything in caps with its internal code
 *    embedded mid-title, e.g. "BACHELOR OF MUSIC - CG51 069478C". All names are
 *    now title case with a single trailing CRICOS code, matching the other four
 *    institutions. CQU's internal code (CG51, CL91, ...) is not kept — the
 *    CRICOS code is, so courses stay verifiable.
 *
 * 4. Campus: all five institutions span several cities, and a degree's fee can
 *    differ by campus, so each programme carries its campus list in the name.
 *    Exception: Victoria University's rows only said "Australia", and the
 *    institution is already named "Melbourne Campus", so its names carry no
 *    suffix.
 *
 * GBP figures are the AUD value at a flat 0.52, derived rather than copied
 * (28,000 -> £14,560; 37,464 -> £19,481).
 */
import dotenv from 'dotenv';
dotenv.config();

import connectDB, { sequelize } from '../src/config/db.js';
import University from '../src/models/University.js';
import Course from '../src/models/Course.js';
import { makeSeoFromEntity } from '../src/utils/seoDefaults.js';

const AU = 'Australia';
const GBP_RATE = 0.52;

const money = (n) => `AUD ${n.toLocaleString('en-AU')}`;
const feeLabel = (n) => `${money(n)} (£${Math.round(n * GBP_RATE).toLocaleString('en-GB')})`;

const INSTITUTIONS = {
  scu: {
    name: 'Southern Cross University',
    city: 'Lismore, New South Wales',
    website: 'https://www.scu.edu.au',
    intake: 'January/February 2027, September/October 2026',
    scholarship: false,
    shortDescription:
      'Public university based in Lismore, New South Wales, with campuses in New South Wales and Queensland plus metropolitan locations.',
    description:
      'Southern Cross University is a public university based in Lismore, New South Wales, with additional campuses across New South Wales and Queensland and metropolitan locations in Sydney, Melbourne and Perth. Degrees listed for the 2027 intake span information technology, business, engineering, health and sport, and the arts.',
  },
  cqu: {
    name: 'Central Queensland University',
    city: 'Rockhampton, Queensland',
    website: 'https://www.cqu.edu.au',
    intake: 'January/February 2027',
    scholarship: true,
    shortDescription:
      'Public university headquartered in Rockhampton, Queensland, trading as CQUniversity Australia, with campuses across Australia.',
    description:
      'Central Queensland University, which trades as CQUniversity Australia, is a public university headquartered in Rockhampton, Queensland, with campuses across Queensland, New South Wales, Victoria and South Australia, and an international campus in Jakarta. Degrees listed for the 2027 intake cover health, education, engineering, information technology, science and the arts.',
  },
  vu: {
    name: 'Victoria University - Melbourne Campus',
    city: 'Melbourne, Victoria',
    website: 'https://www.vu.edu.au',
    intake: 'July/August 2027, January/February 2027',
    scholarship: true,
    shortDescription:
      'Public university based in Melbourne, Victoria, offering undergraduate and postgraduate degrees across its Melbourne campuses.',
    description:
      'Victoria University is a public university based in Melbourne, Victoria, teaching across its Melbourne campuses. Degrees listed for the 2027 intake cover engineering, information technology, sport and exercise science, health, community services, business and the arts.',
  },
  usc: {
    name: 'University of the Sunshine Coast',
    city: 'Sunshine Coast, Queensland',
    website: 'https://www.usc.edu.au',
    intake: 'November/December 2026, January/February 2027',
    scholarship: true,
    shortDescription:
      'Public university based on the Sunshine Coast, Queensland, with an additional campus at Moreton Bay.',
    description:
      'The University of the Sunshine Coast is a public university based on the Sunshine Coast, Queensland, with an additional campus at Moreton Bay. The degrees listed for the 2027 intake are drawn largely from its Bachelor of Arts majors and its Arts/Business double degrees.',
  },
  wsu: {
    name: 'Western Sydney University',
    city: 'Sydney, New South Wales',
    website: 'https://www.westernsydney.edu.au',
    intake: 'September/October 2026',
    scholarship: true,
    shortDescription:
      'Public university in Greater Western Sydney, New South Wales, with campuses across the region and in the Sydney central business district.',
    description:
      'Western Sydney University is a public university in Greater Western Sydney, New South Wales, with campuses across the region including Parramatta, Campbelltown, Bankstown, Penrith and Hawkesbury, plus Sydney City. Degrees listed for the 2027 intake cover engineering, information and communications technology, business, health and science, and the creative arts.',
  },
};

/** ug / pg map to the schema's degreeLevel enum. */
const LEVEL_TO_ENUM = { ug: 'bachelor', pg: 'master' };
const LEVEL_LABEL = { ug: 'Undergraduate', pg: 'Postgraduate' };

/** row(name, campus, fee, duration, category, level) — campus null means no suffix. */
const r = (name, campus, fee, duration, category, level = 'ug') => ({ name, campus, fee, duration, category, level });

const COURSES = {
  /** 25 degrees. The only Australian institution here with no Scholarship badge. */
  scu: [
    r('Bachelor of Arts 108300B (Politics and International Relations)', 'Lismore', 28000, '3 Years', 'Social Science'),
    r('Bachelor of Arts 108300B (Social Science)', 'Lismore', 28000, '3 Years', 'Social Science'),
    r('Bachelor of Art and Design 096003C', 'Lismore', 28000, '3 Years', 'Arts & Design'),
    r('Bachelor of Indigenous Knowledge 093086G', 'Lismore', 28000, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Engineering Systems (Honours) 0102158', 'Lismore', 33600, '4 Years', 'Engineering'),
    r('Bachelor of Information Technology 019840D (Digital Interaction and the User Experience)', 'Gold Coast', 28000, '3 Years', 'Technology'),
    r('Bachelor of Information Technology 019840D (Networks and Cybersecurity)', 'Gold Coast', 28000, '3 Years', 'Technology'),
    r('Bachelor of Information Technology 019840D (Big Data Technologies)', 'Gold Coast', 28000, '3 Years', 'Technology'),
    r('Bachelor of Information Technology 086031D (Software Development)', 'Melbourne / Perth / Sydney', 31200, '3 Years', 'Technology'),
    r('Bachelor of Information Technology 086031D (Digital Interaction and the User Experience)', 'Melbourne / Perth / Sydney', 31200, '3 Years', 'Technology'),
    r('Bachelor of Information Technology 086031D (Networks and Cybersecurity)', 'Melbourne / Perth / Sydney', 31200, '3 Years', 'Technology'),
    r('Bachelor of Information Technology 086031D (Big Data Technologies)', 'Melbourne / Perth / Sydney', 31200, '3 Years', 'Technology'),
    r('Bachelor of Business in Hotel Management 086102E', 'Brisbane / Melbourne / Sydney', 29200, '3 Years', 'Hospitality & Tourism'),
    r('Bachelor of Business and Enterprise 102200K (Financial Service Specialization)', 'Gold Coast', 28000, '3 Years', 'Business'),
    r('Bachelor of Business and Enterprise 102200K (Accounting Specialization)', 'Gold Coast', 28000, '3 Years', 'Business'),
    r('Bachelor of Business and Enterprise 102200K (Business and Data Analytics)', 'Gold Coast', 28000, '3 Years', 'Business'),
    r('Bachelor of Business and Enterprise 102200K (Entrepreneurship and Innovation)', 'Gold Coast', 28000, '3 Years', 'Business'),
    r('Bachelor of Business and Enterprise 102200K (Sustainability)', 'Gold Coast', 28000, '3 Years', 'Business'),
    r('Bachelor of Business and Enterprise 102200K (Tourism Management)', 'Gold Coast', 28000, '3 Years', 'Hospitality & Tourism'),
    r('Bachelor of Business and Enterprise 102200K (Aviation)', 'Gold Coast', 28000, '3 Years', 'Business'),
    r('Bachelor of Laws / Bachelor of Business and Enterprise 108604H', 'Gold Coast', 28000, '4 Years', 'Law'),
    r('Bachelor of Biomedical Science 3007312', 'Gold Coast', 30832, '3 Years', 'Science'),
    r('Bachelor of Exercise Science and Psychological Science 0102160', 'Coffs Harbour / Gold Coast', 30800, '4 Years', 'Sport'),
    r('Bachelor of Sport and Exercise Science 059883F', 'Coffs Harbour / Gold Coast / Lismore', 28800, '3 Years', 'Sport'),
    r('Bachelor of Digital Media 102203G', 'Lismore', 28000, '3 Years', 'Arts & Media'),
  ],

  /** 21 degrees, all caps on paste, all with the Scholarship badge. */
  cqu: [
    r('Bachelor of Music 069478C', 'Mackay', 31200, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Theatre 069479B (Drama)', 'Mackay', 31200, '3 Years', 'Arts & Humanities'),
    // Paste gave the campus only as "Australia", so no suffix is stored.
    r('Bachelor of Occupational Therapy (Honours) 075754D', null, 35280, '4 Years', 'Health'),
    r('Bachelor of Digital Media 081701M', 'Brisbane / Jakarta', 31200, '3 Years', 'Arts & Media'),
    r('Bachelor of Physiotherapy (Honours) 075753E', 'Bundaberg / Rockhampton', 35280, '4 Years', 'Health'),
    r('Bachelor of Education (Early Childhood) 080751J', 'Bundaberg / Mackay / Rockhampton', 28080, '4 Years', 'Education'),
    r('Bachelor of Podiatry Practice (Honours) 075755C', 'Rockhampton', 34560, '4 Years', 'Health'),
    r('Bachelor of Education (Primary) 080753G', 'Bundaberg / Mackay / Rockhampton', 28080, '4 Years', 'Education'),
    r('Bachelor of Education (Secondary) 080752G', 'Bundaberg / Mackay / Rockhampton', 31740, '4 Years', 'Education'),
    r('Bachelor of Speech Pathology (Honours) 075752F', 'Rockhampton', 37740, '4 Years', 'Health'),
    r('Bachelor of Oral Health 094012G', 'Rockhampton', 36720, '3 Years', 'Health'),
    r('Bachelor of Medical Laboratory Science (Honours) 097144D', 'Rockhampton', 36060, '4 Years', 'Health'),
    r('Bachelor of Science (Chiropractic) 075757A', 'Brisbane', 36720, '3 Years', 'Health'),
    r('Bachelor of Accounting 003386G (Financial Planning)', 'Melbourne / Sydney', 31680, '3 Years', 'Business'),
    r('Bachelor of Accounting / Bachelor of Business 059987J (Financial Planning)', 'Melbourne / Sydney', 31680, '4 Years', 'Business'),
    r('Bachelor of Information Technology 003401C (Application Development)', 'Brisbane / Cairns / Melbourne / Rockhampton / Sydney / Townsville', 33360, '3 Years', 'Technology'),
    r('Bachelor of Exercise and Sport Sciences 069480J', 'Rockhampton', 33120, '3 Years', 'Sport'),
    r('Bachelor of Nursing 102338C', 'Rockhampton', 33450, '3 Years', 'Health'),
    r('Bachelor of Science (Psychology) 083579C', 'Adelaide / Cairns / Rockhampton', 31680, '3 Years', 'Science'),
    r('Bachelor of Psychological Science 084516K (Allied Health)', 'Adelaide / Bundaberg / Cairns / Rockhampton', 31680, '3 Years', 'Science'),
    r('Bachelor of Agriculture 088550J', 'Bundaberg / Rockhampton', 33120, '3 Years', 'Agriculture'),
  ],

  /** 27 degrees after five identical repeat pairs were dropped. */
  vu: [
    r('Bachelor of Community Development 088782D', null, 12200, '3 Years', 'Community Services'),
    r('Bachelor of Youth Work 074356D', null, 12800, '3 Years', 'Community Services'),
    r('Bachelor of Engineering (Honours) (Mechanical Engineering) 084875J', null, 17800, '4 Years', 'Engineering'),
    r('Bachelor of Data Science 108667D', null, 15200, '3 Years', 'Technology'),
    r('Bachelor of Outdoor Leadership', null, 15500, '3 Years', 'Sport'),
    r('Bachelor of Exercise Science (Sport Practice) 084833G', null, 16000, '3 Years', 'Sport'),
    r('Bachelor of Sport Science (Human Movement) / Bachelor of Sport Management 084878F', null, 14600, '4 Years', 'Sport'),
    r('Bachelor of Sport Science (Human Movement) / Bachelor of Psychological Studies', null, 14900, '4 Years', 'Sport'),
    r('Bachelor of Psychological Studies 071141K', null, 14500, '3 Years', 'Science'),
    r('Bachelor of Paramedicine 092160M', null, 15800, '3 Years', 'Health'),
    r('Bachelor of Physical Education and Sport Science 088601C', null, 15500, '3 Years', 'Sport'),
    r('Bachelor of Music 077998A', null, 12800, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Social Work 077997B', null, 13400, '3 Years', 'Social Science'),
    r('Bachelor of Science (Honours) (Biomedical Sciences) 015074C', null, 15800, '1 Year', 'Science'),
    r('Bachelor of Sport Management 084881M', null, 16000, '3 Years', 'Sport'),
    r('Bachelor of Information Technology (Professional) 096870D', null, 15200, '42 Months', 'Technology'),
    r('Bachelor of Engineering (Honours) (Architectural Engineering) 084872A', null, 17800, '4 Years', 'Engineering'),
    r('Bachelor of Engineering (Honours) (Electrical and Electronic Engineering) 084874K', null, 17800, '4 Years', 'Engineering'),
    r('Bachelor of Engineering (Honours) (Civil Engineering) 084873M', null, 17800, '4 Years', 'Engineering'),
    r('Bachelor of Exercise Science (Clinical Practice) 084834G', null, 16000, '3 Years', 'Sport'),
    r('Bachelor of Screen Media 092157F', null, 12800, '3 Years', 'Arts & Media'),
    r('Bachelor of Human Nutrition 096482E', null, 14900, '3 Years', 'Health'),
    r('Bachelor of Information Technology 071997F, 093390M', null, 15200, '3 Years', 'Technology'),
    r('Master of Applied Information Technology 083307E, 083015F', null, 15500, '2 Years', 'Technology', 'pg'),
    r('Master of Business Administration (Global) 103253M, 105070B', null, 16700, '2 Years', 'Business', 'pg'),
    r('Master of International Community Development 083312G', null, 12200, '2 Years', 'Community Services', 'pg'),
    r('Master of Professional Accounting 103254K, 103277C', null, 15500, '2 Years', 'Business', 'pg'),
  ],

  /** 35 degrees — 43 pasted rows less 8 repeat pairs, wider campus list kept. */
  usc: [
    r('Bachelor of Arts (English)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Arts (Environmental Geography)', 'Sunshine Coast', 24000, '3 Years', 'Environmental'),
    r('Bachelor of Arts (Geospatial Analysis)', 'Sunshine Coast', 24000, '3 Years', 'Environmental'),
    r('Bachelor of Arts (Global Environmental Politics)', 'Sunshine Coast', 24000, '3 Years', 'Environmental'),
    r('Bachelor of Arts (History)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Arts (Human Geography)', 'Sunshine Coast', 24000, '3 Years', 'Environmental'),
    r('Bachelor of Arts (Indigenous Studies)', 'Sunshine Coast', 24000, '3 Years', 'Social Science'),
    r('Bachelor of Arts (International and Human Rights)', 'Sunshine Coast', 24000, '3 Years', 'Social Science'),
    r('Bachelor of Arts (International Studies)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Social Science'),
    r('Bachelor of Arts (Japanese Studies)', 'Sunshine Coast', 24000, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Arts (Journalism)', 'Sunshine Coast', 24000, '3 Years', 'Arts & Media'),
    r('Bachelor of Arts (Music)', 'Sunshine Coast', 24000, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Arts (Town Planning Studies)', 'Sunshine Coast', 24000, '3 Years', 'Built Environment'),
    r('Bachelor of Arts (Screen Media)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Arts & Media'),
    r('Bachelor of Arts (Social Theory)', 'Sunshine Coast', 24000, '3 Years', 'Social Science'),
    r('Bachelor of Arts (Sociology)', 'Sunshine Coast', 24000, '3 Years', 'Social Science'),
    r('Bachelor of Arts (Sustainability)', 'Sunshine Coast', 24000, '3 Years', 'Environmental'),
    r('Bachelor of Arts (Theatre and Performance)', 'Sunshine Coast', 24000, '3 Years', 'Arts & Humanities'),
    r('Bachelor of International Studies', 'Sunshine Coast', 24000, '3 Years', 'Social Science'),
    r('Bachelor of Arts / Bachelor of Business (Accounting)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Business'),
    r('Bachelor of Arts / Bachelor of Business (Business Administration)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Business'),
    r('Bachelor of Arts / Bachelor of Business (Economics and Finance)', 'Sunshine Coast', 24000, '3 Years', 'Business'),
    r('Bachelor of Arts / Bachelor of Business (Entrepreneurship)', 'Sunshine Coast', 24000, '3 Years', 'Business'),
    r('Bachelor of Arts / Bachelor of Business (Human Resource Management)', 'Sunshine Coast', 24000, '4 Years', 'Business'),
    r('Bachelor of Arts (Criminology and Justice)', 'Sunshine Coast', 24000, '3 Years', 'Law'),
    r('Bachelor of Arts (Geography)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Environmental'),
    r('Bachelor of Arts (Japanese In-country)', 'Sunshine Coast', 24000, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Information System', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Technology'),
    r('Bachelor of Arts (Psychology)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Science'),
    r('Bachelor of Arts (Sustainability - Society)', 'Sunshine Coast', 24000, '3 Years', 'Environmental'),
    r('Bachelor of Arts (Aboriginal and Torres Strait Islander Health)', 'Sunshine Coast', 24000, '3 Years', 'Health'),
    r('Bachelor of Arts (Behavioural Science)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Science'),
    r('Bachelor of Arts (Counselling Skills)', 'Sunshine Coast', 24000, '3 Years', 'Health'),
    r('Bachelor of Arts (Development Studies)', 'Sunshine Coast', 24000, '3 Years', 'Social Science'),
    r('Bachelor of Arts (Creative Writing and Publishing)', 'Sunshine Coast / Moreton Bay', 24000, '3 Years', 'Arts & Media'),
  ],

  /** 23 degrees. */
  wsu: [
    r('Bachelor of Information Systems / Bachelor of Business 093318G', 'Parramatta South / Campbelltown', 30880, '4 Years', 'Technology'),
    r('Bachelor of Engineering (Honours) / Bachelor of Business 082197C', 'Bankstown / Parramatta South / Penrith / Campbelltown / Sydney City', 33040, '5 Years', 'Engineering'),
    r('Bachelor of Information and Communications Technology / Bachelor of Business 089213G', 'Parramatta South / Campbelltown / Bankstown', 30880, '4 Years', 'Technology'),
    r('Bachelor of Information and Communications Technology / Bachelor of Business (Accounting) 082194F', 'Parramatta South / Campbelltown', 30880, '4 Years', 'Technology'),
    r('Master of Professional Accounting (Advanced)', 'Parramatta City / Sydney City', 37464, '2 Years', 'Business', 'pg'),
    r('Master of Applied Finance', 'Parramatta City', 37464, '2 Years', 'Business', 'pg'),
    r('Master of Human Resource Management', 'Parramatta City', 37464, '1 Year', 'Business', 'pg'),
    r('Master of Business Administration / Master of Applied Finance', 'Parramatta City', 37464, '30 Months', 'Business', 'pg'),
    r('Master of Property Investment and Development', 'Parramatta City', 37464, '2 Years', 'Built Environment', 'pg'),
    r('Master of Business Analytics', 'Parramatta City', 37464, '2 Years', 'Business', 'pg'),
    r('Bachelor of Creative Industries 093321B (Advertising)', 'Parramatta South', 28080, '3 Years', 'Arts & Media'),
    r('Bachelor of Design (Visual Communication) 044773B', 'Parramatta South', 28080, '4 Years', 'Arts & Design'),
    r('Bachelor of Music 065052F', 'Penrith', 28080, '3 Years', 'Arts & Humanities'),
    r('Bachelor of Screen Media (Arts and Production) 089386G', 'Parramatta South', 28080, '3 Years', 'Arts & Media'),
    r('Bachelor of Communication / Bachelor of Laws 105744J', 'Parramatta South / Campbelltown', 30800, '5 Years', 'Law'),
    r('Bachelor of Music / Bachelor of Creative Industries 095719G', 'Penrith', 28080, '4 Years', 'Arts & Media'),
    r('Bachelor of Engineering Science 074195E (Civil)', 'Penrith / Parramatta South / Sydney City', 33040, '3 Years', 'Engineering'),
    r('Bachelor of Engineering Advanced (Honours) 063560B', 'Parramatta South', 33040, '4 Years', 'Engineering'),
    r('Bachelor of Engineering (Honours) 089429B (Civil)', 'Bankstown / Parramatta South / Sydney City / Campbelltown / Penrith', 33040, '4 Years', 'Engineering'),
    r('Bachelor of Science (Forensic Science) 041144M', 'Hawkesbury', 30480, '3 Years', 'Science'),
    r('Bachelor of Health Science (Paramedicine) 079923D', 'Campbelltown', 34000, '3 Years', 'Health'),
    r('Bachelor of Health Science (Sport and Exercise Science) 069280F', 'Campbelltown', 30080, '3 Years', 'Sport'),
    r('Bachelor of Occupational Therapy 086212K', 'Campbelltown', 30480, '4 Years', 'Health'),
  ],
};

/** Displayed name carries the campus list when the paste gave one. */
const storedName = (row) => (row.campus ? `${row.name} — ${row.campus}` : row.name);

/** A single fee has no range to show. */
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
      const fees = rows.map((row) => row.fee);
      let university = await University.findOne({ where: { name: institution.name } });

      if (university) {
        unisExisting++;
        console.log(`  · university exists, left untouched: ${institution.name}`);
      } else {
        const features = ['Free to apply'];
        if (institution.scholarship) features.push('Scholarship available');

        university = await University.create({
          seo: makeSeoFromEntity({ type: 'university', name: institution.name, country: AU }),
          name: institution.name,
          country: AU,
          city: institution.city,
          website: institution.website,
          // All five are publicly funded Australian universities.
          type: 'public',
          shortDescription: institution.shortDescription,
          description: institution.description,
          programs: rows.map((row) => ({
            name: storedName(row),
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
        // create() rather than an update so the beforeCreate hook assigns a slug.
        unisAdded++;
        console.log(`  + university added: ${institution.name} (${rows.length} degrees)`);
      }

      for (const row of rows) {
        const name = storedName(row);
        const found = await Course.findOne({
          where: { name },
          include: [{ model: University, as: 'universities', where: { id: university.id }, attributes: [], required: true }],
        });
        if (found) {
          coursesExisting++;
          continue;
        }

        const { universities, ...courseData } = {
          seo: makeSeoFromEntity({ type: 'course', name, country: AU }),
          name,
          category: row.category,
          degreeLevel: LEVEL_TO_ENUM[row.level],
          countries: [AU],
          universities: [university.id],
          tuitionRange: feeLabel(row.fee),
          // Every row in this batch was AUD 0.00 with a "Free to apply" badge.
          applicationFee: 'AUD 0.00',
          isFreeToApply: true,
          scholarshipAvailable: institution.scholarship,
          duration: row.duration,
          intake: institution.intake,
          isFeatured: false,
          isActive: true,
        };
        const course = await Course.create(courseData);
        await course.setUniversities(universities);

        coursesAdded++;
      }
    }

    const [uniTotal, courseTotal] = await Promise.all([
      University.count(),
      Course.count(),
    ]);

    console.log('\nSummary');
    console.log(`  universities: ${unisAdded} added, ${unisExisting} already present`);
    console.log(`  courses:      ${coursesAdded} added, ${coursesExisting} already present`);
    console.log(`  collection totals now: ${uniTotal} universities, ${courseTotal} courses`);

    let total = 0;
    for (const [key, rows] of Object.entries(COURSES)) {
      total += rows.length;
      console.log(`  ${INSTITUTIONS[key].name}: ${rows.length}`);
    }
    console.log(`  total in this batch: ${total} (144 pasted rows - 13 duplicates)`);

    await sequelize.close();
    console.log('Done.');
  } catch (error) {
    console.error('Import failed:', error.message);
    await sequelize.close().catch(() => {});
    process.exitCode = 1;
  }
};

run();
