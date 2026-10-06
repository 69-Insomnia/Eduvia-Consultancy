import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape } from '../utils/shape';

class FAQ extends Model {}

FAQ.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(v) {
        this.setDataValue('question', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Question is required' } },
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: 'Answer is required' } },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'general',
      set(v) {
        this.setDataValue('category', typeof v === 'string' ? v.trim() : v);
      },
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
  },
  {
    sequelize,
    modelName: 'FAQ',
    tableName: 'faqs',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['category'] }, { fields: ['order'] }],
  }
);

applyApiShape(FAQ);

export default FAQ as any;
