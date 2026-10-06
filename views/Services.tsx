'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  BookOpen,
  GraduationCap,
  FileText,
  Award,
  ClipboardList,
  PenTool,
  Plane,
  MessageCircle,
  Headphones,
  Users,
  Heart,
  CheckCircle2,
  Briefcase,
  Home,
  Languages,
  ShieldCheck,
  TrendingUp,
  Globe,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { SITE_URL } from '../components/common/StructuredData';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const ALL_SERVICES: any[] = [
  {
    icon: Compass,
    title: 'Career Counseling',
    description: 'One-on-one counseling sessions to understand your academic background, career aspirations, and personal goals. We help you identify the right path for your future.',
    features: ['Personalized career assessment', 'Country and course recommendations', 'Budget planning guidance', 'Goal-setting workshops'],
  },
  {
    icon: BookOpen,
    title: 'Course Selection',
    description: 'Expert guidance to choose courses that align with your interests, market demand, and long-term career objectives across various fields of study.',
    features: ['Industry-aligned course suggestions', 'Comparison of program structures', 'Market demand analysis', 'Future career pathway mapping'],
  },
  {
    icon: GraduationCap,
    title: 'University Selection',
    description: 'Strategic shortlisting of universities based on your academic profile, budget, preferred location, and career goals to maximize your admission chances.',
    features: ['University ranking analysis', 'Program-specific shortlisting', 'Budget-friendly options', 'Scholarship-matched universities'],
  },
  {
    icon: FileText,
    title: 'Application Processing',
    description: 'Complete application management from document preparation to submission, ensuring accuracy and timely filing for maximum chances of acceptance.',
    features: ['Document verification', 'Application form filling', 'Deadline management', 'Follow-up with universities'],
  },
  {
    icon: Award,
    title: 'Scholarship Assistance',
    description: 'Identifying and applying for scholarships, grants, and financial aid opportunities to make your study abroad journey affordable.',
    features: ['Scholarship identification', 'Application preparation', 'Essay writing support', 'Financial aid guidance'],
  },
  {
    icon: ClipboardList,
    title: 'Documentation Support',
    description: 'Comprehensive assistance with preparing and organizing all required documents including transcripts, certificates, and financial documents.',
    features: ['Document checklist creation', 'Translation assistance', 'Notarization guidance', 'Financial documentation'],
  },
  {
    icon: PenTool,
    title: 'SOP & LOR Guidance',
    description: 'Professional support in writing compelling Statements of Purpose and Letters of Recommendation that strengthen your university applications.',
    features: ['SOP drafting and editing', 'LOR template guidance', 'Personal statement review', 'Multiple revision rounds'],
  },
  {
    icon: Plane,
    title: 'Visa Processing',
    description: 'End-to-end visa support from documentation to interview preparation, ensuring a smooth and successful visa application process.',
    features: ['Visa file preparation', 'Interview coaching', 'Mock visa interviews', 'Post-visa guidance'],
  },
  {
    icon: MessageCircle,
    title: 'Interview Preparation',
    description: 'Comprehensive preparation for university admission interviews and visa interviews through mock sessions and expert feedback.',
    features: ['Mock interview sessions', 'Common questions practice', 'Body language coaching', 'Confidence building'],
  },
  {
    icon: Headphones,
    title: 'Test Preparation',
    description: 'Expert coaching for IELTS, PTE, TOEFL, GRE, GMAT, SAT, and Duolingo with experienced instructors and proven strategies.',
    features: ['Expert faculty guidance', 'Practice tests and materials', 'Score improvement strategies', 'Flexible class schedules'],
  },
  {
    icon: Users,
    title: 'Pre-Departure Orientation',
    description: 'Comprehensive orientation covering travel arrangements, accommodation, banking, cultural adaptation, and settling into your new country.',
    features: ['Travel preparation tips', 'Accommodation guidance', 'Banking and finance setup', 'Cultural adaptation advice'],
  },
  {
    icon: Heart,
    title: 'Post-Arrival Support',
    description: 'Continued support after you reach your destination, including check-ins, academic guidance, and assistance with any challenges.',
    features: ['Airport pickup coordination', 'Academic progress tracking', 'Emergency assistance', 'Networking opportunities'],
  },
];

