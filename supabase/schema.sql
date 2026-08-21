create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  description text not null default '',
  live_url text,
  image_url text,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  name text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  kind text not null default 'contact' check (kind in ('contact', 'booking')),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.skills enable row level security;
alter table public.contact_messages enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create policy "Published projects are public" on public.projects for select using (published or public.is_admin());
create policy "Admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "Published services are public" on public.services for select using (published or public.is_admin());
create policy "Admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "Published skills are public" on public.skills for select using (published or public.is_admin());
create policy "Admins manage skills" on public.skills for all using (public.is_admin()) with check (public.is_admin());
create policy "Public settings read" on public.site_settings for select using (true);
create policy "Admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "Users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "Public can submit messages" on public.contact_messages for insert with check (true);
create policy "Admins manage messages" on public.contact_messages for all using (public.is_admin()) with check (public.is_admin());
