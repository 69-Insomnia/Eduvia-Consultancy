import { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash2, Plus, PenTool, Image as ImageIcon, X } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import Modal from '../../components/common/Modal';
import AdminButton, { RowAction } from '../../components/admin/AdminButton';
import AdminTable, { AdminToolbar, SearchInput, FilterSelect, useClientPagination } from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import FormField, { CheckboxField } from '../../components/admin/FormField';
import SeoFields, { EMPTY_SEO, seoToForm, seoToPayload } from '../../components/admin/SeoFields';
import { blogImageCandidates } from '../../utils/imageAssets';
import { formatDateShort } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = ['Study Abroad', 'Scholarships', 'Visa Guide', 'Career', 'Student Life', 'News', 'Tips', 'Other'];
const emptyBlog = { title: '', excerpt: '', content: '', category: 'Study Abroad', tags: [], author: '', isPublished: false, featuredImage: '', seo: { ...EMPTY_SEO } };

const COLUMNS = [
  { key: 'image', label: 'Image' },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'author', label: 'Author' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'actions', label: 'Actions', align: 'right' },
];

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...emptyBlog });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // `isPublished=all` is required: the endpoint serves published-only to the
      // public, and an authenticated admin opts into drafts. The 10-item default
      // page would otherwise silently hide everything past the tenth post.
      const res = await api.get('/blogs?isPublished=all&limit=100');
      setBlogs(Array.isArray(res.data) ? res.data : res.data.blogs || []);
    } catch (err) { toast.error('Failed to load blogs'); } finally { setLoading(false); }
  };

  const filtered = useMemo(() => blogs.filter((b) => {
    const ms = !search || b.title?.toLowerCase().includes(search.toLowerCase());
    const mc = !categoryFilter || b.category === categoryFilter;
    const mp = !statusFilter
      || (statusFilter === 'published' ? b.isPublished : !b.isPublished);
    return ms && mc && mp;
  }), [blogs, search, categoryFilter, statusFilter]);

  const { page, setPage, totalPages, paginated, total } = useClientPagination(filtered, {
    resetKey: `${search}|${categoryFilter}|${statusFilter}`,
  });

  const openAdd = () => { setForm({ ...emptyBlog, tags: [], seo: { ...EMPTY_SEO } }); setModal('add'); };
  const openEdit = (b) => { setForm({ ...b, tags: b.tags || [], seo: seoToForm(b.seo) }); setModal('edit'); };

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return; }
    setSaving(true);
    const payload = { ...form, seo: seoToPayload(form.seo) };
    try {
      if (modal === 'add') {
        const res = await api.post('/blogs', payload);
        setBlogs((p) => [res.data.blog || res.data, ...p]);
        toast.success('Blog created');
      } else {
        const res = await api.put(`/blogs/${form._id}`, payload);
        setBlogs((p) => p.map((b) => b._id === form._id ? (res.data.blog || res.data) : b));
        toast.success('Blog updated');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/blogs/${id}`); setBlogs((p) => p.filter((b) => b._id !== id)); toast.success('Blog deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const togglePublish = async (blog) => {
    try {
      const res = await api.put(`/blogs/${blog._id}`, { isPublished: !blog.isPublished });
      setBlogs((p) => p.map((b) => b._id === blog._id ? (res.data.blog || res.data) : b));
      toast.success(blog.isPublished ? 'Blog unpublished' : 'Blog published');
    } catch (err) { toast.error('Failed to update'); }
  };

  const addTag = () => { if (tagInput && !form.tags.includes(tagInput)) { setForm((p) => ({ ...p, tags: [...p.tags, tagInput] })); setTagInput(''); } };
  const removeTag = (i) => setForm((p) => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-4">
      <AdminToolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search blogs…" />
        <FilterSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          allLabel="All Categories"
          options={CATEGORIES}
          ariaLabel="Filter by category"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          allLabel="Any Status"
          options={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]}
          ariaLabel="Filter by status"
        />
        <AdminButton icon={Plus} onClick={openAdd}>Add Blog</AdminButton>
      </AdminToolbar>

      <AdminTable
        columns={COLUMNS}
        rows={paginated}
        loading={loading}
        emptyIcon={PenTool}
        emptyMessage="No blogs found"
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        minWidth="min-w-[900px]"
        renderRow={(b) => (
          <tr key={b._id} className="transition-colors hover:bg-dark-50">
            <td className="px-4 py-3">
              <SmartImage candidates={blogImageCandidates(b.featuredImage, b.slug)} alt="" className="h-10 w-10 rounded-lg object-cover" fallback={<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-100"><ImageIcon className="h-5 w-5 text-dark-400" aria-hidden="true" /></div>} />
            </td>
            <td className="max-w-[220px] truncate px-4 py-3 font-medium text-dark-700">{b.title}</td>
            <td className="px-4 py-3 text-dark-500">{b.category || '-'}</td>
            <td className="px-4 py-3 text-dark-500">{b.author || '-'}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => togglePublish(b)}
                title={b.isPublished ? 'Click to unpublish' : 'Click to publish'}
                className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${b.isPublished ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'}`}
              >
                {b.isPublished ? 'Published' : 'Draft'}
              </button>
            </td>
            <td className="px-4 py-3 text-xs text-dark-400">{formatDateShort(b.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <RowAction icon={Pencil} label={`Edit ${b.title}`} onClick={() => openEdit(b)} />
                <RowAction icon={Trash2} label={`Delete ${b.title}`} tone="danger" onClick={() => setDeleteConfirm(b._id)} />
              </div>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add Blog' : 'Edit Blog'}
        size="xl"
      >
        <div className="space-y-4">
          <FormField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <FormField label="Excerpt" as="textarea" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <FormField label="Content" as="textarea" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your blog content here…" controlClassName="resize-y" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Category"
              as="select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <FormField label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          </div>

          <FormField label="Featured Image URL" type="url" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="https://…" />

          <div>
            <span className="mb-1.5 block text-sm font-medium text-dark-700">Tags</span>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag"
                aria-label="Add tag"
                className="flex-1 rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm text-dark-900 shadow-xs transition-all placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
              <AdminButton variant="subtle" onClick={addTag}>Add</AdminButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags?.map((t, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">
                  {t}
                  <button onClick={() => removeTag(i)} aria-label={`Remove ${t}`} className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:text-accent-500">
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <CheckboxField label="Published" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
          <SeoFields
            value={form.seo}
            onChange={(field, value) => setForm((p) => ({ ...p, seo: { ...p.seo, [field]: value } }))}
            previewUrl={form.slug ? `/blogs/${form.slug}` : undefined}
            fallbackTitle={form.title}
            fallbackDescription={form.excerpt}
          />

          <AdminButton onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : modal === 'add' ? 'Create Blog' : 'Save Changes'}
          </AdminButton>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete blog"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
