import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape } from '../utils/shape.js';
import Admin from './Admin.js';

const SOURCE_VALUES = ['website', 'facebook', 'instagram', 'referral', 'walk-in', 'other'];
const STATUS_VALUES = [
  'new',
  'contacted',
  'counselingScheduled',
  'profileEvaluated',
  'applicationStarted',
  'converted',
  'closed',
];

class Inquiry extends Model {}

Inquiry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      set(v) {
        this.setDataValue('fullName', typeof v === 'string' ? v.trim() : v);
      },
      validate: {
        notNull: { msg: 'Full name is required' },
        len: { args: [1, 100], msg: 'Name cannot exceed 100 characters' },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('phone', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Phone number is required' } },
    },
    email: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('email', typeof v === 'string' ? v.trim().toLowerCase() : v);
      },
      validate: {
        validEmail(value) {
          if (value && !/^\S+@\S+\.\S+$/.test(value)) {
            throw new Error('Please provide a valid email');
          }
        },
      },
    },
    preferredCountry: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('preferredCountry', typeof v === 'string' ? v.trim() : v);
      },
    },
    highestEducation: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('highestEducation', typeof v === 'string' ? v.trim() : v);
      },
    },
    interestedCourse: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('interestedCourse', typeof v === 'string' ? v.trim() : v);
      },
    },
    preferredIntake: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('preferredIntake', typeof v === 'string' ? v.trim() : v);
      },
    },
    englishTest: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('englishTest', typeof v === 'string' ? v.trim() : v);
      },
    },
    message: {
      type: DataTypes.TEXT,
      set(v) {
        this.setDataValue('message', typeof v === 'string' ? v.trim() : v);
      },
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'website',
      validate: { isIn: { args: [SOURCE_VALUES] } },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'new',
      validate: { isIn: { args: [STATUS_VALUES] } },
    },
    notes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    assignedCounselorId: {
      type: DataTypes.UUID,
    },
  },
  {
    sequelize,
    modelName: 'Inquiry',
    tableName: 'inquiries',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['status'] }, { fields: ['created_at'] }],
  }
);

Inquiry.belongsTo(Admin, {
  foreignKey: { name: 'assignedCounselorId', field: 'assigned_counselor_id' },
  as: 'assignedCounselor',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

applyApiShape(Inquiry, { assignedCounselorId: 'assignedCounselor' });

export default Inquiry;
