import Blog from '../models/Blog.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const getBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, tag, isPublished, featured } = req.query;

  const filter = {};
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
  // The Blog model has no `isFeatured` path; this only ever matched nothing, so
  // it is left alone rather than silently filtering out every result.
  if (featured === 'true' && Blog.schema.paths.isFeatured) filter.isFeatured = true;
  if (category) filter.category = category;
  if (tag) filter.tags = { $in: [tag] };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(setTotal(total).limit)
    .select('-content');

  res.json({ success: true, blogs, pagination: setTotal(total) });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate(
    'relatedPosts',
    'title slug featuredImage excerpt'
  );
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, blog });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('relatedPosts', 'title slug excerpt');
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

  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  // save() rather than findByIdAndUpdate: the pre-save hook regenerates the slug
  // on a title change and stamps publishedAt on publish, both of which
  // findByIdAndUpdate skips.
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    const { _id, ...updates } = req.body;
    Object.assign(blog, updates);
    await blog.save();
  }
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, message: 'Blog deleted successfully' });
});

export const publishBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { isPublished: true, publishedAt: new Date() },
    { new: true }
  );
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, blog });
});

export const unpublishBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { isPublished: false },
    { new: true }
  );
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, blog });
});

export const incrementViews = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }
  res.json({ success: true, views: blog.views });
});
