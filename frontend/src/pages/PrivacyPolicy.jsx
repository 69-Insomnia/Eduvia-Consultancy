import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';

export default function PrivacyPolicy() {
  const seo = useMergedSeo('privacy-policy', {
    title: 'Privacy Policy - Eduvia Consultancy',
    description: 'Eduvia Consultancy privacy policy. Learn how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, personal information',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="Privacy Policy"
        subtitle="Last updated: January 2025"
        size="sm"
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600 mb-8"><ArrowLeft className="w-4 h-4" aria-hidden="true" />Back to Home</Link>

            <div className="prose-brand">
              <p>
                Eduvia Consultancy Pvt. Ltd. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>

              <h2>1. Information We Collect</h2>
              <p>We may collect information about you in various ways, including:</p>
              <ul>
                <li><strong>Personal Data:</strong> Name, email address, phone number, date of birth, educational background, and financial information necessary for university applications and visa processing.</li>
                <li><strong>Academic Records:</strong> Transcripts, certificates, test scores (IELTS, PTE, GRE, etc.), and other academic documentation.</li>
                <li><strong>Financial Information:</strong> Bank statements, sponsor details, and proof of funds required for visa applications.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, pages visited, and time spent.</li>
                <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience on our website.</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide study abroad counseling and guidance services</li>
                <li>Process university applications on your behalf</li>
                <li>Assist with student visa applications</li>
                <li>Communicate with you regarding your applications and inquiries</li>
                <li>Improve our website and services</li>
                <li>Send promotional materials and updates (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We may share your personal information with universities, immigration authorities, and partner institutions solely for the purpose of processing your applications. We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
              </p>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>5. Cookies and Tracking</h2>
              <p>
                Our website uses cookies to enhance user experience. You can choose to disable cookies through your browser settings, though this may affect the functionality of certain features on our website. We use cookies for session management, analytics, and to remember your preferences.
              </p>

              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>

              <h2>7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically for any changes.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
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
