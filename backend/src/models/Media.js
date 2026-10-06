import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
    folder: {
      type: String,
      default: 'general',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

mediaSchema.index({ folder: 1 });

const Media = mongoose.model('Media', mediaSchema);
export default Media;
