'use client';

import { Link } from '../../utils/router';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { blogImageCandidates } from '../../utils/imageAssets';
import { formatDateShort } from '../../utils/helpers';
import useSpotlight from '../../hooks/useSpotlight';
import SmartImage from './SmartImage';

export default function BlogCard({ blog, compact = false }: any) {
  const { title, excerpt, featuredImage, category, author, createdAt, readTime, slug } = blog;
  const spotRef = useSpotlight();

  const formattedDate = formatDateShort(createdAt, '');

  return (
    <motion.article
      ref={spotRef}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
    >
      <Link to={`/blogs/${slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[16/10] overflow-hidden bg-dark-100">
          <SmartImage
            candidates={blogImageCandidates(featuredImage, slug)}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-primary-700 shadow-xs backdrop-blur">
              {category}
            </span>
          )}
        </div>
      </Link>

      {/* `compact` is the half-width phone treatment on the home grid. The
          excerpt and the byline strip wrap badly at ~170px, so the tile keeps
          the image and headline and hands the rest back at `sm`. */}
      <div className={`flex flex-1 flex-col ${compact ? 'p-3.5 sm:p-5' : 'p-5'}`}>
        <Link to={`/blogs/${slug}`}>
          <h3
            title={title}
            className={`font-display font-semibold leading-snug text-dark-900 line-clamp-2 transition-colors group-hover:text-primary-600 ${compact ? 'sm:mb-2 sm:text-base' : 'mb-2 text-base'}`}
          >
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className={`mb-4 text-sm leading-relaxed text-dark-500 line-clamp-2 ${compact ? 'hidden sm:block' : ''}`}>{excerpt}</p>
        )}

        <div className={`mt-auto flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-dark-200/70 pt-3.5 text-xs text-dark-400 ${compact ? 'hidden sm:flex' : 'flex'}`}>
          {author && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {author}
            </span>
          )}
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formattedDate}
            </span>
          )}
          {readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {readTime} min
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
