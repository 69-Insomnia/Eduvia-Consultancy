import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
});

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    preferredCountry: {
      type: String,
      trim: true,
    },
    highestEducation: {
      type: String,
      trim: true,
    },
    interestedCourse: {
      type: String,
      trim: true,
    },
    preferredIntake: {
      type: String,
      trim: true,
    },
    englishTest: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['website', 'facebook', 'instagram', 'referral', 'walk-in', 'other'],
      default: 'website',
    },
    status: {
      type: String,
      enum: [
        'new',
        'contacted',
        'counselingScheduled',
        'profileEvaluated',
        'applicationStarted',
        'converted',
        'closed',
      ],
      default: 'new',
    },
    notes: [noteSchema],
    assignedCounselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ fullName: 'text', email: 'text', phone: 'text' });

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
