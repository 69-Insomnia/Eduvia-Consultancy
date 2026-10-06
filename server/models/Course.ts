import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { applyApiShape, applySeoDefaults } from '../utils/shape';
import generateUniqueSlug from '../utils/slugify';
import University from './University';

const DEGREE_LEVELS = ['bachelor', 'master', 'phd', 'diploma', 'certificate'];

class Course extends Model {}

Course.init(
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
      validate: { notNull: { msg: 'Course name is required' } },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
      set(v) {
        this.setDataValue('category', typeof v === 'string' ? v.trim() : v);
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    duration: {
      type: DataTypes.STRING,
    },
    degreeLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Degree level is required' },
        isIn: { args: [DEGREE_LEVELS] } as any,
      },
    },
    countries: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => [],
    },
    tuitionRange: {
      type: DataTypes.STRING,
    },
    applicationFee: {
      type: DataTypes.STRING,
    },
    isFreeToApply: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    scholarshipAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    intake: {
      type: DataTypes.STRING,
    },
    requirements: {
      type: DataTypes.TEXT,
    },
    careerOutcomes: {
      type: DataTypes.TEXT,
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
    seo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({}),
    },
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['degree_level'] },
      { fields: ['is_featured'] },
      { fields: ['slug'] },
    ],
  }
);

Course.belongsToMany(University, {
  through: 'course_universities',
  as: 'universities',
  foreignKey: 'courseId',
  otherKey: 'universityId',
});

Course.beforeCreate(async (instance: any) => {
  instance.seo = applySeoDefaults(instance.seo);
  if (instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, Course, instance.id);
  }
});

Course.beforeUpdate(async (instance: any) => {
  if (instance.changed('name') && instance.name) {
    instance.slug = await generateUniqueSlug(instance.name, Course, instance.id);
  }
});

applyApiShape(Course);

export default Course as any;
