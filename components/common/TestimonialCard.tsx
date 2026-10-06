'use client';

import { motion } from 'framer-motion';
import { Quote, Star, MapPin, GraduationCap, BookOpen } from 'lucide-react';
import useSpotlight from '../../hooks/useSpotlight';
import SmartImage from './SmartImage';
import { storedImageCandidates } from '../../utils/imageAssets';

export default function TestimonialCard({ testimonial }: any) {
  const { quote, name, country, university, course, rating, image } = testimonial;
  const stars = rating || 5;
  const spotRef = useSpotlight();

  return (
    <motion.div
      ref={spotRef}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="spotlight flex h-full flex-col rounded-2xl border border-dark-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
    >
      <div className="mb-4 flex items-center justify-between">
        <Quote className="h-7 w-7 text-primary-500/25" aria-hidden="true" />
        <div className="flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < stars ? 'fill-amber-400 text-amber-400' : 'fill-dark-200 text-dark-200'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {quote && (
        <p className="mb-6 flex-1 text-sm leading-relaxed text-dark-600">&ldquo;{quote}&rdquo;</p>
      )}

      <div className="flex items-center gap-3 border-t border-dark-200/70 pt-4">
        <SmartImage
          candidates={storedImageCandidates(image)}
          alt={name}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
          fallback={
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-600">
              {name?.charAt(0)}
            </div>
          }
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-dark-900">{name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-dark-400">
            {course && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                {course}
              </span>
            )}
            {university && (
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" aria-hidden="true" />
                {university}
              </span>
            )}
            {country && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {country}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
