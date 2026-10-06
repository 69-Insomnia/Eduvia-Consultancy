'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import defaultLogo from '../assets/logo.png';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS: any = {
  siteName: 'Eduvia Consultancy',
  siteTagline: 'Your Gateway to Global Education',
  logo: defaultLogo,
  favicon: '',
  email: 'info@eduviaconsultancy.com',
  phone: '+977-1-4700000',
  phone2: '+977-9801234567',
  address: 'Kathmandu, Nepal',
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  youtube: '',
  metaTitle: 'Eduvia Consultancy - Study Abroad',
  metaDescription: 'Eduvia Consultancy helps students achieve their dreams of studying abroad.',
  primaryColor: '#203890',
  secondaryColor: '#3c5bd0',
  company: {},
  contact: {},
  socialMedia: {},
  seo: {},
  officeHours: '',
};

const first = (value) => (Array.isArray(value) ? value[0] : value);

/**
 * The API returns SiteSettings nested (`company.name`, `contact.phone[]`,
 * `socialMedia.facebook`, `seo.title`), but every consumer on the public site
 * reads flat keys (`settings.siteName`, `settings.phone`, `settings.social`).
 * The context's merge is shallow, so the nested objects arrive but the flat keys
 * stayed pinned to the DEFAULT_SETTINGS placeholders — meaning nothing an editor
 * saved in the CMS ever reached the site. This maps one shape onto the other in
 * a single place rather than editing every consumer.
 *
 * Nested blocks are kept as well, since the structured data reads them directly.
 */
function normalizeSettings(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const company = raw.company || {};
  const contact = raw.contact || {};
  const socialMedia = raw.socialMedia || {};

  const phones = contact.phone || [];
  const emails = contact.email || [];

  return {
    ...raw,
    company,
    contact,
    socialMedia,
    seo: raw.seo || {},
    officeHours: raw.officeHours || contact.officeHours || '',

    siteName: company.name || DEFAULT_SETTINGS.siteName,
    siteTagline: company.tagline || DEFAULT_SETTINGS.siteTagline,
    logo: company.logo || DEFAULT_SETTINGS.logo,

    email: first(emails) || DEFAULT_SETTINGS.email,
    emails,
    phone: first(phones) || DEFAULT_SETTINGS.phone,
    phones,
    // The model stores one phone list; index 1 is the WhatsApp/mobile line the
    // navbar and footer use as the secondary contact.
    phone2: phones[1] || '',
    address: contact.address || DEFAULT_SETTINGS.address,

    facebook: socialMedia.facebook || '',
    instagram: socialMedia.instagram || '',
    twitter: socialMedia.twitter || '',
    linkedin: socialMedia.linkedin || '',
    youtube: socialMedia.youtube || '',
    tiktok: socialMedia.tiktok || '',

    metaTitle: raw.seo?.title || DEFAULT_SETTINGS.metaTitle,
    metaDescription: raw.seo?.description || DEFAULT_SETTINGS.metaDescription,
  };
}

export function SettingsProvider({ children }: any) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      setSettings((prev) => ({ ...prev, ...normalizeSettings(res.data.settings) }));
    } catch {
      // keep defaults on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    // Only swap the favicon when the CMS explicitly provides one. The logo is a
    // wide wordmark and makes an illegible tab icon, so falling back to it here
    // would override the purpose-built favicons in index.html.
    const faviconUrl = settings.favicon || settings.company?.favicon;
    if (!faviconUrl) return;

    let favicon: any = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.type = 'image/png';
    favicon.href = faviconUrl;
  }, [settings]);

  const refreshSettings = async () => {
    setLoading(true);
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
