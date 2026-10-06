import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    quote: {
      type: String,
      required: [true, 'Quote is required'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5,
    },
    image: {
      type: String,
      default: '',
    },
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

testimonialSchema.index({ isFeatured: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
