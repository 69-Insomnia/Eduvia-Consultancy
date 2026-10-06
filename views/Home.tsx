'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from '../utils/router';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Globe,
  FileCheck,
  Award,
  ArrowRight,
  Search,
  Users,
  BookOpen,
  Shield,
  Headphones,
  Compass,
  Briefcase,
  Plane,
  Sparkles,
  Target,
  BadgeCheck,
  CalendarCheck,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { buildOrganization, SITE_URL, ORGANIZATION_ID, WEBSITE_ID } from '../components/common/StructuredData';
import { useSettings } from '../context/SettingsContext';
import { useMergedSeo } from '../context/PageSeoContext';
import SkeletonGrid from '../components/common/SkeletonGrid';
import SectionHeading from '../components/common/SectionHeading';
import StatsCounter from '../components/common/StatsCounter';
import EmptyState from '../components/common/EmptyState';
import CountryCard from '../components/common/CountryCard';
import UniversityCard from '../components/common/UniversityCard';
import BlogCard from '../components/common/BlogCard';
import TestimonialCard from '../components/common/TestimonialCard';
import CTASection from '../components/common/CTASection';
import FAQAccordion from '../components/common/FAQAccordion';
import CounselingForm from '../components/common/CounselingForm';
import api from '../services/api';
import { DESTINATIONS } from '../utils/constants';
import { DESTINATION_IMAGES } from '../utils/imageAssets';
import { normalizeStory } from '../utils/helpers';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const WHY_EDUVIA = [
  { icon: Target, title: 'Personalized Counseling', description: 'One-on-one sessions tailored to your academic background, career goals, and budget to find the best-fit university.' },
  { icon: Users, title: 'Experienced Counselors', description: 'Our team has guided thousands of students to top universities across 20+ countries worldwide.' },
  { icon: BookOpen, title: 'University Selection', description: 'Strategic shortlisting of universities that match your profile, ambitions, and financial situation.' },
  { icon: Award, title: 'Scholarship Guidance', description: 'We help you identify and apply for scholarships, grants, and financial aid to reduce your study costs.' },
  { icon: FileCheck, title: 'Visa Assistance', description: 'End-to-end visa guidance from documentation to interview preparation for a smooth approval process.' },
  { icon: Shield, title: 'Transparent Process', description: 'Clear communication at every step. No hidden fees, no false promises — just honest guidance.' },
  { icon: Headphones, title: 'Application Support', description: 'Professional SOP, LOR, and essay writing support to strengthen your university applications.' },
  { icon: Plane, title: 'Pre-Departure Guidance', description: 'Comprehensive orientation covering travel, accommodation, banking, and life abroad preparation.' },
];

const SERVICES_LIST = [
  { icon: Compass, title: 'Career Counseling', description: 'Expert guidance to align your academic choices with your long-term career aspirations and goals.', path: '/services' },
  { icon: BookOpen, title: 'Course Selection', description: 'Find the perfect course that matches your interests, skills, and future career prospects.', path: '/services' },
  { icon: GraduationCap, title: 'University Selection', description: 'Strategic selection from thousands of universities worldwide to find your ideal academic home.', path: '/services' },
  { icon: FileCheck, title: 'Visa Processing', description: 'Complete visa documentation and processing support for a smooth and successful application.', path: '/services' },
  { icon: Award, title: 'Scholarship Assistance', description: 'Access exclusive scholarships and financial aid opportunities to fund your education abroad.', path: '/scholarships' },
  { icon: Briefcase, title: 'Test Preparation', description: 'Comprehensive coaching for IELTS, PTE, TOEFL, GRE, GMAT, and SAT to achieve your target scores.', path: '/test-preparation' },
];

