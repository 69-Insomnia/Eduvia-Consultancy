import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape } from '../utils/shape.js';
import Admin from './Admin.js';

const GENDER_VALUES = ['male', 'female', 'other'];
const STATUS_VALUES = [
  'prospect',
  'contacted',
  'counselingApplied',
  'applicationSubmitted',
  'visaApplied',
  'visaApproved',
  'departed',
  'enrolled',
];
const SOURCE_VALUES = ['website', 'facebook', 'instagram', 'referral', 'walk-in', 'other'];

class Student extends Model {}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('firstName', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'First name is required' } },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(v) {
        this.setDataValue('lastName', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Last name is required' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      allowNull: false,
      set(v) {
        this.setDataValue('phone', typeof v === 'string' ? v.trim() : v);
      },
      validate: { notNull: { msg: 'Phone is required' } },
    },
    address: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('address', typeof v === 'string' ? v.trim() : v);
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.STRING,
      validate: { isIn: { args: [GENDER_VALUES] } },
    },
    nationality: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('nationality', typeof v === 'string' ? v.trim() : v);
      },
    },
    passportNumber: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('passportNumber', typeof v === 'string' ? v.trim() : v);
      },
    },
    education: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    englishTest: {
      type: DataTypes.JSONB,
    },
    preferredCountries: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    preferredCourses: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'prospect',
      validate: { isIn: { args: [STATUS_VALUES] } },
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'website',
      validate: { isIn: { args: [SOURCE_VALUES] } },
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['status'] }, { fields: ['created_at'] }],
  }
);

Student.belongsTo(Admin, {
  foreignKey: { name: 'userId', field: 'user_id' },
  as: 'user',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

applyApiShape(Student, { userId: 'user' });

export default Student;
