import { useState, useEffect, useMemo } from 'react';
import { Eye, Pencil, Trash2, Download, Loader2, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, FilterSelect, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField from '../../components/admin/FormField';
import { formatDate, formatDateShort } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['New', 'Contacted', 'Counseling', 'Application', 'Converted', 'Closed'];
const STATUS_COLORS = {
  New: 'bg-primary-50 text-primary-700',
  Contacted: 'bg-amber-50 text-amber-700',
  Counseling: 'bg-purple-50 text-purple-700',
  Application: 'bg-orange-50 text-orange-700',
  Converted: 'bg-green-50 text-green-700',
  Closed: 'bg-dark-100 text-dark-600',
};

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'country', label: 'Country' },
  { key: 'course', label: 'Course' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inquiries?limit=100');
      setInquiries(Array.isArray(res.data) ? res.data : res.data.inquiries || []);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => inquiries.filter((inq) => {
    const term = search.toLowerCase();
    const matchSearch = !search
      || inq.fullName?.toLowerCase().includes(term)
      || inq.email?.toLowerCase().includes(term)
      || inq.phone?.includes(search);
    const matchStatus = !statusFilter || inq.status === statusFilter;
    return matchSearch && matchStatus;
  }), [inquiries, search, statusFilter]);

  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, {
    resetKey: `${search}|${statusFilter}`,
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/inquiries/${id}`, { status: newStatus });
      setInquiries((prev) => prev.map((inq) => inq._id === id ? { ...inq, status: newStatus } : inq));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await api.put(`/inquiries/${editForm._id}`, editForm);
      setInquiries((prev) => prev.map((inq) => inq._id === editForm._id ? { ...editForm } : inq));
      toast.success('Inquiry updated');
      setEditModal(false);
    } catch (err) {
      toast.error('Failed to update inquiry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      toast.success('Inquiry deleted');
      setDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleExport = () => {
    if (!filtered.length) {
      toast.error('Nothing to export');
      return;
    }
    // [key on the inquiry, CSV header]. The keys are the schema's own names —
    // fullName / preferredCountry / interestedCourse — not the shorter labels.
    const columns = [
      ['fullName', 'Name'],
      ['phone', 'Phone'],
      ['email', 'Email'],
      ['preferredCountry', 'Country'],
      ['interestedCourse', 'Course'],
      ['status', 'Status'],
    ];
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [
      columns.map(([, label]) => label).join(','),
      ...filtered.map((inq) => columns.map(([key]) => cell(inq[key])).join(',')),
    ].join('\r\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} inquir${filtered.length === 1 ? 'y' : 'ies'}`);
  };

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, or phone…" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={STATUS_OPTIONS} ariaLabel="Filter by status" />
        <AdminButton variant="ghost" icon={Download} onClick={handleExport}>Export</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={MessageSquare}
        emptyMessage="No inquiries found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[1080px]"
        renderRow={(inq) => (
          <tr key={inq._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3 font-medium text-dark-700">{inq.fullName}</td>
            <td className="px-4 py-3 text-dark-500">{inq.phone || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{inq.email}</td>
            <td className="px-4 py-3 text-dark-500">{inq.preferredCountry || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{inq.interestedCourse || '-'}</td>
            <td className="px-4 py-3">
              {/* Inline status control: changing it saves immediately. */}
              <select
                value={inq.status}
                onChange={(e) => handleStatusUpdate(inq._id, e.target.value)}
                aria-label={`Update status for ${inq.fullName}`}
                className={`cursor-pointer rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${STATUS_COLORS[inq.status] || ''}`}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
            <td className="px-4 py-3 text-xs text-dark-400">{formatDateShort(inq.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Eye} label={`View ${inq.fullName}`} onClick={() => { setSelected(inq); setDetailModal(true); }} />
                <RowAction icon={Pencil} label={`Edit ${inq.fullName}`} onClick={() => { setEditForm({ ...inq }); setEditModal(true); }} />
                <RowAction icon={Trash2} label={`Delete ${inq.fullName}`} tone="danger" onClick={() => setDeleteConfirm(inq._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={detailModal && Boolean(selected)}
        onClose={() => setDetailModal(false)}
        title="Inquiry Details"
      >
        {selected && (
          <div className="space-y-3 text-sm">
            {[
              ['Name', selected.fullName],
              ['Email', selected.email],
              ['Phone', selected.phone || '-'],
              ['Country', selected.preferredCountry || '-'],
              ['Course', selected.interestedCourse || '-'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-dark-500">{label}</span>
                <span className="break-all text-right font-medium text-dark-700">{value}</span>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <span className="text-dark-500">Status</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[selected.status] || 'bg-dark-100 text-dark-600'}`}>{selected.status}</span>
            </div>
            {selected.message && (
              <div><span className="mb-1 block text-dark-500">Message</span><p className="rounded-lg bg-dark-50 p-3 text-dark-700">{selected.message}</p></div>
            )}
            {selected.notes && (
              <div><span className="mb-1 block text-dark-500">Notes</span><p className="rounded-lg bg-dark-50 p-3 text-dark-700">{selected.notes}</p></div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-dark-500">Created</span>
              <span className="font-medium text-dark-700">{formatDate(selected.createdAt)}</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Inquiry">
        <div className="space-y-4">
          <FormField
            label="Status"
            as="select"
            value={editForm.status || ''}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          />
          <FormField label="Counselor" value={editForm.counselor || ''} onChange={(e) => setEditForm({ ...editForm, counselor: e.target.value })} placeholder="Assign counselor" />
          <FormField label="Notes" as="textarea" rows={4} value={editForm.notes || ''} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Add notes…" />
          <AdminButton onClick={handleSaveEdit} disabled={saving} className="w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete inquiry"
        message="Are you sure you want to delete this inquiry? This action cannot be undone."
      />
    </div>
  );
}