const PROCESS_STEPS = [
  { step: 1, title: 'Free Counseling', description: 'Discuss your goals, budget, and preferences with our expert counselors.' },
  { step: 2, title: 'Course Selection', description: 'We help you choose the right course aligned with your career objectives.' },
  { step: 3, title: 'University Shortlist', description: 'Get a curated list of universities matching your profile and preferences.' },
  { step: 4, title: 'Application', description: 'We prepare and submit your applications with compelling documents.' },
  { step: 5, title: 'SOP & LOR', description: 'Professional statement and recommendation letter writing support.' },
  { step: 6, title: 'Offer Letter', description: 'We guide you through offer evaluation and acceptance decisions.' },
  { step: 7, title: 'Scholarship', description: 'Apply for available scholarships and financial aid opportunities.' },
  { step: 8, title: 'Visa Processing', description: 'Complete visa documentation, filing, and interview preparation.' },
  { step: 9, title: 'Pre-Departure', description: 'Orientation covering travel, accommodation, banking, and settling in.' },
  { step: 10, title: 'Fly to Your Dream', description: 'Board your flight with confidence and begin your global education journey.' },
];

const TESTS_PREP = [
  { name: 'IELTS', description: 'International English Language Testing System — the most widely accepted English proficiency test.', band: '6.0 - 9.0', path: '/test-preparation/ielts' },
  { name: 'PTE', description: 'Pearson Test of English — a computer-based test accepted by thousands of institutions.', band: '50 - 90', path: '/test-preparation/pte' },
  { name: 'TOEFL', description: 'Test of English as a Foreign Language — trusted by universities worldwide.', band: '60 - 120', path: '/test-preparation/toefl' },
  { name: 'GRE', description: 'Graduate Record Examination — required for many graduate and business school programs.', band: '260 - 340', path: '/test-preparation/gre' },
  { name: 'GMAT', description: 'Graduate Management Admission Test — the gold standard for MBA admissions.', band: '200 - 800', path: '/test-preparation/gmat' },
  { name: 'SAT', description: 'Scholastic Assessment Test — widely used for undergraduate admissions in the US.', band: '400 - 1600', path: '/test-preparation/sat' },
];

const HOME_FAQS = [
  { question: 'How do I start my study abroad journey with Eduvia?', answer: 'Simply book a free counseling session with us. Our expert counselors will discuss your academic background, career goals, budget, and preferred destination to create a personalized study plan for you.' },
  { question: 'What countries can I study in through Eduvia?', answer: 'We help students apply to universities in Australia, Canada, United Kingdom, United States, New Zealand, Germany, Japan, South Korea, Ireland, Finland, Netherlands, and the United Arab Emirates.' },
  { question: 'Does Eduvia help with scholarships?', answer: 'Yes! We provide comprehensive scholarship guidance including identifying eligible scholarships, assisting with applications, and helping you write compelling scholarship essays.' },
  { question: 'How long does the visa process take?', answer: 'Visa processing times vary by country. Typically, student visas take 2-8 weeks. We ensure all your documents are in order to minimize processing delays.' },
  { question: 'Is the initial counseling session really free?', answer: 'Yes, absolutely! Our first counseling session is completely free with no obligation. We believe in transparent guidance from the very beginning.' },
  { question: 'Can I apply to multiple universities at once?', answer: 'Yes, we encourage applying to multiple universities to maximize your chances. We help you create a balanced shortlist of 5-8 universities based on your profile.' },
];

const TRUST_POINTS = [
  'Licensed by Nepal Government',
  'Member of QEAC',
  'ISO 9001 Certified',
  'Partner with 500+ Universities',
];

const HERO_BADGES = [
  { icon: Users, label: 'Expert Counselors' },
  { icon: GraduationCap, label: 'University Guidance' },
  { icon: FileCheck, label: 'Visa Assistance' },
  { icon: Award, label: 'Scholarship Support' },
];

const STATS = [
  { value: '10', suffix: '+', label: 'Years of Experience' },
  { value: '1000', suffix: '+', label: 'Students Placed' },
  { value: '20', suffix: '+', label: 'Study Destinations' },
  { value: '500', suffix: '+', label: 'Partner Universities' },
  { value: '95', suffix: '%+', label: 'Student Satisfaction' },
];

