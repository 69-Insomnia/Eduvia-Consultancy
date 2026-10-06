import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape, applySeoDefaults } from '../utils/shape';
import generateUniqueSlug from '../utils/slugify';

class Service extends Model {}

Service.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('title', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Service title is required' } },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    detailedContent: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    modelName: 'Service',
    tableName: 'services',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['order'] }],
  }
);

Service.beforeCreate(async (instance: any) => {
  instance.seo = applySeoDefaults(instance.seo);
  if (instance.title) {
    instance.slug = await generateUniqueSlug(instance.title, Service, instance.id);
  }
});

Service.beforeUpdate(async (instance: any) => {
  if (instance.changed('title') && instance.title) {
    instance.slug = await generateUniqueSlug(instance.title, Service, instance.id);
  }
});

applyApiShape(Service);

export default Service as any;
