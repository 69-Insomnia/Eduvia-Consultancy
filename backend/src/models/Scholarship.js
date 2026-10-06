import mongoose from 'mongoose';
import generateUniqueSlug from '../utils/slugify.js';
import seoFields from './schemas/seoFields.js';

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scholarship name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    eligibility: {
      type: String,
    },
    amount: {
      type: String,
    },
    type: {
      type: String,
      enum: ['merit', 'need', 'government', 'university'],
      default: 'merit',
    },
    deadline: {
      type: Date,
    },
    applicationProcess: {
      type: String,
    },
    requirements: [{ type: String }],
    link: {
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

scholarshipSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.name, mongoose.model('Scholarship'), this._id);
  }
  next();
});

scholarshipSchema.index({ country: 1 });
scholarshipSchema.index({ type: 1 });
scholarshipSchema.index({ isFeatured: 1 });

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
export default Scholarship;
