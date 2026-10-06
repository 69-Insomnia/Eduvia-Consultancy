# Eduvia Consultancy Pvt. Ltd. — Website

A modern, production-ready education consultancy website for Nepali students who want to study abroad.

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Framer Motion
- Lucide React icons
- Axios
- React Helmet Async (SEO)
- React Hot Toast (notifications)

**Backend:**
- Node.js + Express.js
- PostgreSQL (Supabase) + Sequelize
- JWT Authentication
- Cloudinary (image uploads)
- Helmet (security)
- Rate Limiting

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (PostgreSQL)
- npm or yarn

### Installation

The repository root is an npm project that delegates to `backend/` and `frontend/`, so you can
install and run everything without changing directories.

```bash
# Clone the repository
git clone <repo-url>
cd eduvia-consultancy

# Install root + backend + frontend dependencies in one step
npm run setup
```

Run only the sub-project installs:

```bash
npm run install:all
```

### Root scripts

| Command | Does |
|---------|------|
| `npm run setup` | Install root, backend and frontend dependencies |
| `npm run dev` | Run backend and frontend together (labelled `backend` / `frontend`) |
| `npm run dev:backend` | Backend only (nodemon) |
| `npm run dev:frontend` | Frontend only (Vite) |
| `npm run build` | Production build of the frontend into `frontend/dist` |
| `npm run preview` | Serve the production build locally |
| `npm run seed` | Seed the database |
| `npm start` | Start the backend without nodemon |
| `npm run lint` | Lint backend and frontend |

Every script is a thin wrapper around `npm --prefix <dir> run ...`, so the per-directory
commands below still work exactly as before.

### Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

Required variables:
- `SUPABASE_DB_URL` — Supabase Postgres connection string. Use the **Session pooler** URI (Project Settings → Database → Connection string → Session pooler, port 6543, username `postgres.<project-ref>`); it has IPv4 addresses. The direct host (`db.<project-ref>.supabase.co`) is IPv6-only and fails with `ENOTFOUND` on IPv4-only networks. SSL is configured in `config/db.js`, so drop any `?sslmode=` query parameter from the URI.
- `JWT_SECRET` — Secret key for JWT tokens
- `CORS_ORIGIN` — Frontend URL (http://localhost:5173)

Optional:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — For image uploads

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
```

### Database Setup

```bash
# Seed the database with sample data
cd backend
npm run seed
```

This creates:
- Default admin: `admin@eduvia.com` / `admin123`
- 12 study destinations
- 10 universities
- 8 courses
- 6 scholarships
- 12 services
- 5 team members
- 8 FAQs
- 3 testimonials
- 3 success stories
- 3 blog posts
- Site settings

### Development

From the repository root, start both servers at once:

```bash
npm run dev
```

Or run them in separate terminals:

```bash
# Terminal 1 — backend
npm run dev:backend

# Terminal 2 — frontend
npm run dev:frontend
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
Admin Panel: http://localhost:5173/admin

### Admin Login

- URL: `/admin/login`
- Email: `admin@eduvia.com`
- Password: `admin123`

## Project Structure

```
eduvia-consultancy/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── seeds/          # Database seeder
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Reusable components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── sections/   # Page sections
│   │   │   └── ui/         # UI primitives
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin dashboard
│   │   ├── services/       # API service
│   │   ├── utils/          # Helpers & constants
│   │   ├── App.jsx         # Router setup
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
└── README.md
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
# Build frontend
cd frontend
npm run build

# The build output is in frontend/dist/
# Serve with nginx or deploy to Vercel
```

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables

### Backend (Render/Railway)
1. Push to GitHub
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Database (Supabase)
1. Create a project at supabase.com
2. Copy the **Session pooler** URI (Project Settings → Database → Connection string → Session pooler: port 6543, username `postgres.<project-ref>`) into `SUPABASE_DB_URL`. Prefer the pooler over the direct `db.<project-ref>.supabase.co` host, which is IPv6-only and unreachable from IPv4-only machines.
3. Apply the schema: `node backend/scripts/migrate.js` (also writes `supabase/migrations/*_init_schema.sql`)
4. Seed sample data: `npm run seed`
5. Optional, for managing migrations with the Supabase CLI:
   `supabase login`, `supabase link --project-ref <project-ref>`, `supabase db push`

## Features

- [x] Responsive design (mobile-first)
- [x] SEO optimized (meta tags, Open Graph, structured data)
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
