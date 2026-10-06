import mongoose from 'mongoose';
import generateUniqueSlug from '../utils/slugify.js';
import seoFields from './schemas/seoFields.js';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
    },
    degreeLevel: {
      type: String,
      enum: ['bachelor', 'master', 'phd', 'diploma', 'certificate'],
      required: [true, 'Degree level is required'],
    },
    countries: [{ type: String }],
    universities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
      },
    ],
    tuitionRange: {
      type: String,
    },
    applicationFee: {
      type: String,
    },
    isFreeToApply: {
      type: Boolean,
      default: false,
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    intake: {
      type: String,
    },
    requirements: {
      type: String,
    },
    careerOutcomes: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: seoFields(),
  },
  { timestamps: true }
);

courseSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.name, mongoose.model('Course'), this._id);
  }
  next();
});

courseSchema.index({ category: 1 });
courseSchema.index({ degreeLevel: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ name: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);
export default Course;
