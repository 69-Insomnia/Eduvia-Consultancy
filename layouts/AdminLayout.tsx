'use client';

import { useState, useEffect } from 'react';
import { NavLink, useLocation } from '../utils/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileCheck,
  Landmark,
  BookOpen,
  MapPin,
  Award,
  PenTool,
  Star,
  UserCheck,
  HelpCircle,
  Briefcase,
  Settings,
  Quote,
  Image,
  Menu,
  X,
  LogOut,
  Gauge,
  FileSearch,
  Braces,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import SEO from '../components/common/SEO';

/**
 * Grouped so the sidebar stays scannable. It was previously one flat list of 16
 * links, which made it hard to find anything and gave SEO — a whole area of the
 * product — no home at all.
 */
const ADMIN_NAV: any[] = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true }],
  },
  {
    section: 'SEO',
    items: [
      { label: 'SEO Health', path: '/admin/seo', icon: Gauge },
      { label: 'Page SEO', path: '/admin/page-seo', icon: FileSearch },
      { label: 'Structured Data', path: '/admin/seo-meta', icon: Braces },
    ],
  },
  {
    section: 'Leads',
    items: [
      { label: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
      { label: 'Students', path: '/admin/students', icon: Users },
      { label: 'Applications', path: '/admin/applications', icon: FileCheck },
    ],
  },
  {
    section: 'Content',
    items: [
      { label: 'Universities', path: '/admin/universities', icon: Landmark },
      { label: 'Courses', path: '/admin/courses', icon: BookOpen },
      { label: 'Destinations', path: '/admin/destinations', icon: MapPin },
      { label: 'Scholarships', path: '/admin/scholarships', icon: Award },
      { label: 'Blogs', path: '/admin/blogs', icon: PenTool },
      { label: 'Success Stories', path: '/admin/success-stories', icon: Star },
      { label: 'Team', path: '/admin/team', icon: UserCheck },
      { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
      { label: 'Services', path: '/admin/services', icon: Briefcase },
      { label: 'Testimonials', path: '/admin/testimonials', icon: Quote },
      { label: 'Media', path: '/admin/media', icon: Image },
    ],
  },
  {
    section: 'Configuration',
    items: [{ label: 'Settings', path: '/admin/settings', icon: Settings }],
  },
];

const ALL_NAV_ITEMS = ADMIN_NAV.flatMap((group) => group.items);

const navItemClass = ({ isActive }) =>
  `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`;

function NavItemContent({ item, isActive }: any) {
  const Icon = item.icon;
  return (
    <>
      {isActive && (
        <span
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-400"
          aria-hidden="true"
        />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      {item.label}
    </>
  );
}

function SidebarBrand() {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
      <span className="inline-flex items-center rounded-lg bg-white px-2 py-1.5">
        <Logo imageClassName="h-7 w-auto max-w-[104px] object-contain" />
      </span>
      <span className="text-[10px] font-medium tracking-wide text-white/60">Admin</span>
    </div>
  );
}

function SidebarNav({ onNavigate }: any) {
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {ADMIN_NAV.map((group) => (
        <div key={group.section}>
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {group.section}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onNavigate}
                className={navItemClass}
              >
                {({ isActive }) => <NavItemContent item={item} isActive={isActive} />}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle =
    ALL_NAV_ITEMS.find((item) =>
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    )?.label || 'Dashboard';

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-dvh bg-dark-50">
      {/* The dashboard must never appear in search results. robots.txt asks
          crawlers not to fetch /admin, but a disallowed URL can still be indexed
          if anything links to it — noindex is the only reliable exclusion. */}
      <SEO title={`${pageTitle} — Admin`} noindex />

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-gradient-to-b from-primary-800 to-primary-950 text-white lg:flex">
        <SidebarBrand />
        <SidebarNav />
        <div className="border-t border-white/10 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-dark-950/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-primary-800 to-primary-950 text-white shadow-strong lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <span className="inline-flex items-center rounded-lg bg-white px-2 py-1.5">
                  <Logo imageClassName="h-6 w-auto max-w-[92px] object-contain" />
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <SidebarNav onNavigate={() => setSidebarOpen(false)} />

              <div className="border-t border-white/10 p-4">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-dark-200/70 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-dark-100 hover:text-dark-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="font-display text-lg font-semibold text-dark-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight text-dark-700">
                {admin?.name || 'Admin'}
              </p>
              <p className="text-xs text-dark-400">{admin?.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
