import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  level: { type: String, required: true },
  institution: { type: String, required: true },
  board: { type: String },
  percentage: { type: String },
  year: { type: String },
});

const englishTestSchema = new mongoose.Schema({
  type: { type: String, enum: ['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'None', ''] },
  score: { type: String },
  date: { type: Date },
});

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    nationality: {
      type: String,
      trim: true,
    },
    passportNumber: {
      type: String,
      trim: true,
    },
    education: [educationSchema],
    englishTest: englishTestSchema,
    preferredCountries: [{ type: String }],
    preferredCourses: [{ type: String }],
    status: {
      type: String,
      enum: [
        'prospect',
        'contacted',
        'counselingApplied',
        'applicationSubmitted',
        'visaApplied',
        'visaApproved',
        'departed',
        'enrolled',
      ],
      default: 'prospect',
    },
    source: {
      type: String,
      enum: ['website', 'facebook', 'instagram', 'referral', 'walk-in', 'other'],
      default: 'website',
    },
  },
  { timestamps: true }
);

studentSchema.index({ status: 1 });
studentSchema.index({ createdAt: -1 });
studentSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

const Student = mongoose.model('Student', studentSchema);
export default Student;
