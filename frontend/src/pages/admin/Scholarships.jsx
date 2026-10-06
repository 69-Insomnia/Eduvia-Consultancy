import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, Loader2, Award } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, FilterSelect, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField from '../../components/admin/FormField';
import SeoFields, { EMPTY_SEO, seoToForm, seoToPayload } from '../../components/admin/SeoFields';
import { formatDateShort } from '../../utils/helpers';
import toast from 'react-hot-toast';

const TYPES = ['Full Scholarship', 'Partial Scholarship', 'Merit-based', 'Need-based', 'Research Grant', 'Athletic', 'Other'];
const emptySch = { name: '', university: '', country: '', description: '', eligibility: '', amount: '', type: 'Full Scholarship', deadline: '', requirements: '', link: '', seo: { ...EMPTY_SEO } };

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'university', label: 'University' },
  { key: 'country', label: 'Country' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptySch });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchScholarships(); }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/scholarships?limit=100');
      setScholarships(Array.isArray(res.data) ? res.data : res.data.scholarships || []);
    } catch (err) { toast.error('Failed to load scholarships'); } finally { setLoading(false); }
  };

  const countries = useMemo(
    () => [...new Set(scholarships.map((s) => s.country).filter(Boolean))].sort(),
    [scholarships]
  );

  const filtered = useMemo(() => scholarships.filter((s) => {
    const ms = !search || s.name?.toLowerCase().includes(search.toLowerCase());
    const mc = !countryFilter || s.country === countryFilter;
    const mt = !typeFilter || s.type === typeFilter;
    return ms && mc && mt;
  }), [scholarships, search, countryFilter, typeFilter]);

  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, {
    resetKey: `${search}|${countryFilter}|${typeFilter}`,
  });

  const openAdd = () => { setForm({ ...emptySch, seo: { ...EMPTY_SEO } }); setModal('add'); };
  const openEdit = (s) => { setForm({ ...s, seo: seoToForm(s.seo) }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    const payload = { ...form, seo: seoToPayload(form.seo) };
    try {
      if (modal === 'add') {
        const res = await api.post('/scholarships', payload);
        setScholarships((p) => [res.data.scholarship || res.data, ...p]);
        toast.success('Scholarship added');
      } else {
        const res = await api.put(`/scholarships/${form._id}`, payload);
        setScholarships((p) => p.map((s) => s._id === form._id ? (res.data.scholarship || res.data) : s));
        toast.success('Scholarship updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/scholarships/${id}`); setScholarships((p) => p.filter((s) => s._id !== id)); toast.success('Scholarship deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search scholarships…" />
        <FilterSelect value={countryFilter} onChange={setCountryFilter} allLabel="All Countries" options={countries} ariaLabel="Filter by country" />
        <FilterSelect value={typeFilter} onChange={setTypeFilter} allLabel="All Types" options={TYPES} ariaLabel="Filter by type" />
        <AdminButton icon={Plus} onClick={openAdd}>Add Scholarship</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={Award}
        emptyMessage="No scholarships found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[960px]"
        renderRow={(s) => (
          <tr key={s._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3 font-medium text-dark-700">{s.name}</td>
            <td className="px-4 py-3 text-dark-500">{s.university || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{s.country || '-'}</td>
            <td className="px-4 py-3">
              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">{s.type || '-'}</span>
            </td>
            <td className="px-4 py-3 text-dark-500">{s.amount || '-'}</td>
            <td className="px-4 py-3 text-xs text-dark-400">{formatDateShort(s.deadline, '-')}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${s.name}`} onClick={() => openEdit(s)} />
                <RowAction icon={Trash2} label={`Delete ${s.name}`} onClick={() => setDeleteConfirm(s._id)} tone="danger" />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Scholarship' : 'Edit Scholarship'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormField label="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            <FormField label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <FormField label="Type" as="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={TYPES.map((t) => ({ value: t, label: t }))} />
            <FormField label="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. $10,000/year" />
            <FormField label="Deadline" type="date" value={form.deadline?.split('T')[0] || ''} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <FormField label="Description" as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <FormField label="Eligibility" as="textarea" rows={2} value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
          <FormField label="Requirements" as="textarea" rows={2} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          <FormField label="Application Link" type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://…" />

          <SeoFields
            value={form.seo}
            onChange={(field, value) => setForm((p) => ({ ...p, seo: { ...p.seo, [field]: value } }))}
            fallbackTitle={form.name}
            fallbackDescription={form.description}
          />

          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {saving ? 'Saving…' : modal === 'add' ? 'Add Scholarship' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete scholarship"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
