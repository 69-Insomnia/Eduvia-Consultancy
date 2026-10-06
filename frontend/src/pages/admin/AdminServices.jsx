import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, Loader2, Settings, GripVertical, X } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import PageHeader from '../../components/admin/PageHeader';
import FormField, { CheckboxField } from '../../components/admin/FormField';
import SeoFields, { EMPTY_SEO, seoToForm, seoToPayload } from '../../components/admin/SeoFields';
import toast from 'react-hot-toast';

const emptyService = { title: '', icon: '', description: '', features: [], detailedContent: '', image: '', order: 0, isActive: true, seo: { ...EMPTY_SEO } };

const COLUMNS = [
  { key: 'handle', label: '' },
  { key: 'icon', label: 'Icon' },
  { key: 'title', label: 'Title' },
  { key: 'order', label: 'Order' },
  { key: 'active', label: 'Active' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptyService });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services?limit=100');
      setServices(Array.isArray(res.data) ? res.data : res.data.services || []);
    } catch (err) { toast.error('Failed to load services'); } finally { setLoading(false); }
  };

  const sorted = useMemo(() => [...services].sort((a, b) => (a.order || 0) - (b.order || 0)), [services]);
  const { page, setPage, totalPages, paginated, total } = useClientPagination(sorted);

  const openAdd = () => { setForm({ ...emptyService, features: [], seo: { ...EMPTY_SEO } }); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s, features: s.features || [], seo: seoToForm(s.seo) }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return; }
    setSaving(true);
    const payload = { ...form, seo: seoToPayload(form.seo) };
    try {
      if (modal === 'add') {
        const res = await api.post('/services', payload);
        setServices((p) => [res.data.service || res.data, ...p]);
        toast.success('Service added');
      } else {
        const res = await api.put(`/services/${form._id}`, payload);
        setServices((p) => p.map((s) => s._id === form._id ? (res.data.service || res.data) : s));
        toast.success('Service updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/services/${id}`); setServices((p) => p.filter((s) => s._id !== id)); toast.success('Service deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const addFeature = () => { if (featureInput) { setForm((p) => ({ ...p, features: [...p.features, featureInput] })); setFeatureInput(''); } };
  const removeFeature = (i) => setForm((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-4">
      <PageHeader>
        <AdminButton icon={Plus} onClick={openAdd}>Add Service</AdminButton>
      </PageHeader>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={Settings}
        emptyMessage="No services found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[760px]"
        renderRow={(s) => (
          <tr key={s._id} className="transition-colors hover:bg-dark-50">
            <td className="w-8 px-4 py-3 text-dark-300"><GripVertical className="h-4 w-4" aria-hidden="true" /></td>
            <td className="px-4 py-3 text-lg">{s.icon || '-'}</td>
            <td className="px-4 py-3 font-medium text-dark-700">{s.title}</td>
            <td className="px-4 py-3 text-dark-500">{s.order || 0}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.isActive !== false ? 'bg-green-50 text-green-700' : 'bg-dark-100 text-dark-600'}`}>
                {s.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${s.title}`} onClick={() => openEdit(s)} />
                <RowAction icon={Trash2} label={`Delete ${s.title}`} tone="danger" onClick={() => setDeleteConfirm(s._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Service' : 'Edit Service'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <FormField label="Icon (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. 🎓" />
            <FormField label="Image URL" type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <FormField label="Order" type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
          </div>

          <FormField label="Description" as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div>
            <span className="mb-1.5 block text-sm font-medium text-dark-700">Features</span>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="Add feature"
                aria-label="Add feature"
                className="flex-1 rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
              <AdminButton variant="subtle" onClick={addFeature}>Add</AdminButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.features?.map((f, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">
                  {f}
                  <button onClick={() => removeFeature(i)} aria-label={`Remove ${f}`} className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-primary-500 transition-colors hover:bg-accent-50 hover:text-accent-500">
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <FormField label="Detailed Content" as="textarea" rows={5} value={form.detailedContent} onChange={(e) => setForm({ ...form, detailedContent: e.target.value })} />
          <CheckboxField label="Active" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          <SeoFields value={form.seo} onChange={(field, value) => setForm((p) => ({ ...p, seo: { ...p.seo, [field]: value } }))} previewUrl={form.slug ? `/services/${form.slug}` : undefined} />

          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {saving ? 'Saving…' : modal === 'add' ? 'Add Service' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete service"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
