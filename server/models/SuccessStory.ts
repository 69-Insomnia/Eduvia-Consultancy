import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape } from '../utils/shape';

class SuccessStory extends Model {}

SuccessStory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('studentName', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Student name is required' } },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    country: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('country', typeof v === 'string' ? v.trim() : v);
      },
    },
    university: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('university', typeof v === 'string' ? v.trim() : v);
      },
    },
    course: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('course', typeof v === 'string' ? v.trim() : v);
      },
    },
    intake: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('intake', typeof v === 'string' ? v.trim() : v);
      },
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: 'Testimonial is required' } },
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
    modelName: 'SuccessStory',
    tableName: 'successstories',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['is_featured'] }],
  }
);

applyApiShape(SuccessStory);

export default SuccessStory as any;
