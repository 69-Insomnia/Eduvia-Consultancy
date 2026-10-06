'use client';

import { useState, useEffect } from 'react';
import { Link } from '../utils/router';
import { motion } from 'framer-motion';
import {
  Target,
  Eye,
  Heart,
  Globe,
  BookOpen,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import StatsCounter from '../components/common/StatsCounter';
import CTASection from '../components/common/CTASection';
import SmartImage from '../components/common/SmartImage';
import api from '../services/api';
import { storedImageCandidates } from '../utils/imageAssets';
import { getInitials } from '../utils/helpers';

const VALUES = [
  { icon: Heart, title: 'Student-First Approach', description: 'Every decision we make is driven by what is best for our students. Your success is our success.' },
  { icon: Shield, title: 'Integrity & Transparency', description: 'We believe in honest guidance with no hidden agendas. Our processes are clear and our fees are transparent.' },
  { icon: Target, title: 'Excellence', description: 'We strive for excellence in everything — from counseling quality to application preparation to post-arrival support.' },
  { icon: Globe, title: 'Global Perspective', description: 'With partnerships across 20+ countries, we bring a global perspective to help students find their best-fit destination.' },
];

export default function About() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team?limit=6');
        setTeam(res.data?.members || res.data?.data || []);
      } catch {
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const stats = [
    { value: '10', suffix: '+', label: 'Years Experience' },
    { value: '1000', suffix: '+', label: 'Students Placed' },
    { value: '20', suffix: '+', label: 'Countries' },
    { value: '500', suffix: '+', label: 'Partner Universities' },
  ];

  // Editable from the admin (SEO → Pages). The literals below stay as the
  // fallback so the page renders correctly when no override is set or the API
  // is unreachable.
  const seo = useMergedSeo('about', {
    title: "About Eduvia Consultancy - Nepal's Trusted Study Abroad Partner",
    description: "Learn about Eduvia Consultancy — Nepal's leading study abroad consultancy with over a decade of experience helping students achieve their global education dreams.",
    keywords: 'about Eduvia, study abroad consultancy Nepal, education consultancy, our story, our team',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="About Eduvia"
        subtitle="Nepal's trusted partner for global education. Over a decade of turning study abroad dreams into reality."
      />

      {/* Our Story */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.45 }}>
              <h2 className="text-3xl font-display font-bold tracking-tight text-dark-900 mb-4">Our Story</h2>
              <div className="h-1 w-14 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 mb-6" aria-hidden="true" />
              <p className="text-dark-500 leading-relaxed mb-4">
                Eduvia Consultancy was founded with a simple vision: to make quality international education accessible to every Nepali student. What started as a small counseling center has grown into one of Nepal's most trusted study abroad consultancies.
              </p>
              <p className="text-dark-500 leading-relaxed mb-4">
                Over the past decade, we have guided thousands of students to top universities across 20+ countries. Our success is built on personalized counseling, transparent processes, and a genuine commitment to student success.
              </p>
              <p className="text-dark-500 leading-relaxed">
                We understand that studying abroad is a life-changing decision. That is why we take the time to understand each student's unique profile, goals, and budget to provide the best possible guidance.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 text-white shadow-strong"
            >
              <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
              <div className="relative">
                <h3 className="text-xl font-display font-bold mb-6">Our Impact</h3>
                <StatsCounter stats={stats} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 lg:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-dark-200/70 bg-white p-6 md:p-8 shadow-soft"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 mb-4">
                <Target className="h-5 w-5 text-primary-500" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-display font-bold text-dark-900 mb-3">Our Mission</h3>
              <p className="text-dark-500 leading-relaxed">
                To empower Nepali students with the guidance, resources, and support they need to access quality international education. We are committed to making the study abroad journey transparent, accessible, and successful for every student.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.08, duration: 0.45 }}
              className="rounded-2xl border border-dark-200/70 bg-white p-6 md:p-8 shadow-soft"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 mb-4">
                <Eye className="h-5 w-5 text-secondary-500" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-display font-bold text-dark-900 mb-3">Our Vision</h3>
              <p className="text-dark-500 leading-relaxed">
                To be Nepal's most trusted and student-centric study abroad consultancy, recognized for our integrity, expertise, and the transformative impact we create in students' lives through global education opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What We Stand For" title="Our Values" subtitle="The principles that guide everything we do." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="flex flex-col rounded-2xl border border-dark-200/70 bg-dark-50 p-6 text-center transition-colors hover:border-primary-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 mx-auto mb-4">
                  <v.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="text-base font-display font-semibold text-dark-900 mb-2">{v.title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 md:py-20 lg:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How We Work" title="Our Approach" subtitle="A personalized, student-first methodology that delivers results." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Listen & Understand', description: 'We begin by understanding your academic background, career goals, budget, and personal preferences.', icon: BookOpen },
              { title: 'Strategize & Plan', description: 'Based on your profile, we create a customized plan with the best-fit universities and timeline.', icon: Target },
              { title: 'Execute & Support', description: 'We handle applications, documentation, and visa processing while keeping you informed at every step.', icon: CheckCircle2 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft transition-colors hover:border-primary-200"
              >
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mb-4" aria-hidden="true">{i + 1}</div>
                <h3 className="text-base font-display font-semibold text-dark-900 mb-2">{item.title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      {team.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Our Team" title="Meet Our Team" subtitle="Our experienced counselors and staff are dedicated to your success." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col rounded-2xl border border-dark-200/70 bg-dark-50 p-6 text-center transition-all hover:border-primary-200 hover:shadow-medium"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-100 mx-auto mb-4">
                    <SmartImage
                      candidates={storedImageCandidates(member.avatar)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-display text-xl font-semibold text-primary-500">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      }
                    />
                  </div>
                  <h3 className="text-base font-display font-semibold text-dark-900">{member.name}</h3>
                  <p className="text-sm text-primary-600 mb-2">{member.position || member.role}</p>
                  {member.bio && <p className="text-sm text-dark-500 line-clamp-2">{member.bio}</p>}
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600">
                View Full Team <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Ready to Start Your Journey?"
        subtitle="Let our experienced team guide you to the right university and destination."
        primaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
        secondaryButton={{ label: 'Explore Our Services', path: '/services' }}
      />
    </>
  );
}
