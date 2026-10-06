import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import { SITE_URL } from '../components/common/StructuredData';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import SkeletonGrid from '../components/common/SkeletonGrid';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import CTASection from '../components/common/CTASection';
import api from '../services/api';
import { DESTINATIONS, DEGREE_LEVELS, INTAKES } from '../utils/constants';
import { Link } from 'react-router-dom';

// Course.degreeLevel is stored as the schema enum; the card shows the award name.
const DEGREE_LABELS = {
  bachelor: "Bachelor's",
  master: "Master's",
  phd: 'PhD',
  diploma: 'Diploma',
  certificate: 'Certificate',
};

export default function CourseFinder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const countryFilter = searchParams.get('country') || '';
  const degreeFilter = searchParams.get('degree') || '';
  const intakeFilter = searchParams.get('intake') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage);
      params.set('limit', '12');
      if (searchQuery) params.set('search', searchQuery);
      if (countryFilter) params.set('country', countryFilter);
      if (degreeFilter) params.set('degree', degreeFilter);
      if (intakeFilter) params.set('intake', intakeFilter);

      const res = await api.get(`/courses?${params.toString()}`);
      const data = res.data?.courses || res.data?.data || [];
      setCourses(Array.isArray(data) ? data : []);
      setTotalPages(res.data?.totalPages || res.data?.pagination?.totalPages || Math.ceil((res.data?.total || data.length) / 12) || 1);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, countryFilter, degreeFilter, intakeFilter]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  const hasActiveFilters = countryFilter || degreeFilter || intakeFilter || searchQuery;

  // Course nodes for the results currently on the page. `description` is
  // required by schema.org, so courses without one are skipped rather than
  // emitted as invalid nodes.
  const courseList = courses.filter((c) => c.description).length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: courses
          .filter((c) => c.description)
          .map((c, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Course',
              name: c.name,
              description: c.description,
              ...(c.degreeLevel ? { educationalLevel: c.degreeLevel } : {}),
              ...(c.duration ? { timeRequired: c.duration } : {}),
              provider: { '@id': `${SITE_URL}/#organization` },
            },
          })),
      }
    : null;

  const seo = useMergedSeo('course-finder', {
    title: 'Find Your Course - Browse Courses Worldwide',
    description: 'Search and find courses from top universities worldwide. Filter by country, degree level, and intake. Expert guidance from Eduvia Consultancy.',
    keywords: 'find course, study abroad courses, university courses, course search',
  });

  return (
    <>
      <SEO {...seo} jsonLd={courseList} />

      {/* Hero */}
      <PageHero
        eyebrow="Course Discovery"
        icon={BookOpen}
        title="Find Your Course"
        subtitle="Discover thousands of courses from top universities around the world. Search by name, country, degree level, or intake."
      />

      {/* Search & Filters */}
      <section className="py-6 bg-white border-b border-dark-200/70 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" aria-hidden="true" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search courses by name..."
                className="input-field pl-10"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl px-6 py-3 text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 shadow-xs hover:shadow-brand transition-all duration-200 active:scale-[0.98]"
            >
              Search
            </button>
          </form>

          <div className="grid sm:grid-cols-3 gap-3">
            <select
              value={countryFilter}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              aria-label="Filter by country"
              className="input-field"
            >
              <option value="">All Countries</option>
              {DESTINATIONS.map((d) => (
                <option key={d.slug} value={d.name}>{d.name}</option>
              ))}
            </select>
            <select
              value={degreeFilter}
              onChange={(e) => handleFilterChange('degree', e.target.value)}
              aria-label="Filter by degree level"
              className="input-field"
            >
              <option value="">All Degree Levels</option>
              {DEGREE_LEVELS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={intakeFilter}
              onChange={(e) => handleFilterChange('intake', e.target.value)}
              aria-label="Filter by intake"
              className="input-field"
            >
              <option value="">All Intakes</option>
              {INTAKES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button onClick={clearFilters} className="text-xs font-semibold text-primary-500 transition-colors hover:text-primary-600">Clear all filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-dark-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={6} variant="plain" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses found"
              description="Try adjusting your search or filter criteria."
              action={
                <button
                  onClick={clearFilters}
                  className="rounded-xl px-6 py-3 text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 shadow-xs hover:shadow-brand transition-all duration-200 active:scale-[0.98]"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <p className="text-sm text-dark-500 mb-6">Showing {courses.length} courses</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, i) => {
                  // `universities` is populated by the API; the card links to the
                  // first one. Older records may have none, hence the fallback.
                  const university = course.universities?.[0];
                  const country = course.countries?.[0];
                  return (
                  <motion.div
                    key={course._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-6 border border-dark-200/70 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
                  >
                    <h3 className="text-base font-display font-semibold text-dark-900 mb-2">{course.name || course.title}</h3>
                    {university?.name && <p className="text-sm text-secondary-600 mb-1">{university.name}</p>}
                    {country && <p className="text-xs text-dark-400 mb-2">{country}</p>}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.degreeLevel && <span className="whitespace-nowrap rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">{DEGREE_LABELS[course.degreeLevel] || course.degreeLevel}</span>}
                      {course.duration && <span className="whitespace-nowrap rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-600">{course.duration}</span>}
                      {course.scholarshipAvailable && <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">Scholarship</span>}
                      {course.isFreeToApply && <span className="whitespace-nowrap rounded-full bg-secondary-50 px-2.5 py-1 text-[11px] font-semibold text-secondary-700">Free to apply</span>}
                    </div>
                    {/* Both amounts live together: a paid application fee is a value,
                        not a status, so it sits under the tuition rather than as a pill. */}
                    {(course.tuitionRange || course.tuitionFee) && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-dark-700">{course.tuitionRange || course.tuitionFee}</p>
                        {!course.isFreeToApply && course.applicationFee && (
                          <p className="mt-0.5 text-xs text-dark-400">Application fee {course.applicationFee}</p>
                        )}
                      </div>
                    )}
                    {university?.slug ? (
                      <Link to={`/universities/${university.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600">
                        View University
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <Link to="/universities" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600">
                        Explore Universities
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    )}
                  </motion.div>
                  );
                })}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </section>

      <CTASection
        title="Can't Find Your Ideal Course?"
        subtitle="Our counselors can help you find the perfect course and university based on your goals and budget."
        primaryButton={{ label: 'Get Personalized Help', path: '/contact' }}
        secondaryButton={{ label: 'Browse Universities', path: '/universities' }}
      />
    </>
  );
}
