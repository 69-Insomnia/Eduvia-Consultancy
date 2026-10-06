import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape, applySeoDefaults } from '../utils/shape.js';
import generateUniqueSlug from '../utils/slugify.js';
import Blog from './Blog.js';

class Destination extends Model {}

Destination.init(
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
      validate: { notNull: { msg: 'Destination name is required' } },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('code', typeof v === 'string' ? v.trim() : v);
      },
    },
    flag: {
      type: DataTypes.STRING,
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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    whyStudyHere: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    popularUniversities: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    popularCourses: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    tuitionInfo: {
      type: DataTypes.TEXT,
    },
    costOfLiving: {
      type: DataTypes.TEXT,
    },
    scholarships: {
      type: DataTypes.TEXT,
    },
    englishRequirements: {
      type: DataTypes.TEXT,
    },
    visaInfo: {
      type: DataTypes.TEXT,
    },
    workOpportunities: {
      type: DataTypes.TEXT,
    },
    intakes: {
      type: DataTypes.TEXT,
    },
    applicationProcess: {
      type: DataTypes.TEXT,
    },
    faqs: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({}),
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
  },
  {
    sequelize,
    modelName: 'Destination',
    tableName: 'destinations',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['is_featured'] }, { fields: ['slug'] }, { fields: ['created_at'] }],
  }
);

Destination.belongsToMany(Blog, {
  through: 'destination_related_blogs',
  as: 'relatedBlogs',
  foreignKey: 'destinationId',
  otherKey: 'blogId',
});

Destination.beforeCreate(async (instance) => {
  instance.seo = applySeoDefaults(instance.seo);
  if (instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, Destination, instance.id);
  }
});

Destination.beforeUpdate(async (instance) => {
  if (instance.changed('name') && instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, Destination, instance.id);
  }
});

applyApiShape(Destination);

export default Destination;
