import Destination from '../models/Destination.js';
import University from '../models/University.js';
import Course from '../models/Course.js';
import Blog from '../models/Blog.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
  }

  const regex = { $regex: q, $options: 'i' };

  const [destinations, universities, courses, blogs] = await Promise.all([
    Destination.find({ isActive: true, $or: [{ name: regex }, { description: regex }] })
      .limit(5)
      .select('name slug shortDescription image flag'),
    University.find({ isActive: true, $or: [{ name: regex }, { country: regex }, { city: regex }] })
      .limit(5)
      .select('name slug country city logo'),
    Course.find({ isActive: true, $or: [{ name: regex }, { category: regex }, { description: regex }] })
      .limit(5)
      .select('name slug category degreeLevel duration'),
    Blog.find({ isPublished: true, $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] })
      .limit(5)
      .select('title slug featuredImage excerpt category'),
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
