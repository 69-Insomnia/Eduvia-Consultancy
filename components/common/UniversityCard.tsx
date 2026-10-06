'use client';

import { Link } from '../../utils/router';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, ArrowRight, GraduationCap } from 'lucide-react';
import { SITE_IMAGES, UNIVERSITY_IMAGES } from '../../utils/imageAssets';
import useSpotlight from '../../hooks/useSpotlight';

export default function UniversityCard({ university, compact = false }: any) {
  const { name, slug, logo, coverImage, country, city, popularCourses, programs } = university;
  const location = [city, country].filter(Boolean).join(', ');
  const spotRef = useSpotlight();

  // The University schema has no `popularCourses` field — seeded records carry
  // `programs` instead — so fall back to the distinct award levels offered.
  const courseTags = popularCourses?.length
    ? popularCourses
    : [...new Set((programs || []).map((p) => p?.degree).filter(Boolean))];

  const mapped = UNIVERSITY_IMAGES[slug];
  // CMS cover art first, then the bundled campus photo, then the stock fallback.
  // Seeded values point at files that were never uploaded, so the chain matters.
  const [src, setSrc] = useState(coverImage || mapped || SITE_IMAGES.universityFallback);
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const handleImageError = () => {
    if (mapped && src !== mapped) {
      setSrc(mapped);
      return;
    }
    if (src !== SITE_IMAGES.universityFallback) {
      setSrc(SITE_IMAGES.universityFallback);
      return;
    }
    setImageFailed(true);
  };

  const showImage = src && !imageFailed;
  const showLogo = Boolean(logo) && !logoFailed;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="h-full">
      <Link
        ref={spotRef}
        to={`/universities/${slug}`}
        className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-primary-50">
          {showImage ? (
            <img
              src={src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              onError={handleImageError}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <GraduationCap className="h-10 w-10 text-primary-300" aria-hidden="true" />
            </div>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-dark-950/55 via-dark-950/10 to-transparent"
            aria-hidden="true"
          />

          {/* Institution mark, when the CMS actually has one uploaded. */}
          <span className={`absolute bottom-3 left-3 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-soft ${compact ? 'h-8 w-8 sm:h-11 sm:w-11' : 'h-11 w-11'}`}>
            {showLogo ? (
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                onError={() => setLogoFailed(true)}
                className="h-full w-full object-contain"
              />
            ) : (
              <GraduationCap className="h-5 w-5 text-primary-500" aria-hidden="true" />
            )}
          </span>
        </div>

        {/* `compact` is the half-width phone treatment used on the home grid:
            the award-level pills wrap to three rows at that width, so they wait
            for `sm` rather than crowding out the name. */}
        <div className={`flex flex-1 flex-col ${compact ? 'p-3.5 sm:p-5' : 'p-5'}`}>
          <h3
            title={name}
            className={`mb-1 font-display font-semibold leading-snug text-dark-900 line-clamp-2 transition-colors group-hover:text-primary-600 ${compact ? 'text-sm sm:text-base' : ''}`}
          >
            {name}
          </h3>

          {location && (
            <span className={`flex items-center gap-1 text-xs text-dark-400 ${compact ? 'mb-2 sm:mb-3' : 'mb-3'}`}>
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{location}</span>
            </span>
          )}

          {courseTags.length > 0 && (
            <div className={`mb-4 flex-wrap gap-1.5 ${compact ? 'hidden sm:flex' : 'flex'}`}>
              {courseTags.slice(0, 3).map((course, i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-600"
                >
                  {course}
                </span>
              ))}
              {courseTags.length > 3 && (
                <span className="rounded-full bg-dark-100 px-2.5 py-1 text-[11px] font-medium text-dark-500">
                  +{courseTags.length - 3}
                </span>
              )}
            </div>
          )}

          <span className={`mt-auto inline-flex items-center gap-1.5 font-semibold text-primary-500 transition-colors group-hover:text-primary-600 ${compact ? 'text-xs sm:text-sm' : 'text-sm'}`}>
            View details
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
