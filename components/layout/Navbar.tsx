'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from '../../utils/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  CalendarCheck,
  ArrowRight,
  Compass,
  School,
  FileCheck,
  GraduationCap,
  ClipboardCheck,
  PenTool,
  PlaneLanding,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Logo from '../common/Logo';
import CountryFlag from '../common/CountryFlag';
import { DESTINATIONS } from '../../utils/constants';
import defaultLogo from '../../assets/logo.png';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  {
    label: 'Destinations',
    path: '/study-abroad',
    children: DESTINATIONS.map((d) => ({
      label: d.name,
      path: `/study-in/${d.slug}`,
      slug: d.slug,
      code: d.code,
    })),
  },
  { label: 'Universities', path: '/universities' },
  {
    label: 'Services',
    path: '/services',
    children: [
      { label: 'Career Counseling', path: '/services', icon: Compass },
      { label: 'University Selection', path: '/services', icon: School },
      { label: 'Visa Assistance', path: '/services', icon: FileCheck },
      { label: 'Scholarship Guidance', path: '/scholarships', icon: GraduationCap },
      { label: 'Test Preparation', path: '/test-preparation', icon: ClipboardCheck },
      { label: 'SOP & LOR Writing', path: '/services', icon: PenTool },
      { label: 'Airport Pickup', path: '/services', icon: PlaneLanding },
    ],
  },
  { label: 'Success Stories', path: '/success-stories' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

function isLinkActive(link, pathname) {
  if (link.label === 'Destinations') {
    return pathname === '/study-abroad' || pathname.startsWith('/study-in/');
  }
  if (link.label === 'Services') {
    return ['/services', '/scholarships', '/test-preparation'].includes(pathname);
  }
  return pathname === link.path;
}

function DestinationsMenu({ children, isOpen }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
        >
          <div className="w-[min(660px,calc(100vw-2rem))] rounded-2xl bg-white p-3 shadow-strong border border-dark-200/70">
            <div className="grid grid-cols-3 gap-0.5">
              {children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex min-w-0 items-center gap-2.5 px-2.5 py-2.5 rounded-xl transition-colors duration-150 group ${
                      isActive ? 'bg-primary-50' : 'hover:bg-primary-50'
                    }`
                  }
                >
                  <CountryFlag
                    slug={child.slug}
                    code={child.code}
                    className="h-6 w-9 group-hover:ring-primary-300"
                  />
                  <span className="truncate text-sm text-dark-700 group-hover:text-primary-600 font-medium transition-colors">
                    {child.label}
                  </span>
                </NavLink>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-dark-200/70">
              <Link
                to="/study-abroad"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
              >
                View all destinations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ServicesMenu({ children, isOpen }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
        >
          <div className="w-[19rem] rounded-2xl bg-white p-2 shadow-strong border border-dark-200/70">
            {children.map((child) => {
              const Icon = child.icon;
              return (
                <Link
                  key={child.label}
                  to={child.path}
                  className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors duration-150 group"
                >
                  <span className="w-9 h-9 shrink-0 rounded-lg bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm text-dark-700 group-hover:text-primary-600 font-medium transition-colors">
                    {child.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function linkClassName(active) {
  return `relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
    active
      ? 'text-primary-600 bg-primary-50'
      : 'text-dark-600 hover:text-primary-600 hover:bg-dark-50'
  }`;
}

export default function Navbar({ onCounselClick }: any) {
  const { settings } = useSettings();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const logoUrl = settings.company?.logo || settings.logo || defaultLogo;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileAccordion(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleDropdownEnter = useCallback((label) => setOpenDropdown(label), []);
  const handleDropdownLeave = useCallback(() => setOpenDropdown(null), []);
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOpenDropdown(null);
  };

  const handleCounsel = () => {
    setMobileOpen(false);
    onCounselClick?.();
  };

  return (
    <>
      {/* Brand accent rule */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-400" />

      {/* Top utility bar */}
      <div className="hidden lg:block bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {settings.phone}
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="hidden md:flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {settings.email}
              </a>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-white/70">
            <GraduationCap className="w-3.5 h-3.5 text-white/70" />
            {settings.siteTagline || 'Your Gateway to Global Education'}
          </p>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b transition-all duration-300 ${
          scrolled ? 'border-dark-200/70 shadow-soft' : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link
              to="/"
              aria-label="Eduvia Consultancy — home"
              className="shrink-0 rounded-lg transition-opacity hover:opacity-85"
            >
              <Logo
                src={logoUrl}
                showName={false}
                imageClassName="h-9 sm:h-10 lg:h-11 w-auto max-w-[150px] sm:max-w-[175px] object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link, location.pathname);
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => link.children && handleDropdownEnter(link.label)}
                    onMouseLeave={handleDropdownLeave}
                    onBlur={handleBlur}
                  >
                    {link.children ? (
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                        onFocus={() => handleDropdownEnter(link.label)}
                        aria-expanded={openDropdown === link.label}
                        aria-haspopup="true"
                        className={linkClassName(active)}
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openDropdown === link.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <Link to={link.path} className={linkClassName(active)}>
                        {link.label}
                      </Link>
                    )}
                    {link.children && link.label === 'Destinations' && (
                      <DestinationsMenu isOpen={openDropdown === link.label}>
                        {link.children}
                      </DestinationsMenu>
                    )}
                    {link.children && link.label === 'Services' && (
                      <ServicesMenu isOpen={openDropdown === link.label}>
                        {link.children}
                      </ServicesMenu>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Desktop CTA + Mobile Hamburger */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onCounselClick}
                className="shine hidden xl:inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-white text-sm font-semibold rounded-full shadow-accent hover:bg-accent-600 active:scale-[0.98] transition-all duration-200"
              >
                <CalendarCheck className="w-4 h-4" />
                Free Counseling
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="xl:hidden inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dark-200 text-dark-700 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-dark-950/60 backdrop-blur-sm z-50 xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-[21rem] max-w-[88vw] bg-white z-50 xl:hidden shadow-strong overflow-y-auto flex flex-col"
            >
              <div className="sticky top-0 bg-white flex items-center justify-between px-4 py-3.5 border-b border-dark-200/70 z-10">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Eduvia Consultancy — home"
                >
                  <Logo
                    src={logoUrl}
                    showName={false}
                    imageClassName="h-9 w-auto max-w-[150px] object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-dark-200 text-dark-500 transition-colors hover:bg-dark-50 hover:text-dark-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-3 space-y-0.5" aria-label="Mobile">
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link, location.pathname);
                  return (
                    <div key={link.label}>
                      {link.children ? (
                        <>
                          <button
                            onClick={() =>
                              setMobileAccordion(mobileAccordion === link.label ? null : link.label)
                            }
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                              active
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-dark-700 hover:bg-dark-50'
                            }`}
                            aria-expanded={mobileAccordion === link.label}
                          >
                            {link.label}
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200 ${
                                mobileAccordion === link.label ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {mobileAccordion === link.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden pl-3 mt-0.5 space-y-0.5"
                              >
                                {link.children.map((child) => (
                                  <NavLink
                                    key={child.path + child.label}
                                    to={child.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive: childActive }) =>
                                      `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                                        childActive
                                          ? 'text-primary-600 bg-primary-50 font-medium'
                                          : 'text-dark-500 hover:text-primary-600 hover:bg-dark-50'
                                      }`
                                    }
                                  >
                                    <CountryFlag
                                      slug={child.slug}
                                      code={child.code}
                                      className="h-5 w-8"
                                    />
                                    {child.label}
                                  </NavLink>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                            active
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-dark-700 hover:bg-dark-50'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-dark-200/70 space-y-2.5 bg-dark-50/60">
                <div className="grid grid-cols-2 gap-2.5">
                  {settings.phone && (
                    <a
                      href={`tel:${settings.phone}`}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dark-200 bg-white text-primary-600 text-sm font-semibold hover:border-primary-300 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  )}
                  {settings.phone2 && (
                    <a
                      href={`https://wa.me/${settings.phone2.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dark-200 bg-white text-green-700 text-sm font-semibold hover:border-green-300 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                </div>
                <button
                  onClick={handleCounsel}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-500 text-white text-sm font-semibold rounded-full shadow-xs hover:bg-accent-600 active:scale-[0.98] transition-all"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book Free Counseling
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
