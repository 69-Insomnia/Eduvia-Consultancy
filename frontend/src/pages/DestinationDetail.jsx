import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  FileText,
  BookOpen,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { buildBreadcrumbList } from '../components/common/StructuredData';
import PageHero from '../components/common/PageHero';
import CountryFlag from '../components/common/CountryFlag';
import SectionHeading from '../components/common/SectionHeading';
import FAQAccordion from '../components/common/FAQAccordion';
import CTASection from '../components/common/CTASection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import { DESTINATIONS } from '../utils/constants';
import { DESTINATION_IMAGES } from '../utils/imageAssets';

const STEP_ANIMATION = (i) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { delay: i * 0.06, duration: 0.45 },
});

export default function DestinationDetail() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/destinations/${slug}`);
        setDestination(res.data?.destination || res.data);
      } catch (err) {
        const fallback = DESTINATIONS.find((d) => d.slug === slug);
        if (fallback) {
          setDestination({
            ...fallback,
            image: DESTINATION_IMAGES[fallback.slug],
            longDescription: `${fallback.name} is one of the most popular study abroad destinations for Nepali students, offering world-class education, diverse culture, and excellent career opportunities.`,
            whyStudy: [
              'Globally ranked universities and institutions',
              'High-quality education with international recognition',
              'Multicultural and welcoming environment',
              'Post-study work opportunities',
              'Safe and student-friendly lifestyle',
              'English-taught programs available',
            ],
            tuitionFees: 'Tuition fees vary by institution and program. Contact us for detailed fee structures.',
            livingCosts: 'Average living costs range from USD 800 - 1,500 per month depending on the city and lifestyle.',
            entryRequirements: 'High school diploma or bachelor\'s degree depending on the program level. Specific requirements vary by university.',
            englishRequirements: 'IELTS 6.0+, TOEFL 80+, PTE 50+ or equivalent. Requirements vary by program.',
            workOpportunities: 'International students can work part-time during studies and may be eligible for post-study work visas.',
            intakes: 'Main intakes: Spring (February/March) and Fall (August/September)',
            faqs: [
              { question: `What are the admission requirements for ${fallback.name}?`, answer: 'Requirements vary by university and program. Generally, you need academic transcripts, English proficiency scores, and a valid passport.' },
              { question: `How much does it cost to study in ${fallback.name}?`, answer: 'Tuition fees vary by institution. Contact us for a personalized cost estimate based on your chosen program.' },
              { question: `Can I work while studying in ${fallback.name}?`, answer: 'Most student visas allow part-time work during studies. Work rights vary by country and visa type.' },
            ],
            visaInformation: 'Student visa applications require an offer letter from a recognized institution, proof of funds, health insurance, and English proficiency scores.',
            popularUniversities: [],
            popularCourses: ['Business Administration', 'Computer Science', 'Engineering', 'Nursing', 'Hospitality Management'],
          });
        } else {
          setError('Destination not found.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-dark-500">{error}</p></div>;

  const d = {
    ...destination,
    image: destination.image?.startsWith('http')
      ? destination.image
      : destination.coverImage?.startsWith('http')
        ? destination.coverImage
        : DESTINATION_IMAGES[slug],
    longDescription: destination.longDescription || destination.description,
    whyStudy: destination.whyStudy || destination.whyStudyHere,
    tuitionFees: destination.tuitionFees || destination.tuitionInfo,
    livingCosts: destination.livingCosts || destination.costOfLiving,
    visaInformation: destination.visaInformation || destination.visaInfo,
  };
  const name = d.name || slug;
  const destinationImage = d.image || DESTINATION_IMAGES[slug];
  const scholarships = Array.isArray(d.scholarships)
    ? d.scholarships
    : d.scholarships
      ? [d.scholarships]
      : [];

  const breadcrumbItems = [
    { label: 'Study Abroad', link: '/study-abroad' },
    { label: `Study in ${name}` },
  ];

  const seo = d.seo || {};

  // Only marked up when the FAQ section actually renders these questions —
  // structured data has to reflect what is on the page.
  const faqSchema = d.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: d.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <SEO
        title={seo.title || `Study in ${name} - Complete Guide for Nepali Students`}
        description={seo.description || `Everything you need to know about studying in ${name}: universities, tuition fees, scholarships, visa process, and student life. Expert guidance from Eduvia Consultancy.`}
        keywords={seo.keywords?.join(', ') || `study in ${name}, universities in ${name}, ${name} student visa, ${name} scholarships`}
        image={seo.ogImage}
        canonical={seo.canonical || `/study-in/${d.slug || slug}`}
        type={seo.ogType}
        robots={seo.robots}
        jsonLd={[buildBreadcrumbList(breadcrumbItems), faqSchema]}
      />

      {/* Hero */}
      <PageHero
        title={`Study in ${name}`}
        subtitle={d.shortDescription || `Discover world-class education opportunities in ${name}.`}
        eyebrow="Eduvia destination guide"
        breadcrumb={breadcrumbItems}
      />

      {/* Destination banner + primary actions (carried over from the old hero) */}
      <section className="bg-white pt-10 md:pt-12">
        {destinationImage && (
          <div className="h-56 w-full overflow-hidden md:h-72 lg:h-80">
            <img
              src={destinationImage}
              alt={`${name} study destination`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <CountryFlag slug={slug} code={d.code} className="h-10 w-16" />
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-accent-600 hover:shadow-accent active:scale-[0.98]">
                Get free guidance <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/universities" className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-700 transition-all duration-200 hover:border-primary-200 hover:text-primary-600 active:scale-[0.98]">
                Explore universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-3">
            <div className="prose-brand lg:col-span-2">
              <span className="eyebrow">Your destination snapshot</span>
              <h2 className="mt-2">Why students choose {name}</h2>
              <p>
                {d.longDescription || d.description || `${name} is a popular study destination for students from around the world, including Nepal. Known for its high-quality education system, diverse culture, and excellent career prospects, ${name} offers a transformative educational experience for international students.`}
              </p>
            </div>
            {(() => {
              // Destination records in this project carry study data, not the
              // geographic fields this panel originally expected — so without
              // the fallbacks below it rendered as an empty box with a heading.
              const facts = [
                { Icon: MapPin, label: 'Capital', value: d.capital },
                { Icon: BookOpen, label: 'Language', value: d.language },
                { Icon: DollarSign, label: 'Currency', value: d.currency },
                { Icon: Users, label: 'Population', value: d.population },
                { Icon: DollarSign, label: 'Tuition', value: d.tuitionInfo },
                { Icon: Users, label: 'Living cost', value: d.costOfLiving },
                { Icon: BookOpen, label: 'English', value: d.englishRequirements },
                { Icon: MapPin, label: 'Intakes', value: d.intakes },
              ].filter((f) => f.value);

              if (!facts.length) return null;

              return (
                <div className="rounded-2xl border border-dark-200/70 bg-dark-50 p-6 shadow-soft">
                  <h3 className="mb-4 font-display text-lg font-semibold text-dark-900">
                    Quick Facts
                  </h3>
                  <div className="space-y-3">
                    {facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-start gap-3 text-sm text-dark-600"
                      >
                        <fact.Icon
                          className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500"
                          aria-hidden="true"
                        />
                        <span>
                          <strong>{fact.label}:</strong> {fact.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Why Study Here */}
      {d.whyStudy && d.whyStudy.length > 0 && (
        <section className="bg-dark-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why study here"
              title={`Why Study in ${name}?`}
              subtitle={`Discover the advantages of choosing ${name} for your international education.`}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {d.whyStudy.map((item, i) => (
                <motion.div
                  key={i}
                  {...STEP_ANIMATION(i)}
                  className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-5 shadow-soft"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-dark-600">{typeof item === 'string' ? item : item.title || item.description}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Universities */}
      {d.popularUniversities && d.popularUniversities.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Universities" title={`Popular Universities in ${name}`} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.popularUniversities.map((uni, i) => (
                <motion.div
                  key={i}
                  {...STEP_ANIMATION(i)}
                  className="flex items-center gap-3 rounded-2xl border border-dark-200/70 bg-dark-50 p-4"
                >
                  <Building2 className="h-5 w-5 shrink-0 text-secondary-500" aria-hidden="true" />
                  <span className="text-sm font-medium text-dark-900">{typeof uni === 'string' ? uni : uni.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Courses */}
      {d.popularCourses && d.popularCourses.length > 0 && (
        <section className="bg-dark-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Courses" title="Popular Courses" />
            <div className="flex flex-wrap gap-3">
              {d.popularCourses.map((course, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600"
                >
                  {typeof course === 'string' ? course : course.name}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tuition & Living Costs */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              {...STEP_ANIMATION(0)}
              className="rounded-2xl border border-dark-200/70 bg-dark-50 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <DollarSign className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-semibold text-dark-900">Tuition Fees</h3>
              </div>
              <p className="text-sm leading-relaxed text-dark-500">{d.tuitionFees || 'Tuition fees vary by institution and program. Contact us for detailed fee structures and available scholarships.'}</p>
            </motion.div>
            <motion.div
              {...STEP_ANIMATION(1)}
              className="rounded-2xl border border-dark-200/70 bg-dark-50 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <DollarSign className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-semibold text-dark-900">Living Costs</h3>
              </div>
              <p className="text-sm leading-relaxed text-dark-500">{d.livingCosts || 'Average living costs range from USD 800 to 1,500 per month depending on the city and lifestyle.'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Entry & English Requirements */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              {...STEP_ANIMATION(0)}
              className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <FileText className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-semibold text-dark-900">Entry Requirements</h3>
              </div>
              <p className="text-sm leading-relaxed text-dark-500">{d.entryRequirements || 'Requirements vary by program level and university. Generally, you need completed previous education, academic transcripts, and a valid passport.'}</p>
            </motion.div>
            <motion.div
              {...STEP_ANIMATION(1)}
              className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <BookOpen className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-semibold text-dark-900">English Requirements</h3>
              </div>
              <p className="text-sm leading-relaxed text-dark-500">{d.englishRequirements || 'IELTS 6.0+, TOEFL 80+, PTE 50+, or Duolingo 95+. Requirements may vary by program and university.'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      {scholarships.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Funding" title={`Scholarships in ${name}`} />
            <div className="space-y-4">
              {scholarships.map((s, i) => (
                <motion.div
                  key={i}
                  {...STEP_ANIMATION(i)}
                  className="rounded-2xl border border-dark-200/70 bg-dark-50 p-5"
                >
                  <div className="flex items-start gap-3">
                    <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-semibold text-dark-900">{typeof s === 'string' ? s : s.name}</h4>
                      {typeof s === 'object' && s.description && <p className="mt-1 text-sm text-dark-500">{s.description}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Student Visa */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Visa" title="Student Visa Information" />
          <div className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft md:p-8">
            <div className="mb-4 flex items-start gap-3">
              <FileText className="h-6 w-6 shrink-0 text-secondary-500" aria-hidden="true" />
              <h3 className="text-lg font-display font-semibold text-dark-900">Student Visa for {name}</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-dark-500">
              {d.visaInformation || `The student visa process for ${name} requires an offer letter from a recognized institution, proof of financial capacity, health insurance, and English language proficiency. Our team at Eduvia will guide you through every step of the application process.`}
            </p>
            <Link to={`/student-visa/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600">
              Learn More About Visa Process <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Work Opportunities */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Work" title="Work Opportunities" />
          <div className="rounded-2xl border border-dark-200/70 bg-dark-50 p-6 md:p-8">
            <div className="mb-4 flex items-start gap-3">
              <Briefcase className="h-6 w-6 shrink-0 text-primary-500" aria-hidden="true" />
              <h3 className="text-lg font-display font-semibold text-dark-900">Working While Studying in {name}</h3>
            </div>
            <p className="text-sm leading-relaxed text-dark-500">
              {d.workOpportunities || `International students in ${name} can typically work part-time during their studies. Many students gain valuable work experience through internships and part-time jobs. After graduation, post-study work visa options may be available depending on your qualification and the country's immigration policies.`}
            </p>
          </div>
        </div>
      </section>

      {/* Intakes */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Intakes" title="Intakes & Deadlines" />
          <div className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft md:p-8">
            <div className="mb-4 flex items-start gap-3">
              <Calendar className="h-6 w-6 shrink-0 text-secondary-500" aria-hidden="true" />
              <h3 className="text-lg font-display font-semibold text-dark-900">Academic Intakes in {name}</h3>
            </div>
            <p className="text-sm leading-relaxed text-dark-500">
              {d.intakes || `Universities in ${name} typically have two main intakes: Spring (February/March) and Fall (August/September). Some institutions may also offer Summer and Winter intakes. Contact us for specific deadline information for your preferred university.`}
            </p>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Application process" title="Application Process" subtitle={`Follow these steps to apply for universities in ${name}.`} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Research', desc: `Explore universities and courses in ${name} that match your profile.` },
              { step: '02', title: 'Apply', desc: 'Submit your application with required documents.' },
              { step: '03', title: 'Accept Offer', desc: 'Review and accept your university offer letter.' },
              { step: '04', title: 'Visa & Fly', desc: 'Complete visa processing and prepare for departure.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...STEP_ANIMATION(i)}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white shadow-brand">{item.step}</div>
                <h4 className="mb-2 text-base font-display font-semibold text-dark-900">{item.title}</h4>
                <p className="text-sm leading-relaxed text-dark-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Eduvia */}
      <section className="bg-dark-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Eduvia"
            title={`Why Choose Eduvia for Studying in ${name}`}
            subtitle="Your trusted partner throughout the entire study abroad journey."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Free counseling and university shortlisting',
              'Application preparation and submission',
              'SOP and LOR writing support',
              'Visa documentation and interview prep',
              'Scholarship application assistance',
              'Pre-departure orientation',
            ].map((item, i) => (
              <motion.div
                key={i}
                {...STEP_ANIMATION(i)}
                className="flex items-start gap-3 rounded-2xl border border-dark-200/70 bg-white p-5 shadow-soft"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
                <span className="text-sm text-dark-600">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {d.faqs && d.faqs.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <SectionHeading eyebrow="FAQs" title={`FAQs About Studying in ${name}`} />
              <FAQAccordion faqs={d.faqs} />
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
              <strong>Disclaimer:</strong> Visa rules, tuition fees, and entry requirements are subject to change by the respective immigration authorities and educational institutions. The information provided is for general guidance only. Students are advised to verify all requirements with official sources before making decisions.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to Study in ${name}?`}
        subtitle={`Get expert guidance on universities, admissions, and visa processing for ${name}. Book a free counseling session today.`}
        primaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
        secondaryButton={{ label: 'Explore More Destinations', path: '/study-abroad' }}
      />
    </>
  );
}
