import { useState, useEffect, useMemo } from 'react';
import { Eye, Pencil, Trash2, Plus, Loader2, Users } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, FilterSelect, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField from '../../components/admin/FormField';
import { formatDateShort } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Active', 'Inactive', 'Graduated', 'Withdrawn'];
const STATUS_COLORS = { Active: 'bg-green-50 text-green-700', Inactive: 'bg-dark-100 text-dark-600', Graduated: 'bg-primary-50 text-primary-700', Withdrawn: 'bg-accent-50 text-accent-700' };
const TEST_TYPES = ['IELTS', 'TOEFL', 'PTE', 'Duolingo'];

const emptyStudent = { name: '', email: '', phone: '', status: 'Active', country: '', dateOfBirth: '', passportNumber: '', education: { highestLevel: '', institution: '', gpa: '' }, englishTest: { type: '', score: '' }, preferences: { countries: [], courses: [], budget: '' } };

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status' },
  { key: 'country', label: 'Country' },
  { key: 'created', label: 'Created' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptyStudent });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students?limit=100');
      setStudents(Array.isArray(res.data) ? res.data : res.data.students || []);
    } catch (err) { toast.error('Failed to load students'); } finally { setLoading(false); }
  };

  const filtered = useMemo(() => students.filter((s) => {
    const term = search.toLowerCase();
    const ms = !search
      || s.name?.toLowerCase().includes(term)
      || s.email?.toLowerCase().includes(term)
      || s.phone?.includes(search);
    const mf = !statusFilter || s.status === statusFilter;
    return ms && mf;
  }), [students, search, statusFilter]);

  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, {
    resetKey: `${search}|${statusFilter}`,
  });

  const openAdd = () => { setForm({ ...emptyStudent }); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s, education: s.education || {}, englishTest: s.englishTest || {}, preferences: s.preferences || {} }); setModal('edit'); };
  const openView = (s) => { setForm({ ...s }); setModal('view'); };

  const handleSave = async () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await api.post('/students', form);
        setStudents((p) => [res.data.student || res.data, ...p]);
        toast.success('Student added');
      } else {
        const res = await api.put(`/students/${form._id}`, form);
        setStudents((p) => p.map((s) => s._id === form._id ? (res.data.student || res.data) : s));
        toast.success('Student updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/students/${id}`); setStudents((p) => p.filter((s) => s._id !== id)); toast.success('Student deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const updateField = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const updateNested = (parent, field, value) => setForm((p) => ({ ...p, [parent]: { ...p[parent], [field]: value } }));

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search students…" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={STATUS_OPTIONS} ariaLabel="Filter by status" />
        <AdminButton icon={Plus} onClick={openAdd}>Add Student</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={Users}
        emptyMessage="No students found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[960px]"
        renderRow={(s) => (
          <tr key={s._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3 font-medium text-dark-700">{s.name}</td>
            <td className="px-4 py-3 text-dark-500">{s.email}</td>
            <td className="px-4 py-3 text-dark-500">{s.phone || '-'}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status] || ''}`}>{s.status}</span>
            </td>
            <td className="px-4 py-3 text-dark-500">{s.country || '-'}</td>
            <td className="px-4 py-3 text-xs text-dark-400">{formatDateShort(s.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Eye} label={`View ${s.name}`} onClick={() => openView(s)} />
                <RowAction icon={Pencil} label={`Edit ${s.name}`} onClick={() => openEdit(s)} />
                <RowAction icon={Trash2} label={`Delete ${s.name}`} tone="danger" onClick={() => setDeleteConfirm(s._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'view' ? 'Student Details' : modal === 'add' ? 'Add Student' : 'Edit Student'}
        size="lg"
      >
        {modal === 'view' ? (
          <div className="space-y-3 text-sm">
            {[
              ['Name', form.name],
              ['Email', form.email],
              ['Phone', form.phone || '-'],
              ['Country', form.country || '-'],
              ['Passport', form.passportNumber || '-'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-dark-500">{label}</span>
                <span className="break-all text-right font-medium text-dark-700">{value}</span>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <span className="text-dark-500">Status</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[form.status] || ''}`}>{form.status}</span>
            </div>
            {form.education?.highestLevel && (
              <div className="flex justify-between gap-4">
                <span className="text-dark-500">Education</span>
                <span className="text-right font-medium text-dark-700">{form.education.highestLevel} - {form.education.institution || ''}</span>
              </div>
            )}
            {form.englishTest?.type && (
              <div className="flex justify-between gap-4">
                <span className="text-dark-500">English Test</span>
                <span className="font-medium text-dark-700">{form.englishTest.type}: {form.englishTest.score}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Name" required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              <FormField label="Email" type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} />
              <FormField label="Phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              <FormField label="Status" as="select" value={form.status} onChange={(e) => updateField('status', e.target.value)} options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} />
              <FormField label="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
              <FormField label="Passport Number" value={form.passportNumber} onChange={(e) => updateField('passportNumber', e.target.value)} />
            </div>

            <fieldset className="rounded-xl border border-dark-200 p-4">
              <legend className="px-2 text-sm font-medium text-dark-700">Education</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="Highest Level" value={form.education?.highestLevel || ''} onChange={(e) => updateNested('education', 'highestLevel', e.target.value)} />
                <FormField label="Institution" value={form.education?.institution || ''} onChange={(e) => updateNested('education', 'institution', e.target.value)} />
                <FormField label="GPA" value={form.education?.gpa || ''} onChange={(e) => updateNested('education', 'gpa', e.target.value)} />
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-dark-200 p-4">
              <legend className="px-2 text-sm font-medium text-dark-700">English Test</legend>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Type"
                  as="select"
                  value={form.englishTest?.type || ''}
                  onChange={(e) => updateNested('englishTest', 'type', e.target.value)}
                  options={[{ value: '', label: 'None' }, ...TEST_TYPES.map((t) => ({ value: t, label: t }))]}
                />
                <FormField label="Score" value={form.englishTest?.score || ''} onChange={(e) => updateNested('englishTest', 'score', e.target.value)} />
              </div>
            </fieldset>

            <AdminButton onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {saving ? 'Saving…' : modal === 'add' ? 'Add Student' : 'Save Changes'}
            </AdminButton>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete student"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
