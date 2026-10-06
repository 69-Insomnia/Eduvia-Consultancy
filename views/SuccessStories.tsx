'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Award, MapPin, Star } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SkeletonGrid from '../components/common/SkeletonGrid';
import CTASection from '../components/common/CTASection';
import SmartImage from '../components/common/SmartImage';
import api from '../services/api';
import { DESTINATIONS } from '../utils/constants';
import { normalizeStory } from '../utils/helpers';
import { storedImageCandidates } from '../utils/imageAssets';

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '20');
      if (filter) params.set('country', filter);
      const res = await api.get(`/success-stories?${params.toString()}`);
      setStories((res.data?.stories || res.data?.data || []).map(normalizeStory));
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const seo = useMergedSeo('success-stories', {
    title: 'Success Stories - Students Who Achieved Their Dreams',
    description: 'Read inspiring success stories from Nepali students who achieved their dream of studying abroad with guidance from Eduvia Consultancy.',
    keywords: 'success stories, student testimonials, study abroad success, Eduvia reviews',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        eyebrow="Inspiring Journeys"
        icon={Award}
        title="Success Stories"
        subtitle="Read inspiring stories from our students who have successfully achieved their dream of studying abroad."
      />

      {/* Filter */}
      <section className="py-6 bg-white border-b border-dark-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !filter
                  ? 'border border-primary-500 bg-primary-500 text-white shadow-xs'
                  : 'border border-dark-200 bg-white text-dark-600 hover:border-primary-200 hover:text-primary-600'
              }`}
            >
              All Destinations
            </button>
            {DESTINATIONS.slice(0, 8).map((d) => (
              <button
                key={d.slug}
                onClick={() => setFilter(d.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === d.name
                    ? 'border border-primary-500 bg-primary-500 text-white shadow-xs'
                    : 'border border-dark-200 bg-white text-dark-600 hover:border-primary-200 hover:text-primary-600'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 md:py-20 bg-dark-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={6} variant="media" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : stories.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-12 h-12 text-dark-300 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-dark-900 mb-2">No stories found</h3>
              <p className="text-sm text-dark-400">Check back later for more success stories.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, i) => (
                <motion.div
                  key={story._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl overflow-hidden border border-dark-200/70 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
                >
                  {story.image && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <SmartImage
                        candidates={storedImageCandidates(story.image)}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < (story.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-dark-200'}`} aria-hidden="true" />
                      ))}
                    </div>
                    {story.quote && (
                      <p className="text-sm text-dark-500 italic leading-relaxed mb-4">&ldquo;{story.quote}&rdquo;</p>
                    )}
                    <div className="flex items-center gap-3 pt-4 border-t border-dark-200/70">
                      <SmartImage
                        candidates={storedImageCandidates(story.image)}
                        alt={story.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        fallback={
                          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-primary-500">{story.name?.charAt(0)}</span>
                          </div>
                        }
                      />
                      <div>
                        <p className="text-sm font-semibold text-dark-900">{story.name}</p>
                        <div className="flex items-center gap-2 text-xs text-dark-400">
                          {story.course && <span>{story.course}</span>}
                          {story.country && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" aria-hidden="true" />{story.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Ready to Write Your Success Story?"
        subtitle="Join thousands of students who have achieved their dream of studying abroad with Eduvia Consultancy."
        primaryButton={{ label: 'Start Your Journey', path: '/contact' }}
        secondaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
      />
    </>
  );
}
