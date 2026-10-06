import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, UserCheck, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { CheckboxField } from '../../components/admin/FormField';
import { storedImageCandidates } from '../../utils/imageAssets';
import toast from 'react-hot-toast';

const emptySocial = { linkedin: '', twitter: '', facebook: '' };
const emptyMember = { name: '', position: '', avatar: '', bio: '', specialization: '', email: '', phone: '', socialLinks: { ...emptySocial }, order: 0, isActive: true };

const COLUMNS = [
  { key: 'photo', label: 'Photo' },
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'active', label: 'Active' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptyMember, socialLinks: { ...emptySocial } });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/team?limit=100');
      setMembers(Array.isArray(res.data) ? res.data : res.data.members || []);
    } catch (err) { toast.error('Failed to load team'); } finally { setLoading(false); }
  };

  const sorted = useMemo(() => {
    const filtered = members.filter((m) => !search || m.name?.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [members, search]);

  const { page, setPage, totalPages, paginated, total } = useClientPagination(sorted, { resetKey: search });

  const openAdd = () => { setForm({ ...emptyMember, socialLinks: { ...emptySocial } }); setModal('add'); };
  const openEdit = (m) => { setForm({ ...m, socialLinks: m.socialLinks || { ...emptySocial } }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.name || !form.position) { toast.error('Name and position are required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await api.post('/team', form);
        setMembers((p) => [res.data.member || res.data, ...p]);
        toast.success('Team member added');
      } else {
        const res = await api.put(`/team/${form._id}`, form);
        setMembers((p) => p.map((m) => m._id === form._id ? (res.data.member || res.data) : m));
        toast.success('Team member updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/team/${id}`); setMembers((p) => p.filter((m) => m._id !== id)); toast.success('Member deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const updateSocial = (field, value) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [field]: value } }));

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search team members…" />
        <AdminButton icon={Plus} onClick={openAdd}>Add Member</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={UserCheck}
        emptyMessage="No team members found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[720px]"
        renderRow={(m) => (
          <tr key={m._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3">
              <SmartImage candidates={storedImageCandidates(m.avatar)} alt={m.name} className="h-10 w-10 rounded-full object-cover" fallback={<div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-100"><ImageIcon className="h-5 w-5 text-dark-400" aria-hidden="true" /></div>} />
            </td>
            <td className="px-4 py-3 font-medium text-dark-700">{m.name}</td>
            <td className="px-4 py-3 text-dark-500">{m.position}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.isActive !== false ? 'bg-green-50 text-green-700' : 'bg-dark-100 text-dark-600'}`}>
                {m.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${m.name}`} onClick={() => openEdit(m)} />
                <RowAction icon={Trash2} label={`Delete ${m.name}`} tone="danger" onClick={() => setDeleteConfirm(m._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Team Member' : 'Edit Team Member'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormField label="Position" required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <FormField label="Avatar URL" type="url" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://…" />
            <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <FormField label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            <FormField label="Display Order" type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
          </div>
          <FormField label="Bio" as="textarea" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />

          <fieldset className="rounded-xl border border-dark-200 p-4">
            <legend className="px-2 text-sm font-medium text-dark-700">Social Links</legend>
            <div className="space-y-3">
              <FormField label="LinkedIn" type="url" value={form.socialLinks?.linkedin || ''} onChange={(e) => updateSocial('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" />
              <FormField label="Twitter" type="url" value={form.socialLinks?.twitter || ''} onChange={(e) => updateSocial('twitter', e.target.value)} placeholder="https://twitter.com/…" />
              <FormField label="Facebook" type="url" value={form.socialLinks?.facebook || ''} onChange={(e) => updateSocial('facebook', e.target.value)} placeholder="https://facebook.com/…" />
            </div>
          </fieldset>

          <CheckboxField label="Active" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />

          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : modal === 'add' ? 'Add Member' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete member"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
