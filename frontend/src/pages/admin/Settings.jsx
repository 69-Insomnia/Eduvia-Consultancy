import { useState, useEffect } from 'react';
import { Save, Loader2, X, Building, Phone, Globe, Search as SearchIcon, BarChart3 } from 'lucide-react';
import api from '../../services/api';
import AdminButton from '../../components/admin/AdminButton';
import FormField from '../../components/admin/FormField';
import toast from 'react-hot-toast';

// The stable public URL, not the Vite-bundled import: bundled asset names are
// content-hashed and change every build, so persisting one to the database
// would break the logo on the next deploy.
const DEFAULT_LOGO_URL = '/logo.png';

const TABS = [
  { id: 'company', label: 'Company', icon: Building },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'social', label: 'Social Media', icon: Globe },
  { id: 'seo', label: 'SEO', icon: SearchIcon },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
];

// Keywords are edited as a comma-separated string but stored as an array.
const splitKeywords = (v) => String(v || '').split(',').map((k) => k.trim()).filter(Boolean);
const joinKeywords = (v) => (Array.isArray(v) ? v.join(', ') : v || '');

const defaultSettings = {
  company: { name: '', tagline: '', description: '', logo: DEFAULT_LOGO_URL },
  contact: { phones: [], emails: [], address: '', whatsapp: '', officeHours: '' },
  // Must match the `socialMedia` block in SiteSettings — the API allowlist drops
  // any other name, which is why this tab never used to persist.
  socialMedia: { facebook: '', instagram: '', tiktok: '', linkedin: '', youtube: '' },
  seo: { title: '', description: '', keywords: '' },
  statistics: { yearsExperience: '', studentsServed: '', destinations: '', universities: '', satisfaction: '' },
};

