'use client';

import { useParams, Link } from '../utils/router';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  Award,
  Lightbulb,
  FileText,
} from 'lucide-react';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';
import SectionHeading from '../components/common/SectionHeading';
import FAQAccordion from '../components/common/FAQAccordion';
import CTASection from '../components/common/CTASection';

const TEST_DATA = {
  ielts: {
    name: 'IELTS',
    fullName: 'International English Language Testing System',
    description: 'IELTS is the world\'s most popular English language proficiency test for higher education and global migration. It assesses all four language skills — listening, reading, writing, and speaking.',
    format: [
      { section: 'Listening', duration: '30 minutes', details: '4 sections, 40 questions. You listen to recorded audio and answer questions.' },
      { section: 'Reading', duration: '60 minutes', details: '3 sections, 40 questions. Academic or General Training reading passages.' },
      { section: 'Writing', duration: '60 minutes', details: 'Task 1: Describe visual information. Task 2: Write an essay in response to a point of view.' },
      { section: 'Speaking', duration: '11-14 minutes', details: 'Face-to-face interview with examiner. 3 parts: introduction, individual turn, discussion.' },
    ],
    scoring: 'IELTS uses a 9-band scoring system. Each band corresponds to a level of English competence. Most universities require an overall band score of 6.0 to 7.0.',
    tips: [
      'Practice listening to English podcasts and news daily',
      'Read academic articles from various sources',
      'Practice writing essays within the time limit',
      'Record yourself speaking and analyze pronunciation',
      'Take full mock tests under timed conditions',
      'Learn synonyms and paraphrasing techniques',
    ],
    materials: [
      'Cambridge IELTS practice books (1-18)',
      'British Council IELTS preparation resources',
      'IELTS.org official practice tests',
      'Online mock test platforms',
      'IELTS vocabulary and grammar guides',
    ],
    faqs: [
      { question: 'How long is IELTS valid?', answer: 'IELTS scores are valid for 2 years from the date of the test.' },
      { question: 'Can I retake IELTS?', answer: 'Yes, you can retake IELTS as many times as you want. There is no limit on retakes.' },
      { question: 'What is the difference between Academic and General Training?', answer: 'Academic IELTS is for university admission, while General Training is for migration and work purposes. The Listening and Speaking sections are the same.' },
      { question: 'How do I register for IELTS?', answer: 'You can register online through the British Council or IDP websites, or visit our office for assistance with registration.' },
    ],
  },
  pte: {
    name: 'PTE',
    fullName: 'Pearson Test of English',
    description: 'PTE Academic is a computer-based English language test that assesses reading, writing, listening, and speaking skills. It is accepted by thousands of institutions worldwide and known for its fast results.',
    format: [
      { section: 'Speaking & Writing', duration: '54-67 minutes', details: 'Read aloud, repeat sentence, describe image, essay writing, and more.' },
      { section: 'Reading', duration: '29-30 minutes', details: 'Multiple choice, reorder paragraphs, fill in the blanks.' },
      { section: 'Listening', duration: '30-43 minutes', details: 'Summarize spoken text, fill in blanks, highlight correct summary, write from dictation.' },
    ],
    scoring: 'PTE scores range from 10 to 90. Each skill (Listening, Reading, Speaking, Writing) is scored separately, along with an overall score.',
    tips: [
      'Familiarize yourself with the computer-based format',
      'Practice speaking clearly into a microphone',
      'Improve typing speed for writing tasks',
      'Take practice tests on the official PTE platform',
      'Focus on pronunciation and fluency',
      'Learn academic vocabulary and collocations',
    ],
    materials: [
      'PTE Official Practice Tests',
      'Pearson PTE preparation books',
      'Online PTE mock test platforms',
      'PTE practice apps',
      'Academic word lists',
    ],
    faqs: [
      { question: 'How quickly do I get PTE results?', answer: 'PTE results are typically available within 2-48 hours.' },
      { question: 'Is PTE easier than IELTS?', answer: 'Difficulty is subjective. PTE is fully computer-based and may suit those comfortable with technology. Some find its format more straightforward.' },
    ],
  },
  toefl: {
    name: 'TOEFL',
    fullName: 'Test of English as a Foreign Language',
    description: 'TOEFL iBT measures academic English skills as they are used in college and university classrooms. It is accepted by over 160 countries and 11,000+ universities worldwide.',
    format: [
      { section: 'Reading', duration: '54-72 minutes', details: '3-4 academic passages with questions.' },
      { section: 'Listening', duration: '41-57 minutes', details: 'Lectures, conversations, and classroom discussions.' },
      { section: 'Speaking', duration: '17 minutes', details: '4 tasks: independent and integrated speaking tasks.' },
      { section: 'Writing', duration: '50 minutes', details: 'Integrated writing task and independent writing task.' },
    ],
    scoring: 'TOEFL iBT scores range from 0 to 120. Each section is scored from 0 to 30.',
    tips: [
      'Take extensive notes during listening tasks',
      'Practice academic reading regularly',
      'Record and review your speaking responses',
      'Practice timed writing essays',
      'Use official ETS TOEFL preparation materials',
    ],
    materials: [
      'Official TOEFL iBT Tests (ETS)',
      'TOEFL Prep Online by ETS',
      'Barron\'s TOEFL preparation guide',
      'TOEFL practice test websites',
    ],
    faqs: [
      { question: 'Is TOEFL accepted in the UK?', answer: 'Yes, TOEFL is accepted by UK universities and for UK visa purposes.' },
      { question: 'How long is TOEFL valid?', answer: 'TOEFL scores are valid for 2 years.' },
    ],
  },
  gre: {
    name: 'GRE',
    fullName: 'Graduate Record Examinations',
    description: 'The GRE General Test is required for many graduate and business school programs worldwide. It measures verbal reasoning, quantitative reasoning, and analytical writing skills.',
    format: [
      { section: 'Verbal Reasoning', duration: '41 minutes', details: 'Text completion, sentence equivalence, reading comprehension.' },
      { section: 'Quantitative Reasoning', duration: '47 minutes', details: 'Numeric entry, multiple choice, data interpretation.' },
      { section: 'Analytical Writing', duration: '30 minutes', details: 'Analyze an issue task — construct an argument on a given topic.' },
    ],
    scoring: 'Verbal and Quantitative: 130-170 each. Analytical Writing: 0-6. Total: 260-340.',
    tips: [
      'Start preparation at least 3 months before the test',
      'Focus on vocabulary building for verbal section',
      'Practice data interpretation for quantitative section',
      'Write practice essays and get feedback',
      'Take official PowerPrep practice tests',
    ],
    materials: [
      'Official GRE Super Power Pack (ETS)',
      'Manhattan Prep GRE books',
      'Magoosh GRE online preparation',
      'Kaplan GRE prep',
    ],
    faqs: [
      { question: 'How long is GRE valid?', answer: 'GRE scores are valid for 5 years.' },
      { question: 'Can I use a calculator on GRE?', answer: 'An on-screen calculator is provided for the quantitative section.' },
    ],
  },
  gmat: {
    name: 'GMAT',
    fullName: 'Graduate Management Admission Test',
    description: 'The GMAT is the most widely used test for MBA admissions. It assesses analytical, quantitative, verbal, and integrated reasoning skills.',
    format: [
      { section: 'Quantitative Reasoning', duration: '62 minutes', details: 'Data sufficiency and problem-solving questions.' },
      { section: 'Verbal Reasoning', duration: '65 minutes', details: 'Reading comprehension, critical reasoning, sentence correction.' },
      { section: 'Integrated Reasoning', duration: '30 minutes', details: 'Multi-source reasoning, graphics interpretation, table analysis.' },
      { section: 'Analytical Writing', duration: '30 minutes', details: 'Analysis of an argument essay.' },
    ],
    scoring: 'Total: 200-800. Verbal and Quantitative: 6-51 each. IR: 1-8. AWA: 0-6.',
    tips: [
      'Master the data sufficiency question type',
      'Practice time management — limited time per question',
      'Focus on critical reasoning skills',
      'Take official GMATPrep practice tests',
      'Consider a structured preparation course',
    ],
    materials: [
      'Official Guide for GMAT Review (GMAC)',
      'Manhattan Prep GMAT series',
      'GMAT Official Practice Exams',
      'Target Test Prep (for quant)',
    ],
    faqs: [
      { question: 'How long is GMAT valid?', answer: 'GMAT scores are valid for 5 years.' },
      { question: 'How many times can I take GMAT?', answer: 'You can take GMAT up to 5 times in a rolling 12-month period.' },
    ],
  },
  sat: {
    name: 'SAT',
    fullName: 'Scholastic Assessment Test',
    description: 'The SAT is a standardized test widely used for undergraduate admissions in the United States. It measures literacy, writing skills, and mathematical abilities.',
    format: [
      { section: 'Evidence-Based Reading', duration: '65 minutes', details: 'Reading passages from literature, science, history, and social studies.' },
      { section: 'Writing and Language', duration: '35 minutes', details: 'Grammar, usage, and rhetorical skills questions.' },
      { section: 'Math', duration: '80 minutes', details: 'Algebra, problem-solving, data analysis, and advanced math topics.' },
    ],
    scoring: 'Total: 400-1600. Evidence-Based Reading and Writing: 200-800. Math: 200-800.',
    tips: [
      'Practice with official College Board SAT tests',
      'Focus on grammar rules for the writing section',
      'Master algebra and data analysis for math',
      'Read challenging texts regularly',
      'Use Khan Academy\'s free SAT prep',
    ],
    materials: [
      'Official SAT Study Guide (College Board)',
      'Khan Academy SAT Practice',
      'Princeton Review SAT prep',
      'College Board official practice tests',
    ],
    faqs: [
      { question: 'Is the SAT required for US universities?', answer: 'Many US universities have adopted test-optional policies. Check specific university requirements.' },
      { question: 'How long is SAT valid?', answer: 'SAT scores are valid for 5 years.' },
    ],
  },
  duolingo: {
    name: 'Duolingo',
    fullName: 'Duolingo English Test',
    description: 'The Duolingo English Test is an affordable, convenient English proficiency test that can be taken online from home. It is accepted by a growing number of institutions worldwide.',
    format: [
      { section: 'Adaptive Test', duration: '45 minutes', details: 'Questions adapt to your ability level. Covers reading, writing, listening, and speaking.' },
      { section: 'Video Interview', duration: '5 minutes', details: 'Unscored sample of spoken English for universities to review.' },
      { section: 'Writing Sample', duration: '5 minutes', details: 'Unscored writing sample sent to universities.' },
    ],
    scoring: 'Scores range from 10 to 160. Most universities require scores between 95 and 120.',
    tips: [
      'Practice speaking clearly into your microphone',
      'Familiarize yourself with the adaptive test format',
      'Practice with the free Duolingo practice test',
      'Improve your typing speed',
      'Record yourself speaking and listen back',
    ],
    materials: [
      'Duolingo Official Practice Test',
      'Duolingo English Test preparation guide',
      'Online practice platforms',
      'English speaking and writing practice apps',
    ],
    faqs: [
      { question: 'How quickly do I get Duolingo results?', answer: 'Results are available within 48 hours of completing the test.' },
      { question: 'How much does Duolingo cost?', answer: 'The Duolingo English Test costs $59 USD.' },
    ],
  },
};

