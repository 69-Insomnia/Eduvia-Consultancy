import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SkeletonGrid from '../components/common/SkeletonGrid';
import CTASection from '../components/common/CTASection';
import SmartImage from '../components/common/SmartImage';
import api from '../services/api';
import { storedImageCandidates } from '../utils/imageAssets';
import { getInitials } from '../utils/helpers';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        setTeam(res.data?.members || res.data?.data || []);
      } catch {
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const seo = useMergedSeo('team', {
    title: 'Our Team - Meet the Eduvia Consultancy Team',
    description: 'Meet the experienced team behind Eduvia Consultancy. Our expert counselors and staff are dedicated to helping students achieve their study abroad dreams.',
    keywords: 'Eduvia team, our team, counselors, study abroad experts, education consultants',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="Our Team"
        subtitle="Meet the dedicated professionals who make your study abroad dreams possible. Experienced, passionate, and committed to your success."
        eyebrow="Our Expert Team"
        icon={GraduationCap}
      />

      {/* Team Grid */}
      <section className="py-16 md:py-20 lg:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={8} variant="media" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />
          ) : team.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-12 h-12 text-dark-300 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-dark-700">Team information coming soon.</h3>
              <p className="text-sm text-dark-400 mt-1">We are currently updating our team page.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  className="overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft transition-all hover:border-primary-200 hover:shadow-medium"
                >
                  {/* Square on the multi-column grid; a full-width square is
                      ~390px tall in the single-column phone layout. */}
                  <div className="h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 sm:h-auto sm:aspect-square">
                    <SmartImage
                      candidates={storedImageCandidates(member.avatar)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-display text-5xl font-semibold text-primary-400">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      }
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-display font-semibold text-dark-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-secondary-500 font-medium mb-3">{member.position || member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-dark-400 line-clamp-3 mb-4">{member.bio}</p>
                    )}
                    <div className="flex items-center gap-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          aria-label={`Email ${member.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-dark-100 text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary-500"
                        >
                          <Mail className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          aria-label={`Call ${member.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-dark-100 text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary-500"
                        >
                          <Phone className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Want to Join Our Team?"
        subtitle="We are always looking for passionate individuals who want to make a difference in students' lives."
        primaryButton={{ label: 'Contact Us', path: '/contact' }}
        secondaryButton={{ label: 'Learn About Us', path: '/about' }}
      />
    </>
  );
}
