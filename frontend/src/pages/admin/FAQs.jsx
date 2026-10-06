import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, HelpCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import PageHeader from '../../components/admin/PageHeader';
import FormField, { CheckboxField } from '../../components/admin/FormField';

const emptyFaq = { question: '', answer: '', category: 'General', order: 0, isActive: true };

const COLUMNS = [
  { key: 'question', label: 'Question' },
  { key: 'category', label: 'Category' },
  { key: 'order', label: 'Order' },
  { key: 'active', label: 'Active' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptyFaq });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faqs?limit=100');
      setFaqs(Array.isArray(res.data) ? res.data : res.data.faqs || []);
    } catch (err) { toast.error('Failed to load FAQs'); } finally { setLoading(false); }
  };

  const sorted = useMemo(() => [...faqs].sort((a, b) => (a.order || 0) - (b.order || 0)), [faqs]);
  const { page, setPage, totalPages, paginated, total } = useClientPagination(sorted);

  const openAdd = () => { setForm({ ...emptyFaq }); setModal('add'); };
  const openEdit = (f) => { setForm({ ...f }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.question || !form.answer) { toast.error('Question and answer are required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await api.post('/faqs', form);
        setFaqs((p) => [res.data.faq || res.data, ...p]);
        toast.success('FAQ added');
      } else {
        const res = await api.put(`/faqs/${form._id}`, form);
        setFaqs((p) => p.map((f) => f._id === form._id ? (res.data.faq || res.data) : f));
        toast.success('FAQ updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/faqs/${id}`); setFaqs((p) => p.filter((f) => f._id !== id)); toast.success('FAQ deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4">
      <PageHeader>
        <AdminButton icon={Plus} onClick={openAdd}>Add FAQ</AdminButton>
      </PageHeader>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={HelpCircle}
        emptyMessage="No FAQs found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[680px]"
        renderRow={(f) => (
          <tr key={f._id} className="transition-colors hover:bg-dark-50">
            <td className="max-w-[320px] truncate px-4 py-3 font-medium text-dark-700">{f.question}</td>
            <td className="px-4 py-3 text-dark-500">{f.category || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{f.order || 0}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${f.isActive !== false ? 'bg-green-50 text-green-700' : 'bg-dark-100 text-dark-600'}`}>
                {f.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${f.question}`} onClick={() => openEdit(f)} />
                <RowAction icon={Trash2} label={`Delete ${f.question}`} tone="danger" onClick={() => setDeleteConfirm(f._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add FAQ' : 'Edit FAQ'}
      >
        <div className="space-y-4">
          <FormField label="Question" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <FormField label="Answer" as="textarea" required rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <FormField label="Order" type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
          </div>
          <CheckboxField label="Active" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : modal === 'add' ? 'Add FAQ' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete FAQ"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
