# Eduvia Consultancy Pvt. Ltd. — Website

A modern, production-ready education consultancy website for Nepali students who want to study abroad.

## Tech Stack

**One Next.js app (App Router) + the original Express API mounted inside it:**

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS, Framer Motion, Lucide React icons
- React Helmet Async (per-page SEO tags, same behaviour as the old SPA)
- Express.js mounted in-process via `pages/api/[...path].ts` (all `/api/*`
  routes) and a `/sitemap.xml` rewrite — no separate backend process
- PostgreSQL (Supabase) + Sequelize, JWT auth, Cloudinary uploads
- Helmet security headers, rate limiting, CORS

The pages under `app/` are thin wrappers around the converted SPA views in
`views/`; `utils/router.tsx` is a small react-router compatibility layer over
`next/navigation`, so component code stayed virtually unchanged.

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- A Supabase project (PostgreSQL)
- npm

### Installation

```bash
git clone <repo-url>
cd eduvia-consultancy
npm install
cp .env.example .env   # then fill in the values
```

### Scripts

| Command | Does |
|---------|------|
| `npm run dev` | Dev server with hot reload (http://localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` over the whole project |
| `npm run seed` | Seed/refresh the canonical demo content |
| `npm run seed:uk` … `seed:ae` | Country-specific university seeds |
| `npm run backfill:seo` | Regenerate SEO fields for existing content |
| `npm run verify:seo` | Validate the sitemap + SEO invariants |
| `npm run migrate` | Apply models to the DB and regenerate `supabase/migrations/*_init_schema.sql` |
| `npm run e2e` | API + page end-to-end checks against a running server |

### Environment Variables

```bash
cp .env.example .env
# Edit .env with your values
```

Required:

- `SUPABASE_DB_URL` — Supabase Postgres connection string. Use the **Session
  pooler** URI (Project Settings → Database → Connection string → Session
  pooler, port 6543, username `postgres.<project-ref>`); it has IPv4
  addresses. The direct host (`db.<project-ref>.supabase.co`) is IPv6-only and
  fails with `ENOTFOUND` on IPv4-only networks. SSL is configured in
  `server/config/db.ts`, so drop any `?sslmode=` query parameter from the URI.
- `JWT_SECRET` — Secret key for JWT tokens

Optional:

- `CORS_ORIGIN` — comma-separated allowed browser origins (default
  `http://localhost:3000`; unused for same-origin requests)
- `SITE_URL` / `NEXT_PUBLIC_SITE_URL` — canonical origin (default
  `https://eduviaconsultancy.com`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` —
  for admin media uploads

### Database Setup

```bash
npm run seed
```

This creates:

- Default admin: `admin@eduvia.com` / `admin123`
- 12 study destinations, 10 universities, 8 courses, 6 scholarships
- 12 services, 5 team members, 8 FAQs
- 3 testimonials, 3 success stories, 3 blog posts
- Site settings + page SEO rows

### Development

```bash
npm run dev
```

- Site: http://localhost:3000
- API: http://localhost:3000/api (Express, same origin — no CORS in dev)
- Admin Panel: http://localhost:3000/admin/login

### Admin Login

- URL: `/admin/login`
- Email: `admin@eduvia.com`
- Password: `admin123`

## Project Structure

```
eduvia-consultancy/
├── app/                    # Next.js App Router (all public + admin routes)
│   ├── layout.tsx          # Root layout: fonts, static meta/JSON-LD, providers
│   ├── (site)/             # Public routes → render views/* in MainLayout
│   └── admin/              # Admin routes → views/admin/* in AdminLayout
├── pages/
│   ├── api/[...path].ts    # Express app mounted at /api (bodyParser off)
│   └── api/__sitemap.ts    # /sitemap.xml via rewrite in next.config.mjs
├── components/             # Shared React components (common/layout/admin/ui/…)
├── layouts/                # MainLayout + AdminLayout
├── views/                  # Page components (21 public + 19 admin)
├── context/                # Auth / Settings / PageSeo contexts
├── hooks/  utils/  services/  # Hooks, helpers, react-router compat, API client
├── server/                 # Express API (config, models, routes, controllers)
├── scripts/                # seed/migrate/verify/e2e tooling (run with tsx)
├── public/  assets/        # Static files + logo
└── supabase/migrations/    # Generated *_init_schema.sql (supabase db push)
```

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inquiries` | Submit counseling inquiry |
| POST | `/api/contact` | Submit contact message |
| GET | `/api/destinations` | List destinations |
| GET | `/api/destinations/:slug` | Destination detail |
| GET | `/api/universities` | List universities |
| GET | `/api/universities/:slug` | University detail |
| GET | `/api/courses` | List courses |
| GET | `/api/scholarships` | List scholarships |
| GET | `/api/blogs` | List blogs |
| GET | `/api/blogs/:slug` | Blog detail |
| GET | `/api/services` | List services |
| GET | `/api/team` | List team members |
| GET | `/api/testimonials` | List testimonials |
| GET | `/api/success-stories` | List success stories |
| GET | `/api/faqs` | List FAQs |
| GET | `/api/settings` | Site settings |
| GET | `/api/search` | Global search |
| GET | `/sitemap.xml` | Sitemap (Express route behind a rewrite) |

### Admin (Requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/me` | Get current admin |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET/POST/PUT/DELETE | `/api/inquiries` | Inquiry management |
| GET/POST/PUT/DELETE | `/api/students` | Student management |
| GET/POST/PUT/DELETE | `/api/applications` | Application management |
| GET/POST/PUT/DELETE | `/api/universities` | University management |
| GET/POST/PUT/DELETE | `/api/courses` | Course management |
| GET/POST/PUT/DELETE | `/api/destinations` | Destination management |
| GET/POST/PUT/DELETE | `/api/scholarships` | Scholarship management |
| GET/POST/PUT/DELETE | `/api/blogs` | Blog management |
| GET/POST/PUT/DELETE | `/api/services` | Service management |
| GET/POST/PUT/DELETE | `/api/team` | Team management |
| GET/POST/PUT/DELETE | `/api/testimonials` | Testimonial management |
| GET/POST/PUT/DELETE | `/api/success-stories` | Success story management |
| GET/POST/PUT/DELETE | `/api/faqs` | FAQ management |
| POST | `/api/media/upload` | Upload media |
| GET/DELETE | `/api/media` | Media management |
| GET/PUT | `/api/settings` | Site settings |

## Production Build

```bash
npm run build
npm start          # serves http://localhost:3000
npm run e2e        # optional end-to-end verification
```

## Deployment (Vercel) — eduviaconsultancy.com

One deployment: Vercel detects Next.js at the repo root — no config files,
no second service. The Express API runs inside the same serverless functions
as the pages, talking to Supabase through the IPv4 Session pooler.

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com): **Add New → Project** → import the repo.
   Root Directory: repo root (default); framework preset **Next.js** (auto).
3. Set environment variables: `SUPABASE_DB_URL`, `JWT_SECRET` (Production and
   Preview), optionally `CORS_ORIGIN`, `SITE_URL`, `NEXT_PUBLIC_SITE_URL`,
   `SITE_URL` and the Cloudinary keys.
4. Deploy; verify the preview URL loads.

### Custom domain DNS
Add these records at your domain registrar for `eduviaconsultancy.com`:

| Type    | Name | Value                  | Purpose                  |
|---------|------|------------------------|--------------------------|
| A       | `@`  | `76.76.21.21`          | apex → Vercel            |
| CNAME   | `www`| `cname.vercel-dns.com` | www → Vercel             |

Then in Vercel → Project → **Settings → Domains**, add `eduviaconsultancy.com`
and `www.eduviaconsultancy.com`, and set the apex as canonical (Vercel
auto-redirects www → apex).

### Verify
- `https://eduviaconsultancy.com/` loads and lists real data
- `https://eduviaconsultancy.com/api/blogs` returns JSON
- `https://eduviaconsultancy.com/sitemap.xml` returns XML
- Admin login at `/admin/login` (`admin@eduvia.com` / `admin123` — change after launch)
- Inquiry/contact forms write to the Supabase dashboard (Table Editor)

Notes:
- **Serverless + Express:** `/api/*` and `/sitemap.xml` are handled in the
  Node.js runtime; `bodyParser` is disabled on the Next side so Express
  (including multer uploads) parses bodies itself. Uploads are limited by the
  function payload limit — Cloudinary uploads stay well under it.
- **Image uploads:** add the three `CLOUDINARY_*` variables if you use admin
  media uploads (optional).

### Database (Supabase)
1. Create a project at supabase.com
2. Copy the **Session pooler** URI (Project Settings → Database → Connection string → Session pooler: port 6543, username `postgres.<project-ref>`) into `SUPABASE_DB_URL`. Prefer the pooler over the direct `db.<project-ref>.supabase.co` host, which is IPv6-only and unreachable from IPv4-only machines.
3. Apply the schema: `npm run migrate` (also regenerates `supabase/migrations/*_init_schema.sql`)
4. Seed sample data: `npm run seed`
5. Optional, for managing migrations with the Supabase CLI:
   `supabase login`, `supabase link --project-ref <project-ref>`, `supabase db push`

## Features

- [x] Responsive design (mobile-first)
- [x] SEO optimized (meta tags, Open Graph, structured data, sitemap)
- [x] Admin dashboard with CMS
- [x] Inquiry management system
- [x] University/course discovery
- [x] Destination pages with detailed info
- [x] Scholarship directory
- [x] Blog system
- [x] Test preparation pages
- [x] Student visa guides
- [x] Success stories
- [x] Team management
- [x] FAQ system
- [x] Media management
- [x] Site settings CMS
- [x] Contact form
- [x] Counseling form
- [x] WhatsApp/Call floating buttons
- [x] Mobile bottom CTA
- [x] Back to top button
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] JWT authentication
- [x] Role-based access control
- [x] Rate limiting
- [x] Security headers (Helmet)
- [x] CORS configuration

## Placeholder Content

The seed data contains realistic placeholder content for development. Replace with actual:

- Company contact details
- Team member information
- Student success stories
- Blog articles
- University partnerships
- Scholarship information
- Images and media

**Do not claim:**
- Fake visa approval rates
- Invented university partnerships
- Fabricated student statistics

## License

Copyright © 2026 Eduvia Consultancy Pvt. Ltd. All rights reserved.
