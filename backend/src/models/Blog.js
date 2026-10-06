import mongoose from 'mongoose';
import generateUniqueSlug from '../utils/slugify.js';
import seoFields from './schemas/seoFields.js';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    author: {
      type: String,
      default: 'Eduvia Team',
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      trim: true,
    },
    tags: [{ type: String }],
    readTime: {
      type: Number,
      default: 5,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    seo: seoFields(),
    views: {
      type: Number,
      default: 0,
    },
    relatedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
  },
  { timestamps: true }
);

blogSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    this.slug = await generateUniqueSlug(this.title, mongoose.model('Blog'), this._id);
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: 'text', content: 'text' });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
