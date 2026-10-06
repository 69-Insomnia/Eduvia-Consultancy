import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape } from '../utils/shape.js';

class ContactMessage extends Model {}

ContactMessage.init(
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
      validate: { notNull: { msg: 'Name is required' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('email', typeof v === 'string' ? v.trim().toLowerCase() : v);
      },
      validate: {
        notNull: { msg: 'Email is required' },
        is: { args: /^\S+@\S+\.\S+$/, msg: 'Please provide a valid email' },
      },
    },
    phone: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('phone', typeof v === 'string' ? v.trim() : v);
      },
    },
    subject: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('subject', typeof v === 'string' ? v.trim() : v);
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: 'Message is required' } },
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'contactmessages',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['is_read'] }, { fields: ['created_at'] }],
  }
);

applyApiShape(ContactMessage);

export default ContactMessage;
