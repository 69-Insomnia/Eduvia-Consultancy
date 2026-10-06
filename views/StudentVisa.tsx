'use client';

import { useState, useEffect } from 'react';
import { Link } from '../utils/router';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import CountryFlag from '../components/common/CountryFlag';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import SkeletonGrid from '../components/common/SkeletonGrid';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import api from '../services/api';
import { DESTINATIONS } from '../utils/constants';

const VISA_PROCESS_STEPS = [
  { step: 1, title: 'Gather Documents', description: 'Collect all required documents including passport, academic transcripts, financial statements, and English proficiency scores.' },
  { step: 2, title: 'Receive Offer Letter', description: 'Get your offer letter from the university. This is required for your visa application.' },
  { step: 3, title: 'Prepare Visa File', description: 'Organize all documents in the format required by the immigration authority.' },
  { step: 4, title: 'Submit Application', description: 'Submit your visa application online or at the visa application center.' },
  { step: 5, title: 'Biometrics', description: 'Attend your biometrics appointment at the designated center.' },
  { step: 6, title: 'Interview', description: 'Some countries require a visa interview. We prepare you thoroughly.' },
  { step: 7, title: 'Visa Decision', description: 'Receive your visa decision. We assist if any additional information is required.' },
];

export default function StudentVisa() {
  const [destinations, setDestinations] = useState(DESTINATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        const data = res.data?.destinations || res.data?.data || [];
        if (data.length > 0) setDestinations(data);
      } catch {
        /* use constants */
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const seo = useMergedSeo('student-visa', {
    title: 'Student Visa Services - Expert Visa Guidance',
    description: 'Get expert student visa assistance from Eduvia Consultancy. We help Nepali students with visa documentation, application, interview preparation for Australia, Canada, UK, USA, and more.',
    keywords: 'student visa, visa services, student visa assistance, visa processing, study abroad visa',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        eyebrow="Visa Assistance"
        icon={FileText}
        title="Student Visa Services"
        subtitle="Navigate the student visa process with confidence. Our experts guide you through documentation, application, and interview preparation."
      />

      {/* Destination Visa Cards */}
      <section className="bg-dark-50 py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Destinations"
            title="Student Visa by Destination"
            subtitle="Choose your study destination to learn about specific visa requirements and processes."
          />
          {loading ? (
            <SkeletonGrid count={8} variant="plain" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.slug || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <Link
                    to={`/student-visa/${dest.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <CountryFlag slug={dest.slug} code={dest.code} className="h-6 w-9" />
                      <h3 className="text-base font-display font-semibold text-dark-900 transition-colors group-hover:text-primary-600">{dest.name}</h3>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-dark-500">Student visa requirements and process for {dest.name}.</p>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors group-hover:text-primary-600">
                      View Details
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* General Visa Process */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Application steps"
            title="General Student Visa Process"
            subtitle="A step-by-step overview of the typical student visa application process."
          />
          <div className="mx-auto max-w-3xl space-y-6">
            {VISA_PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white shadow-brand">{step.step}</div>
                <div>
                  <h3 className="mb-1 text-base font-display font-semibold text-dark-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-dark-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Eduvia */}
      <section className="bg-dark-50 py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why Eduvia" title="Why Choose Eduvia for Visa Assistance?" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '95% Visa Success Rate', description: 'Our expert guidance ensures a high visa approval rate across all destinations.' },
              { title: 'Complete Documentation', description: 'We help you prepare and organize all required documents perfectly.' },
              { title: 'Interview Preparation', description: 'Mock interviews and coaching to build your confidence for the visa interview.' },
              { title: 'Up-to-Date Knowledge', description: 'We stay current with the latest immigration policies and requirements.' },
              { title: 'Transparent Process', description: 'No hidden charges. Complete clarity on the visa process and timeline.' },
              { title: 'Post-Visa Support', description: 'Assistance with travel arrangements, accommodation, and pre-departure orientation.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="flex flex-col rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <CheckCircle2 className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-base font-display font-semibold text-dark-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-dark-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Need Help with Your Student Visa?"
        subtitle="Our visa experts will guide you through the entire process. Book a free consultation today."
        primaryButton={{ label: 'Get Visa Assistance', path: '/contact' }}
        secondaryButton={{ label: 'Explore Destinations', path: '/study-abroad' }}
      />
    </>
  );
}
