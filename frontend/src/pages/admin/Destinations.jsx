import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, Loader2, MapPin, Star, X } from 'lucide-react';
import api from '../../services/api';
import CountryFlag from '../../components/common/CountryFlag';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { CheckboxField, INPUT_CLASS } from '../../components/admin/FormField';
import SeoFields, { EMPTY_SEO, seoToForm, seoToPayload } from '../../components/admin/SeoFields';
import toast from 'react-hot-toast';

const emptyDest = {
  name: '', code: '', description: '', whyStudyHere: [], popularUniversities: [], popularCourses: '',
  tuitionRange: '', livingCosts: '', requirements: '', englishRequirements: '', scholarships: '',
  visaInfo: '', workOpportunities: '', intakes: '', applicationProcess: '',
  faqs: [], seo: { ...EMPTY_SEO }, isFeatured: false, isActive: true,
};

const CHIP_REMOVE = 'h-6 w-6 inline-flex shrink-0 items-center justify-center rounded-full text-accent-500 transition-colors hover:bg-accent-50';

const COLUMNS = [
  { key: 'flag', label: 'Flag' },
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'featured', label: 'Featured' },
  { key: 'active', label: 'Active' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

/** Repeatable list of single-value chips (reasons, universities). */
function ChipListField({ label, items, onRemove, value, onChange, onAdd, placeholder }) {
  return (
    <fieldset className="rounded-xl border border-dark-200/70 p-4">
      <legend className="px-2 text-sm font-medium text-dark-700">{label}</legend>
      {items?.length > 0 && (
        <div className="mb-3 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-dark-50 p-2 text-sm">
              <span className="flex-1 text-dark-700">{item}</span>
              <button onClick={() => onRemove(i)} aria-label={`Remove ${item}`} className={CHIP_REMOVE}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          placeholder={placeholder}
          aria-label={placeholder}
          className={`${INPUT_CLASS} flex-1`}
        />
        <AdminButton variant="subtle" onClick={onAdd}>Add</AdminButton>
      </div>
    </fieldset>
  );
}

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptyDest });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [whyInput, setWhyInput] = useState('');
  const [uniInput, setUniInput] = useState('');
  const [faqInput, setFaqInput] = useState({ question: '', answer: '' });

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/destinations?limit=100');
      setDestinations(Array.isArray(res.data) ? res.data : res.data.destinations || []);
    } catch (err) { toast.error('Failed to load destinations'); } finally { setLoading(false); }
  };

  const filtered = useMemo(
    () => destinations.filter((d) => !search || d.name?.toLowerCase().includes(search.toLowerCase())),
    [destinations, search]
  );
  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, { resetKey: search });

  const openAdd = () => { setForm({ ...emptyDest, whyStudyHere: [], popularUniversities: [], faqs: [], seo: { ...EMPTY_SEO } }); setModal('add'); };
  const openEdit = (d) => { setForm({ ...d, whyStudyHere: d.whyStudyHere || [], popularUniversities: d.popularUniversities || [], faqs: d.faqs || [], seo: seoToForm(d.seo) }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    const payload = { ...form, seo: seoToPayload(form.seo) };
    try {
      if (modal === 'add') {
        const res = await api.post('/destinations', payload);
        setDestinations((p) => [res.data.destination || res.data, ...p]);
        toast.success('Destination added');
      } else {
        const res = await api.put(`/destinations/${form._id}`, payload);
        setDestinations((p) => p.map((d) => d._id === form._id ? (res.data.destination || res.data) : d));
        toast.success('Destination updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/destinations/${id}`); setDestinations((p) => p.filter((d) => d._id !== id)); toast.success('Destination deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const addWhy = () => { if (whyInput) { setForm((p) => ({ ...p, whyStudyHere: [...p.whyStudyHere, whyInput] })); setWhyInput(''); } };
  const removeWhy = (i) => setForm((p) => ({ ...p, whyStudyHere: p.whyStudyHere.filter((_, idx) => idx !== i) }));
  const addUni = () => { if (uniInput) { setForm((p) => ({ ...p, popularUniversities: [...p.popularUniversities, uniInput] })); setUniInput(''); } };
  const removeUni = (i) => setForm((p) => ({ ...p, popularUniversities: p.popularUniversities.filter((_, idx) => idx !== i) }));
  const addFaq = () => { if (faqInput.question && faqInput.answer) { setForm((p) => ({ ...p, faqs: [...p.faqs, { ...faqInput }] })); setFaqInput({ question: '', answer: '' }); } };
  const removeFaq = (i) => setForm((p) => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }));

  const text = (label, field, rows) => (
    <FormField
      label={label}
      as={rows ? 'textarea' : 'input'}
      rows={rows}
      value={form[field] || ''}
      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
    />
  );

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search destinations…" />
        <AdminButton icon={Plus} onClick={openAdd}>Add Destination</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={MapPin}
        emptyMessage="No destinations found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[720px]"
        renderRow={(d) => (
          <tr key={d._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3"><CountryFlag slug={d.slug} code={d.code} label={d.name} className="h-6 w-8" /></td>
            <td className="px-4 py-3 font-medium text-dark-700">{d.name}</td>
            <td className="px-4 py-3 text-dark-500">{d.code || '-'}</td>
            <td className="px-4 py-3">
              {d.isFeatured
                ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-label="Featured" />
                : <span className="text-dark-300">-</span>}
            </td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.isActive !== false ? 'bg-green-50 text-green-700' : 'bg-dark-100 text-dark-600'}`}>
                {d.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${d.name}`} onClick={() => openEdit(d)} />
                <RowAction icon={Trash2} label={`Delete ${d.name}`} onClick={() => setDeleteConfirm(d._id)} tone="danger" />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Destination' : 'Edit Destination'}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormField label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. US, UK" />
          </div>

          <div className="flex items-center gap-6">
            <CheckboxField label="Featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            <CheckboxField label="Active" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          </div>

          <FormField label="Description" as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {text('Tuition Range', 'tuitionRange')}
          {text('Living Costs', 'livingCosts')}
          {text('Requirements', 'requirements', 3)}
          {text('English Requirements', 'englishRequirements', 3)}
          {text('Scholarships', 'scholarships', 3)}
          {text('Visa Info', 'visaInfo', 3)}
          {text('Work Opportunities', 'workOpportunities', 3)}
          {text('Intakes', 'intakes')}
          {text('Application Process', 'applicationProcess', 3)}

          <ChipListField
            label="Why Study Here"
            items={form.whyStudyHere}
            onRemove={removeWhy}
            value={whyInput}
            onChange={setWhyInput}
            onAdd={addWhy}
            placeholder="Add reason"
          />

          <ChipListField
            label="Popular Universities"
            items={form.popularUniversities}
            onRemove={removeUni}
            value={uniInput}
            onChange={setUniInput}
            onAdd={addUni}
            placeholder="Add university"
          />

          <fieldset className="rounded-xl border border-dark-200/70 p-4">
            <legend className="px-2 text-sm font-medium text-dark-700">FAQs</legend>
            <div className="mb-3 space-y-2">
              {form.faqs?.map((f, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-dark-50 p-2 text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-dark-700">{f.question}</p>
                    <p className="mt-1 text-xs text-dark-500">{f.answer}</p>
                  </div>
                  <button onClick={() => removeFaq(i)} aria-label={`Remove ${f.question}`} className={`${CHIP_REMOVE} mt-1`}>
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input type="text" value={faqInput.question} onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })} placeholder="Question" aria-label="FAQ question" className={INPUT_CLASS} />
              <div className="flex gap-2">
                <input type="text" value={faqInput.answer} onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })} placeholder="Answer" aria-label="FAQ answer" className={`${INPUT_CLASS} flex-1`} />
                <AdminButton variant="subtle" onClick={addFaq}>Add</AdminButton>
              </div>
            </div>
          </fieldset>

          <SeoFields
            value={form.seo}
            onChange={(field, value) => setForm((p) => ({ ...p, seo: { ...p.seo, [field]: value } }))}
            previewUrl={form.slug ? `/study-in/${form.slug}` : undefined}
            fallbackTitle={form.name ? `Study in ${form.name} - Universities, Fees & Student Visa Guide` : undefined}
            fallbackDescription={form.description}
          />

          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {saving ? 'Saving…' : modal === 'add' ? 'Add Destination' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete destination"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
