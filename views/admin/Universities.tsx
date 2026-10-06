'use client';

import { useState, useEffect, useMemo } from 'react';
import { Eye, Pencil, Trash2, Plus, Loader2, Landmark, Star, X } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, FilterSelect, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { CheckboxField } from '../../components/admin/FormField';
import SeoFields, { EMPTY_SEO, seoToForm, seoToPayload } from '../../components/admin/SeoFields';
import { storedImageCandidates } from '../../utils/imageAssets';
import toast from 'react-hot-toast';

const emptyUni = {
  name: '', country: '', city: '', website: '', type: 'University', ranking: '', founded: '',
  shortDescription: '', description: '', programs: [], scholarships: '', entryRequirements: '',
  tuitionRange: { min: '', max: '', currency: 'USD' }, features: [], seo: { ...EMPTY_SEO }, isFeatured: false, isActive: true,
};

const TYPES = ['University', 'College', 'Institute', 'Polytechnic'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];

const COLUMNS = [
  { key: 'logo', label: 'Logo' },
  { key: 'name', label: 'Name' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'featured', label: 'Featured' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState<any>({ ...emptyUni });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newProgram, setNewProgram] = useState({ name: '', degree: '', duration: '', tuition: '' });

  useEffect(() => { fetchUniversities(); }, []);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      // limit=100 because the endpoint pages at 10 by default, which would hide
      // most of the imported institutions.
      const res = await api.get('/universities?limit=100');
      setUniversities(Array.isArray(res.data) ? res.data : res.data.universities || []);
    } catch (err) { toast.error('Failed to load universities'); } finally { setLoading(false); }
  };

  const countries = useMemo(
    () => [...new Set(universities.map((u) => u.country).filter(Boolean))].sort(),
    [universities]
  );

  const filtered = useMemo(() => universities.filter((u) => {
    const ms = !search || u.name?.toLowerCase().includes(search.toLowerCase());
    const mf = !countryFilter || u.country === countryFilter;
    return ms && mf;
  }), [universities, search, countryFilter]);

  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, {
    resetKey: `${search}|${countryFilter}`,
  });

  const openAdd = () => { setForm({ ...emptyUni, programs: [], features: [], seo: { ...EMPTY_SEO } }); setModal('add'); };
  const openEdit = (u) => {
    setForm({
      ...u,
      programs: u.programs || [],
      features: u.features || [],
      tuitionRange: u.tuitionRange || { min: '', max: '', currency: 'USD' },
      seo: seoToForm(u.seo),
    });
    setModal('edit');
  };
  const openView = (u) => { setForm({ ...u, seo: seoToForm(u.seo) }); setModal('view'); };

  const handleSave = async () => {
    if (!form.name || !form.country) { toast.error('Name and country are required'); return; }
    setSaving(true);
    const payload = { ...form, seo: seoToPayload(form.seo) };
    try {
      if (modal === 'add') {
        const res = await api.post('/universities', payload);
        setUniversities((p) => [res.data.university || res.data, ...p]);
        toast.success('University added');
      } else {
        const res = await api.put(`/universities/${form._id}`, payload);
        setUniversities((p) => p.map((u) => u._id === form._id ? (res.data.university || res.data) : u));
        toast.success('University updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/universities/${id}`); setUniversities((p) => p.filter((u) => u._id !== id)); toast.success('University deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const addProgram = () => {
    if (!newProgram.name) return;
    setForm((p) => ({ ...p, programs: [...p.programs, { ...newProgram }] }));
    setNewProgram({ name: '', degree: '', duration: '', tuition: '' });
  };
  const removeProgram = (i) => setForm((p) => ({ ...p, programs: p.programs.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search universities…" />
        <FilterSelect value={countryFilter} onChange={setCountryFilter} allLabel="All Countries" options={countries} ariaLabel="Filter by country" />
        <AdminButton icon={Plus} onClick={openAdd}>Add University</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={Landmark}
        emptyMessage="No universities found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[760px]"
        renderRow={(u) => (
          <tr key={u._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3">
              <SmartImage candidates={storedImageCandidates(u.logo)} alt={u.name} className="h-10 w-10 rounded-xl object-cover" fallback={<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-100"><Landmark className="h-5 w-5 text-dark-400" aria-hidden="true" /></div>} />
            </td>
            <td className="px-4 py-3 font-medium text-dark-700">{u.name}</td>
            <td className="px-4 py-3 text-dark-500">{u.country}</td>
            <td className="px-4 py-3 text-dark-500">{u.city || '-'}</td>
            <td className="px-4 py-3">
              {u.isFeatured
                ? <Star className="h-4 w-4 fill-amber-500 text-amber-500" aria-label="Featured" />
                : <span className="text-dark-300">-</span>}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Eye} label={`View ${u.name}`} onClick={() => openView(u)} />
                <RowAction icon={Pencil} label={`Edit ${u.name}`} onClick={() => openEdit(u)} />
                <RowAction icon={Trash2} label={`Delete ${u.name}`} tone="danger" onClick={() => setDeleteConfirm(u._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'view' ? 'University Details' : modal === 'add' ? 'Add University' : 'Edit University'}
        size="lg"
      >
        {modal === 'view' ? (
          <div className="space-y-3 text-sm">
            {[
              ['Name', form.name],
              ['Country', form.country],
              ['City', form.city || '-'],
              ['Website', form.website || '-'],
              ['Type', form.type || '-'],
              ['Ranking', form.ranking || '-'],
              ['Featured', form.isFeatured ? 'Yes' : 'No'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-dark-500">{label}</span>
                <span className="text-right font-medium text-dark-700">{value}</span>
              </div>
            ))}
            {form.shortDescription && (
              <div><span className="mb-1 block text-dark-500">Short Description</span><p className="rounded-xl bg-dark-50 p-3 text-dark-700">{form.shortDescription}</p></div>
            )}
            {form.description && (
              <div><span className="mb-1 block text-dark-500">Full Description</span><p className="whitespace-pre-wrap rounded-xl bg-dark-50 p-3 text-dark-700">{form.description}</p></div>
            )}
            {form.programs?.length > 0 && (
              <div>
                <span className="mb-1 block text-dark-500">Programs</span>
                <div className="space-y-2">
                  {form.programs.map((p, i) => (
                    <div key={i} className="rounded-xl bg-dark-50 p-3 text-dark-700">{p.name} - {p.degree} ({p.duration}){p.tuition && ` - ${p.tuition}`}</div>
                  ))}
                </div>
              </div>
            )}
            {form.scholarships && (
              <div><span className="mb-1 block text-dark-500">Scholarships</span><p className="rounded-xl bg-dark-50 p-3 text-dark-700">{form.scholarships}</p></div>
            )}
            {form.entryRequirements && (
              <div><span className="mb-1 block text-dark-500">Entry Requirements</span><p className="rounded-xl bg-dark-50 p-3 text-dark-700">{form.entryRequirements}</p></div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <FormField label="Country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              <FormField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <FormField label="Website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <FormField label="Type" as="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={TYPES.map((t) => ({ value: t, label: t }))} />
              <FormField label="Ranking" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })} />
              <FormField label="Founded" value={form.founded} onChange={(e) => setForm({ ...form, founded: e.target.value })} />
              <div className="flex flex-wrap items-center gap-5 pt-6">
                <CheckboxField label="Featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                <CheckboxField label="Active" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              </div>
            </div>

            <FormField label="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            <FormField label="Full Description" as="textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <FormField label="Scholarships" as="textarea" rows={2} value={form.scholarships} onChange={(e) => setForm({ ...form, scholarships: e.target.value })} />
            <FormField label="Entry Requirements" as="textarea" rows={2} value={form.entryRequirements} onChange={(e) => setForm({ ...form, entryRequirements: e.target.value })} />

            <fieldset className="rounded-xl border border-dark-200 p-4">
              <legend className="px-2 text-sm font-medium text-dark-700">Tuition Range</legend>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Min" type="number" value={form.tuitionRange?.min || ''} onChange={(e) => setForm({ ...form, tuitionRange: { ...form.tuitionRange, min: e.target.value } })} />
                <FormField label="Max" type="number" value={form.tuitionRange?.max || ''} onChange={(e) => setForm({ ...form, tuitionRange: { ...form.tuitionRange, max: e.target.value } })} />
                <FormField label="Currency" as="select" value={form.tuitionRange?.currency || 'USD'} onChange={(e) => setForm({ ...form, tuitionRange: { ...form.tuitionRange, currency: e.target.value } })} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-dark-200 p-4">
              <legend className="px-2 text-sm font-medium text-dark-700">Programs</legend>
              <div className="mb-3 space-y-2">
                {form.programs?.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-dark-50 p-2 text-sm">
                    <span className="flex-1 text-dark-700">{p.name} - {p.degree} ({p.duration})</span>
                    <button onClick={() => removeProgram(i)} aria-label={`Remove ${p.name}`} className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-accent-500 transition-colors hover:bg-accent-50 hover:text-accent-600">
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <input type="text" placeholder="Program name" aria-label="Program name" value={newProgram.name} onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })} className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10" />
                <input type="text" placeholder="Degree" aria-label="Degree" value={newProgram.degree} onChange={(e) => setNewProgram({ ...newProgram, degree: e.target.value })} className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10" />
                <input type="text" placeholder="Duration" aria-label="Duration" value={newProgram.duration} onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })} className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10" />
                <AdminButton variant="subtle" onClick={addProgram}>Add</AdminButton>
              </div>
            </fieldset>

            <SeoFields
              value={form.seo}
              onChange={(field, value) => setForm((p) => ({ ...p, seo: { ...p.seo, [field]: value } }))}
              previewUrl={form.slug ? `/universities/${form.slug}` : undefined}
              fallbackTitle={form.name ? `${form.name}${form.country ? `, ${form.country}` : ''} - Programs, Fees & Admission Requirements` : undefined}
              fallbackDescription={form.description}
            />

            <AdminButton onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {saving ? 'Saving…' : modal === 'add' ? 'Add University' : 'Save Changes'}
            </AdminButton>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete university"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
