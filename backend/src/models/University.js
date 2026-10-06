import mongoose from 'mongoose';
import generateUniqueSlug from '../utils/slugify.js';
import seoFields from './schemas/seoFields.js';

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  degree: { type: String },
  duration: { type: String },
  tuition: { type: String },
  intake: { type: String },
  requirements: { type: String },
});

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    website: {
      type: String,
      trim: true,
    },
    ranking: {
      type: String,
    },
    founded: {
      type: String,
    },
    type: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    programs: [programSchema],
    scholarships: [
      {
        name: { type: String },
        amount: { type: String },
        eligibility: { type: String },
      },
    ],
    entryRequirements: {
      type: String,
    },
    tuitionRange: {
      type: String,
    },
    features: [{ type: String }],
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

universitySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.name, mongoose.model('University'), this._id);
  }
  next();
});

universitySchema.index({ country: 1 });
universitySchema.index({ isFeatured: 1 });
universitySchema.index({ name: 'text', description: 'text' });

const University = mongoose.model('University', universitySchema);
export default University;
