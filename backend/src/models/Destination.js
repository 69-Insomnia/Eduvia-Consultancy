import mongoose from 'mongoose';
import generateUniqueSlug from '../utils/slugify.js';
import seoFields from './schemas/seoFields.js';

const faqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
    },
    flag: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    whyStudyHere: [{ type: String }],
    popularUniversities: [
      {
        name: { type: String },
        ranking: { type: String },
        programs: [{ type: String }],
      },
    ],
    popularCourses: [{ type: String }],
    tuitionInfo: {
      type: String,
    },
    costOfLiving: {
      type: String,
    },
    scholarships: {
      type: String,
    },
    englishRequirements: {
      type: String,
    },
    visaInfo: {
      type: String,
    },
    workOpportunities: {
      type: String,
    },
    intakes: {
      type: String,
    },
    applicationProcess: {
      type: String,
    },
    faqs: [faqItemSchema],
    relatedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
    seo: seoFields(),
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

destinationSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(this.name, mongoose.model('Destination'), this._id);
  }
  next();
});

destinationSchema.index({ isFeatured: 1 });
destinationSchema.index({ name: 'text', description: 'text' });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
