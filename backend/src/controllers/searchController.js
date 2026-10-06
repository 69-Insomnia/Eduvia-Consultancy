import { Op } from 'sequelize';
import Destination from '../models/Destination.js';
import University from '../models/University.js';
import Course from '../models/Course.js';
import Blog from '../models/Blog.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { iLike, jsonTextILike } from '../utils/search.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
  }

  const [destinations, universities, courses, blogs] = await Promise.all([
    Destination.findAll({
      where: {
        isActive: true,
        [Op.or]: [{ name: iLike(q) }, { description: iLike(q) }],
      },
      limit: 5,
      attributes: ['id', 'name', 'slug', 'shortDescription', 'image', 'flag'],
    }),
    University.findAll({
      where: {
        isActive: true,
        [Op.or]: [{ name: iLike(q) }, { country: iLike(q) }, { city: iLike(q) }],
      },
      limit: 5,
      attributes: ['id', 'name', 'slug', 'country', 'city', 'logo'],
    }),
    Course.findAll({
      where: {
        isActive: true,
        [Op.or]: [{ name: iLike(q) }, { category: iLike(q) }, { description: iLike(q) }],
      },
      limit: 5,
      attributes: ['id', 'name', 'slug', 'category', 'degreeLevel', 'duration'],
    }),
    Blog.findAll({
      where: {
        isPublished: true,
        [Op.or]: [{ title: iLike(q) }, { excerpt: iLike(q) }, jsonTextILike('tags', q)],
      },
      limit: 5,
      attributes: ['id', 'title', 'slug', 'featuredImage', 'excerpt', 'category'],
    }),
  ]);

  res.json({
    success: true,
    results: {
      destinations,
      universities,
      courses,
      blogs,
      total:
        destinations.length + universities.length + courses.length + blogs.length,
    },
  });
});
