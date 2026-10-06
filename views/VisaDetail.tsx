'use client';

import { useState, useEffect } from 'react';
import { useParams, Link } from '../utils/router';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Shield,
  Clock,
  DollarSign,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import FAQAccordion from '../components/common/FAQAccordion';
import CTASection from '../components/common/CTASection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';

const VISA_DATA = {
  australia: {
    name: 'Australia',
    processingTime: '4 - 12 weeks',
    visaFee: 'AUD 710',
    workRights: '48 hours per fortnight during studies, unlimited during breaks',
    postStudyWork: 'Temporary Graduate Visa (subclass 485) — 2 to 4 years depending on qualification',
    requirements: [
      'Confirmation of Enrolment (CoE) from a CRICOS-registered institution',
      'Valid passport',
      'Genuine Temporary Entrant (GTE) statement',
      'Proof of financial capacity (AUD 24,505+ per year for living costs)',
      'English proficiency test results',
      'Overseas Student Health Cover (OSHC)',
      'Health examination (if required)',
      'Character assessment',
    ],
    documents: [
      'Passport (valid for at least 6 months)',
      'Offer letter and CoE',
      'Academic transcripts and certificates',
      'IELTS/PTE/TOEFL score report',
      'Bank statements (last 6 months)',
      'Income tax returns of sponsors',
      'Police clearance certificate',
      'Health insurance receipt',
      'Passport-size photographs',
      'Genuine Temporary Entrant (GTE) statement',
    ],
    commonMistakes: [
      'Providing insufficient financial evidence',
      'Not writing a compelling GTE statement',
      'Incomplete or inconsistent documentation',
      'Applying too close to course commencement',
      'Failing to disclose previous visa refusals',
    ],
    interviewTips: [
      'Be clear about your study plans and career goals',
      'Explain why you chose Australia specifically',
      'Demonstrate ties to your home country',
      'Be honest about your financial situation',
      'Know details about your chosen course and university',
    ],
    faqs: [
      { question: 'How long does the Australian student visa take?', answer: 'Processing typically takes 4-12 weeks depending on the application completeness and individual circumstances.' },
      { question: 'Can I work while studying in Australia?', answer: 'Yes, student visa holders can work up to 48 hours per fortnight during academic sessions and unlimited hours during scheduled breaks.' },
      { question: 'Do I need health insurance for Australian student visa?', answer: 'Yes, Overseas Student Health Cover (OSHC) is mandatory for the duration of your stay.' },
    ],
  },
  canada: {
    name: 'Canada',
    processingTime: '8 - 16 weeks',
    visaFee: 'CAD 150 + CAD 85 (biometrics)',
    workRights: '20 hours per week during studies, full-time during breaks',
    postStudyWork: 'Post-Graduation Work Permit (PGWP) — up to 3 years depending on program length',
    requirements: [
      'Letter of Acceptance from a Designated Learning Institution (DLI)',
      'Valid passport',
      'Proof of financial support',
      'Language test results',
      'Immigration Medical Examination (if required)',
      'Police clearance certificate',
      'Digital photograph',
    ],
    documents: [
      'Passport',
      'Letter of Acceptance from DLI',
      'Academic transcripts',
      'Language test results (IELTS/CELPIP)',
      'Proof of funds (GIC of CAD 20,635 or bank statements)',
      'Study Plan / Statement of Purpose',
      'Police clearance certificate',
      'Medical examination receipt',
      'Photographs',
      'Family Information Form (IMM 5707)',
    ],
    commonMistakes: [
      'Not demonstrating sufficient funds',
      'Weak study plan or statement of purpose',
      'Applying to institutions not designated as DLIs',
      'Failing to meet language requirements',
      'Incomplete application forms',
    ],
    interviewTips: [
      'Be prepared to explain your study plan clearly',
      'Show evidence of financial support',
      'Demonstrate that you will return to your home country',
      'Know your chosen institution and program details',
      'Be honest about your intentions',
    ],
    faqs: [
      { question: 'How long does the Canadian student visa take?', answer: 'Processing takes 8-16 weeks. Apply at least 3-4 months before your program starts.' },
      { question: 'Can I work while studying in Canada?', answer: 'Yes, you can work up to 20 hours per week during studies and full-time during scheduled breaks.' },
      { question: 'What is the GIC requirement?', answer: 'Guaranteed Investment Certificate (GIC) of CAD 20,635 is required as proof of funds for the Student Direct Stream.' },
    ],
  },
  'united-kingdom': {
    name: 'United Kingdom',
    processingTime: '3 - 6 weeks',
    visaFee: 'GBP 490 + Immigration Health Surcharge',
    workRights: '20 hours per week during term-time, full-time during vacations',
    postStudyWork: 'Graduate Route Visa — 2 years (3 years for PhD graduates)',
    requirements: [
      'Confirmation of Acceptance for Studies (CAS) from a licensed sponsor',
      'Valid passport',
      'Proof of funds (1,334 GBP per month for London, 1,023 GBP outside)',
      'English language proficiency',
      'ATAS certificate (if applicable)',
      'TB test certificate (if applicable)',
    ],
    documents: [
      'Valid passport',
      'CAS number from university',
      'Academic transcripts',
      'IELTS/UKVI score report',
      'Bank statements (28 days)',
      'ATAS certificate (if required)',
      'TB test certificate',
      'Photographs',
      'Parental consent (if under 18)',
    ],
    commonMistakes: [
      'Not meeting the financial requirement',
      'CAS errors or mismatched information',
      'Failing to provide ATAS certificate when required',
      'Incorrect IELTS for UKVI test type',
      'Not applying within 6 months of CAS issue',
    ],
    interviewTips: [
      'Know your course details and university',
      'Be clear about why you chose the UK',
      'Have proof of financial support ready',
      'Understand your post-study plans',
      'Be confident and concise in answers',
    ],
    faqs: [
      { question: 'What test do I need for UK student visa?', answer: 'You need IELTS for UKVI (UK Visas and Immigration) specifically, not regular IELTS.' },
      { question: 'How long does UK student visa take?', answer: 'Standard processing is 3 weeks. Priority service may be available for faster processing.' },
    ],
  },
  'united-states': {
    name: 'United States',
    processingTime: '2 - 8 weeks',
    visaFee: 'USD 185 (MRV fee)',
    workRights: 'On-campus only for first year, CPT/OPT after that',
    postStudyWork: 'OPT — 12 months (36 months for STEM fields)',
    requirements: [
      'Form I-20 from a SEVP-certified institution',
      'Valid passport',
      'DS-160 confirmation page',
      'SEVIS fee receipt',
      'Financial documents',
      'Academic transcripts',
      'English proficiency test scores',
    ],
    documents: [
      'Passport (valid for 6+ months beyond stay)',
      'Form I-20',
      'DS-160 confirmation',
      'SEVIS I-901 fee receipt',
      'Visa application fee receipt',
      'Academic transcripts',
      'Standardized test scores (SAT/GRE/GMAT)',
      'English proficiency scores',
      'Bank statements',
      'Sponsorship letters (if applicable)',
      'Photographs',
    ],
    commonMistakes: [
      'Not demonstrating strong ties to home country',
      'Insufficient financial proof',
      'Vague answers during the visa interview',
      'Choosing inconsistent university/course',
      'Missing SEVIS payment',
    ],
    interviewTips: [
      'Be confident and answer questions directly',
      'Explain your career plans after graduation',
      'Show evidence you will return to Nepal',
      'Know your I-20 and university details',
      'Dress professionally for the interview',
    ],
    faqs: [
      { question: 'How do I schedule a US visa interview?', answer: 'After paying the MRV fee and completing DS-160, schedule your interview at the US Embassy in Kathmandu.' },
      { question: 'Can I work in the US after graduation?', answer: 'Yes, through Optional Practical Training (OPT) — 12 months for all graduates, 36 months for STEM graduates.' },
    ],
  },
};

