import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    company: {
      name: { type: String, default: 'Eduvia Consultancy Pvt. Ltd.' },
      logo: { type: String, default: '' },
      tagline: { type: String, default: 'Your Gateway to Global Education' },
      description: { type: String, default: '' },
    },
    contact: {
      phone: [{ type: String }],
      email: [{ type: String }],
      address: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    officeHours: {
      type: String,
      default: 'Sun-Fri: 9:00 AM - 5:00 PM',
    },
    statistics: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    heroSettings: {
      title: { type: String, default: 'Your Gateway to Global Education' },
      subtitle: {
        type: String,
        default: 'Empowering Nepali students to achieve their dreams of studying abroad',
      },
      backgroundImage: { type: String, default: '' },
    },
    // Kept inline rather than using the shared `seoFields()` factory: this is the
    // site-wide fallback, so unlike per-entity SEO it *does* carry defaults.
    seo: {
      title: { type: String, default: 'Eduvia Consultancy - Study Abroad Consultancy in Nepal' },
      description: {
        type: String,
        default:
          'Eduvia Consultancy is a leading education consultancy in Nepal helping students study in Australia, Canada, UK, USA, and more.',
      },
      keywords: {
        type: [String],
        default: [
          'study abroad',
          'education consultancy nepal',
          'study in australia',
          'study in canada',
          'study in uk',
          'student visa',
          'kathmandu',
        ],
      },
      ogImage: { type: String, default: '' },
      ogType: { type: String, default: 'website' },
      robots: { type: String, default: 'index,follow' },
    },
    footerSettings: {
      copyright: {
        type: String,
        default: `© ${new Date().getFullYear()} Eduvia Consultancy Pvt. Ltd. All rights reserved.`,
      },
    },
  },
  { timestamps: true }
);

siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
