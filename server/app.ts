import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import studentRoutes from './routes/studentRoutes';
import applicationRoutes from './routes/applicationRoutes';
import universityRoutes from './routes/universityRoutes';
import courseRoutes from './routes/courseRoutes';
import destinationRoutes from './routes/destinationRoutes';
import scholarshipRoutes from './routes/scholarshipRoutes';
import blogRoutes from './routes/blogRoutes';
import serviceRoutes from './routes/serviceRoutes';
import teamRoutes from './routes/teamRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import successStoryRoutes from './routes/successStoryRoutes';
import faqRoutes from './routes/faqRoutes';
import contactRoutes from './routes/contactRoutes';
import mediaRoutes from './routes/mediaRoutes';
import settingsRoutes from './routes/settingsRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import searchRoutes from './routes/searchRoutes';
import seoRoutes from './routes/seoRoutes';
import pageSeoRoutes from './routes/pageSeoRoutes';

const app = express();

// Behind the Vercel edge, one trusted hop keeps req.ip (and therefore the
// rate limiter) on the real client instead of a shared proxy IP.
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Eduvia API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/page-seo', pageSeoRoutes);

// Root-level so /sitemap.xml is reachable without the /api prefix and without
// the rate limiter above. Must be registered before the catch-all below.
app.use('/', seoRoutes);

app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