/** Repeatable list of values, edited as chips. */
function ChipList({ label, items = [], onRemove, value, onChange, onAdd, placeholder, type = 'text' }) {
  const inputProps = {
    id: `chip-${placeholder.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    type,
    value,
    onChange: (e) => onChange(e.target.value),
    onKeyDown: (e) => e.key === 'Enter' && (e.preventDefault(), onAdd()),
    placeholder,
    className: 'flex-1',
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-dark-700">{label}</span>
      <div className="mb-2 flex gap-2">
        <FormField label="" {...inputProps} />
        <AdminButton variant="subtle" onClick={onAdd}>Add</AdminButton>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700">
            {item}
            <button onClick={() => onRemove(i)} aria-label={`Remove ${item}`} className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:text-accent-500">
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({ ...defaultSettings });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      const data = res.data.settings || res.data;
      setSettings({
        company: { ...defaultSettings.company, ...(data.company || {}) },
        contact: { ...defaultSettings.contact, ...(data.contact || {}), phones: data.contact?.phone || data.contact?.phones || [], emails: data.contact?.email || data.contact?.emails || [] },
        socialMedia: { ...defaultSettings.socialMedia, ...(data.socialMedia || {}) },
        seo: { ...defaultSettings.seo, ...(data.seo || {}), keywords: joinKeywords(data.seo?.keywords) },
        statistics: data.statistics || defaultSettings.statistics,
      });
    } catch (err) { toast.error('Failed to load settings'); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // The backend expects `phone`/`email` arrays and a top-level `officeHours`;
      // sending the form's shape verbatim would be silently dropped.
      const payload = {
        company: settings.company,
        socialMedia: settings.socialMedia,
        statistics: settings.statistics,
        seo: { ...settings.seo, keywords: splitKeywords(settings.seo.keywords) },
        contact: {
          phone: settings.contact.phones || [],
          email: settings.contact.emails || [],
          address: settings.contact.address,
          whatsapp: settings.contact.whatsapp,
        },
        officeHours: settings.contact.officeHours,
      };
      await api.put('/settings', payload);
      toast.success('Settings saved');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const updateCompany = (field, value) => setSettings((p) => ({ ...p, company: { ...p.company, [field]: value } }));
  const updateContact = (field, value) => setSettings((p) => ({ ...p, contact: { ...p.contact, [field]: value } }));
  const updateSocial = (field, value) => setSettings((p) => ({ ...p, socialMedia: { ...p.socialMedia, [field]: value } }));
  const updateSeo = (field, value) => setSettings((p) => ({ ...p, seo: { ...p.seo, [field]: value } }));
  const updateStats = (field, value) => setSettings((p) => ({ ...p, statistics: { ...p.statistics, [field]: value } }));

  const addPhone = () => { if (phoneInput) { setSettings((p) => ({ ...p, contact: { ...p.contact, phones: [...(p.contact.phones || []), phoneInput] } })); setPhoneInput(''); } };
  const removePhone = (i) => setSettings((p) => ({ ...p, contact: { ...p.contact, phones: p.contact.phones.filter((_, idx) => idx !== i) } }));
  const addEmail = () => { if (emailInput) { setSettings((p) => ({ ...p, contact: { ...p.contact, emails: [...(p.contact.emails || []), emailInput] } })); setEmailInput(''); } };
  const removeEmail = (i) => setSettings((p) => ({ ...p, contact: { ...p.contact, emails: p.contact.emails.filter((_, idx) => idx !== i) } }));

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 rounded-2xl border border-dark-200/70 bg-white p-8 shadow-soft">
        <div className="h-8 w-40 rounded-xl bg-dark-200" />
        <div className="h-4 w-full rounded-xl bg-dark-200" />
        <div className="h-4 w-3/4 rounded-xl bg-dark-200" />
        <div className="h-10 w-full rounded-xl bg-dark-200" />
      </div>
    );
  }

  const renderCompany = () => (
    <div className="space-y-4">
      <FormField label="Company Name" value={settings.company.name} onChange={(e) => updateCompany('name', e.target.value)} />
      <FormField label="Tagline" value={settings.company.tagline} onChange={(e) => updateCompany('tagline', e.target.value)} />
      <FormField label="Description" as="textarea" rows={4} value={settings.company.description} onChange={(e) => updateCompany('description', e.target.value)} />
      <FormField label="Logo URL" type="url" value={settings.company.logo} onChange={(e) => updateCompany('logo', e.target.value)} placeholder="/logo.png or https://…" />
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      <ChipList label="Phone Numbers" items={settings.contact.phones} onRemove={removePhone} value={phoneInput} onChange={setPhoneInput} onAdd={addPhone} placeholder="Add phone" type="tel" />
      <ChipList label="Email Addresses" items={settings.contact.emails} onRemove={removeEmail} value={emailInput} onChange={setEmailInput} onAdd={addEmail} placeholder="Add email" type="email" />
      <FormField label="Address" as="textarea" rows={2} value={settings.contact.address} onChange={(e) => updateContact('address', e.target.value)} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="WhatsApp Number" type="tel" value={settings.contact.whatsapp} onChange={(e) => updateContact('whatsapp', e.target.value)} />
        <FormField label="Office Hours" value={settings.contact.officeHours} onChange={(e) => updateContact('officeHours', e.target.value)} placeholder="e.g. Mon-Fri 9am-6pm" />
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-4">
      {[
        ['facebook', 'Facebook URL', 'https://facebook.com/…'],
        ['instagram', 'Instagram URL', 'https://instagram.com/…'],
        ['tiktok', 'TikTok URL', 'https://tiktok.com/…'],
        ['linkedin', 'LinkedIn URL', 'https://linkedin.com/…'],
        ['youtube', 'YouTube URL', 'https://youtube.com/…'],
      ].map(([field, label, placeholder]) => (
        <FormField
          key={field}
          label={label}
          type="url"
          value={settings.socialMedia[field]}
          onChange={(e) => updateSocial(field, e.target.value)}
          placeholder={placeholder}
        />
      ))}
    </div>
  );

  const renderSeo = () => (
    <div className="space-y-4">
      <p className="text-sm text-dark-500">
        Site-wide fallbacks. Per-page overrides live under <strong className="font-medium text-dark-700">SEO → Page SEO</strong>.
      </p>
      <FormField label="Default Meta Title" value={settings.seo.title} onChange={(e) => updateSeo('title', e.target.value)} placeholder="Eduvia Consultancy - Study Abroad" />
      <FormField label="Default Meta Description" as="textarea" rows={3} value={settings.seo.description} onChange={(e) => updateSeo('description', e.target.value)} />
      <FormField label="Default Keywords" value={settings.seo.keywords} onChange={(e) => updateSeo('keywords', e.target.value)} placeholder="study abroad, consultancy, education" hint="Comma separated." />
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[
        ['yearsExperience', 'Years of Experience', 'e.g. 10+'],
        ['studentsServed', 'Students Served', 'e.g. 5000+'],
        ['destinations', 'Destinations', 'e.g. 20+'],
        ['universities', 'Universities', 'e.g. 200+'],
        ['satisfaction', 'Satisfaction Rate', 'e.g. 98%'],
      ].map(([field, label, placeholder]) => (
        <FormField
          key={field}
          label={label}
          value={settings.statistics[field]}
          onChange={(e) => updateStats(field, e.target.value)}
          placeholder={placeholder}
        />
      ))}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'company': return renderCompany();
      case 'contact': return renderContact();
      case 'social': return renderSocial();
      case 'seo': return renderSeo();
      case 'statistics': return renderStats();
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-dark-200/70 bg-white shadow-soft">
        <div className="flex overflow-x-auto border-b border-dark-200/70" role="tablist">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-dark-500 hover:border-dark-300 hover:text-dark-700'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="p-6">
          {renderTab()}
        </div>
      </div>

      <div className="flex justify-end">
        <AdminButton size="md" icon={saving ? Loader2 : Save} onClick={handleSave} disabled={saving} className="px-6">
          {saving ? 'Saving…' : 'Save Settings'}
        </AdminButton>
      </div>
    </div>
  );
}
