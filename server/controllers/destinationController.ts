import { Op } from 'sequelize';
import Destination from '../models/Destination';
import Blog from '../models/Blog';
import asyncHandler from '../middleware/asyncHandler';
import paginate from '../utils/pagination';
import { iLike } from '../utils/search';
import { cleanBody } from '../utils/shape';
import { purgePaths } from '../utils/revalidate';

// The destination detail page, its visa guide and the listing are prerendered
// from this record (metadata server-side); purge all three on write.
const destinationPaths = (slug?: string) => [
  '/study-in',
  slug ? `/study-in/${slug}` : null,
  slug ? `/student-visa/${slug}` : null,
];

const RELATED_SHORT = ['id', 'title', 'slug', 'featuredImage', 'excerpt'];

const relatedBlogsInclude = (attributes) => ({
  model: Blog,
  as: 'relatedBlogs',
  attributes,
  through: { attributes: [] },
});

// Mongoose cast body relations (raw id, populated doc or `''`) to an ObjectId; unwrap them to the id here.
const refId = (v) => (v && typeof v === 'object' ? v._id ?? v.id ?? null : v === '' ? null : v);
const refIds = (v) => (v == null ? [] : (Array.isArray(v) ? v : [v]).map(refId));

export const getDestinations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (search) {
    filter[Op.or] = [
      { name: iLike(search) },
      { description: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Destination.count({ where: filter });
  const destinations = await Destination.findAll({
    where: filter,
    order: [
      ['isFeatured', 'DESC'],
      ['name', 'ASC'],
    ],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, destinations, pagination: setTotal(total) });
});

export const getFeaturedDestinations = asyncHandler(async (_req, res) => {
  const destinations = await Destination.findAll({
    where: { isFeatured: true, isActive: true },
    order: [['name', 'ASC']],
    limit: 12,
  });
  res.json({ success: true, destinations });
});

export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [relatedBlogsInclude(RELATED_SHORT)],
  });
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, destination });
});

export const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findByPk(req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, destination });
});

export const createDestination = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Destination name is required' });
  }

  const existing = await Destination.findOne({ where: { name } });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Destination with this name already exists' });
  }

  const { relatedBlogs, ...data } = cleanBody(req.body) as any;
  let destination = await Destination.create(data);
  if (relatedBlogs !== undefined) {
    await destination.setRelatedBlogs(refIds(relatedBlogs));
  }
  destination = await Destination.findByPk(destination.id, {
    include: [relatedBlogsInclude(RELATED_SHORT)],
  });
  await purgePaths(res, destinationPaths(destination.slug));
  res.status(201).json({ success: true, destination });
});

export const updateDestination = asyncHandler(async (req, res) => {
  // save() rather than update(): the beforeUpdate hook regenerates the slug
  // when the name changes, and a bulk update skips hooks entirely.
  const destination = await Destination.findByPk(req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  const { relatedBlogs, ...updates } = cleanBody(req.body) as any;
  destination.set(updates);
  await destination.save();
  if (relatedBlogs !== undefined) {
    await destination.setRelatedBlogs(refIds(relatedBlogs));
  }
  const reloaded = await Destination.findByPk(destination.id, {
    include: [relatedBlogsInclude(RELATED_SHORT)],
  });
  await purgePaths(res, destinationPaths(reloaded?.slug));
  res.json({ success: true, destination: reloaded });
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByPk(req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  await destination.destroy();
  await purgePaths(res, destinationPaths(destination.slug));
  res.json({ success: true, message: 'Destination deleted successfully' });
});
