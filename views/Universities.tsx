'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from '../utils/router';
import { motion } from 'framer-motion';
import { Search, GraduationCap, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SkeletonGrid from '../components/common/SkeletonGrid';
import UniversityCard from '../components/common/UniversityCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import CTASection from '../components/common/CTASection';
import api from '../services/api';
import { DESTINATIONS, DEGREE_LEVELS } from '../utils/constants';

const FIELD_CLASS =
  'w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10';

export default function Universities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const countryFilter = searchParams.get('country') || '';
  const degreeFilter = searchParams.get('degree') || '';
  const courseFilter = searchParams.get('course') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage as any);
      params.set('limit', '12');
      if (searchQuery) params.set('search', searchQuery);
      if (countryFilter) params.set('country', countryFilter);
      if (degreeFilter) params.set('degree', degreeFilter);
      if (courseFilter) params.set('course', courseFilter);

      const res = await api.get(`/universities?${params.toString()}`);
      const data = res.data?.universities || res.data?.data || [];
      setUniversities(Array.isArray(data) ? data : []);
      setTotalPages(res.data?.totalPages || res.data?.pagination?.totalPages || Math.ceil((res.data?.total || data.length) / 12) || 1);
    } catch {
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, countryFilter, degreeFilter, courseFilter]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      params.set('search', localSearch.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

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
    setLocalSearch('');
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = countryFilter || degreeFilter || courseFilter || searchQuery;

  const seo = useMergedSeo('universities', {
    title: 'Find Your University - Top Universities Worldwide',
    description: 'Search and explore thousands of universities worldwide. Find the perfect university for your study abroad journey with expert guidance from Eduvia Consultancy.',
    keywords: 'universities abroad, find university, study abroad universities, university search',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        eyebrow="500+ Partner Universities"
        icon={GraduationCap}
        title="Find Your University"
        subtitle="Discover top universities across the globe. Search by country, course, or degree level to find your perfect match."
      />

      {/* Search & Filters */}
      <section className="sticky top-16 z-30 border-b border-dark-200/70 bg-white py-6 lg:top-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search universities by name, course, or country..."
                className={`${FIELD_CLASS} pl-10`}
              />
            </div>
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
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-primary-600 hover:shadow-brand active:scale-[0.98]"
            >
              Search
            </button>
          </form>

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
              <input
                type="text"
                value={courseFilter}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                placeholder="Filter by course..."
                aria-label="Filter by course"
                className={FIELD_CLASS}
              />
            </motion.div>
          )}

          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-dark-400">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs text-primary-600">
                  Search: {searchQuery}
                  <button onClick={() => { handleFilterChange('search', ''); setLocalSearch(''); }} aria-label="Remove search filter" className="ml-1"><X className="h-3 w-3" aria-hidden="true" /></button>
                </span>
              )}
              {countryFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs text-primary-600">
                  Country: {countryFilter}
                  <button onClick={() => handleFilterChange('country', '')} aria-label="Remove country filter"><X className="h-3 w-3" aria-hidden="true" /></button>
                </span>
              )}
              {degreeFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs text-primary-600">
                  Degree: {degreeFilter}
                  <button onClick={() => handleFilterChange('degree', '')} aria-label="Remove degree filter"><X className="h-3 w-3" aria-hidden="true" /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs font-semibold text-primary-500 hover:text-primary-600">Clear all</button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="min-h-[50vh] bg-dark-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={8} variant="plain" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />
          ) : universities.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No universities found"
              description="Try adjusting your search or filters to find more results."
              action={<button onClick={clearFilters} className="rounded-xl border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-500 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 active:scale-[0.98]">Clear Filters</button>}
            />
          ) : (
            <>
              <p className="text-sm text-dark-500 mb-6">Showing {universities.length} universities</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {universities.map((uni, i) => (
                  <motion.div
                    key={uni._id || uni.slug || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                  >
                    <UniversityCard university={uni} priority={i < 3} />
                  </motion.div>
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </section>

      <CTASection
        title="Can't Find What You're Looking For?"
        subtitle="Our counselors can help you find the perfect university based on your profile and goals."
        primaryButton={{ label: 'Get Personalized Help', path: '/contact' }}
        secondaryButton={{ label: 'Explore Destinations', path: '/study-abroad' }}
      />
    </>
  );
}
