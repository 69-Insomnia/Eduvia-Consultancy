import { Op } from 'sequelize';
import { sequelize } from '../config/db';
import Blog from '../models/Blog';
import asyncHandler from '../middleware/asyncHandler';
import paginate from '../utils/pagination';
import { iLike, jsonTextILike } from '../utils/search';
import { cleanBody } from '../utils/shape';
import { purgePaths } from '../utils/revalidate';

// Blog detail and listing pages carry this record's metadata server-side.
const blogPaths = (slug?: string) => ['/blogs', slug ? `/blogs/${slug}` : null];

const RELATED_SHORT = ['id', 'title', 'slug', 'featuredImage', 'excerpt'];
const RELATED_SHORTER = ['id', 'title', 'slug', 'excerpt'];

const relatedInclude = (attributes) => ({
  model: Blog,
  as: 'relatedPosts',
  attributes,
  through: { attributes: [] },
});

export const getBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, tag, isPublished, featured } = req.query;

  const filter: any = {};
  // Anonymous callers only ever see published posts. An authenticated admin may
  // additionally filter by status, or pass `isPublished=all` to include drafts —
  // which is what the admin list does, since drafts were previously invisible
  // there and therefore impossible to edit or publish.
  if (req.admin) {
    if (isPublished !== undefined && isPublished !== 'all') {
      filter.isPublished = isPublished === 'true';
    }
  } else {
    filter.isPublished = true;
  }
  // The Blog model has no `isFeatured` attribute; this only ever matched nothing, so
  // it is left alone rather than silently filtering out every result.
  if (featured === 'true' && Blog.rawAttributes.isFeatured) filter.isFeatured = true;
  if (category) filter.category = category;
  if (tag) filter.tags = { [Op.contains]: [tag] };
  if (search) {
    filter[Op.or] = [
      { title: iLike(search) },
      { excerpt: iLike(search) },
      jsonTextILike('tags', search),
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Blog.count({ where: filter });
  const blogs = await Blog.findAll({
    where: filter,
    order: [
      ['publishedAt', 'DESC NULLS LAST'],
      ['createdAt', 'DESC NULLS LAST'],
    ],
    offset: skip,
    limit: setTotal(total).limit,
    attributes: { exclude: ['content'] },
  });

  res.json({ success: true, blogs, pagination: setTotal(total) });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    where: { slug: req.params.slug, isPublished: true },
    include: [relatedInclude(RELATED_SHORT)],
  });
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, blog });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    include: [relatedInclude(RELATED_SHORTER)],
  });
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, blog });
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const { relatedPosts, ...data } = cleanBody(req.body) as any;
  let blog = await Blog.create(data);
  if (relatedPosts !== undefined) {
    await blog.setRelatedPosts(relatedPosts || []);
    blog = await Blog.findByPk(blog.id, { include: [relatedInclude(RELATED_SHORTER)] });
  }
  await purgePaths(res, blogPaths(blog.slug));
  res.status(201).json({ success: true, blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  // save() rather than update(): the beforeUpdate hook regenerates the slug
  // on a title change and stamps publishedAt on publish, both of which
  // a bulk update skips.
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  const { relatedPosts, ...updates } = cleanBody(req.body) as any;
  blog.set(updates);
  await blog.save();
  if (relatedPosts !== undefined) {
    await blog.setRelatedPosts(relatedPosts || []);
  }
  const reloaded = await Blog.findByPk(blog.id, { include: [relatedInclude(RELATED_SHORTER)] });
  await purgePaths(res, blogPaths(reloaded?.slug));
  res.json({ success: true, blog: reloaded });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  await blog.destroy();
  await purgePaths(res, blogPaths(blog.slug));
  res.json({ success: true, message: 'Blog deleted successfully' });
});

export const publishBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  blog.isPublished = true;
  blog.publishedAt = new Date();
  await blog.save();
  await purgePaths(res, blogPaths(blog.slug));
  res.json({ success: true, blog });
});

export const unpublishBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  blog.isPublished = false;
  await blog.save();
  await purgePaths(res, blogPaths(blog.slug));
  res.json({ success: true, blog });
});

export const incrementViews = asyncHandler(async (req, res) => {
  const [count] = await Blog.update(
    { views: sequelize.literal('views + 1') },
    { where: { slug: req.params.slug, isPublished: true } }
  );
  if (!count) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  const blog = await Blog.findOne({
    where: { slug: req.params.slug, isPublished: true },
    attributes: ['id', 'views'],
  });
  res.json({ success: true, views: blog.views });
});
