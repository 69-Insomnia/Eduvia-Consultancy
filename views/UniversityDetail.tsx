'use client';

import { useState, useEffect } from 'react';
import { useParams } from '../utils/router';
import { motion } from 'framer-motion';
import {
  MapPin,
  GraduationCap,
  DollarSign,
  Calendar,
  Award,
  Globe,
  CheckCircle2,
  ExternalLink,
  Building2,
  FileText,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { buildBreadcrumbList } from '../components/common/StructuredData';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CTASection from '../components/common/CTASection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SmartImage from '../components/common/SmartImage';
import api from '../services/api';
import { storedImageCandidates } from '../utils/imageAssets';

export default function UniversityDetail() {
  const { slug } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/universities/${slug}`);
        setUniversity(res.data?.university || res.data);
      } catch {
        setError('University not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-dark-500">{error}</p></div>;

  const u = university;
  const name = u?.name || slug;
  const breadcrumbItems = [
    { label: 'Universities', link: '/universities' },
    { label: name },
  ];

  // Authored SEO wins; the template is only a fallback so an unedited
  // university still gets a sensible title.
  const seo = u?.seo || {};

  return (
    <>
      <SEO
        title={seo.title || `${name} - University Details & Admissions`}
        description={seo.description || `Learn about ${name}: programs, admission requirements, tuition fees, scholarships, and how to apply. Expert guidance from Eduvia Consultancy.`}
        keywords={seo.keywords?.join(', ') || `${name}, university, programs, admission, tuition fees, scholarships`}
        image={seo.ogImage}
        canonical={seo.canonical || `/universities/${u?.slug || slug}`}
        type={seo.ogType}
        robots={seo.robots}
        jsonLd={buildBreadcrumbList(breadcrumbItems)}
      />

      {/* Hero */}
      <PageHero title={name} breadcrumb={breadcrumbItems} />

      {/* University identity — logo + location */}
      <section className="bg-white pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6">
            <SmartImage
              candidates={storedImageCandidates(u.logo)}
              alt={name}
              className="h-20 w-20 shrink-0 rounded-2xl bg-white object-contain p-2 shadow-soft md:h-24 md:w-24"
              fallback={
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-50 md:h-24 md:w-24">
                  <GraduationCap className="h-10 w-10 text-primary-500" aria-hidden="true" />
                </div>
              }
            />
            <div className="max-w-3xl">
              {(u.city || u.country) && (
                <span className="mt-4 flex items-center gap-1.5 text-sm text-dark-500">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {[u.city, u.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-dark-900">Overview</h2>
              <p className="mb-6 leading-relaxed text-dark-500">
                {u.description || u.overview || `${name} is a prestigious educational institution${u.country ? ` located in ${u.country}` : ''}. Known for its academic excellence and diverse programs, the university attracts students from around the world seeking quality education and global career opportunities.`}
              </p>
              {u.website && (
                <a href={u.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600">
                  Visit Official Website <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="rounded-2xl border border-dark-200/70 bg-dark-50 p-6 shadow-soft">
              <h3 className="mb-4 font-display text-lg font-semibold text-dark-900">Quick Facts</h3>
              <div className="space-y-3">
                {u.country && (
                  <div className="flex items-center gap-3 text-sm text-dark-600">
                    <Globe className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                    <span>{u.country}</span>
                  </div>
                )}
                {u.city && (
                  <div className="flex items-center gap-3 text-sm text-dark-600">
                    <MapPin className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                    <span>{u.city}</span>
                  </div>
                )}
                {/* The schema field is `founded` — the admin form and the seed both
                    write it — so reading `establishedYear` showed nothing. */}
                {u.founded && (
                  <div className="flex items-center gap-3 text-sm text-dark-600">
                    <Calendar className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                    <span>Established: {u.founded}</span>
                  </div>
                )}
                {u.ranking && (
                  <div className="flex items-center gap-3 text-sm text-dark-600">
                    <Award className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                    <span>Ranking: {u.ranking}</span>
                  </div>
                )}
                {u.type && (
                  <div className="flex items-center gap-3 text-sm text-dark-600">
                    <Building2 className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                    <span>Type: {u.type}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Programs */}
      {u.popularCourses && u.popularCourses.length > 0 && (
        <section className="bg-dark-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Programs" title="Popular Programs" />
            <div className="overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-dark-200/70 bg-dark-50">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-dark-500">Program</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-dark-500">Degree Level</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-dark-500">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200/70">
                    {u.popularCourses.map((course, i) => (
                      <tr key={i} className="transition-colors hover:bg-dark-50">
                        <td className="px-6 py-4 text-sm font-medium text-dark-900">{typeof course === 'string' ? course : course.name}</td>
                        <td className="px-6 py-4 text-sm text-dark-500">{typeof course === 'object' ? course.level : 'Various'}</td>
                        <td className="px-6 py-4 text-sm text-dark-500">{typeof course === 'object' ? course.duration : 'Varies'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Entry Requirements */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45 }}>
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-dark-900">
                <FileText className="h-5 w-5 text-secondary-500" aria-hidden="true" />
                Entry Requirements
              </h3>
              <p className="text-sm leading-relaxed text-dark-500">
                {u.entryRequirements || 'Entry requirements vary by program level and course. Generally, applicants need completed previous education with relevant academic qualifications, English language proficiency (IELTS/TOEFL/PTE), and a valid passport.'}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: 0.06, duration: 0.45 }}>
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-dark-900">
                <DollarSign className="h-5 w-5 text-primary-500" aria-hidden="true" />
                Tuition Fees
              </h3>
              <p className="text-sm leading-relaxed text-dark-500">
                {u.tuitionFees || 'Tuition fees vary by program and level of study. Contact us for the latest fee structure and available payment plans.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      {u.scholarships && u.scholarships.length > 0 && (
        <section className="bg-dark-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Funding" title="Scholarships" />
            <div className="space-y-3">
              {u.scholarships.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06, duration: 0.45 }} className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
                  <div>
                    <h4 className="text-sm font-semibold text-dark-900">{typeof s === 'string' ? s : s.name}</h4>
                    {typeof s === 'object' && s.description && <p className="mt-1 text-sm text-dark-500">{s.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Intakes */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Admission cycles" title="Intakes" />
          <div className="flex flex-wrap justify-center gap-3">
            {(u.intakes || ['Spring (February/March)', 'Fall (August/September)']).map((intake, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06, duration: 0.45 }} className="flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {typeof intake === 'string' ? intake : intake.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Study Here */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why this university" title={`Why Study at ${name}?`} />
          <div className="grid sm:grid-cols-2 gap-4">
            {(u.whyStudyHere || [
              'Globally recognized degree and qualifications',
              'Diverse and inclusive campus community',
              'Research opportunities with leading faculty',
              'Strong industry connections and career support',
              'Modern facilities and learning resources',
              'Vibrant student life and cultural experiences',
            ]).map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06, duration: 0.45 }} className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm text-dark-600">{typeof item === 'string' ? item : item.title || item.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Application process" title="How to Apply" subtitle="Follow these steps to start your application to this university." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Choose Program', desc: 'Select the program that matches your academic and career goals.' },
              { step: '02', title: 'Prepare Documents', desc: 'Gather transcripts, test scores, recommendation letters, and SOP.' },
              { step: '03', title: 'Submit Application', desc: 'Complete and submit your application with all required documents.' },
              { step: '04', title: 'Receive Offer', desc: 'Get your offer letter and proceed with enrollment and visa.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06, duration: 0.45 }} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">{item.step}</div>
                <h4 className="mb-2 font-display text-base font-semibold text-dark-900">{item.title}</h4>
                <p className="text-sm text-dark-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to Apply to ${name}?`}
        subtitle="Get expert guidance on admission requirements, application process, and visa. Book a free counseling session today."
        primaryButton={{ label: 'Start Your Application', path: '/contact' }}
        secondaryButton={{ label: 'Explore More Universities', path: '/universities' }}
      />
    </>
  );
}
