'use client';

import { Link } from '../utils/router';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle2, Clock, Users, Target } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';

const TESTS = [
  {
    name: 'IELTS',
    slug: 'ielts',
    fullName: 'International English Language Testing System',
    description: 'The world\'s most popular English language proficiency test for higher education and global migration. Accepted by over 11,000 organizations worldwide.',
    band: '6.0 - 9.0',
    duration: '2 hours 45 minutes',
    sections: ['Listening', 'Reading', 'Writing', 'Speaking'],
    highlights: ['Accepted by 11,000+ organizations', 'Computer and paper-based options', 'Results in 3-5 days (computer)', 'Life Skills versions available'],
  },
  {
    name: 'PTE',
    slug: 'pte',
    fullName: 'Pearson Test of English',
    description: 'A computer-based English proficiency test trusted by governments and universities worldwide. Known for fast results and unbiased scoring.',
    band: '50 - 90',
    duration: '2 hours',
    sections: ['Speaking & Writing', 'Reading', 'Listening'],
    highlights: ['Fully computer-based scoring', 'Results in 2-48 hours', 'Accepted by 3,000+ institutions', 'Unbiased AI scoring'],
  },
  {
    name: 'TOEFL',
    slug: 'toefl',
    fullName: 'Test of English as a Foreign Language',
    description: 'The most widely accepted English proficiency test globally, particularly in the US. Measures academic English skills.',
    band: '60 - 120',
    duration: '3 hours',
    sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
    highlights: ['Accepted by 160+ countries', 'iBT home edition available', 'Trusted by US universities', 'Comprehensive skill assessment'],
  },
  {
    name: 'GRE',
    slug: 'gre',
    fullName: 'Graduate Record Examinations',
    description: 'The standard test for graduate school admissions worldwide. Required for many Master\'s and PhD programs.',
    band: '260 - 340',
    duration: '3 hours 45 minutes',
    sections: ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing'],
    highlights: ['Accepted by thousands of grad schools', 'ScoreSelect option', 'Computer-adaptive testing', 'Test can be retaken'],
  },
  {
    name: 'GMAT',
    slug: 'gmat',
    fullName: 'Graduate Management Admission Test',
    description: 'The gold standard for MBA admissions. Used by leading business schools worldwide to assess analytical and critical thinking skills.',
    band: '200 - 800',
    duration: '3 hours 30 minutes',
    sections: ['Quantitative Reasoning', 'Verbal Reasoning', 'Integrated Reasoning', 'Analytical Writing'],
    highlights: ['Required by top business schools', 'Computer-adaptive format', 'Test can be taken online', 'Valid for 5 years'],
  },
  {
    name: 'SAT',
    slug: 'sat',
    fullName: 'Scholastic Assessment Test',
    description: 'A standardized test widely used for undergraduate admissions in the United States. Measures literacy and writing skills.',
    band: '400 - 1600',
    duration: '3 hours',
    sections: ['Evidence-Based Reading', 'Writing and Language', 'Math'],
    highlights: ['Required by many US universities', 'Digital SAT available', 'Test-optional at some schools', 'Score range: 400-1600'],
  },
  {
    name: 'Duolingo',
    slug: 'duolingo',
    fullName: 'Duolingo English Test',
    description: 'An affordable, convenient English proficiency test taken online from home. Accepted by growing number of universities worldwide.',
    band: '95 - 160',
    duration: '1 hour',
    sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
    highlights: ['Take from home anytime', 'Results in 48 hours', 'Affordable at $59', 'Accepted by 4,000+ institutions'],
  },
];

export default function TestPreparation() {
  const seo = useMergedSeo('test-preparation', {
    title: 'Test Preparation - IELTS, PTE, TOEFL, GRE, GMAT, SAT Coaching',
    description: 'Expert coaching for IELTS, PTE, TOEFL, GRE, GMAT, SAT, and Duolingo at Eduvia Consultancy. Achieve your target scores with our proven preparation methods.',
    keywords: 'IELTS preparation, PTE coaching, TOEFL classes, GRE preparation, GMAT coaching, SAT prep, Duolingo test',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        eyebrow="Expert Test Preparation"
        icon={BookOpen}
        title="Test Preparation"
        subtitle="Achieve your target scores with our expert coaching for IELTS, PTE, TOEFL, GRE, GMAT, SAT, and Duolingo."
      />

      {/* Test Cards */}
      <section className="bg-dark-50 py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {TESTS.map((test, i) => (
              <motion.div
                key={test.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <Link
                  to={`/test-preparation/${test.slug}`}
                  className="group flex flex-col rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium md:p-8"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-display font-bold text-dark-900 transition-colors group-hover:text-primary-600 md:text-2xl">{test.name}</h2>
                      <p className="text-sm text-dark-400">{test.fullName}</p>
                    </div>
                    <span className="badge-primary shrink-0">{test.band}</span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-dark-500">{test.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {test.sections.map((s) => (
                      <span key={s} className="badge-neutral">{s}</span>
                    ))}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {test.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-dark-500">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden="true" />
                        {h}
                      </div>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors group-hover:text-primary-600">
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Prepare with Eduvia */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Eduvia"
            title="Why Prepare with Eduvia?"
            subtitle="Our proven preparation methods and expert faculty help you achieve your target scores."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: 'Expert Faculty', description: 'Learn from certified instructors with years of test preparation experience.' },
              { icon: Target, title: 'Proven Strategies', description: 'Master time-tested strategies and techniques for each test section.' },
              { icon: Clock, title: 'Flexible Schedules', description: 'Choose from morning, evening, and weekend batches to fit your schedule.' },
              { icon: BookOpen, title: 'Comprehensive Materials', description: 'Access extensive practice materials, mock tests, and study resources.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <item.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-base font-display font-semibold text-dark-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-dark-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Start Your Test Preparation?"
        subtitle="Enroll in our test preparation classes and achieve your target scores. Book a free demo class today."
        primaryButton={{ label: 'Book Free Demo Class', path: '/contact' }}
        secondaryButton={{ label: 'View All Services', path: '/services' }}
      />
    </>
  );
}