const PROCESS_STEPS = [
  { step: 1, title: 'Free Consultation', description: 'Book a free session with our expert counselors to discuss your study abroad plans.' },
  { step: 2, title: 'Profile Assessment', description: 'We evaluate your academic background, test scores, and preferences.' },
  { step: 3, title: 'Service Selection', description: 'Choose the services you need for your study abroad journey.' },
  { step: 4, title: 'Execution', description: 'Our team works on your applications, documents, and visa processing.' },
  { step: 5, title: 'Success', description: 'Receive your offer letter, complete your visa, and fly to your dream destination.' },
];

/**
 * The CMS stores an icon as a free-text label (seed data uses 'Visa',
 * 'Scholarship', …), while this page needs a component. Unknown labels fall
 * back to a neutral icon rather than rendering nothing.
 */
const ICON_MAP = {
  university: GraduationCap,
  visa: Plane,
  english: Languages,
  scholarship: Award,
  document: FileText,
  orientation: Compass,
  career: Briefcase,
  accommodation: Home,
  airport: Plane,
  pr: ShieldCheck,
  parent: Users,
  training: TrendingUp,
};

const resolveIcon = (name) => ICON_MAP[String(name || '').trim().toLowerCase()] || Globe;

export default function Services() {
  const [services, setServices] = useState(ALL_SERVICES);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      // The endpoint paginates to 10 by default; the service list is longer than
      // that and is meant to render in full.
      const res = await api.get('/services?limit=50');
      const list = res.data?.services || res.data?.data || res.data;
      // Only adopt CMS content when it actually yields something renderable;
      // otherwise the page would go blank if the collection is empty.
      if (Array.isArray(list) && list.some((s) => s.title)) {
        setServices(
          [...list]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((s) => ({
              id: s._id,
              title: s.title,
              description: s.description,
              features: s.features || [],
              image: s.image || '',
              icon: resolveIcon(s.icon),
              seo: s.seo || {},
            })),
        );
      }
    } catch {
      // keep the built-in list
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // Service nodes for what is on screen. `description` is required by
  // schema.org, so services without one are skipped.
  const described = services.filter((s) => s.description);
  const serviceList = described.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: described.map((s, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Service',
            name: s.title,
            description: s.description,
            provider: { '@id': `${SITE_URL}/#organization` },
          },
        })),
      }
    : null;

  const seo = useMergedSeo('services', {
    title: 'Our Services - Complete Study Abroad Support',
    description: 'Eduvia Consultancy offers comprehensive study abroad services including career counseling, university selection, visa processing, test preparation, and scholarship assistance.',
    keywords: 'study abroad services, career counseling, visa processing, university selection, test preparation, scholarship assistance',
  });

  return (
    <>
      <SEO {...seo} jsonLd={serviceList} />

      {/* Hero */}
      <PageHero
        title="Our Services"
        subtitle="Comprehensive support for every step of your study abroad journey. From initial counseling to post-arrival assistance."
      />

      {/* Services Grid */}
      <section className="py-16 md:py-20 lg:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={service.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  className="flex flex-col rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft transition-all hover:border-primary-200 hover:shadow-medium"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 mb-4">
                    <service.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-dark-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-dark-500 leading-relaxed mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {(service.features || []).map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-dark-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Process" title="How We Work" subtitle="Our streamlined process ensures a smooth and successful study abroad journey." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-brand">{step.step}</div>
                <h4 className="text-base font-display font-semibold text-dark-900 mb-2">{step.title}</h4>
                <p className="text-sm text-dark-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Get Started?"
        subtitle="Book a free counseling session to learn how our services can help you achieve your study abroad dream."
        primaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
        secondaryButton={{ label: 'View Test Preparation', path: '/test-preparation' }}
      />
    </>
  );
}
