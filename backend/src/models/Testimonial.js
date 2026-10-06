import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape } from '../utils/shape.js';

class Testimonial extends Model {}

Testimonial.init(
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
    quote: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: 'Quote is required' } },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating cannot exceed 5' },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
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
    modelName: 'Testimonial',
    tableName: 'testimonials',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['is_featured'] }],
  }
);

applyApiShape(Testimonial);

export default Testimonial;
