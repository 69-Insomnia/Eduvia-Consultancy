import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db';
import Inquiry from '../models/Inquiry';
import Student from '../models/Student';
import Application from '../models/Application';
import Blog from '../models/Blog';
import University from '../models/University';
import asyncHandler from '../middleware/asyncHandler';

const groupByStatus = async (model, column) => {
  const rows = await sequelize.query(
    `SELECT "${column}" AS "_id", count(*)::int AS "count" FROM "${model.tableName}" GROUP BY "${column}" ORDER BY count DESC`,
    { type: QueryTypes.SELECT }
  );
  return rows;
};

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const totalInquiries = await Inquiry.count();
  const totalStudents = await Student.count();
  const totalApplications = await Application.count();

  // The dashboard tiles read these two keys; without them the tiles rendered a
  // hard 0 regardless of how much content existed.
  const publishedBlogs = await Blog.count({ where: { isPublished: true } });
  const totalUniversities = await University.count({ where: { isActive: true } });
  const draftBlogs = await Blog.count({ where: { isPublished: false } });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newInquiriesThisWeek = await Inquiry.count({
    where: { createdAt: { [Op.gte]: oneWeekAgo } },
  });

  const applicationsByStatus = await groupByStatus(Application, 'status');
  const studentsByStatus = await groupByStatus(Student, 'status');
  const inquiriesByStatus = await groupByStatus(Inquiry, 'status');

  const recentInquiries = await Inquiry.findAll({
    order: [['createdAt', 'DESC']],
    limit: 5,
    attributes: [
      'id',
      'fullName',
      'email',
      'phone',
      'status',
      'preferredCountry',
      'interestedCourse',
      'createdAt',
    ],
  });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const trendRows = await sequelize.query(
    `SELECT extract(year FROM created_at)::int AS year, extract(month FROM created_at)::int AS month, count(*)::int AS count
     FROM "${Inquiry.tableName}"
     WHERE created_at >= :since
     GROUP BY 1, 2
     ORDER BY 1, 2`,
    { type: QueryTypes.SELECT, replacements: { since: sixMonthsAgo.toISOString() } }
  );
  const monthlyInquiryTrend = trendRows.map((row: any) => ({
    _id: { year: row.year, month: row.month },
    count: row.count,
  }));

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
