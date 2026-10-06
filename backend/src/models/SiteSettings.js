import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape } from '../utils/shape.js';

class SiteSettings extends Model {
  static async getSettings() {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return settings;
  }
}

SiteSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        name: 'Eduvia Consultancy Pvt. Ltd.',
        logo: '',
        tagline: 'Your Gateway to Global Education',
        description: '',
      }),
    },
    contact: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        phone: [],
        email: [],
        address: '',
        whatsapp: '',
        facebook: '',
        instagram: '',
        tiktok: '',
        linkedin: '',
        youtube: '',
      }),
    },
    socialMedia: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        facebook: '',
        instagram: '',
        tiktok: '',
        linkedin: '',
        youtube: '',
        twitter: '',
      }),
    },
    officeHours: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Sun-Fri: 9:00 AM - 5:00 PM',
    },
    statistics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    heroSettings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        title: 'Your Gateway to Global Education',
        subtitle: 'Empowering Nepali students to achieve their dreams of studying abroad',
        backgroundImage: '',
      }),
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        title: 'Eduvia Consultancy - Study Abroad Consultancy in Nepal',
        description:
          'Eduvia Consultancy is a leading education consultancy in Nepal helping students study in Australia, Canada, UK, USA, and more.',
        keywords: [
          'study abroad',
          'education consultancy nepal',
          'study in australia',
          'study in canada',
          'study in uk',
          'student visa',
          'kathmandu',
        ],
        ogImage: '',
        ogType: 'website',
        robots: 'index,follow',
      }),
    },
    footerSettings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        copyright: `Â© ${new Date().getFullYear()} Eduvia Consultancy Pvt. Ltd. All rights reserved.`,
      }),
    },
  },
  {
    sequelize,
    modelName: 'SiteSettings',
    tableName: 'sitesettings',
    timestamps: true,
    underscored: true,
  }
);

applyApiShape(SiteSettings);

export default SiteSettings;
