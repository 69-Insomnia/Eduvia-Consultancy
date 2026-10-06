'use client';

import { useState, useEffect, useMemo } from 'react';
import { Eye, Pencil, Trash2, Plus, Loader2, BookOpen, Star, X } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, FilterSelect, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { CheckboxField, INPUT_CLASS } from '../../components/admin/FormField';
import SeoFields, { EMPTY_SEO, seoToForm, seoToPayload } from '../../components/admin/SeoFields';
import toast from 'react-hot-toast';

const DEGREE_LEVELS = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];
const emptyCourse = { name: '', category: '', description: '', duration: '', degreeLevel: 'Bachelor', countries: [], tuitionRange: { min: '', max: '', currency: 'USD' }, requirements: '', careerOutcomes: '', seo: { ...EMPTY_SEO }, isFeatured: false };

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'degree', label: 'Degree Level' },
  { key: 'countries', label: 'Countries' },
  { key: 'featured', label: 'Featured' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState<any>({ ...emptyCourse });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [countryInput, setCountryInput] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses?limit=100');
      setCourses(Array.isArray(res.data) ? res.data : res.data.courses || []);
    } catch (err) { toast.error('Failed to load courses'); } finally { setLoading(false); }
  };

  const categories = useMemo(
    () => [...new Set(courses.map((c) => c.category).filter(Boolean))].sort(),
    [courses]
  );

  const filtered = useMemo(() => courses.filter((c) => {
    const ms = !search || c.name?.toLowerCase().includes(search.toLowerCase());
    const mf = !categoryFilter || c.category === categoryFilter;
    return ms && mf;
  }), [courses, search, categoryFilter]);

  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, {
    resetKey: `${search}|${categoryFilter}`,
  });

  const openAdd = () => { setForm({ ...emptyCourse, countries: [], seo: { ...EMPTY_SEO } }); setModal('add'); };
  const openEdit = (c) => { setForm({ ...c, countries: c.countries || [], tuitionRange: c.tuitionRange || { min: '', max: '', currency: 'USD' }, seo: seoToForm(c.seo) }); setModal('edit'); };
  const openView = (c) => { setForm({ ...c, countries: c.countries || [], seo: seoToForm(c.seo) }); setModal('view'); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Course name is required'); return; }
    setSaving(true);
    const payload = { ...form, seo: seoToPayload(form.seo) };
    try {
      if (modal === 'add') {
        const res = await api.post('/courses', payload);
        setCourses((p) => [res.data.course || res.data, ...p]);
        toast.success('Course added');
      } else {
        const res = await api.put(`/courses/${form._id}`, payload);
        setCourses((p) => p.map((c) => c._id === form._id ? (res.data.course || res.data) : c));
        toast.success('Course updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/courses/${id}`); setCourses((p) => p.filter((c) => c._id !== id)); toast.success('Course deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const addCountry = () => { if (countryInput && !form.countries.includes(countryInput)) { setForm((p) => ({ ...p, countries: [...p.countries, countryInput] })); setCountryInput(''); } };
  const removeCountry = (i) => setForm((p) => ({ ...p, countries: p.countries.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search courses…" />
        <FilterSelect value={categoryFilter} onChange={setCategoryFilter} allLabel="All Categories" options={categories} ariaLabel="Filter by category" />
        <AdminButton icon={Plus} onClick={openAdd}>Add Course</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={BookOpen}
        emptyMessage="No courses found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[820px]"
        renderRow={(c) => (
          <tr key={c._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3 font-medium text-dark-700">{c.name}</td>
            <td className="px-4 py-3 text-dark-500">{c.category || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{c.degreeLevel || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{c.countries?.join(', ') || '-'}</td>
            <td className="px-4 py-3">
              {c.isFeatured
                ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-label="Featured" />
                : <span className="text-dark-300">-</span>}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Eye} label={`View ${c.name}`} onClick={() => openView(c)} />
                <RowAction icon={Pencil} label={`Edit ${c.name}`} onClick={() => openEdit(c)} />
                <RowAction icon={Trash2} label={`Delete ${c.name}`} tone="danger" onClick={() => setDeleteConfirm(c._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'view' ? 'Course Details' : modal === 'add' ? 'Add Course' : 'Edit Course'}
        size="lg"
      >
        {modal === 'view' ? (
          <div className="space-y-3 text-sm">
            {[
              ['Name', form.name],
              ['Category', form.category || '-'],
              ['Degree Level', form.degreeLevel || '-'],
              ['Duration', form.duration || '-'],
              ['Countries', form.countries?.join(', ') || '-'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-dark-500">{label}</span>
                <span className="text-right font-medium text-dark-700">{value}</span>
              </div>
            ))}
            {form.description && (
              <div><span className="mb-1 block text-dark-500">Description</span><p className="whitespace-pre-wrap rounded-lg bg-dark-50 p-3 text-dark-700">{form.description}</p></div>
            )}
            {form.requirements && (
              <div><span className="mb-1 block text-dark-500">Requirements</span><p className="rounded-lg bg-dark-50 p-3 text-dark-700">{form.requirements}</p></div>
            )}
            {form.careerOutcomes && (
              <div><span className="mb-1 block text-dark-500">Career Outcomes</span><p className="rounded-lg bg-dark-50 p-3 text-dark-700">{form.careerOutcomes}</p></div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <FormField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <FormField label="Degree Level" as="select" value={form.degreeLevel} onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })} options={DEGREE_LEVELS.map((l) => ({ value: l, label: l }))} />
              <FormField label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 4 years" />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-dark-700">Countries</span>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
                  placeholder="Add country"
                  aria-label="Add country"
                  className={`${INPUT_CLASS} flex-1`}
                />
                <AdminButton variant="subtle" onClick={addCountry}>Add</AdminButton>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.countries?.map((c, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">
                    {c}
                    <button onClick={() => removeCountry(i)} aria-label={`Remove ${c}`} className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:text-accent-500">
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <FormField label="Description" as="textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Tuition Min" type="number" value={form.tuitionRange?.min || ''} onChange={(e) => setForm({ ...form, tuitionRange: { ...form.tuitionRange, min: e.target.value } })} />
              <FormField label="Tuition Max" type="number" value={form.tuitionRange?.max || ''} onChange={(e) => setForm({ ...form, tuitionRange: { ...form.tuitionRange, max: e.target.value } })} />
              <FormField label="Currency" as="select" value={form.tuitionRange?.currency || 'USD'} onChange={(e) => setForm({ ...form, tuitionRange: { ...form.tuitionRange, currency: e.target.value } })} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
            </div>

            <FormField label="Requirements" as="textarea" rows={2} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            <FormField label="Career Outcomes" as="textarea" rows={2} value={form.careerOutcomes} onChange={(e) => setForm({ ...form, careerOutcomes: e.target.value })} />
            <CheckboxField label="Featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />

            <SeoFields
              value={form.seo}
              onChange={(field, value) => setForm((p) => ({ ...p, seo: { ...p.seo, [field]: value } }))}
              fallbackTitle={form.name ? `${form.name}${form.countries?.[0] ? ` in ${form.countries[0]}` : ''} - Duration, Fees & Requirements` : undefined}
              fallbackDescription={form.description}
            />

            <AdminButton onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {saving ? 'Saving…' : modal === 'add' ? 'Add Course' : 'Save Changes'}
            </AdminButton>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete course"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
