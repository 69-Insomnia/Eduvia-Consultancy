import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Loader2, Image as ImageIcon, Copy, Check, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import AdminButton from '../../components/admin/AdminButton';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { storedImageCandidates } from '../../utils/imageAssets';
import toast from 'react-hot-toast';

const TYPES = ['All', 'Image', 'Video', 'Document'];

export default function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const fileInput = useRef(null);

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get('/media?limit=100');
      setMedia(Array.isArray(res.data) ? res.data : res.data.media || []);
    } catch (err) { toast.error('Failed to load media'); } finally { setLoading(false); }
  };

  const filtered = media.filter((m) => {
    if (typeFilter === 'All') return true;
    return m.type?.toLowerCase() === typeFilter.toLowerCase();
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success(`${files.length} file(s) uploaded`);
      fetchMedia();
    } catch (err) { toast.error('Upload failed'); } finally { setUploading(false); if (fileInput.current) fileInput.current.value = ''; }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/media/${id}`); setMedia((p) => p.filter((m) => m._id !== id)); toast.success('Media deleted'); setDeleteConfirm(null); } catch (err) { toast.error('Failed to delete'); }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isImage = (m) => m.type?.toLowerCase() === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(m.url || m.filename || '');

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative sm:w-48">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by file type" className="w-full appearance-none rounded-xl border border-dark-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-dark-900 shadow-xs transition-all hover:border-dark-300 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" aria-hidden="true" />
        </div>
        <input ref={fileInput} type="file" multiple onChange={handleUpload} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx" />
        <AdminButton
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          icon={uploading ? Loader2 : Upload}
          className="sm:ml-auto"
        >
          {uploading ? 'Uploading…' : 'Upload Files'}
        </AdminButton>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(10)].map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-dark-200" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dark-200/70 bg-white py-16 text-center shadow-soft">
          <ImageIcon className="mx-auto mb-3 h-10 w-10 text-dark-300" aria-hidden="true" />
          <p className="text-dark-500">No media files found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((m) => (
            <motion.div key={m._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft">
              <div className="flex aspect-square items-center justify-center overflow-hidden bg-dark-100">
                {isImage(m) ? (
                  <SmartImage candidates={storedImageCandidates(m.url || m.filePath)} alt={m.originalName || m.filename} className="h-full w-full object-cover" fallback={<div className="flex h-full w-full items-center justify-center"><ImageIcon className="h-8 w-8 text-dark-400" aria-hidden="true" /></div>} />
                ) : (
                  <div className="p-4 text-center">
                    <ImageIcon className="mx-auto mb-2 h-8 w-8 text-dark-400" aria-hidden="true" />
                    <p className="truncate text-xs text-dark-500">{m.originalName || m.filename}</p>
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-dark-600" title={m.originalName || m.filename}>{m.originalName || m.filename}</p>
                <p className="text-[10px] text-dark-400">{m.type || 'Unknown'}</p>
              </div>
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button onClick={() => copyUrl(m.url || m.filePath, m._id)} aria-label="Copy URL" title="Copy URL" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-dark-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
                  {copiedId === m._id ? <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
                <button onClick={() => setDeleteConfirm(m._id)} aria-label="Delete media" title="Delete" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-accent-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete media"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
