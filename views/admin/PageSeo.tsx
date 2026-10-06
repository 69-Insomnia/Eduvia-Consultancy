'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil, RotateCcw, Globe, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable from '../../components/admin/AdminTable';
import PageHeader from '../../components/admin/PageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import SeoFields, { EMPTY_SEO, seoToForm, seoToPayload } from '../../components/admin/SeoFields';

function StatusChip({ page }: any) {
  const noindex = /noindex/i.test(page.seo?.robots || '');

  const chips = [];
  chips.push(
    page.seo?.title
      ? { label: 'Custom', className: 'bg-green-50 text-green-700' }
      : { label: 'Using default', className: 'bg-dark-100 text-dark-600' }
  );
  if (noindex) chips.push({ label: 'No index', className: 'bg-amber-50 text-amber-700' });

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span key={chip.label} className={`rounded-full px-2 py-0.5 text-xs font-medium ${chip.className}`}>
          {chip.label}
        </span>
      ))}
    </div>
  );
}

export default function PageSeo() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_SEO });
  const [saving, setSaving] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/page-seo/admin');
      setPages(res.data?.pages || []);
    } catch {
      toast.error('Failed to load page SEO');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (page) => {
    setForm(seoToForm(page.seo));
    setEditing(page);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/page-seo/${editing.key}`, { seo: seoToPayload(form) });
      const saved = res.data?.page;
      setPages((prev) =>
        prev.map((p) => (p.key === editing.key ? { ...p, seo: saved?.seo || {} } : p))
      );
      toast.success(`${editing.label} SEO saved`);
      setEditing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const target = resetTarget;
    setResetTarget(null);
    try {
      await api.delete(`/page-seo/${target.key}/seo`);
      setPages((prev) => prev.map((p) => (p.key === target.key ? { ...p, seo: {} } : p)));
      toast.success(`${target.label} reverted to its default`);
    } catch {
      toast.error('Failed to reset');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Page SEO"
        description="Meta title, description and keywords for the site's own pages. Leaving a field empty uses the default built into that page."
      >
        <AdminButton to="/admin/seo" variant="ghost" icon={Search}>
          SEO overview
        </AdminButton>
      </PageHeader>

      <AdminTable
        columns={[
          { key: 'page', label: 'Page' },
          { key: 'title', label: 'Meta title' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions', align: 'right' },
        ]}
        rows={pages}
        loading={loading}
        emptyIcon={Globe}
        emptyMessage="No pages registered"
        minWidth="min-w-[760px]"
        renderRow={(page) => (
          <tr key={page.key} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3">
              <p className="font-medium text-dark-700">{page.label}</p>
              <p className="text-xs text-dark-400">{page.path}</p>
            </td>
            <td className="max-w-[320px] px-4 py-3">
              {page.seo?.title ? (
                <span className="block truncate text-dark-600">{page.seo.title}</span>
              ) : (
                <span className="text-dark-300">—</span>
              )}
            </td>
            <td className="px-4 py-3">
              <StatusChip page={page} />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                {page.seo?.title && (
                  <RowAction
                    icon={RotateCcw}
                    label={`Reset ${page.label} to default`}
                    onClick={() => setResetTarget(page)}
                  />
                )}
                <RowAction
                  icon={Pencil}
                  label={`Edit ${page.label} SEO`}
                  onClick={() => openEdit(page)}
                />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `${editing.label} — SEO` : 'SEO'}
        size="lg"
      >
        <div className="space-y-4">
          <SeoFields
            value={form}
            onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
            title="Metadata"
            previewUrl={editing?.path}
          />
          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : 'Save changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(resetTarget)}
        onClose={() => setResetTarget(null)}
        onConfirm={handleReset}
        title="Reset to default"
        message={
          resetTarget
            ? `Remove the custom SEO for ${resetTarget.label} and use the default built into that page?`
            : ''
        }
        confirmLabel="Reset"
      />
    </div>
  );
}
