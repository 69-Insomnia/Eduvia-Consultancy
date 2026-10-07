'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from '../utils/router';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import SkeletonGrid from '../components/common/SkeletonGrid';
import SectionHeading from '../components/common/SectionHeading';
import BlogCard from '../components/common/BlogCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import { BLOG_CATEGORIES } from '../utils/constants';

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage as any);
      params.set('limit', '9');
      if (categoryFilter) params.set('category', categoryFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await api.get(`/blogs?${params.toString()}`);
      const data = res.data?.blogs || res.data?.data || [];
      setBlogs(Array.isArray(data) ? data : []);
      setTotalPages(res.data?.totalPages || res.data?.pagination?.totalPages || Math.ceil((res.data?.total || data.length) / 9) || 1);

      if (!categoryFilter && !searchQuery && currentPage === 1) {
        const featRes = await api.get('/blogs?limit=3&featured=true');
        setFeaturedPosts(featRes.data?.blogs || featRes.data?.data || []);
      }
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seo = useMergedSeo('blogs', {
    title: 'Blog & Insights - Study Abroad Tips & News',
    description: 'Stay informed with the latest study abroad news, university guides, scholarship updates, visa tips, and expert advice from Eduvia Consultancy.',
    keywords: 'study abroad blog, education news, university guides, visa tips, scholarship updates',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="Blog & Insights"
        subtitle="Stay informed with expert advice, study abroad tips, university guides, and the latest education news."
      />

      {/* Search & Categories */}
      <section className="py-6 bg-white border-b border-dark-200/70 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" aria-hidden="true" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search articles..."
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
          {/* Scrolls on phones (wrapping nine pills costs ~7 rows); wraps once
              there is room for two rows. */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !categoryFilter
                  ? 'border border-primary-500 bg-primary-500 text-white shadow-xs'
                  : 'border border-dark-200 bg-white text-dark-600 hover:border-primary-200 hover:text-primary-600'
              }`}
            >
              All Posts
            </button>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'border border-primary-500 bg-primary-500 text-white shadow-xs'
                    : 'border border-dark-200 bg-white text-dark-600 hover:border-primary-200 hover:text-primary-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {!categoryFilter && !searchQuery && featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Highlights"
              title="Featured Articles"
              subtitle="Our most popular and informative articles."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((blog, i) => (
                <motion.div
                  key={blog._id || blog.slug || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <BlogCard blog={blog} priority={i < 3} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12 bg-dark-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonGrid count={6} variant="media" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : blogs.length === 0 ? (
            <EmptyState title="No articles found" description="Try adjusting your search or filter criteria." />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, i) => (
                  <motion.div
                    key={blog._id || blog.slug || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                  >
                    <BlogCard blog={blog} priority={i === 0} />
                  </motion.div>
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
