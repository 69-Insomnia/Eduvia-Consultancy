import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape, applySeoDefaults } from '../utils/shape.js';
import generateUniqueSlug from '../utils/slugify.js';

const TYPE_VALUES = ['public', 'private'];

class University extends Model {}

University.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(v) {
        this.setDataValue('name', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'University name is required' } },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('country', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Country is required' } },
    },
    city: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('city', typeof v === 'string' ? v.trim() : v);
      },
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    shortDescription: {
      type: DataTypes.STRING(300),
      validate: { len: { args: [0, 300], msg: 'Short description cannot exceed 300 characters' } },
    },
    website: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('website', typeof v === 'string' ? v.trim() : v);
      },
    },
    ranking: {
      type: DataTypes.STRING,
    },
    founded: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
      validate: { isIn: { args: [TYPE_VALUES] } },
    },
    programs: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    scholarships: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    entryRequirements: {
      type: DataTypes.TEXT,
    },
    tuitionRange: {
      type: DataTypes.STRING,
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({}),
    },
  },
  {
    sequelize,
    modelName: 'University',
    tableName: 'universities',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['country'] },
      { fields: ['is_featured'] },
      { fields: ['slug'] },
      { fields: ['created_at'] },
    ],
  }
);

University.beforeCreate(async (instance) => {
  instance.seo = applySeoDefaults(instance.seo);
  if (instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, University, instance.id);
  }
});

University.beforeUpdate(async (instance) => {
  if (instance.changed('name') && instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, University, instance.id);
  }
});

applyApiShape(University);

export default University;
