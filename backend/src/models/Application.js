import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'University is required'],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
    },
    intake: {
      type: String,
      required: [true, 'Intake is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'underReview',
        'conditionalOffer',
        'fullOffer',
        'rejected',
        'visaApplied',
        'visaApproved',
        'visaRejected',
        'enrolled',
        'deferred',
      ],
      default: 'draft',
    },
    documents: [
      {
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    offerLetter: {
      type: String,
    },
    notes: {
      type: String,
    },
    deadlines: {
      applicationDeadline: { type: Date },
      documentDeadline: { type: Date },
      visaDeadline: { type: Date },
    },
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ university: 1 });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
