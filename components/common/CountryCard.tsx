'use client';

import { Link } from '../../utils/router';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  destinationImageCandidates,
  destinationFlag,
} from '../../utils/imageAssets';
import useSpotlight from '../../hooks/useSpotlight';
import CountryFlag from './CountryFlag';

export default function CountryCard({ destination, compact = false, priority = false }: any) {
  const { name, slug, flag, shortDescription } = destination;
  const spotRef = useSpotlight();

  // Walk candidates until one actually loads, so stale CMS paths still recover.
  const candidates = destinationImageCandidates(destination.image, slug);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const flagSrc = destinationFlag(slug);
  const [flagFailed, setFlagFailed] = useState(false);
  const showFlagImage = Boolean(flagSrc) && !flagFailed;

  const handleImageError = () => {
    if (index + 1 < candidates.length) {
      setIndex(index + 1);
      return;
    }
    setFailed(true);
  };

  const src = candidates[index];
  const showImage = Boolean(src) && !failed;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="h-full">
      <Link
        ref={spotRef}
        to={`/study-in/${slug}`}
        className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-primary-50">
          {showImage ? (
            <Image
              src={src}
              alt={name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              onError={handleImageError}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
              <span className="text-4xl">{flag || '🌍'}</span>
            </div>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-dark-950/50 via-dark-950/5 to-transparent"
            aria-hidden="true"
          />

          {(showFlagImage || flag) && showImage && (
            <span className="absolute left-3 top-3 flex items-center justify-center rounded-full bg-white/95 p-1.5 shadow-soft backdrop-blur">
              {showFlagImage ? (
                <img
                  src={flagSrc}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  onError={() => setFlagFailed(true)}
                  className="h-5 w-[30px] rounded object-cover"
                />
              ) : (
                <CountryFlag slug={slug} code={destination.code} className="h-5 w-[30px]" />
              )}
            </span>
          )}
        </div>

        {/* `compact` is the phone treatment on the home grid, where the card is
            half-width: the blurb clamps to about three words a line and reads as
            noise, so it is held back until the card has room again at `sm`. */}
        <div className={`flex flex-1 flex-col ${compact ? 'p-3.5 sm:p-5' : 'p-5'}`}>
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-dark-900 transition-colors group-hover:text-primary-600">
              {name}
            </h3>
            <ArrowRight
              className={`mt-1 h-4 w-4 shrink-0 text-dark-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary-600 ${compact ? 'hidden sm:block' : ''}`}
              aria-hidden="true"
            />
          </div>
          {shortDescription && (
            <p className={`text-sm leading-relaxed text-dark-500 line-clamp-2 ${compact ? 'hidden sm:block' : ''}`}>{shortDescription}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
