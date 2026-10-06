import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape, applySeoDefaults } from '../utils/shape';
import generateUniqueSlug from '../utils/slugify';
import University from './University';

const TYPE_VALUES = ['merit', 'need', 'government', 'university'];

class Scholarship extends Model {}

Scholarship.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('name', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Scholarship name is required' } },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    universityId: {
      type: DataTypes.UUID,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('country', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Country is required' } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    eligibility: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'merit',
      validate: { isIn: { args: [TYPE_VALUES] } as any },
    },
    deadline: {
      type: DataTypes.DATE,
    },
    applicationProcess: {
      type: DataTypes.TEXT,
    },
    requirements: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    link: {
      type: DataTypes.STRING,
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
    modelName: 'Scholarship',
    tableName: 'scholarships',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['country'] }, { fields: ['type'] }, { fields: ['is_featured'] }],
  }
);

Scholarship.belongsTo(University, {
  foreignKey: { name: 'universityId', field: 'university_id' },
  as: 'university',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Scholarship.beforeCreate(async (instance: any) => {
  instance.seo = applySeoDefaults(instance.seo);
  if (instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, Scholarship, instance.id);
  }
});

Scholarship.beforeUpdate(async (instance: any) => {
  if (instance.changed('name') && instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, Scholarship, instance.id);
  }
});

applyApiShape(Scholarship, { universityId: 'university' });

export default Scholarship as any;
