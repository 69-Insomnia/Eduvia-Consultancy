import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    photo: {
      type: String,
      default: '',
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
    intake: {
      type: String,
      trim: true,
    },
    testimonial: {
      type: String,
      required: [true, 'Testimonial is required'],
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

successStorySchema.index({ isFeatured: 1 });

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
export default SuccessStory;
