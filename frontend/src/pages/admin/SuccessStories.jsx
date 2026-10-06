import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, Star, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { CheckboxField } from '../../components/admin/FormField';
import { storedImageCandidates } from '../../utils/imageAssets';
import toast from 'react-hot-toast';

const emptyStory = { studentName: '', photo: '', country: '', university: '', course: '', intake: '', testimonial: '', isFeatured: false };

const COLUMNS = [
  { key: 'photo', label: 'Photo' },
  { key: 'name', label: 'Name' },
  { key: 'country', label: 'Country' },
  { key: 'university', label: 'University' },
  { key: 'featured', label: 'Featured' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptyStory });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchStories(); }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/success-stories?limit=100');
      setStories(Array.isArray(res.data) ? res.data : res.data.stories || []);
    } catch (err) { toast.error('Failed to load stories'); } finally { setLoading(false); }
  };

  const filtered = useMemo(
    () => stories.filter((s) => !search || s.studentName?.toLowerCase().includes(search.toLowerCase())),
    [stories, search]
  );
  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, { resetKey: search });

  const openAdd = () => { setForm({ ...emptyStory }); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.studentName) { toast.error('Student name is required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await api.post('/success-stories', form);
        setStories((p) => [res.data.story || res.data, ...p]);
        toast.success('Story added');
      } else {
        const res = await api.put(`/success-stories/${form._id}`, form);
        setStories((p) => p.map((s) => s._id === form._id ? (res.data.story || res.data) : s));
        toast.success('Story updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/success-stories/${id}`); setStories((p) => p.filter((s) => s._id !== id)); toast.success('Story deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search stories…" />
        <AdminButton icon={Plus} onClick={openAdd}>Add Story</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={Star}
        emptyMessage="No stories found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[820px]"
        renderRow={(s) => (
          <tr key={s._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3">
              <SmartImage candidates={storedImageCandidates(s.photo)} alt={s.studentName} className="h-10 w-10 rounded-full object-cover" fallback={<div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-100"><ImageIcon className="h-5 w-5 text-dark-400" aria-hidden="true" /></div>} />
            </td>
            <td className="px-4 py-3 font-medium text-dark-700">{s.studentName}</td>
            <td className="px-4 py-3 text-dark-500">{s.country || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{s.university || '-'}</td>
            <td className="px-4 py-3">
              {s.isFeatured
                ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-label="Featured" />
                : <span className="text-dark-300">-</span>}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${s.studentName}`} onClick={() => openEdit(s)} />
                <RowAction icon={Trash2} label={`Delete ${s.studentName}`} tone="danger" onClick={() => setDeleteConfirm(s._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Story' : 'Edit Story'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Student Name" required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
            <FormField label="Photo URL" type="url" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://…" />
            <FormField label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <FormField label="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            <FormField label="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            <FormField label="Intake" value={form.intake} onChange={(e) => setForm({ ...form, intake: e.target.value })} placeholder="e.g. Sep 2026" />
          </div>
          <FormField label="Testimonial" as="textarea" rows={4} value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} />
          <CheckboxField label="Featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : modal === 'add' ? 'Add Story' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete story"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
