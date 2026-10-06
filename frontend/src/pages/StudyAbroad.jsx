import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  GraduationCap,
  Award,
  Shield,
  Compass,
  Briefcase,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SkeletonGrid from '../components/common/SkeletonGrid';
import SectionHeading from '../components/common/SectionHeading';
import CountryCard from '../components/common/CountryCard';
import SearchBar from '../components/common/SearchBar';
import CTASection from '../components/common/CTASection';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import { DESTINATIONS } from '../utils/constants';

const WHY_STUDY_ABROAD = [
  { icon: Globe, title: 'Global Exposure', description: 'Immerse yourself in diverse cultures and gain a global perspective that sets you apart in the job market.' },
  { icon: GraduationCap, title: 'World-Class Education', description: 'Access universities ranked among the best in the world with cutting-edge research facilities.' },
  { icon: Award, title: 'Scholarship Opportunities', description: 'Many countries offer generous scholarships and financial aid for international students from Nepal.' },
  { icon: Briefcase, title: 'Career Growth', description: 'International qualifications open doors to global career opportunities and higher earning potential.' },
  { icon: Shield, title: 'Post-Study Work', description: 'Many destinations offer post-study work visas, allowing you to gain valuable international work experience.' },
  { icon: Compass, title: 'Personal Development', description: 'Living abroad builds independence, adaptability, and cross-cultural communication skills.' },
];

const PROCESS_OVERVIEW = [
  { step: 1, title: 'Counseling', description: 'Discuss your goals and get expert advice on destinations and courses.' },
  { step: 2, title: 'University Selection', description: 'Choose the right universities based on your profile and budget.' },
  { step: 3, title: 'Application', description: 'Submit applications with professionally crafted documents.' },
  { step: 4, title: 'Offer & Enrollment', description: 'Accept your offer and complete enrollment formalities.' },
  { step: 5, title: 'Visa Processing', description: 'Complete your visa application with our expert guidance.' },
  { step: 6, title: 'Fly & Settle', description: 'Pre-departure orientation and post-arrival support.' },
];

export default function StudyAbroad() {
  const [destinations, setDestinations] = useState(DESTINATIONS);
  const [filteredDestinations, setFilteredDestinations] = useState(DESTINATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        const data = res.data?.destinations || res.data?.data || [];
        if (data.length > 0) {
          setDestinations(data);
          setFilteredDestinations(data);
        }
      } catch {
        /* use constants */
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDestinations(destinations);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredDestinations(destinations.filter((d) => d.name.toLowerCase().includes(q)));
    }
  }, [searchQuery, destinations]);

  const seo = useMergedSeo('study-abroad', {
    title: 'Study Abroad - Top Destinations for Nepali Students',
    description: 'Explore top study abroad destinations for Nepali students including Australia, Canada, UK, USA, New Zealand, Germany, and more. Expert guidance from Eduvia Consultancy.',
    keywords: 'study abroad, study abroad destinations, study in Australia, study in Canada, study in UK, study in USA',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="Study Abroad"
        subtitle="Discover the perfect destination for your international education. From world-class universities to vibrant student life, find where your future begins."
        eyebrow="Explore 20+ Destinations"
        icon={Globe}
      />

      {/* Search / Filter */}
      <section className="sticky top-16 z-30 border-b border-dark-200/70 bg-white py-8 lg:top-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Search destinations by country name..." onSearch={setSearchQuery} />
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="bg-dark-50 py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Destinations"
            title="Popular Study Destinations"
            subtitle="Choose from our wide range of study destinations known for quality education and career opportunities."
          />
          {loading ? (
            <SkeletonGrid count={8} variant="media" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />
          ) : filteredDestinations.length === 0 ? (
            <EmptyState
              icon={Globe}
              title="No destinations found"
              description="Try adjusting your search criteria or browse all destinations."
              action={<button onClick={() => setSearchQuery('')} className="rounded-xl border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-500 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 active:scale-[0.98]">Clear Search</button>}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((dest, i) => (
                <motion.div
                  key={dest.slug || dest._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <CountryCard destination={dest} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Study Abroad */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why study abroad"
            title="Why Study Abroad?"
            subtitle="Studying abroad is more than just education — it is an investment in your future that opens doors to limitless possibilities."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_STUDY_ABROAD.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="flex flex-col rounded-2xl border border-dark-200/70 bg-dark-50 p-6 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <item.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-dark-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-dark-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="bg-dark-50 py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our process"
            title="How It Works"
            subtitle="Our streamlined process makes your study abroad journey smooth and stress-free."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROCESS_OVERVIEW.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="mb-1 font-display text-base font-semibold text-dark-900">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-dark-500">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Not Sure Which Destination Is Right for You?"
        subtitle="Our expert counselors can help you choose the perfect study destination based on your goals, budget, and preferences."
        primaryButton={{ label: 'Get Free Guidance', path: '/contact' }}
        secondaryButton={{ label: 'Explore All Destinations', path: '/study-abroad' }}
      />
    </>
  );
}
