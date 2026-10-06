import Inquiry from '../models/Inquiry.js';
import Student from '../models/Student.js';
import Application from '../models/Application.js';
import Blog from '../models/Blog.js';
import University from '../models/University.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const totalInquiries = await Inquiry.countDocuments();
  const totalStudents = await Student.countDocuments();
  const totalApplications = await Application.countDocuments();

  // The dashboard tiles read these two keys; without them the tiles rendered a
  // hard 0 regardless of how much content existed.
  const publishedBlogs = await Blog.countDocuments({ isPublished: true });
  const totalUniversities = await University.countDocuments({ isActive: true });
  const draftBlogs = await Blog.countDocuments({ isPublished: false });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newInquiriesThisWeek = await Inquiry.countDocuments({ createdAt: { $gte: oneWeekAgo } });

  const applicationsByStatus = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const studentsByStatus = await Student.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const inquiriesByStatus = await Inquiry.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const recentInquiries = await Inquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('fullName email phone status preferredCountry interestedCourse createdAt');

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyInquiryTrend = await Inquiry.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalInquiries,
      totalStudents,
      totalApplications,
      newInquiriesThisWeek,
      applicationsByStatus,
      studentsByStatus,
      inquiriesByStatus,
      recentInquiries,
      monthlyInquiryTrend,
      publishedBlogs,
      totalUniversities,
      draftBlogs,
    },
  });
});
