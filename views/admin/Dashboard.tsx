'use client';

import { useState, useEffect } from 'react';
import { Link } from '../../utils/router';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  FileCheck,
  Landmark,
  BookOpen,
  TrendingUp,
  Plus,
  Eye,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import SeoHealthPanel from '../../components/admin/SeoHealthPanel';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  New: 'bg-primary-50 text-primary-700',
  Contacted: 'bg-amber-50 text-amber-700',
  Counseling: 'bg-purple-50 text-purple-700',
  Application: 'bg-orange-50 text-orange-700',
  Converted: 'bg-green-50 text-green-700',
  Closed: 'bg-dark-100 text-dark-600',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CARD = 'rounded-2xl border border-dark-200/70 bg-white shadow-soft';
const CARD_HEADING = 'font-display text-sm font-semibold text-dark-900';

function formatShortDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${CARD} p-5`}
    >
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold tabular-nums text-dark-900">{value}</p>
      {/* Full card width: side-by-side with the icon, "Active Applications" had
          ~87px and ellipsised to "Active A...". */}
      <p className="mt-0.5 text-sm text-dark-500">{label}</p>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className={`${CARD} p-5`}>
      <div className="skeleton mb-3 h-11 w-11 rounded-xl" />
      <div className="skeleton h-6 w-16" />
      <div className="skeleton mt-1.5 h-4 w-24" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className={`${CARD} p-5`}>
      <div className="skeleton mb-4 h-5 w-40" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch {
      setError('Failed to load dashboard');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6" role="status" aria-live="polite">
        <span className="sr-only">Loading dashboard</span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonTable />
          <SkeletonTable />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-4 text-dark-500">{error}</p>
        <button
          onClick={fetchStats}
          className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary-600 active:scale-[0.98]"
        >
          Retry
        </button>
      </div>
    );
  }

  const d = stats || {};
  const inquiries = Array.isArray(d.recentInquiries) ? d.recentInquiries : [];
  const monthlyData = Array.isArray(d.monthlyInquiries) && d.monthlyInquiries.length
    ? d.monthlyInquiries
    : new Array(12).fill(0);
  const maxVal = Math.max(...monthlyData, 1);

  const chartSummary = monthlyData
    .map((val, i) => `${MONTHS[i]}: ${val}`)
    .join(', ');

  const statCards = [
    { icon: MessageSquare, label: 'Total Inquiries', value: d.totalInquiries || 0, color: 'bg-primary-50 text-primary-600' },
    { icon: TrendingUp, label: 'New This Week', value: d.newInquiriesThisWeek || 0, color: 'bg-green-50 text-green-600' },
    { icon: Users, label: 'Total Students', value: d.totalStudents || 0, color: 'bg-purple-50 text-purple-600' },
    { icon: FileCheck, label: 'Active Applications', value: d.activeApplications || 0, color: 'bg-amber-50 text-amber-600' },
    { icon: BookOpen, label: 'Published Blogs', value: d.publishedBlogs || 0, color: 'bg-secondary-50 text-secondary-600' },
    { icon: Landmark, label: 'Universities', value: d.totalUniversities || 0, color: 'bg-accent-50 text-accent-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${CARD} p-5 lg:col-span-2`}>
          <h2 className={`${CARD_HEADING} mb-4`}>Monthly Inquiries</h2>
          {/* The bar heights carry meaning visually, so expose the series as text
              for screen readers rather than leaving the chart silent. */}
          <div
            className="flex h-48 items-end gap-2"
            role="img"
            aria-label={`Monthly inquiries: ${chartSummary}`}
          >
            {monthlyData.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full justify-center">
                  <div
                    className="w-full max-w-8 rounded-t bg-primary-500"
                    style={{ height: `${(val / maxVal) * 140}px`, minHeight: val > 0 ? '4px' : '0px' }}
                    title={`${MONTHS[i]}: ${val}`}
                  />
                </div>
                <span className="text-[10px] text-dark-400" aria-hidden="true">
                  {MONTHS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${CARD} p-5`}>
          <h2 className={`${CARD_HEADING} mb-4`}>Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to: '/admin/universities', icon: Plus, label: 'Add University', tone: 'bg-primary-50 text-primary-600' },
              { to: '/admin/blogs', icon: Plus, label: 'Add Blog', tone: 'bg-secondary-50 text-secondary-600' },
              { to: '/admin/inquiries', icon: Eye, label: 'View Inquiries', tone: 'bg-accent-50 text-accent-600' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-dark-50"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.tone}`}>
                  <action.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-dark-700 transition-colors group-hover:text-primary-600">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={`${CARD} p-5`}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className={CARD_HEADING}>Recent Inquiries</h2>
          <Link
            to="/admin/inquiries"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-200/70">
                {['Name', 'Email', 'Country', 'Course', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-200/70">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={"6" as any} className="py-8 text-center text-dark-400">
                    No inquiries yet
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq._id} className="transition-colors hover:bg-dark-50">
                    <td className="px-2 py-3 font-medium text-dark-800">{inq.fullName}</td>
                    <td className="px-2 py-3 text-dark-500">{inq.email}</td>
                    <td className="px-2 py-3 text-dark-500">{inq.preferredCountry}</td>
                    <td className="px-2 py-3 text-dark-500">{inq.interestedCourse || '—'}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[inq.status] || 'bg-dark-100 text-dark-600'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-dark-400">{formatShortDate(inq.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SeoHealthPanel compact />
    </div>
  );
}
