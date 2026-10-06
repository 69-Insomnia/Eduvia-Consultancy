import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import CTASection from '../components/common/CTASection';

export default function Disclaimer() {
  const seo = useMergedSeo('disclaimer', {
    title: 'Disclaimer - Eduvia Consultancy',
    description: 'Important disclaimers regarding visa decisions, university admissions, and information accuracy at Eduvia Consultancy.',
    keywords: 'disclaimer, visa disclaimer, admission disclaimer, information accuracy',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="Disclaimer"
        subtitle="Important information to read before making decisions"
        size="sm"
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600 mb-8"><ArrowLeft className="w-4 h-4" aria-hidden="true" />Back to Home</Link>

            <div className="prose-brand space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-accent-200/70 bg-accent-50 p-6 shadow-soft"
              >
                <h2 className="text-lg font-display font-bold text-dark-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent-600" aria-hidden="true" />
                  Visa Decision Disclaimer
                </h2>
                <p className="text-sm text-dark-600 leading-relaxed">
                  Student visa approvals and rejections are entirely at the discretion of the respective immigration authorities. Eduvia Consultancy provides guidance and assistance in preparing visa applications, but we do not guarantee visa approval. The final decision rests solely with the immigration officials of the destination country. We shall not be held responsible for any visa refusal or delays in processing.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.06, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft"
              >
                <h2 className="text-lg font-display font-bold text-dark-900 mb-3">University Admission Disclaimer</h2>
                <p className="text-sm text-dark-600 leading-relaxed">
                  University admission decisions are made exclusively by the respective educational institutions. Eduvia Consultancy assists with application preparation and submission, but we do not guarantee admission to any university. Acceptance depends on the university's evaluation of the applicant's academic profile, documentation, and other criteria.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.12, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft"
              >
                <h2 className="text-lg font-display font-bold text-dark-900 mb-3">Rules and Regulations</h2>
                <p className="text-sm text-dark-600 leading-relaxed mb-4">
                  Visa rules, immigration policies, tuition fees, scholarship availability, and entry requirements are subject to change by the respective governments, immigration authorities, and educational institutions at any time without prior notice. The information provided on this website and during counseling is based on the most current information available at the time.
                </p>
                <p className="text-sm text-dark-600 leading-relaxed">
                  Students are strongly advised to verify all requirements, fees, and policies with official government and university sources before making any commitments or decisions. Eduvia Consultancy is not responsible for any discrepancies between the information provided and the actual requirements.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.18, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft"
              >
                <h2 className="text-lg font-display font-bold text-dark-900 mb-3">Information Accuracy</h2>
                <p className="text-sm text-dark-600 leading-relaxed mb-4">
                  While we strive to provide accurate and up-to-date information on our website and in our counseling sessions, we make no warranties or representations regarding the completeness, accuracy, or reliability of the information provided. This includes but is not limited to:
                </p>
                <ul className="list-disc list-inside text-sm text-dark-600 space-y-2">
                  <li>Tuition fees and living costs (which may change without notice)</li>
                  <li>University rankings and reputation (which are subjective and change annually)</li>
                  <li>Scholarship availability and amounts</li>
                  <li>Visa processing times (which vary by individual case)</li>
                  <li>Post-study work rights and employment prospects</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.24, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft"
              >
                <h2 className="text-lg font-display font-bold text-dark-900 mb-3">External Links</h2>
                <p className="text-sm text-dark-600 leading-relaxed">
                  Our website may contain links to external websites or third-party content. Eduvia Consultancy does not endorse, guarantee, or assume responsibility for the accuracy or content of external sites. Clicking on external links is at your own risk.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft"
              >
                <h2 className="text-lg font-display font-bold text-dark-900 mb-3">Testimonials</h2>
                <p className="text-sm text-dark-600 leading-relaxed">
                  Testimonials and success stories on our website represent the experiences of individual students. Their experiences may not be representative of all students, and individual results may vary. Past success does not guarantee future outcomes.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.36, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-dark-50 p-6 shadow-soft"
              >
                <h2 className="text-lg font-display font-bold text-dark-900 mb-3">Contact for Clarifications</h2>
                <p className="text-sm text-dark-600 leading-relaxed mb-4">
                  If you have any questions or need clarification regarding any information provided by Eduvia Consultancy, please contact us before making any decisions:
                </p>
                <ul className="list-none pl-0 text-sm text-dark-600 space-y-2">
                  <li><strong>Eduvia Consultancy Pvt. Ltd.</strong></li>
                  <li>Email: info@eduvia.com.np</li>
                  <li>Phone: +977-1-4XXXXXX</li>
                  <li>Address: Kathmandu, Nepal</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Have Questions?"
        subtitle="Our team is ready to clarify any concerns you may have about studying abroad."
        primaryButton={{ label: 'Contact Us', path: '/contact' }}
        secondaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
      />
    </>
  );
}
