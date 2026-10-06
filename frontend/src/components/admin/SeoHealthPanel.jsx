import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileWarning,
  Globe,
  RefreshCw,
  Copy,
} from 'lucide-react';
import api from '../../services/api';
import AdminButton from './AdminButton';

/**
 * SEO audit for the admin.
 *
 * All the counting happens server-side in `GET /api/dashboard/seo` — the full
 * collections are never sent to the browser just to be counted here.
 */

const CARD = 'rounded-2xl border border-dark-200/70 bg-white p-5 shadow-soft';

function StatCard({ label, value, tone = 'neutral', hint }) {
  const tones = {
    neutral: 'text-dark-900',
    good: 'text-green-600',
    warn: 'text-amber-600',
    bad: 'text-accent-600',
  };

  return (
    <div className={CARD}>
      <p className="text-xs font-medium uppercase tracking-wide text-dark-400">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${tones[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-dark-400">{hint}</p>}
    </div>
  );
}

function IssueRow({ icon: Icon, tone, label, count, to }) {
  if (!count) return null;

  const tones = {
    warn: 'bg-amber-50 text-amber-600',
    bad: 'bg-accent-50 text-accent-600',
  };

  const content = (
    <>
      <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="flex-1 text-sm text-dark-700">{label}</span>
      <span className="font-display text-sm font-semibold text-dark-900">{count}</span>
    </>
  );

  const className =
    'flex items-center gap-3 rounded-xl border border-dark-200/70 bg-white px-4 py-3 transition-colors hover:border-primary-200';

  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default function SeoHealthPanel({ compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/seo');
      setData(res.data);
    } catch {
      setError('Could not load the SEO audit.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className={`${CARD} animate-pulse space-y-3`}>
        <div className="h-5 w-40 rounded-lg bg-dark-100" />
        <div className="h-4 w-3/4 rounded-lg bg-dark-100" />
        <div className="h-4 w-2/3 rounded-lg bg-dark-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={CARD}>
        <p className="text-sm text-dark-500">{error}</p>
        <AdminButton variant="ghost" size="sm" icon={RefreshCw} onClick={load} className="mt-3">
          Retry
        </AdminButton>
      </div>
    );
  }

  const { totals, entities, duplicateTitles } = data;
  const clean =
    totals.missingSeo === 0 &&
    totals.titleLong === 0 &&
    totals.titleShort === 0 &&
    totals.descriptionMissing === 0 &&
    duplicateTitles.length === 0;

  return (
    <div className="space-y-4">
      <div className={CARD}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-base font-semibold text-dark-900">SEO overview</h3>
            <p className="mt-0.5 text-sm text-dark-500">
              {totals.documents} public items and {totals.pages} pages audited.
            </p>
          </div>
          <AdminButton variant="ghost" size="sm" icon={RefreshCw} onClick={load}>
            Refresh
          </AdminButton>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Missing SEO"
            value={totals.missingSeo}
            tone={totals.missingSeo ? 'bad' : 'good'}
            hint="No meta title set"
          />
          <StatCard
            label="Titles too long"
            value={totals.titleLong}
            tone={totals.titleLong ? 'warn' : 'good'}
            hint={`Over ${data.limits.titleMax} characters`}
          />
          <StatCard
            label="Missing descriptions"
            value={totals.descriptionMissing}
            tone={totals.descriptionMissing ? 'warn' : 'good'}
          />
          <StatCard
            label="Set to noindex"
            value={totals.noindex}
            tone={totals.noindex ? 'warn' : 'good'}
            hint="Deliberately hidden"
          />
        </div>
      </div>

      <div className={CARD}>
        <h4 className="mb-3 font-display text-sm font-semibold text-dark-900">Pages</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-dark-400">Custom SEO</p>
            <p className="font-display text-lg font-semibold text-dark-900">{totals.pagesCustom}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-dark-400">Using default</p>
            <p className="font-display text-lg font-semibold text-dark-900">{totals.pagesUsingDefault}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-dark-400">Sitemap URLs</p>
            <p className="font-display text-lg font-semibold text-dark-900">
              {totals.sitemapUrlCount ?? '—'}
            </p>
          </div>
          <div className="flex items-end">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View sitemap
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {clean ? (
          <div className={`${CARD} flex items-center gap-3`}>
            <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
            <p className="text-sm text-dark-600">
              No SEO problems detected across your published content.
            </p>
          </div>
        ) : (
          <>
            <IssueRow
              icon={FileWarning}
              tone="bad"
              count={totals.missingSeo}
              label="Items with no meta title"
            />
            <IssueRow
              icon={AlertTriangle}
              tone="warn"
              count={totals.titleLong}
              label={`Meta titles over ${data.limits.titleMax} characters`}
            />
            <IssueRow
              icon={AlertTriangle}
              tone="warn"
              count={totals.titleShort}
              label={`Meta titles under ${data.limits.titleMin} characters`}
            />
            <IssueRow
              icon={FileWarning}
              tone="warn"
              count={totals.descriptionMissing}
              label="Items with no meta description"
            />
            <IssueRow
              icon={Copy}
              tone="bad"
              count={duplicateTitles.length}
              label="Duplicate meta titles across items"
            />
          </>
        )}
      </div>

      {!compact && (
        <div className={CARD}>
          <h4 className="mb-3 font-display text-sm font-semibold text-dark-900">By content type</h4>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-dark-400">
                  <th className="py-2 text-left font-semibold">Type</th>
                  <th className="py-2 text-right font-semibold">Items</th>
                  <th className="py-2 text-right font-semibold">No SEO</th>
                  <th className="py-2 text-right font-semibold">Title long</th>
                  <th className="py-2 text-right font-semibold">No description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200/70">
                {entities.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2.5 text-dark-700">{row.label}</td>
                    <td className="py-2.5 text-right text-dark-500">{row.total}</td>
                    <td className={`py-2.5 text-right ${row.missingSeo ? 'font-medium text-accent-600' : 'text-dark-400'}`}>
                      {row.missingSeo}
                    </td>
                    <td className={`py-2.5 text-right ${row.titleLong ? 'font-medium text-amber-600' : 'text-dark-400'}`}>
                      {row.titleLong}
                    </td>
                    <td className={`py-2.5 text-right ${row.descriptionMissing ? 'font-medium text-amber-600' : 'text-dark-400'}`}>
                      {row.descriptionMissing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!compact && duplicateTitles.length > 0 && (
        <div className={CARD}>
          <h4 className="mb-1 font-display text-sm font-semibold text-dark-900">
            Duplicate meta titles
          </h4>
          <p className="mb-3 text-sm text-dark-500">
            Distinct pages competing on the same title. Give each one its own.
          </p>
          <ul className="space-y-2">
            {duplicateTitles.map((dupe) => (
              <li
                key={dupe.title}
                className="flex items-start justify-between gap-4 rounded-xl bg-dark-50 px-4 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-dark-700">{dupe.title}</span>
                <span className="shrink-0 text-xs text-dark-400">
                  {dupe.count}× · {[...new Set(dupe.where)].join(', ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={`${CARD} flex flex-wrap items-center gap-3`}>
        <Globe className="h-5 w-5 text-dark-400" aria-hidden="true" />
        <p className="flex-1 text-sm text-dark-600">
          Edit the metadata for the site's own pages.
        </p>
        <AdminButton to="/admin/page-seo" variant="ghost" size="sm">
          Manage page SEO
        </AdminButton>
      </div>
    </div>
  );
}
