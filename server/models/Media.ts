import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape } from '../utils/shape';
import Admin from './Admin';

class Media extends Model {}

Media.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'filename is required' } },
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'originalName is required' } },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'url is required' } },
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    mimetype: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    folder: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'general',
    },
    uploadedById: {
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    modelName: 'Media',
    tableName: 'media',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['folder'] }],
  }
);

Media.belongsTo(Admin, {
  foreignKey: { name: 'uploadedById', field: 'uploaded_by_id' },
  as: 'uploadedBy',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

applyApiShape(Media, { uploadedById: 'uploadedBy' });

export default Media as any;
