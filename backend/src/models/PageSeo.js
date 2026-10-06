import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape, applySeoDefaults } from '../utils/shape.js';

class PageSeo extends Model {}

PageSeo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(v) {
        this.setDataValue('key', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Page key is required' } },
    },
    label: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('label', typeof v === 'string' ? v.trim() : v);
      },
    },
    path: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('path', typeof v === 'string' ? v.trim() : v);
      },
    },
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({}),
    },
  },
  {
    sequelize,
    modelName: 'PageSeo',
    tableName: 'pageseos',
    timestamps: true,
    underscored: true,
  }
);

PageSeo.beforeCreate((instance) => {
  instance.seo = applySeoDefaults(instance.seo);
});

applyApiShape(PageSeo);

export default PageSeo;
