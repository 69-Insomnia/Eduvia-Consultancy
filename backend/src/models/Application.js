import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import { applyApiShape } from '../utils/shape.js';
import Student from './Student.js';
import University from './University.js';

const STATUS_VALUES = [
  'draft',
  'submitted',
  'underReview',
  'conditionalOffer',
  'fullOffer',
  'rejected',
  'visaApplied',
  'visaApproved',
  'visaRejected',
  'enrolled',
  'deferred',
];

class Application extends Model {}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notNull: { msg: 'Student is required' } },
    },
    universityId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notNull: { msg: 'University is required' } },
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'Course is required' } },
    },
    intake: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'Intake is required' } },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notNull: { msg: 'Year is required' } },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'draft',
      validate: { isIn: { args: [STATUS_VALUES] } },
    },
    documents: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    offerLetter: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    deadlines: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({}),
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['student_id', 'status'] },
      { fields: ['university_id'] },
      { fields: ['created_at'] },
    ],
  }
);

Application.belongsTo(Student, {
  foreignKey: { name: 'studentId', field: 'student_id' },
  as: 'student',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});
Application.belongsTo(University, {
  foreignKey: { name: 'universityId', field: 'university_id' },
  as: 'university',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

applyApiShape(Application, { studentId: 'student', universityId: 'university' });

export default Application;
