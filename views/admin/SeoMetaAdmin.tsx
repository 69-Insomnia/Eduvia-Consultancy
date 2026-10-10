'use client';

import { useState, useEffect, useCallback } from 'react';
import { Braces, Pencil, RotateCcw, Trash2, Plus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable from '../../components/admin/AdminTable';
import PageHeader from '../../components/admin/PageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { INPUT_CLASS } from '../../components/admin/FormField';

const ENTITY_TYPES = [
  { value: 'service', label: 'Service' },
  { value: 'university', label: 'University' },
  { value: 'blog', label: 'Blog post' },
  { value: 'destination', label: 'Destination' },
  { value: 'course', label: 'Course' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'page', label: 'Site page' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = {
  entityType: 'service',
  entityId: '',
  metaTitle: '',
  metaDescription: '',
  ogImageUrl: '',
  ogTitle: '',
  ogDescription: '',
  canonicalUrl: '',
  noindex: false,
  jsonLd: '',
};

const typeLabel = (value) => ENTITY_TYPES.find((t) => t.value === value)?.label || value;

/**
 * Editor for `public.seo_meta`: one row per (entity_type, entity_id) carrying
 * meta overrides and arbitrary JSON-LD that ships on top of the record's own
 * `seo` subdocument. The JSON-LD field is validated as JSON before saving.
 */
export default function SeoMetaAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // existing row being edited, or {} for new
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/seo-meta');
      setRows(res.data?.seoMetas || []);
    } catch {
      toast.error('Failed to load structured data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setJsonError('');
    setEditing({});
  };

  const openEdit = (row) => {
    setForm({
      entityType: row.entityType || 'service',
      entityId: row.entityId || '',
      metaTitle: row.metaTitle || '',
      metaDescription: row.metaDescription || '',
      ogImageUrl: row.ogImageUrl || '',
      ogTitle: row.ogTitle || '',
      ogDescription: row.ogDescription || '',
      canonicalUrl: row.canonicalUrl || '',
      noindex: Boolean(row.noindex),
      jsonLd: row.jsonLd ? JSON.stringify(row.jsonLd, null, 2) : '',
    });
    setJsonError('');
    setEditing(row);
  };

  const setField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'jsonLd') setJsonError('');
  };

  const handleSave = async () => {
    if (!form.entityId.trim()) {
      toast.error('Entity ID is required');
      return;
    }

    let jsonLd = null;
    if (form.jsonLd.trim()) {
      try {
        jsonLd = JSON.parse(form.jsonLd);
      } catch (err) {
        setJsonError(`Invalid JSON: ${err.message}`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        metaTitle: form.metaTitle.trim() || null,
        metaDescription: form.metaDescription.trim() || null,
        ogImageUrl: form.ogImageUrl.trim() || null,
        ogTitle: form.ogTitle.trim() || null,
        ogDescription: form.ogDescription.trim() || null,
        canonicalUrl: form.canonicalUrl.trim() || null,
        noindex: form.noindex,
        jsonLd,
      };
      const res = await api.put(
        `/seo-meta/${encodeURIComponent(form.entityType.trim().toLowerCase())}/${encodeURIComponent(form.entityId.trim())}`,
        payload
      );
      const saved = res.data?.seoMeta;
      setRows((prev) => {
        const rest = prev.filter((r) => r._id !== editing._id);
        return [saved, ...rest];
      });
      toast.success('Structured data saved');
      setEditing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.delete(`/seo-meta/${target._id}`);
      setRows((prev) => prev.filter((r) => r._id !== target._id));
      toast.success('Structured data deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Structured Data"
        description="Extra JSON-LD and meta overrides stored per entity (service, university, blog, …). Renders on top of each record's own SEO."
      >
        <AdminButton onClick={openAdd} icon={Plus}>
          Add entry
        </AdminButton>
      </PageHeader>

      <AdminTable
        columns={[
          { key: 'entity', label: 'Entity' },
          { key: 'metaTitle', label: 'Meta title' },
          { key: 'jsonLd', label: 'JSON-LD' },
          { key: 'actions', label: 'Actions', align: 'right' },
        ]}
        rows={rows}
        loading={loading}
        emptyIcon={Braces}
        emptyMessage="No custom structured data yet"
        minWidth="min-w-[720px]"
        renderRow={(row) => (
          <tr key={row._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3">
              <p className="font-medium text-dark-700">{typeLabel(row.entityType)}</p>
              <p className="text-xs text-dark-400">{row.entityId}</p>
            </td>
            <td className="max-w-[260px] px-4 py-3">
              {row.metaTitle ? (
                <span className="block truncate text-dark-600">{row.metaTitle}</span>
              ) : (
                <span className="text-dark-300">—</span>
              )}
            </td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                <Braces className="h-3 w-3" aria-hidden="true" />
                {row.jsonLd ? (Array.isArray(row.jsonLd) ? `${row.jsonLd.length} nodes` : '1 node') : 'none'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Trash2} label="Delete entry" onClick={() => setDeleteTarget(row)} />
                <RowAction icon={Pencil} label="Edit entry" onClick={() => openEdit(row)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?._id ? 'Edit structured data' : 'Add structured data'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              label="Entity type"
              as="select"
              value={form.entityType}
              onChange={setField('entityType')}
              options={ENTITY_TYPES}
            />
            <FormField
              label="Entity ID (slug)"
              value={form.entityId}
              onChange={setField('entityId')}
              hint="The record's slug, e.g. rwth-aachen-university"
              required
            />
          </div>

          <FormField
            label="Meta title"
            value={form.metaTitle}
            onChange={setField('metaTitle')}
            placeholder="Overrides the record's meta title"
          />
          <FormField
            label="Meta description"
            as="textarea"
            rows={2}
            value={form.metaDescription}
            onChange={setField('metaDescription')}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              label="OG title"
              value={form.ogTitle}
              onChange={setField('ogTitle')}
            />
            <FormField
              label="OG image URL"
              value={form.ogImageUrl}
              onChange={setField('ogImageUrl')}
              placeholder="/og-image.jpg"
            />
          </div>
          <FormField
            label="OG description"
            as="textarea"
            rows={2}
            value={form.ogDescription}
            onChange={setField('ogDescription')}
          />

          <FormField
            label="Canonical URL"
            type="url"
            value={form.canonicalUrl}
            onChange={setField('canonicalUrl')}
            placeholder="Defaults to this page's own URL"
          />

          <label className="flex items-center gap-2 text-sm font-medium text-dark-700">
            <input
              type="checkbox"
              checked={form.noindex}
              onChange={setField('noindex')}
              className="h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
            />
            Noindex (ask search engines not to index this entity)
          </label>

          <div>
            <label htmlFor="seo-jsonld" className="mb-1.5 block text-sm font-medium text-dark-700">
              JSON-LD
            </label>
            <textarea
              id="seo-jsonld"
              rows={8}
              value={form.jsonLd}
              onChange={setField('jsonLd')}
              placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Service",\n  "name": "..."\n}'}
              className={`${INPUT_CLASS} resize-y font-mono text-xs ${jsonError ? 'border-accent-400 focus:border-accent-500 focus:ring-accent-500/10' : ''}`}
            />
            {jsonError ? (
              <p className="mt-1 text-xs text-accent-600">{jsonError}</p>
            ) : (
              <p className="mt-1 text-xs text-dark-400">
                Must be valid JSON (object or array). Rendered as an extra &lt;script type="application/ld+json"&gt; on the entity's page.
              </p>
            )}
          </div>

          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : 'Save changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete structured data"
        message={
          deleteTarget
            ? `Remove the custom structured data for ${typeLabel(deleteTarget.entityType)} "${deleteTarget.entityId}"?`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