export default function TestDetail() {
  const { slug } = useParams() as any;
  const test = TEST_DATA[slug];

  if (!test) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-dark-500 mb-4">Test information not found.</p>
        <Link to="/test-preparation" className="text-primary-500 hover:text-primary-600 font-medium">Back to Test Preparation</Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Test Preparation', link: '/test-preparation' },
    { label: test.name },
  ];

  return (
    <>
      <SEO
        title={`${test.name} (${test.fullName}) - Preparation Guide`}
        description={`Complete preparation guide for ${test.name}: test format, sections, scoring system, study materials, and expert tips from Eduvia Consultancy.`}
        keywords={`${test.name} preparation, ${test.name} format, ${test.name} scoring, ${test.name} tips`}
      />

      {/* Hero */}
      <PageHero
        title={test.name}
        subtitle={test.fullName}
        breadcrumb={breadcrumbItems}
      />

      {/* What is this test */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-brand mx-auto max-w-3xl [&>h2:first-child]:mt-0">
            <h2>What is {test.name}?</h2>
            <p>{test.description}</p>
          </div>
        </div>
      </section>

      {/* Test Format */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Test format" title="Test Format & Sections" />
          <div className="mx-auto max-w-4xl space-y-4">
            {test.format.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="flex items-start gap-4 rounded-2xl border border-dark-200/70 bg-white p-5 shadow-soft"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <span className="text-sm font-bold text-primary-600">{i + 1}</span>
                </div>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-display font-semibold text-dark-900">{section.section}</h3>
                    <span className="badge-primary">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {section.duration}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-dark-500">{section.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Scoring" title="Scoring System" />
          <div className="mx-auto max-w-4xl">
            <div className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-dark-50 p-6">
              <Award className="mt-0.5 h-6 w-6 shrink-0 text-primary-500" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-dark-600">{test.scoring}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Tips */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Preparation tips" title="Preparation Tips" />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {test.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-5 shadow-soft"
              >
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-dark-600">{tip}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Materials */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Study materials" title="Recommended Study Materials" />
          <div className="mx-auto max-w-4xl space-y-3">
            {test.materials.map((material, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-dark-50 p-4"
              >
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-secondary-500" aria-hidden="true" />
                <span className="text-sm text-dark-600">{material}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eduvia Preparation */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="At Eduvia" title={`${test.name} Preparation at Eduvia`} />
          <div className="mx-auto max-w-4xl rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft md:p-8">
            <p className="mb-6 text-sm leading-relaxed text-dark-500">
              At Eduvia Consultancy, we offer comprehensive {test.name} preparation classes led by experienced and certified instructors. Our structured curriculum covers all test sections with extensive practice materials, mock tests, and personalized feedback to help you achieve your target score.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Expert certified instructors',
                'Comprehensive study materials',
                'Regular mock tests and practice',
                'Personalized score improvement plan',
                'Flexible class schedules',
                'Small batch sizes for individual attention',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-dark-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {test.faqs && test.faqs.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <SectionHeading eyebrow="FAQs" title={`FAQs About ${test.name}`} />
              <FAQAccordion faqs={test.faqs} />
            </div>
          </div>
        </section>
      )}

      <CTASection
        title={`Ready to Start ${test.name} Preparation?`}
        subtitle={`Enroll in our ${test.name} preparation classes and achieve your target score. Book a free consultation today.`}
        primaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
        secondaryButton={{ label: 'View All Tests', path: '/test-preparation' }}
      />
    </>
  );
}