export default function VisaDetail() {
  const { slug } = useParams() as any;
  const [visaInfo, setVisaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisaInfo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/destinations/${slug}`);
        const dest = res.data?.destination || res.data;
        if (dest.visaInformation) {
          setVisaInfo(dest.visaInformation);
        } else {
          setVisaInfo(VISA_DATA[slug] || null);
        }
      } catch {
        setVisaInfo(VISA_DATA[slug] || null);
      } finally {
        setLoading(false);
      }
    };
    fetchVisaInfo();
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (!visaInfo) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-dark-500 mb-4">Visa information not found for this destination.</p>
        <Link to="/student-visa" className="text-primary-500 hover:text-primary-600 font-medium">Back to Student Visa</Link>
      </div>
    );
  }

  const v = visaInfo;
  const countryName = v.name || slug;

  const breadcrumbItems = [
    { label: 'Student Visa', link: '/student-visa' },
    { label: `Student Visa - ${countryName}` },
  ];

  return (
    <>
      <SEO
        title={`Student Visa for ${countryName} - Complete Guide`}
        description={`Complete student visa guide for ${countryName}: requirements, documents checklist, application process, interview preparation, and tips from Eduvia Consultancy.`}
        keywords={`student visa ${countryName}, ${countryName} visa requirements, ${countryName} student visa process`}
      />

      {/* Hero */}
      <PageHero
        title={`Student Visa - ${countryName}`}
        subtitle={`Complete guide to obtaining a student visa for ${countryName}.`}
        breadcrumb={breadcrumbItems}
      />

      {/* Quick Info */}
      <section className="border-b border-dark-200/70 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, label: 'Processing Time', value: v.processingTime },
              { icon: DollarSign, label: 'Visa Fee', value: v.visaFee },
              { icon: FileText, label: 'Work Rights', value: v.workRights },
              { icon: Shield, label: 'Post-Study Work', value: v.postStudyWork },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-dark-50 p-5"
              >
                <item.icon className="mb-2 h-5 w-5 text-secondary-500" aria-hidden="true" />
                <p className="mb-0.5 text-xs text-dark-400">{item.label}</p>
                <p className="text-sm font-semibold text-dark-900">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Requirements" title="Visa Requirements" />
          <div className="mx-auto max-w-4xl space-y-3">
            {v.requirements.map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-4 shadow-soft"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm text-dark-600">{req}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Checklist */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Documents" title="Documents Checklist" />
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {v.documents.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="flex items-center gap-3 rounded-2xl border border-dark-200/70 bg-dark-50 p-4"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm text-dark-600">{doc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      {v.commonMistakes && v.commonMistakes.length > 0 && (
        <section className="bg-dark-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Common mistakes" title="Common Mistakes to Avoid" />
            <div className="mx-auto max-w-4xl space-y-3">
              {v.commonMistakes.map((mistake, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-4 shadow-soft"
                >
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
                  <span className="text-sm text-dark-600">{mistake}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interview Preparation */}
      {v.interviewTips && v.interviewTips.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Interview prep" title="Interview Preparation Tips" />
            <div className="mx-auto max-w-4xl space-y-3">
              {v.interviewTips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-dark-50 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span className="text-sm text-dark-600">{tip}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Eduvia Visa Assistance */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="At Eduvia" title="How Eduvia Helps with Your Visa" />
          <div className="mx-auto max-w-4xl rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft md:p-8">
            <p className="mb-6 text-sm leading-relaxed text-dark-500">
              At Eduvia Consultancy, we provide end-to-end visa assistance to maximize your chances of approval. Our visa team has years of experience with {countryName} student visas and stays updated with the latest immigration policies.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Complete documentation guidance',
                'Financial statement preparation',
                'GTE/SOP writing assistance',
                'Mock visa interviews',
                'Application review and submission',
                'Post-visa travel arrangements',
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
      {v.faqs && v.faqs.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <SectionHeading eyebrow="FAQs" title={`FAQs About ${countryName} Student Visa`} />
              <FAQAccordion faqs={v.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-amber-700">
              <strong>Disclaimer:</strong> Visa rules, fees, and processing times are subject to change by the respective immigration authorities. The information provided is for general guidance only. Students are advised to verify all requirements with official government sources before applying.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title={`Need Visa Assistance for ${countryName}?`}
        subtitle="Our visa experts will guide you through the entire process with a high success rate."
        primaryButton={{ label: 'Get Visa Help', path: '/contact' }}
        secondaryButton={{ label: 'Explore More Destinations', path: '/student-visa' }}
      />
    </>
  );
}
