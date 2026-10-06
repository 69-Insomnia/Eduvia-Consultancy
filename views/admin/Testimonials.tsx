'use client';

import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, Quote, Star } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { CheckboxField } from '../../components/admin/FormField';
import toast from 'react-hot-toast';

const emptyTestimonial = { studentName: '', country: '', university: '', course: '', quote: '', rating: 5, image: '', isFeatured: false };

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'country', label: 'Country' },
  { key: 'university', label: 'University' },
  { key: 'rating', label: 'Rating' },
  { key: 'featured', label: 'Featured' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

function Stars({ value = 0 }: any) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-dark-300'}`} aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState<any>({ ...emptyTestimonial });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials?limit=100');
      setTestimonials(Array.isArray(res.data) ? res.data : res.data.testimonials || []);
    } catch (err) { toast.error('Failed to load testimonials'); } finally { setLoading(false); }
  };

  const filtered = useMemo(
    () => testimonials.filter((t) => !search || t.studentName?.toLowerCase().includes(search.toLowerCase())),
    [testimonials, search]
  );
  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, { resetKey: search });

  const openAdd = () => { setForm({ ...emptyTestimonial }); setModal('add'); };
  const openEdit = (t) => { setForm({ ...t }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.studentName || !form.quote) { toast.error('Name and quote are required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await api.post('/testimonials', form);
        setTestimonials((p) => [res.data.testimonial || res.data, ...p]);
        toast.success('Testimonial added');
      } else {
        const res = await api.put(`/testimonials/${form._id}`, form);
        setTestimonials((p) => p.map((t) => t._id === form._id ? (res.data.testimonial || res.data) : t));
        toast.success('Testimonial updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/testimonials/${id}`); setTestimonials((p) => p.filter((t) => t._id !== id)); toast.success('Testimonial deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search testimonials…" />
        <AdminButton icon={Plus} onClick={openAdd}>Add Testimonial</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={Quote}
        emptyMessage="No testimonials found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[820px]"
        renderRow={(t) => (
          <tr key={t._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3 font-medium text-dark-700">{t.studentName}</td>
            <td className="px-4 py-3 text-dark-500">{t.country || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{t.university || '-'}</td>
            <td className="px-4 py-3"><Stars value={t.rating || 0} /></td>
            <td className="px-4 py-3">
              {t.isFeatured
                ? <Star className="h-4 w-4 fill-amber-500 text-amber-500" aria-label="Featured" />
                : <span className="text-dark-300">-</span>}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${t.studentName}`} onClick={() => openEdit(t)} />
                <RowAction icon={Trash2} label={`Delete ${t.studentName}`} tone="danger" onClick={() => setDeleteConfirm(t._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Student Name" required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
            <FormField label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <FormField label="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            <FormField label="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            <FormField label="Image URL" type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <div>
              <span className="mb-1.5 block text-sm font-medium text-dark-700">Rating</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, rating: s })}
                    aria-label={`Rate ${s} star${s === 1 ? '' : 's'}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-dark-50"
                  >
                    <Star className={`h-6 w-6 transition-colors hover:text-amber-400 ${s <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-dark-300'}`} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <FormField label="Quote" as="textarea" required rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
          <CheckboxField label="Featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : modal === 'add' ? 'Add Testimonial' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete testimonial"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
