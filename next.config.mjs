/** @type {import('next').NextConfig} */

// `next dev` and `next build`/`next start` must not share a build directory:
// dev writes its own React server bindings into `<distDir>/server/chunks`, and
// `next start` then loads them with the production bindings and crashes SSR
// with "Expected to use Webpack bindings ... referencing the Turbopack
// bindings". So the dev server gets its own directory.
//
// The command name is only on the CLI process's argv — the worker that
// actually writes the chunks (`start-server.js`) is spawned without it — so
// fall back to NODE_ENV, which Next sets from the command before config loads
// and which the worker inherits.
const nextCommand = ['dev', 'start', 'build'].find((cmd) => process.argv.includes(cmd));
const isDevCommand = nextCommand ? nextCommand === 'dev' : process.env.NODE_ENV !== 'production';

const nextConfig = {
  reactStrictMode: true,
  distDir: isDevCommand ? '.next-dev' : '.next',
  // Sequelize loads database dialects dynamically. Keep its driver outside
  // webpack bundles so Next server workers and Vercel's Node runtime can load pg.
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'pg'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Card covers fall back to stock photography on Unsplash
    // (SITE_IMAGES in utils/imageAssets.ts), and admin uploads land in
    // Cloudinary or Supabase Storage. next/image rejects any remote host that is
    // not listed here, so an unlisted fallback would render as a 400.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    // AVIF is typically ~20-30% smaller than WebP; Next serves whichever the
    // browser's Accept header supports and falls back automatically.
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/__sitemap',
        },
      ],
    };
  },
};

export default nextConfig;
