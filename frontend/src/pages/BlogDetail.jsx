import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { buildBreadcrumbList, absoluteUrl, SITE_URL } from '../components/common/StructuredData';
import Breadcrumb from '../components/common/Breadcrumb';
import BlogCard from '../components/common/BlogCard';
import CTASection from '../components/common/CTASection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SmartImage from '../components/common/SmartImage';
import api from '../services/api';
import { formatDate } from '../utils/helpers';
import { blogImageCandidates } from '../utils/imageAssets';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${slug}`);
        const blogData = res.data?.blog || res.data;
        setBlog(blogData);

        if (blogData.category) {
          const relRes = await api.get(`/blogs?category=${blogData.category}&limit=3`);
          const related = (relRes.data?.blogs || relRes.data?.data || []).filter((b) => b.slug !== slug);
          setRelatedBlogs(related.slice(0, 3));
        }
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (contentRef.current) {
      const content = contentRef.current;
      const headingEls = content.querySelectorAll('h2, h3');
      const items = Array.from(headingEls).map((el, i) => {
        const id = `heading-${i}`;
        el.id = id;
        return { id, text: el.textContent, level: el.tagName };
      });
      setHeadings(items);
    }
  }, [blog]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-dark-500 mb-4">Article not found.</p>
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600">Back to Blog</Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Blog', link: '/blogs' },
    { label: blog.title },
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = blog.title || '';
  // Resolved once: the stored path is dead, so og:image needs the corrected URL too.
  // Falls back to the site default so BlogPosting never ships an empty image.
  const heroImages = blogImageCandidates(blog.featuredImage, blog.slug);
  const heroImage = absoluteUrl(heroImages[0] || '/og-image.jpg');

  const seo = blog.seo || {};
  const published = blog.publishedAt || blog.createdAt;
  const canonicalBlogUrl = absoluteUrl(seo.canonical || `/blogs/${blog.slug || slug}`);

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seo.title || blog.title,
    description: seo.description || blog.excerpt || '',
    image: [seo.ogImage ? absoluteUrl(seo.ogImage) : heroImage],
    datePublished: published,
    dateModified: blog.updatedAt || published,
    author: { '@type': 'Person', name: blog.author || 'Eduvia Team' },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalBlogUrl },
    ...(blog.tags?.length ? { keywords: blog.tags.join(', ') } : {}),
    ...(blog.category ? { articleSection: blog.category } : {}),
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title={seo.title || blog.title}
        description={seo.description || blog.excerpt}
        keywords={seo.keywords?.join(', ') || blog.tags?.join(', ')}
        image={seo.ogImage || heroImages[0]}
        canonical={canonicalBlogUrl}
        type="article"
        robots={seo.robots}
        article={{
          publishedTime: published,
          modifiedTime: blog.updatedAt,
          author: blog.author,
          section: blog.category,
          tags: blog.tags,
        }}
        jsonLd={[blogPosting, buildBreadcrumbList(breadcrumbItems)]}
      />

      {/* Featured image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-gradient-to-br from-primary-800 to-secondary-800">
        <SmartImage candidates={heroImages} alt={blog?.title || 'Article cover image'} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 to-transparent" />
      </div>

      <section className="-mt-24 relative z-10 py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400 mb-6 mt-6">
              {blog.author && (
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" aria-hidden="true" />{blog.author}</span>
              )}
              {blog.createdAt && (
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" aria-hidden="true" />{formatDate(blog.createdAt)}</span>
              )}
              {blog.readTime && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" aria-hidden="true" />{blog.readTime} min read</span>
              )}
              {blog.category && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">{blog.category}</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-dark-900 mb-6">{blog.title}</h1>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-dark-200/70">
              <span className="text-sm font-medium text-dark-500">Share:</span>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-200 transition-colors">
                <Twitter className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors">
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
              <button onClick={handleCopyLink} aria-label="Copy link" className="w-8 h-8 rounded-full bg-dark-100 flex items-center justify-center text-dark-500 hover:bg-dark-200 transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Link2 className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>

            <div className="grid lg:grid-cols-[1fr_220px] gap-10">
              {/* Content */}
              <div ref={contentRef} className="prose-brand max-w-3xl">
                {blog.content ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : blog.body ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.body }} />
                ) : (
                  <p className="text-dark-500">{blog.excerpt || 'No content available for this article.'}</p>
                )}
              </div>

              {/* Table of Contents */}
              {headings.length > 0 && (
                <aside className="hidden lg:block">
                  <div className="sticky top-16 lg:top-20">
                    <h4 className="text-sm font-semibold text-dark-900 mb-3">Table of Contents</h4>
                    <nav className="space-y-2">
                      {headings.map((h) => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className={`block text-xs text-dark-400 hover:text-primary-600 transition-colors ${
                            h.level === 'H3' ? 'pl-4' : ''
                          }`}
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </aside>
              )}
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 md:py-20 bg-dark-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-[2rem] font-display font-bold tracking-tight text-dark-900 mb-8 text-center">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((b, i) => (
                <motion.div
                  key={b._id || b.slug || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <BlogCard blog={b} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Need Help with Your Study Abroad Journey?"
        subtitle="Our experts are ready to guide you through every step of the process."
        primaryButton={{ label: 'Book Free Counseling', path: '/contact' }}
        secondaryButton={{ label: 'Explore Our Services', path: '/services' }}
      />
    </>
  );
}
