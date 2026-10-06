import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';

export default function TermsConditions() {
  const seo = useMergedSeo('terms-conditions', {
    title: 'Terms & Conditions - Eduvia Consultancy',
    description: 'Eduvia Consultancy terms and conditions. Read our service terms, fee policies, liability, and more.',
    keywords: 'terms and conditions, service terms, fee policy, liability',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="Terms & Conditions"
        subtitle="Last updated: January 2025"
        size="sm"
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600 mb-8"><ArrowLeft className="w-4 h-4" aria-hidden="true" />Back to Home</Link>

            <div className="prose-brand">
              <p>
                Welcome to Eduvia Consultancy Pvt. Ltd. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before engaging our services.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
              </p>

              <h2>2. Our Services</h2>
              <p>Eduvia Consultancy provides the following services:</p>
              <ul>
                <li>Study abroad counseling and career guidance</li>
                <li>University and course selection</li>
                <li>Application processing and documentation support</li>
                <li>SOP and LOR writing assistance</li>
                <li>Student visa processing and interview preparation</li>
                <li>Test preparation coaching (IELTS, PTE, TOEFL, GRE, GMAT, SAT)</li>
                <li>Scholarship guidance and application assistance</li>
                <li>Pre-departure orientation</li>
              </ul>

              <h2>3. Fees and Payment</h2>
              <ul>
                <li>Service fees are communicated upfront before engagement. There are no hidden charges.</li>
                <li>Initial counseling sessions are free of charge.</li>
                <li>Service fees must be paid as per the agreed payment schedule.</li>
                <li>Fees paid are non-refundable unless otherwise specified in writing.</li>
                <li>University application fees and visa fees are borne by the student and are separate from our service fees.</li>
              </ul>

              <h2>4. Student Responsibilities</h2>
              <ul>
                <li>Provide accurate and complete information for applications and visa processing.</li>
                <li>Submit all required documents within the specified deadlines.</li>
                <li>Respond promptly to communications from our team and partner institutions.</li>
                <li>Comply with the rules and regulations of the chosen university and destination country.</li>
                <li>Make timely payments as agreed upon.</li>
              </ul>

              <h2>5. Limitation of Liability</h2>
              <p>
                Eduvia Consultancy acts as an intermediary between students and educational institutions. We do not guarantee admission to any university or approval of any visa. The final decision rests with the respective university and immigration authority. We shall not be held liable for any decisions made by universities or immigration authorities.
              </p>

              <h2>6. Visa Processing</h2>
              <p>
                While we provide comprehensive visa assistance and have a high success rate, visa approval is solely at the discretion of the immigration authorities. We are not responsible for visa refusals. However, we will provide guidance on reapplication where applicable.
              </p>

              <h2>7. Privacy</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using our services, you consent to the collection and use of information as outlined in our Privacy Policy.
              </p>

              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.
              </p>

              <h2>9. Contact</h2>
              <p>
                For any questions about these Terms and Conditions, please contact:
              </p>
              <ul className="list-none pl-0">
                <li><strong>Eduvia Consultancy Pvt. Ltd.</strong></li>
                <li>Email: info@eduvia.com.np</li>
                <li>Phone: +977-1-4XXXXXX</li>
                <li>Address: Kathmandu, Nepal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
