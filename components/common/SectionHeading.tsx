'use client';

import { motion } from 'framer-motion';

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  centered = true,
  light = false,
  className = '',
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-10 md:mb-12 ${centered ? 'text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] mb-3 ${
            light ? 'text-primary-200' : 'text-primary-600'
          }`}
        >
          <span className="w-5 h-px bg-current opacity-50" aria-hidden="true" />
          {eyebrow}
        </span>
      )}

      <h2
        className={`text-3xl md:text-4xl font-display font-bold tracking-tight ${
          light ? 'text-white' : 'text-dark-900'
        }`}
      >
        {title}
      </h2>

      <div
        className={`relative mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 ${
          centered ? 'mx-auto' : ''
        }`}
        aria-hidden="true"
      >
        {/* soft halo so the rule reads as light, not just a bar */}
        <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 opacity-50 blur-[6px]" />
      </div>

      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed max-w-2xl ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-white/70' : 'text-dark-500'}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
