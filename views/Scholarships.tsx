'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from '../utils/router';
import { motion } from 'framer-motion';
import { Award, SlidersHorizontal, ChevronDown } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SkeletonGrid from '../components/common/SkeletonGrid';
import ScholarshipCard from '../components/common/ScholarshipCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import CTASection from '../components/common/CTASection';
import api from '../services/api';
import { DESTINATIONS, DEGREE_LEVELS } from '../utils/constants';

const FIELD_CLASS =
  'w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10';

export default function Scholarships() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const countryFilter = searchParams.get('country') || '';
  const typeFilter = searchParams.get('type') || '';
  const degreeFilter = searchParams.get('degree') || '';

  const fetchScholarships = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage as any);
      params.set('limit', '12');
      if (countryFilter) params.set('country', countryFilter);
      if (typeFilter) params.set('type', typeFilter);
      if (degreeFilter) params.set('degree', degreeFilter);

      const res = await api.get(`/scholarships?${params.toString()}`);
      const data = res.data?.scholarships || res.data?.data || [];
      setScholarships(Array.isArray(data) ? data : []);
      setTotalPages(res.data?.totalPages || res.data?.pagination?.totalPages || Math.ceil((res.data?.total || data.length) / 12) || 1);
    } catch {
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, countryFilter, typeFilter, degreeFilter]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = countryFilter || typeFilter || degreeFilter;

  const seo = useMergedSeo('scholarships', {
    title: 'Scholarships for Nepali Students',
    description: 'Find scholarships and financial aid for Nepali students studying abroad. Explore merit-based, need-based, and government scholarships for study in Australia, Canada, UK, and more.',
    keywords: 'scholarships for Nepali students, study abroad scholarships, financial aid, merit scholarships, need-based scholarships',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        eyebrow="100+ Scholarships Available"
        icon={Award}
        title="Scholarships"
        subtitle="Discover scholarships and financial aid opportunities to make your study abroad dream affordable. We help you find and apply for the right scholarships."
      />

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-dark-200/70 bg-white py-6 lg:top-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                showFilters
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-dark-200 bg-white text-dark-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs font-semibold text-primary-500 hover:text-primary-600">Clear all filters</button>
            )}
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid sm:grid-cols-3 gap-3">
              <div className="relative">
                <select
                  value={countryFilter}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  aria-label="Filter by country"
                  className={`${FIELD_CLASS} appearance-none pr-10`}
                >
                  <option value="">All Countries</option>
                  {DESTINATIONS.map((d) => (
                    <option key={d.slug} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
              </div>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  aria-label="Filter by scholarship type"
                  className={`${FIELD_CLASS} appearance-none pr-10`}
                >
                  <option value="">All Types</option>
                  <option value="merit">Merit-based</option>
                  <option value="need">Need-based</option>
                  <option value="sports">Sports</option>
                  <option value="research">Research</option>
                  <option value="general">General</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
              </div>
              <div className="relative">
                <select
                  value={degreeFilter}
                  onChange={(e) => handleFilterChange('degree', e.target.value)}
                  aria-label="Filter by degree level"
                  className={`${FIELD_CLASS} appearance-none pr-10`}
                >
                  <option value="">All Degree Levels</option>
                  {DEGREE_LEVELS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="min-h-[50vh] bg-dark-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={6} variant="plain" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : scholarships.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No scholarships found"
              description="Try adjusting your filters to find more scholarship opportunities."
              action={<button onClick={clearFilters} className="rounded-xl border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-500 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 active:scale-[0.98]">Clear Filters</button>}
            />
          ) : (
            <>
              <p className="text-sm text-dark-500 mb-6">Showing {scholarships.length} scholarships</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((s, i) => (
                  <motion.div
                    key={s._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                  >
                    <ScholarshipCard scholarship={s} />
                  </motion.div>
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </section>

      <CTASection
        title="Need Help Finding Scholarships?"
        subtitle="Our experts can help you identify and apply for scholarships that match your profile."
        primaryButton={{ label: 'Get Scholarship Guidance', path: '/contact' }}
        secondaryButton={{ label: 'View All Services', path: '/services' }}
      />
    </>
  );
}
