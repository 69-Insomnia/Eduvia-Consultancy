-- Custom per-entity SEO metadata (extra structured data on top of each
-- record's own `seo` subdocument). Public read so the site can render meta
-- tags and JSON-LD; writes go through the authenticated admin API.
create table if not exists public.seo_meta (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,          -- e.g. 'service'
  entity_id text not null,            -- the service id or slug
  meta_title text,
  meta_description text,
  og_image_url text,
  og_title text,
  og_description text,
  canonical_url text,
  noindex boolean default false,
  json_ld jsonb,
  updated_at timestamptz default now(),
  unique (entity_type, entity_id)
);

alter table public.seo_meta enable row level security;

-- Public can read (so the site can render meta tags)
create policy "Public read seo_meta"
  on public.seo_meta for select
  using (true);

-- Only logged-in users (you, the admin) can write
create policy "Authenticated write seo_meta"
  on public.seo_meta for all
  to authenticated
  using (true)
  with check (true);
