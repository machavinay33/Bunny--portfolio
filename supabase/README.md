# Supabase CMS setup

The portfolio uses Supabase Auth, Postgres, and Row Level Security for the editable CMS. Run `schema.sql` in the Supabase SQL Editor before opening `/admin`.

Create the first admin in **Authentication → Users** with email/password. Copy that user UUID, then run:

```sql
insert into public.profiles (id, display_name, role)
values ('YOUR_AUTH_USER_UUID', 'Bunny', 'admin')
on conflict (id) do update set role = 'admin';
```

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the deployment environment. The browser only receives the anon key; never expose the service-role key. The admin dashboard is available at `/admin` and supports project CRUD, services CRUD, skills CRUD, contact details/about settings, incoming messages, booking requests, message statuses, and dashboard counts.

The public homepage reads published projects, about copy, and contact email from Supabase when rows exist. The public form writes to `contact_messages` with either `contact` or `booking` as its kind. RLS policies allow public inserts only and limit CMS writes and inbox reads to profiles whose role is `admin`.

For Netlify, this repository still contains the original Express/tRPC server scaffold. A frontend-only Netlify build can host the React site, but Supabase Auth and database calls require the site to be served with the Vite client and the configured environment variables. If you need the Express server, OAuth callback, and tRPC fallback on Netlify, convert those routes to Netlify Functions or deploy the full-stack runtime on a Node host.
