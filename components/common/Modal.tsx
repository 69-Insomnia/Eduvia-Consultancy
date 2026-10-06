'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: any) {
  const contentRef = useRef(null);
  const previouslyFocused = useRef(null);

  const getFocusable = useCallback(
    (): any[] => Array.from(contentRef.current?.querySelectorAll(FOCUSABLE) || []),
    []
  );

  // Remember what had focus, move focus into the dialog, restore it on close.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;

    const raf = requestAnimationFrame(() => {
      const focusable = getFocusable();
      (focusable[0] || contentRef.current)?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      const target = previouslyFocused.current;
      if (target && typeof target.focus === 'function') {
        target.focus({ preventScroll: true });
      }
    };
  }, [isOpen, getFocusable]);

  // Escape to dismiss + keep Tab cycling inside the dialog.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) {
        e.preventDefault();
        contentRef.current?.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !contentRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, getFocusable]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-strong border border-dark-200/70 max-h-[90vh] overflow-y-auto`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
          >
            {title && (
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-white/95 backdrop-blur border-b border-dark-200/70">
                <h2 className="text-lg font-display font-semibold text-dark-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="-mr-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-dark-400 transition-colors hover:bg-dark-100 hover:text-dark-700"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