const HOME_SCHOLARSHIPS = [
  { name: 'Australia Awards Scholarships', university: 'Various Australian Universities', country: 'Australia', amount: 'Full Tuition + Living', deadline: '2026-04-30', type: 'merit', description: 'Fully funded scholarships from the Australian Government for international students from developing countries.' },
  { name: 'Chevening Scholarships', university: 'UK Universities', country: 'United Kingdom', amount: 'Full Tuition + Living', deadline: '2026-11-01', type: 'merit', description: 'The UK government global scholarship programme offering fully funded awards to outstanding professionals.' },
  { name: 'New Zealand Scholarships', university: 'Various NZ Universities', country: 'New Zealand', amount: 'Tuition + Allowance', deadline: '2026-03-15', type: 'general', description: 'New Zealand government scholarships for students from developing countries including Nepal.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [destinations, setDestinations] = useState(DESTINATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniRes, blogRes, destRes, testRes] = await Promise.allSettled([
          api.get('/universities?limit=4&featured=true'),
          api.get('/blogs?limit=3'),
          api.get('/destinations'),
          api.get('/success-stories?limit=3'),
        ]);
        if (uniRes.status === 'fulfilled') setFeaturedUniversities(uniRes.value.data?.universities || uniRes.value.data?.data || []);
        if (blogRes.status === 'fulfilled') setBlogs(blogRes.value.data?.blogs || blogRes.value.data?.data || []);
        if (destRes.status === 'fulfilled') {
          const d = destRes.value.data?.destinations || destRes.value.data?.data || [];
          if (d.length > 0) setDestinations(d);
        }
        if (testRes.status === 'fulfilled') setTestimonials((testRes.value.data?.stories || testRes.value.data?.data || []).map(normalizeStory));
      } catch {
        /* use fallback constants */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) navigate(`/universities?search=${encodeURIComponent(searchQuery.trim())}`);
    },
    [searchQuery, navigate]
  );

  const destinationCards = destinations.map((destination) => ({
    ...destination,
    image: destination.image || DESTINATION_IMAGES[destination.slug],
  }));

  // The home page's own override wins; the global SiteSettings SEO sits beneath
  // it as the fallback, then the literals below as the last resort.
  const seo = useMergedSeo('home', {
    title: 'Eduvia Consultancy - Study Abroad Consultancy in Nepal',
    description: "Eduvia Consultancy is Nepal's trusted study abroad consultancy providing expert counseling, university selection, visa assistance, and scholarship guidance for Nepali students.",
    keywords: settings.seo?.keywords?.join(', ') || 'study abroad Nepal, study abroad consultancy, education consultancy Nepal, study in Australia, study in Canada, study in UK',
    robots: settings.seo?.robots,
  });

  return (
    <>
      <SEO
        {...seo}
        image={settings.seo?.ogImage}
        canonical="/"
        jsonLd={[
          buildOrganization(settings),
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': WEBSITE_ID,
            name: settings.siteName || 'Eduvia Consultancy',
            url: SITE_URL,
            publisher: { '@id': ORGANIZATION_ID },
            // Universities.jsx reads ?search=, so this search box is real.
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/universities?search={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          },
          // Mirrors the FAQ accordion rendered at the bottom of this page.
          HOME_FAQS.length
            ? {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: HOME_FAQS.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
              }
            : null,
        ]}
      />

      {/* ============================================================== Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50 via-white to-primary-50/60">
        {/* Decorative field: soft brand waves, dotted map, dashed flight path */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg
            className="absolute -left-32 top-0 h-full w-[52%] text-primary-100"
            viewBox="0 0 400 620"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <path
              d="M-60 90 C 120 30, 250 170, 205 330 C 168 460, 30 520, -80 545"
              stroke="currentColor"
              strokeWidth="46"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M-80 430 C 70 385, 195 480, 235 620"
              stroke="currentColor"
              strokeWidth="32"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>

          {/* dotted "world map" texture */}
          <div
            className="absolute right-[4%] top-14 hidden h-64 w-[38%] opacity-40 lg:block"
            style={{
              backgroundImage: 'radial-gradient(#9fb0e9 1.5px, transparent 1.5px)',
              backgroundSize: '14px 14px',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 45%, transparent 78%)',
              maskImage: 'radial-gradient(ellipse at 50% 40%, #000 45%, transparent 78%)',
            }}
          />

          {/* dashed flight path + plane */}
          <svg
            className="absolute right-[16%] top-16 hidden h-32 w-56 text-primary-400 lg:block"
            viewBox="0 0 220 120"
            fill="none"
          >
            <path
              d="M6 104 C 54 74, 96 40, 150 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="7 8"
              strokeLinecap="round"
            />
            <path
              d="M186 6 l24 4 -15 12 -4 -7 -5 4 z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* LEFT — student photo inside an organic mask */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1"
            >
              <div
                className="relative overflow-hidden shadow-strong"
                style={{ borderRadius: '44% 56% 40% 60% / 30% 30% 70% 70%' }}
              >
                <img
                  src="/hero-student.jpg"
                  alt="A student heading to campus with a backpack and notebook"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>

              {/* handwritten accent, per the reference */}
              <span
                className="pointer-events-none absolute left-2 top-8 font-script text-3xl font-bold leading-tight text-primary-800 md:text-[2.1rem]"
                style={{ textShadow: '0 1px 3px rgba(255,255,255,0.95), 0 3px 14px rgba(255,255,255,0.9)' }}
              >
                Your Dreams
                <span className="block">Our Guidance</span>
                <svg className="mt-1 h-3 w-28 text-primary-500" viewBox="0 0 120 12" fill="none">
                  <path
                    d="M2 8 C 30 2, 60 12, 118 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.div>

            {/* RIGHT — the message */}
            <div className="order-1 lg:order-2">
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <motion.span
                  variants={fadeUp}
                  custom={0}
                  className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary-100 bg-white px-4 py-2 text-xs font-semibold text-dark-700 shadow-soft"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                    <Sparkles className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                  </span>
                  Nepal&rsquo;s Trusted Study Abroad Partner
                </motion.span>

                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="text-4xl font-display font-bold leading-[1.12] tracking-tight text-dark-900 md:text-5xl lg:text-[3.25rem]"
                >
                  Your journey to <span className="text-primary-500">global education</span> starts
                  here.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="mt-5 max-w-xl text-base leading-relaxed text-dark-500 md:text-lg"
                >
                  Expert guidance for Nepali students to study in Australia, Canada, the UK, the USA, and
                  20+ destinations. From your first counseling session to visa approval, we are with you
                  every step of the way.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/contact"
                    className="shine inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-white shadow-accent transition-all duration-200 hover:bg-accent-600 hover:shadow-accent-lg active:scale-[0.98]"
                  >
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    Book Free Counseling
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/study-abroad"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-dark-200 bg-white px-7 py-3.5 text-sm font-semibold text-dark-700 shadow-xs transition-all duration-200 hover:border-primary-300 hover:text-primary-600 active:scale-[0.98]"
                  >
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    Explore Destinations
                  </Link>
                </motion.div>

                <motion.ul variants={fadeUp} custom={4} className="mt-9 flex max-w-lg flex-wrap gap-2.5">
                  {HERO_BADGES.map((badge) => (
                    <li
                      key={badge.label}
                      className="flex items-center gap-2 rounded-full border border-dark-200/70 bg-white px-3.5 py-2 text-xs font-medium text-dark-600 shadow-xs"
                    >
                      <badge.icon className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                      {badge.label}
                    </li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Landmark cluster — the destinations, in miniature. Grouped with its
            label and offset so it clears both the badge row and the fixed
            action buttons pinned to the lower-right corner. */}
        <div
          className="pointer-events-none absolute bottom-16 right-24 hidden flex-col items-end gap-1 xl:flex"
          aria-hidden="true"
        >
          <div className="flex items-end">
            {[
              { src: '/destinations/united-kingdom.jpg', cls: 'h-20 w-20' },
              { src: '/destinations/united-states.jpg', cls: 'h-28 w-28' },
              { src: '/destinations/australia.jpg', cls: 'h-20 w-20' },
            ].map((item, i) => (
              <span
                key={item.src}
                className={`${item.cls} -ml-4 overflow-hidden rounded-full border-4 border-white shadow-medium first:ml-0`}
                style={{ zIndex: 3 - i }}
              >
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              </span>
            ))}
          </div>
          <span className="mr-1 font-script text-3xl font-bold text-primary-800">
            Study Abroad
            <svg className="mt-1 h-3 w-32 text-primary-500" viewBox="0 0 120 12" fill="none">
              <path
                d="M2 8 C 30 2, 60 12, 118 5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        {/* Curved base sweeping into the next section */}
        <svg
          className="absolute inset-x-0 -bottom-px h-[50px] w-full text-white md:h-[90px]"
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,74 C240,14 486,104 744,74 C1002,44 1230,14 1440,56 L1440,110 L0,110 Z"
            fill="currentColor"
          />
        </svg>
      </section>

      {/* ==================================================== Trust indicators */}
      <section className="border-b border-dark-200/70 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.14em] text-dark-400">
            Trusted by thousands of students and families across Nepal
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
            {TRUST_POINTS.map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-center justify-center gap-2 text-center text-sm font-medium text-dark-600"
              >
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                {text}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== Stats */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 py-14">
        <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
        <div className="aurora" aria-hidden="true">
          <span className="aurora-blob left-1/4 -top-16 h-72 w-72 bg-secondary-400/25 animate-aurora" />
          <span className="aurora-blob -right-10 bottom-0 h-64 w-64 bg-secondary-500/20 animate-aurora-slow" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StatsCounter stats={STATS} />
        </div>
      </section>

      {/* ================================================== Book a session */}
      <section className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                centered={false}
                eyebrow="Free Counseling"
                title="Talk to a counselor, at no cost"
                subtitle="Tell us where you want to study and we will map out the universities, costs, and timeline to get you there. The first session is completely free with no obligation."
              />
              <ul className="space-y-3.5">
                {[
                  'One-on-one session with an expert counselor',
                  'No fees for the first session',
                  'A counselor contacts you within 24 hours',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-dark-600">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-medium md:p-8"
            >
              <CounselingForm minimal />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================= Why Eduvia */}
      <section className="bg-gradient-to-b via-primary-50/70 from-white to-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Eduvia"
            title="Guidance you can actually trust"
            subtitle="With over a decade of experience, we have helped thousands of Nepali students achieve their dream of studying abroad."
          />
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_EDUVIA.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="group flex items-start gap-4 rounded-2xl border border-dark-200/70 bg-white p-4 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium sm:block sm:p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors duration-300 group-hover:bg-primary-500 sm:mb-4 sm:h-11 sm:w-11">
                  <item.icon
                    className="h-5 w-5 text-primary-500 transition-colors duration-300 group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-base font-semibold text-dark-900 sm:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-dark-500">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== Destinations */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Study Destinations"
            title="Where will your degree take you?"
            subtitle="Explore the top study destinations chosen by Nepali students for world-class education and global career opportunities."
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {destinationCards.slice(0, 8).map((dest, i) => (
              <motion.div
                key={dest.slug || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <CountryCard destination={dest} compact />
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/study-abroad"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
            >
              View all destinations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================= Universities */}
      <section className="bg-gradient-to-b via-primary-50/70 from-white to-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Universities"
            title="Find your university"
            subtitle="Search thousands of universities across the globe to find your perfect academic match."
          />

          <form onSubmit={handleSearch} className="mx-auto mb-12 max-w-2xl">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search universities, courses, or countries..."
                aria-label="Search universities"
                className="w-full rounded-2xl border border-dark-200 bg-white py-4 pl-12 pr-32 text-sm text-dark-900 shadow-soft transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                Search
              </button>
            </div>
          </form>

          {loading ? (
            <SkeletonGrid count={4} variant="plain" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" />
          ) : featuredUniversities.length === 0 ? (
            // Without this the section collapsed to a blank hole whenever the
            // API returned no featured universities.
            <EmptyState
              icon={GraduationCap}
              title="University listings are being updated"
              description="Browse the full directory to explore every university we work with, filtered by country, course, and tuition."
              action={
                <Link
                  to="/universities"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-primary-600 hover:shadow-brand active:scale-[0.98]"
                >
                  Browse all universities
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {featuredUniversities.map((uni, i) => (
                <motion.div
                  key={uni._id || uni.slug || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                >
                  <UniversityCard university={uni} compact />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
            >
              View all universities
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================== Services */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Services"
            title="Everything you need, end to end"
            subtitle="Comprehensive support from your first consultation to settling into your new country."
          />
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_LIST.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={service.path}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-dark-200/70 bg-white p-4 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium sm:block sm:p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 transition-colors duration-300 group-hover:bg-primary-500 sm:mb-4 sm:h-11 sm:w-11">
                    <service.icon
                      className="h-5 w-5 text-primary-500 transition-colors duration-300 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col sm:block">
                    <h3 className="mb-1 font-display text-base font-semibold text-dark-900 sm:mb-2">
                      {service.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-dark-500 sm:mb-5">{service.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors group-hover:text-primary-600">
                      Learn more
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-primary-600 hover:shadow-brand active:scale-[0.98]"
            >
              View all services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ Process */}
      <section className="bg-gradient-to-b via-primary-50/70 from-white to-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="Your study abroad journey"
            subtitle="A streamlined ten-step process from your first counseling session to boarding your flight."
          />
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="relative flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-4 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium sm:block sm:p-5"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white sm:mb-3">
                  {step.step}
                </span>
                <div>
                  <h3 className="mb-1 font-display text-sm font-semibold text-dark-900 sm:mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-dark-500">{step.description}</p>
                </div>
                {step.step === 10 && (
                  <span
                    className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary-500"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== Scholarships */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Funding"
            title="Scholarships for Nepali students"
            subtitle="Access exclusive scholarships and financial aid to make your study abroad dream affordable."
          />
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_SCHOLARSHIPS.map((scholarship, i) => (
              <motion.div
                key={scholarship.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="flex h-full flex-col rounded-2xl border border-dark-200/70 bg-white p-5 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="flex-1 font-display font-semibold leading-snug text-dark-900 line-clamp-2">
                    {scholarship.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-primary-700">
                    {scholarship.type}
                  </span>
                </div>
                <ul className="mb-4 space-y-2 text-sm text-dark-500">
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-dark-400" aria-hidden="true" />
                    {scholarship.university}
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-dark-400" aria-hidden="true" />
                    {scholarship.country}
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 shrink-0 text-dark-400" aria-hidden="true" />
                    {scholarship.amount}
                  </li>
                </ul>
                <p className="mb-4 text-sm leading-relaxed text-dark-500 line-clamp-2">
                  {scholarship.description}
                </p>
                <Link
                  to="/scholarships"
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
                >
                  View all scholarships
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== Test preparation */}
      <section className="bg-gradient-to-b via-primary-50/70 from-white to-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Test Preparation"
            title="Hit your target score"
            subtitle="Expert coaching for international standardized tests, built around your schedule and goals."
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {TESTS_PREP.map((test, i) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={test.path}
                  className="group flex h-full flex-col rounded-2xl border border-dark-200/70 bg-white p-4 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium sm:p-6"
                >
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-2 sm:mb-3 sm:gap-3">
                    <h3 className="font-display text-base font-bold text-dark-900 sm:text-lg">{test.name}</h3>
                    <span className="shrink-0 rounded-full bg-primary-50 px-2 py-1 text-[10px] font-semibold text-primary-600 sm:px-2.5 sm:text-[11px]">
                      {test.band}
                    </span>
                  </div>
                  <p className="mb-4 hidden text-sm leading-relaxed text-dark-500 sm:mb-5 sm:block">{test.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors group-hover:text-primary-600">
                    Learn more
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== Success stories */}
      {testimonials.length > 0 && (
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Success Stories"
              title="Students who made it"
              subtitle="Hear from students who have successfully achieved their dream of studying abroad."
            />
          <div className="grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                >
                  <TestimonialCard testimonial={t} />
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/success-stories"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
              >
                Read more stories
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== Blogs */}
      {blogs.length > 0 && (
        <section className="bg-gradient-to-b via-primary-50/70 from-white to-white py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Insights"
              title="Latest articles & guides"
              subtitle="Stay informed with the latest study abroad news, tips, and expert advice."
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <motion.div
                  key={blog._id || blog.slug || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                >
                  <BlogCard blog={blog} compact />
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
              >
                Read all articles
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ FAQ */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            subtitle="Answers to the most common questions about studying abroad with Eduvia."
          />
          <FAQAccordion faqs={HOME_FAQS} />
        </div>
      </section>

      {/* ================================================================ CTA */}
      <CTASection
        title="Ready to start your study abroad journey?"
        subtitle="Book a free counseling session with our expert team and take the first step toward your global education dream."
        primaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
        secondaryButton={{ label: 'Explore Our Services', path: '/services' }}
      />
    </>
  );
}
