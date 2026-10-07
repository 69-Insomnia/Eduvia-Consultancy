import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import View from '../../../../views/BlogDetail';
import Blog from '../../../../server/models/Blog';
import { getEntityMetadata } from '../../../../server/services/pageMetadata';

// One cached read per slug: the view fetches the same post client-side, so this
// would otherwise double the queries a detail page costs.
const loadBlog = unstable_cache(
  async (slug: string) => {
    const row: any = await Blog.findOne({
      where: { slug, isPublished: true },
      attributes: [
        'title',
        'slug',
        'excerpt',
        'seo',
        'tags',
        'category',
        'author',
        'featuredImage',
        'publishedAt',
        'updatedAt',
      ],
    });
    if (!row) return null;
    return {
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      seo: row.seo,
      tags: Array.isArray(row.tags) ? row.tags : [],
      category: row.category,
      author: row.author,
      featuredImage: row.featuredImage,
      publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
      updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
    };
  },
  ['blog-page-metadata'],
  { revalidate: 300 }
);

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Only a missing post 404s — a database error keeps the page alive rather
  // than turning every detail URL into a hard 404.
  let blog: any = null;
  try {
    blog = await loadBlog(params.slug);
  } catch {
    return {};
  }
  if (!blog) notFound();

  return getEntityMetadata({
    path: `/blogs/${blog.slug}`,
    seo: blog.seo,
    fallback: {
      title: blog.title,
      description: blog.excerpt || undefined,
      keywords: blog.tags.length ? blog.tags : undefined,
    },
    type: 'article',
    article: {
      publishedTime: blog.publishedAt || undefined,
      modifiedTime: blog.updatedAt || undefined,
      authors: blog.author ? [blog.author] : undefined,
      section: blog.category || undefined,
      tags: blog.tags.length ? blog.tags : undefined,
    },
  });
}

export default async function Page({ params }: { params: { slug: string } }) {
  // `notFound()` here (not just in the metadata) is what sets the 404 status
  // code — metadata alone renders the not-found page with a 200.
  try {
    if (!(await loadBlog(params.slug))) notFound();
  } catch {
    // Database unavailable: render anyway and let the view retry client-side.
  }
  return <View />;
}
