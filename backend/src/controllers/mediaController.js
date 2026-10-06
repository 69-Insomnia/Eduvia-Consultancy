import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import Media from '../models/Media.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'video/mp4'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  },
});

export const uploadMiddleware = upload.single('file');

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const folder = req.body.folder || 'general';
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: `eduvia/${folder}`,
    resource_type: 'auto',
  });

  const media = await Media.create({
    filename: result.public_id,
    originalName: req.file.originalname,
    url: result.secure_url,
    thumbnailUrl: result.eager?.[0]?.secure_url || '',
    mimetype: req.file.mimetype,
    size: req.file.size,
    folder,
    uploadedById: req.admin.id,
  });

  res.status(201).json({ success: true, media });
});

export const getMedia = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, folder } = req.query;

  const filter = {};
  if (folder) filter.folder = folder;

  const { skip, setTotal } = paginate(page, limit);
  const total = await Media.count({ where: filter });
  const media = await Media.findAll({
    where: filter,
    order: [['createdAt', 'DESC NULLS LAST']],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, media, pagination: setTotal(total) });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByPk(req.params.id);
  if (!media) {
    return res.status(404).json({ success: false, message: 'Media not found' });
  }

  try {
    await cloudinary.uploader.destroy(media.filename);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }

  await media.destroy();
  res.json({ success: true, message: 'Media deleted successfully' });
});
