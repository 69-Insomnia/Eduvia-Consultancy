import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection({
  title = 'Ready to Start Your Journey?',
  subtitle = 'Get expert guidance on studying abroad. Book a free counseling session today.',
  primaryButton,
  secondaryButton,
}) {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-primary-800">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950" />
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div className="aurora" aria-hidden="true">
        <span className="aurora-blob -top-24 -right-16 h-80 w-80 bg-accent-500/25 animate-aurora" />
        <span className="aurora-blob -bottom-24 -left-16 h-80 w-80 bg-secondary-400/25 animate-aurora-slow" />
        <span className="aurora-blob left-1/2 top-1/3 h-64 w-64 bg-primary-400/20 animate-aurora [animation-delay:-11s]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight text-balance">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {primaryButton && (
              <Link
                to={primaryButton.path || '/contact'}
                className="shine w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-500 text-white text-sm font-semibold rounded-full shadow-accent hover:bg-accent-600 active:scale-[0.98] transition-all duration-200"
              >
                {primaryButton.label || 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {secondaryButton && (
              <Link
                to={secondaryButton.path || '/services'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full hover:bg-white/20 hover:border-white/40 active:scale-[0.98] transition-all duration-200"
              >
                {secondaryButton.label || 'Learn More'}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
