'use client';

import { useState, useEffect, useMemo } from 'react';
import { Eye, Pencil, Trash2, Plus, Loader2, FileCheck } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, FilterSelect, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField from '../../components/admin/FormField';
import { formatDateShort } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Draft', 'Submitted', 'Under Review', 'Offer', 'Visa', 'Enrolled', 'Rejected'];
const STATUS_COLORS = { Draft: 'bg-dark-100 text-dark-600', 'Under Review': 'bg-amber-50 text-amber-700', Submitted: 'bg-primary-50 text-primary-700', Offer: 'bg-purple-50 text-purple-700', Visa: 'bg-orange-50 text-orange-700', Enrolled: 'bg-green-50 text-green-700', Rejected: 'bg-accent-50 text-accent-700' };

const emptyApplication = { student: '', university: '', course: '', intake: '', status: 'Draft', notes: '' };

/** `student`/`university` come back populated (an object) or as a raw id. */
const labelOf = (value) => (value && typeof value === 'object' ? value.name : value) || '-';

const COLUMNS = [
  { key: 'student', label: 'Student' },
  { key: 'university', label: 'University' },
  { key: 'course', label: 'Course' },
  { key: 'intake', label: 'Intake' },
  { key: 'status', label: 'Status' },
  { key: 'created', label: 'Created' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState<any>({ ...emptyApplication });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications?limit=100');
      setApplications(Array.isArray(res.data) ? res.data : res.data.applications || []);
    } catch (err) { toast.error('Failed to load applications'); } finally { setLoading(false); }
  };

  const filtered = useMemo(
    () => applications.filter((a) => !statusFilter || a.status === statusFilter),
    [applications, statusFilter]
  );
  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, { resetKey: statusFilter });

  const openAdd = () => { setForm({ ...emptyApplication }); setModal('add'); };
  const openEdit = (a) => { setForm({ ...a }); setModal('edit'); };
  const openView = (a) => { setForm({ ...a }); setModal('view'); };

  const handleSave = async () => {
    if (!form.student || !form.university) { toast.error('Student and university are required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await api.post('/applications', form);
        setApplications((p) => [res.data.application || res.data, ...p]);
        toast.success('Application created');
      } else {
        const res = await api.put(`/applications/${form._id}`, form);
        setApplications((p) => p.map((a) => a._id === form._id ? (res.data.application || res.data) : a));
        toast.success('Application updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/applications/${id}`); setApplications((p) => p.filter((a) => a._id !== id)); toast.success('Application deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={STATUS_OPTIONS} ariaLabel="Filter by status" />
        <AdminButton icon={Plus} onClick={openAdd} className="sm:ml-auto">New Application</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={FileCheck}
        emptyMessage="No applications found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[960px]"
        renderRow={(a) => {
          const student = labelOf(a.student);
          return (
            <tr key={a._id} className="transition-colors hover:bg-dark-50">
              <td className="px-4 py-3 font-medium text-dark-700">{student}</td>
              <td className="px-4 py-3 text-dark-500">{labelOf(a.university)}</td>
              <td className="px-4 py-3 text-dark-500">{a.course || '-'}</td>
              <td className="px-4 py-3 text-dark-500">{a.intake || '-'}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[a.status] || ''}`}>{a.status}</span>
              </td>
              <td className="px-4 py-3 text-xs text-dark-400">{formatDateShort(a.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <RowAction icon={Eye} label={`View ${student}`} onClick={() => openView(a)} />
                  <RowAction icon={Pencil} label={`Edit ${student}`} onClick={() => openEdit(a)} />
                  <RowAction icon={Trash2} label={`Delete ${student}`} tone="danger" onClick={() => setDeleteConfirm(a._id)} />
                </div>
              </td>
            </tr>
          );
        }}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'view' ? 'Application Details' : modal === 'add' ? 'New Application' : 'Edit Application'}
      >
        {modal === 'view' ? (
          <div className="space-y-3 text-sm">
            {[
              ['Student', labelOf(form.student)],
              ['University', labelOf(form.university)],
              ['Course', form.course || '-'],
              ['Intake', form.intake || '-'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-dark-500">{label}</span>
                <span className="text-right font-medium text-dark-700">{value}</span>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <span className="text-dark-500">Status</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[form.status] || 'bg-dark-100 text-dark-600'}`}>{form.status}</span>
            </div>
            {form.notes && (
              <div><span className="mb-1 block text-dark-500">Notes</span><p className="rounded-lg bg-dark-50 p-3 text-dark-700">{form.notes}</p></div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <FormField label="Student" required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} placeholder="Student name or ID" />
            <FormField label="University" required value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} placeholder="University name or ID" />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
              <FormField label="Intake" value={form.intake} onChange={(e) => setForm({ ...form, intake: e.target.value })} placeholder="e.g. Sep 2026" />
            </div>
            <FormField label="Status" as="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} />
            <FormField label="Notes" as="textarea" rows={3} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <AdminButton onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {saving ? 'Saving…' : modal === 'add' ? 'Create Application' : 'Save Changes'}
            </AdminButton>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete application"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
