'use client';

import { useState, useEffect } from 'react';
import { Link } from '../utils/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUp,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import CounselingForm from '../components/common/CounselingForm';
import Modal from '../components/common/Modal';
import Logo from '../components/common/Logo';
import CountryFlag from '../components/common/CountryFlag';
import Navbar from '../components/layout/Navbar';
import { DESTINATIONS } from '../utils/constants';
import defaultLogo from '../utils/brandLogo';

const QUICK_LINKS = [
  { label: 'About Us', path: '/about' },
  { label: 'Study Abroad', path: '/study-abroad' },
  { label: 'Universities', path: '/universities' },
  { label: 'Scholarships', path: '/scholarships' },
  { label: 'Test Preparation', path: '/test-preparation' },
  { label: 'Success Stories', path: '/success-stories' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact Us', path: '/contact' },
];

const SOCIALS = [
  { key: 'facebook', Icon: Facebook, label: 'Facebook' },
  { key: 'instagram', Icon: Instagram, label: 'Instagram' },
  { key: 'twitter', Icon: Twitter, label: 'Twitter' },
  { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
  { key: 'youtube', Icon: Youtube, label: 'YouTube' },
];

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  const { settings } = useSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCounselingModal, setShowCounselingModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoUrl = settings.company?.logo || settings.logo || defaultLogo;
  const whatsapp = settings.phone2?.replace(/[^0-9]/g, '');
  const socials = SOCIALS.filter((s) => settings[s.key]);

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar onCounselClick={() => setShowCounselingModal(true)} />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer className="relative bg-gradient-to-b from-primary-900 to-primary-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="aurora" aria-hidden="true">
          <span className="aurora-blob -left-32 top-0 h-80 w-80 bg-secondary-500/20 animate-aurora-slow" />
          <span className="aurora-blob -right-24 bottom-0 h-72 w-72 bg-secondary-500/15 animate-aurora" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              {/* White plate: the logo mark is brand blue and would otherwise
                  disappear against the dark footer gradient. */}
              <div className="mb-5 inline-flex items-center rounded-xl bg-white px-3.5 py-2.5 shadow-soft">
                <Logo
                  src={logoUrl}
                  imageClassName="h-10 w-auto max-w-[180px] object-contain"
                />
              </div>
              <p className="text-sm text-white/65 leading-relaxed mb-5 max-w-xs">
                {settings.siteTagline ||
                  'Your gateway to global education — honest counseling, university guidance, and visa support for Nepali students.'}
              </p>
              {socials.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {socials.map(({ key, Icon, label }) => (
                    <a
                      key={key}
                      href={settings[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-primary-700 hover:border-white transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2.5 h-px bg-secondary-400 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-4">
                Study Destinations
              </h3>
              <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2.5">
                {DESTINATIONS.slice(0, 8).map((d) => (
                  <li key={d.slug}>
                    <Link
                      to={`/study-in/${d.slug}`}
                      className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                      <CountryFlag slug={d.slug} code={d.code} className="h-3.5 w-5 shrink-0" />
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-4">
                Get in Touch
              </h3>
              <ul className="space-y-3.5 mb-6">
                {settings.address && (
                  <li className="flex items-start gap-3 text-sm text-white/70">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary-400" />
                    <span className="leading-relaxed">{settings.address}</span>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Phone className="w-4 h-4 shrink-0 text-secondary-400" />
                    <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.phone2 && (
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Phone className="w-4 h-4 shrink-0 text-secondary-400" />
                    <a href={`tel:${settings.phone2}`} className="hover:text-white transition-colors">
                      {settings.phone2}
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-center gap-3 text-sm text-white/70">
                    <Mail className="w-4 h-4 shrink-0 text-secondary-400" />
                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:text-white transition-colors break-all"
                    >
                      {settings.email}
                    </a>
                  </li>
                )}
              </ul>
              <button
                onClick={() => setShowCounselingModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 active:scale-[0.98] transition-all"
              >
                Free Counseling
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/60 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Eduvia Consultancy Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/60">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="hover:text-white transition-colors">
                Terms &amp; Conditions
              </Link>
              <Link to="/disclaimer" className="hover:text-white transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating desktop actions */}
      <div className="fixed bottom-8 right-6 z-40 hidden lg:flex flex-col gap-3">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-strong hover:bg-green-700 hover:scale-105 active:scale-95 transition-all"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        )}
        {settings.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-brand hover:bg-primary-600 hover:scale-105 active:scale-95 transition-all"
            title="Call us"
            aria-label="Call us"
          >
            <Phone className="w-5 h-5" />
          </a>
        )}
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 lg:bottom-8 right-6 z-40 w-11 h-11 rounded-full bg-dark-900 text-white flex items-center justify-center shadow-strong hover:bg-dark-800 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-lg border-t border-dark-200/70 safe-bottom">
        <div className="flex items-stretch">
          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="flex-1 flex flex-col items-center justify-center py-2.5 text-primary-600 active:bg-primary-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">Call</span>
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center justify-center py-2.5 text-green-700 active:bg-green-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">WhatsApp</span>
            </a>
          )}
          <div className="w-px bg-dark-200/70 my-2" aria-hidden="true" />
          <button
            onClick={() => setShowCounselingModal(true)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 bg-accent-500 text-white active:bg-accent-600 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Free Counseling</span>
          </button>
        </div>
      </div>

      {/* Counseling Modal */}
      <Modal
        isOpen={showCounselingModal}
        onClose={() => setShowCounselingModal(false)}
        title="Book Free Counseling"
        size="lg"
      >
        <CounselingForm onSuccess={() => setShowCounselingModal(false)} />
      </Modal>
    </div>
  );
}
