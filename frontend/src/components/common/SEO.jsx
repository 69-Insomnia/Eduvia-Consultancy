import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import StructuredData, { SITE_URL, absoluteUrl } from './StructuredData';

const DEFAULT_OG_IMAGE = '/og-image.jpg';
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Per-page metadata.
 *
 * `title` is the page's own title — the brand is appended only when it is not
 * already present, otherwise pages that legitimately include the brand render it
 * twice.
 *
 * `canonical` defaults to this page's own path on SITE_URL, with query and hash
 * dropped so filtered or paginated list URLs consolidate onto the base list URL
 * rather than competing with it as duplicates.
 */
export default function SEO({
  title,
  description,
  keywords,
  image,
  canonical,
  type = 'website',
  robots,
  noindex = false,
  article,
  jsonLd,
}) {
  const { settings } = useSettings();
  const location = useLocation();

  const siteName = settings.siteName || 'Eduvia Consultancy';
  const fullTitle = !title
    ? settings.metaTitle || siteName
    : title.includes(siteName)
      ? title
      : `${title} | ${siteName}`;

  const metaDesc = description || settings.metaDescription || '';
  const ogImage = absoluteUrl(image || settings.seo?.ogImage || DEFAULT_OG_IMAGE);

  const canonicalPath = location.pathname !== '/' ? location.pathname.replace(/\/+$/, '') : '';
  const canonicalUrl = canonical ? absoluteUrl(canonical) : `${SITE_URL}${canonicalPath}`;

  const robotsContent = robots || (noindex ? 'noindex,nofollow' : 'index,follow');
  const isArticle = type === 'article';

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        {metaDesc && <meta name="description" content={metaDesc} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content={robotsContent} />

        {/* Open Graph */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={fullTitle} />
        {metaDesc && <meta property="og:description" content={metaDesc} />}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content={String(OG_WIDTH)} />
        <meta property="og:image:height" content={String(OG_HEIGHT)} />
        <meta property="og:image:alt" content={fullTitle} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="en_US" />

        {/* Article-specific Open Graph, only meaningful on article pages */}
        {isArticle && article?.publishedTime && (
          <meta property="article:published_time" content={article.publishedTime} />
        )}
        {isArticle && article?.modifiedTime && (
          <meta property="article:modified_time" content={article.modifiedTime} />
        )}
        {isArticle && article?.author && <meta property="article:author" content={article.author} />}
        {isArticle && article?.section && <meta property="article:section" content={article.section} />}
        {isArticle &&
          (article?.tags || []).map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        {metaDesc && <meta name="twitter:description" content={metaDesc} />}
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={fullTitle} />
      </Helmet>

      {jsonLd && <StructuredData data={jsonLd} />}
    </>
  );
}
