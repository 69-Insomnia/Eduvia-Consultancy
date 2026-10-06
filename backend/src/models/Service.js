import mongoose from 'mongoose';
import generateUniqueSlug from '../utils/slugify.js';
import seoFields from './schemas/seoFields.js';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    icon: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    features: [{ type: String }],
    detailedContent: {
      type: String,
    },
    image: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: seoFields(),
  },
  { timestamps: true }
);

serviceSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    this.slug = await generateUniqueSlug(this.title, mongoose.model('Service'), this._id);
  }
  next();
});

serviceSchema.index({ order: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
