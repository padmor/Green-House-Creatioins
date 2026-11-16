-- Green-Building Creations Ltd. — database schema
-- Run in the Supabase SQL editor (or `supabase db push`). Safe to re-run.

create extension if not exists "pgcrypto";

-- ───────────── Enums ─────────────
do $$ begin
  create type staff_role as enum ('admin', 'manager', 'staff', 'editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enquiry_status as enum
    ('new', 'contacted', 'consultation', 'proposal', 'won', 'lost');
exception when duplicate_object then null; end $$;

do $$ begin
  create type note_kind as enum ('note', 'call', 'email', 'meeting', 'status_change', 'assignment');
exception when duplicate_object then null; end $$;

-- ───────────── Staff profiles ─────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role staff_role not null default 'staff',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- First user to sign up becomes admin; everyone else starts inactive 'staff'
-- until an admin activates them.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare first_user boolean;
begin
  select not exists (select 1 from profiles) into first_user;
  insert into profiles (id, full_name, email, role, active)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', ''),
          coalesce(new.email, ''),
          case when first_user then 'admin'::staff_role else 'staff'::staff_role end,
          first_user);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Helper functions used by RLS (security definer avoids recursive policies)
create or replace function current_role_name() returns staff_role
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid() and active
$$;

create or replace function is_role(variadic roles staff_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(current_role_name() = any(roles), false)
$$;

-- ───────────── Enquiries ─────────────
create sequence if not exists enquiry_ref_seq start 1001;

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique
    default ('GBC-' || to_char(now(), 'YY') || '-' || nextval('enquiry_ref_seq')),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) between 6 and 30),
  organisation text,
  service text not null,
  project_type text not null,
  location text not null,
  budget_range text,
  timeline text,
  message text not null check (char_length(message) between 10 and 4000),
  consent boolean not null check (consent),
  status enquiry_status not null default 'new',
  assigned_to uuid references profiles(id) on delete set null,
  follow_up_at date,
  lost_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists enquiries_status_idx on enquiries(status);
create index if not exists enquiries_assigned_idx on enquiries(assigned_to);
create index if not exists enquiries_followup_idx on enquiries(follow_up_at);

create table if not exists enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references enquiries(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  kind note_kind not null default 'note',
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists enquiry_notes_enquiry_idx on enquiry_notes(enquiry_id, created_at desc);

create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists enquiries_touch on enquiries;
create trigger enquiries_touch before update on enquiries
  for each row execute function touch_updated_at();

-- ───────────── Portfolio ─────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  category text not null,
  location text not null,
  year int,
  summary text not null,
  body text not null default '',
  client text,
  scope text,
  image_urls text[] not null default '{}',
  is_placeholder boolean not null default true,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Map coordinates (optional; projects with both appear on the interactive map)
alter table projects add column if not exists latitude double precision;
alter table projects add column if not exists longitude double precision;

-- The homepage "Get in touch" form does not ask for a phone number.
alter table enquiries alter column phone drop not null;

drop trigger if exists projects_touch on projects;
create trigger projects_touch before update on projects
  for each row execute function touch_updated_at();

-- ───────────── Editable site content ─────────────
create table if not exists site_content (
  key text primary key,
  value text not null,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ───────────── People (public founder & team profiles) ─────────────
-- Separate from `profiles` (dashboard accounts): not every person shown publicly has a login.
create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  role_title text not null check (char_length(role_title) between 2 and 120),
  bio text not null default '' check (char_length(bio) <= 1500),
  photo_url text check (photo_url is null or photo_url ~ '^(https://|/)\S+$'),
  is_founder boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- At most one founder feature.
create unique index if not exists people_one_founder on people ((true)) where is_founder;
create index if not exists people_order_idx on people(sort_order, created_at);

-- Rank (seniority group used to organise the About page) and an optional public LinkedIn profile.
alter table people add column if not exists rank text not null default 'Staff'
  check (rank in ('Leadership', 'Management', 'Senior staff', 'Staff', 'Trainee / intern'));
alter table people add column if not exists linkedin_url text
  check (linkedin_url is null or linkedin_url ~ '^https://([a-z]{2,3}\.)?linkedin\.com/\S+$');

-- Full profile: qualifications, duties and contributions (one item per line) and public handles.
alter table people add column if not exists qualifications text not null default '' check (char_length(qualifications) <= 1500);
alter table people add column if not exists responsibilities text not null default '' check (char_length(responsibilities) <= 1500);
alter table people add column if not exists contributions text not null default '' check (char_length(contributions) <= 1500);
alter table people add column if not exists x_url text check (x_url is null or x_url ~ '^https://(www\.)?(x|twitter)\.com/\S+$');
alter table people add column if not exists instagram_url text check (instagram_url is null or instagram_url ~ '^https://(www\.)?instagram\.com/\S+$');
alter table people add column if not exists facebook_url text check (facebook_url is null or facebook_url ~ '^https://(www\.|m\.)?facebook\.com/\S+$');
alter table people add column if not exists public_email text check (public_email is null or public_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

drop trigger if exists people_touch on people;
create trigger people_touch before update on people
  for each row execute function touch_updated_at();

-- ───────────── Project ratings (website visitors) ─────────────
-- One rating per visitor per project: voter_hash is a salted one-way hash of the visitor's
-- connection details (the IP address itself is never stored). Re-rating replaces the old rating.
-- Written only by the server (service role); there is deliberately no anon insert policy.
create table if not exists project_ratings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  voter_hash text not null check (char_length(voter_hash) = 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, voter_hash)
);
create index if not exists project_ratings_project_idx on project_ratings(project_id);
drop trigger if exists project_ratings_touch on project_ratings;
create trigger project_ratings_touch before update on project_ratings
  for each row execute function touch_updated_at();

-- Public, aggregate-only view of ratings for published projects (no individual rows exposed).
create or replace function project_rating_summary()
returns table (slug text, average numeric, total bigint)
language sql stable security definer set search_path = public as $$
  select p.slug, round(avg(r.rating)::numeric, 1), count(*)
  from project_ratings r join projects p on p.id = r.project_id
  where p.published
  group by p.slug
$$;
grant execute on function project_rating_summary() to anon, authenticated;

-- ───────────── Row-level security ─────────────
alter table project_ratings enable row level security;
alter table people enable row level security;
alter table profiles enable row level security;
alter table enquiries enable row level security;
alter table enquiry_notes enable row level security;
alter table projects enable row level security;
alter table site_content enable row level security;

-- profiles: staff see colleagues (for assignment); only admins change roles.
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select
  using (auth.uid() = id or is_role('admin','manager','staff','editor'));
drop policy if exists profiles_admin_write on profiles;
create policy profiles_admin_write on profiles for update
  using (is_role('admin')) with check (is_role('admin'));

-- enquiries: public INSERT happens only through the server (service role),
-- so there is deliberately no anon insert policy.
drop policy if exists enquiries_read on enquiries;
create policy enquiries_read on enquiries for select using (
  is_role('admin','manager')
  or (is_role('staff') and assigned_to = auth.uid())
);
drop policy if exists enquiries_update on enquiries;
create policy enquiries_update on enquiries for update using (
  is_role('admin','manager')
  or (is_role('staff') and assigned_to = auth.uid())
);

drop policy if exists notes_read on enquiry_notes;
create policy notes_read on enquiry_notes for select using (
  exists (select 1 from enquiries e where e.id = enquiry_id)  -- inherits enquiry RLS
);
drop policy if exists notes_insert on enquiry_notes;
create policy notes_insert on enquiry_notes for insert with check (
  author_id = auth.uid()
  and exists (select 1 from enquiries e where e.id = enquiry_id)
);

-- projects: public reads published rows; admin/manager/editor manage.
drop policy if exists projects_public_read on projects;
create policy projects_public_read on projects for select
  using (published or is_role('admin','manager','editor'));
drop policy if exists projects_write on projects;
create policy projects_write on projects for all
  using (is_role('admin','manager','editor'))
  with check (is_role('admin','manager','editor'));

-- project_ratings: staff can review and clear ratings (e.g. spam); the public only sees the summary function.
drop policy if exists ratings_staff_read on project_ratings;
create policy ratings_staff_read on project_ratings for select
  using (is_role('admin','manager','editor'));
drop policy if exists ratings_staff_delete on project_ratings;
create policy ratings_staff_delete on project_ratings for delete
  using (is_role('admin','manager','editor'));

-- people: public reads published profiles; admin/manager/editor manage.
drop policy if exists people_public_read on people;
create policy people_public_read on people for select
  using (published or is_role('admin','manager','editor'));
drop policy if exists people_write on people;
create policy people_write on people for all
  using (is_role('admin','manager','editor'))
  with check (is_role('admin','manager','editor'));

-- site_content: public read, privileged write.
drop policy if exists content_read on site_content;
create policy content_read on site_content for select using (true);
drop policy if exists content_write on site_content;
create policy content_write on site_content for all
  using (is_role('admin','manager','editor'))
  with check (is_role('admin','manager','editor'));


-- ───────────── Tradespeople / jobsite directory ─────────────
-- For an existing Supabase database, run supabase/jobsite.sql.

create table if not exists public.tradespeople (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  public_name text not null check (char_length(trim(public_name)) between 2 and 80),
  phone text not null check (char_length(trim(phone)) between 7 and 30),
  email text not null check (char_length(trim(email)) between 5 and 254),
  trade text not null check (trade in ('Tiler', 'Electrician', 'Plumber', 'Carpenter', 'Mason')),
  service_area text not null check (char_length(trim(service_area)) between 2 and 160),
  experience_years smallint not null default 0 check (experience_years between 0 and 60),
  bio text not null default '' check (char_length(bio) <= 1200),
  qualification_type text not null check (char_length(trim(qualification_type)) between 2 and 120),
  qualification_details text not null default '' check (char_length(qualification_details) <= 1000),
  qualification_reference text not null default '' check (char_length(qualification_reference) <= 160),
  cewp_reference text not null default '' check (char_length(cewp_reference) <= 160),
  portfolio_url text check (portfolio_url is null or portfolio_url ~ '^https://[^[:space:]]+),
  consent boolean not null default false check (consent),
  identity_checked boolean not null default false,
  qualification_checked boolean not null default false,
  references_checked boolean not null default false,
  practical_assessment boolean not null default false,
  cewp_verified boolean not null default false,
  application_status text not null default 'pending'
    check (application_status in ('pending', 'verified', 'rejected')),
  published boolean not null default false,
  verification_notes text not null default '' check (char_length(verification_notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    not published or (
      application_status = 'verified'
      and identity_checked
      and qualification_checked
      and references_checked
      and practical_assessment
      and (trade <> 'Electrician' or (cewp_verified and char_length(trim(cewp_reference)) > 0))
    )
  ),
  check (not cewp_verified or trade = 'Electrician')
);

create index if not exists tradespeople_review_idx
  on public.tradespeople(application_status, created_at desc);
create index if not exists tradespeople_public_directory_idx
  on public.tradespeople(trade, published, created_at desc);

create or replace function public.touch_tradespeople_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists tradespeople_touch on public.tradespeople;
create trigger tradespeople_touch before update on public.tradespeople
  for each row execute function public.touch_tradespeople_updated_at();

alter table public.tradespeople enable row level security;
-- All application details and verification notes are private.
-- Public reads go through the narrow RPC below; only server-side service-role code
-- creates applications or changes review decisions after checking staff permissions.
revoke all on table public.tradespeople from anon, authenticated;
grant all on table public.tradespeople to service_role;

create or replace function public.get_verified_tradespeople()
returns table (
  id uuid,
  public_name text,
  trade text,
  service_area text,
  experience_years integer,
  bio text,
  portfolio_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id,
    t.public_name,
    t.trade,
    t.service_area,
    t.experience_years::integer,
    t.bio,
    t.portfolio_url
  from public.tradespeople t
  where t.application_status = 'verified'
    and t.published = true
  order by t.trade, t.created_at desc
$$;

revoke all on function public.get_verified_tradespeople() from public;
grant execute on function public.get_verified_tradespeople() to anon, authenticated;

-- Replace the old building-company copy that may already be stored in site_content.
insert into public.site_content (key, value)
values
  ('home.hero.eyebrow', 'Your job. The right professional.'),
  ('home.hero.title', 'Find the right hands for the job.'),
  ('home.hero.subtitle', 'Find tilers, electricians, plumbers, carpenters and masons. Post a job, get connected with a suitable professional and keep track of the work.'),
  ('home.about.title', 'Skilled trades. Clear requests. Better job connections.'),
  ('home.intro', 'Green-Building Creations Ltd. is developing a job-matching service that helps customers find skilled tradespeople and helps professionals access genuine work. Profiles are published as verified only after the required checks have been completed.'),
  ('home.locations', 'GBC is based in Cape Coast. Job requests can be submitted with the work location, and availability is confirmed with the customer before a professional is matched.'),
  ('home.careers', 'Are you a tiler, electrician, plumber, carpenter or mason? Apply to join the network. Your profile will be reviewed before it can appear as verified.'),
  ('about.story', 'Green-Building Creations Ltd. (GBC) is based in Cape Coast, Ghana. We are shifting the website from a building portfolio into a job-matching service for customers who need skilled trade work and professionals looking for genuine jobs. Customers can post a job request, share the location and requirements, and receive follow-up from the GBC team. Tradespeople apply to join the network and are reviewed before a verified profile is published.'),
  ('sustainability.intro', 'A dependable job site begins with clear scopes, safe work practices and transparent expectations. We review trade evidence before listing a professional as verified and keep electrical wiring requests subject to the relevant certification checks.')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

),
  consent boolean not null default false check (consent),
  identity_checked boolean not null default false,
  qualification_checked boolean not null default false,
  references_checked boolean not null default false,
  practical_assessment boolean not null default false,
  cewp_verified boolean not null default false,
  application_status text not null default 'pending'
    check (application_status in ('pending', 'verified', 'rejected')),
  published boolean not null default false,
  verification_notes text not null default '' check (char_length(verification_notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    not published or (
      application_status = 'verified'
      and identity_checked
      and qualification_checked
      and references_checked
      and practical_assessment
      and (trade <> 'Electrician' or (cewp_verified and char_length(trim(cewp_reference)) > 0))
    )
  ),
  check (not cewp_verified or trade = 'Electrician')
);

create index if not exists tradespeople_review_idx
  on public.tradespeople(application_status, created_at desc);
create index if not exists tradespeople_public_directory_idx
  on public.tradespeople(trade, published, created_at desc);

create or replace function public.touch_tradespeople_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists tradespeople_touch on public.tradespeople;
create trigger tradespeople_touch before update on public.tradespeople
  for each row execute function public.touch_tradespeople_updated_at();

alter table public.tradespeople enable row level security;
-- All application details and verification notes are private.
-- Public reads go through the narrow RPC below; only server-side service-role code
-- creates applications or changes review decisions after checking staff permissions.
revoke all on table public.tradespeople from anon, authenticated;
grant all on table public.tradespeople to service_role;

create or replace function public.get_verified_tradespeople()
returns table (
  id uuid,
  public_name text,
  trade text,
  service_area text,
  experience_years integer,
  bio text,
  portfolio_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id,
    t.public_name,
    t.trade,
    t.service_area,
    t.experience_years::integer,
    t.bio,
    t.portfolio_url
  from public.tradespeople t
  where t.application_status = 'verified'
    and t.published = true
  order by t.trade, t.created_at desc
$$;

revoke all on function public.get_verified_tradespeople() from public;
grant execute on function public.get_verified_tradespeople() to anon, authenticated;

-- Replace the old building-company copy that may already be stored in site_content.
insert into public.site_content (key, value)
values
  ('home.hero.eyebrow', 'Your job. The right professional.'),
  ('home.hero.title', 'Find the right hands for the job.'),
  ('home.hero.subtitle', 'Find tilers, electricians, plumbers, carpenters and masons. Post a job, get connected with a suitable professional and keep track of the work.'),
  ('home.about.title', 'Skilled trades. Clear requests. Better job connections.'),
  ('home.intro', 'Green-Building Creations Ltd. is developing a job-matching service that helps customers find skilled tradespeople and helps professionals access genuine work. Profiles are published as verified only after the required checks have been completed.'),
  ('home.locations', 'GBC is based in Cape Coast. Job requests can be submitted with the work location, and availability is confirmed with the customer before a professional is matched.'),
  ('home.careers', 'Are you a tiler, electrician, plumber, carpenter or mason? Apply to join the network. Your profile will be reviewed before it can appear as verified.'),
  ('about.story', 'Green-Building Creations Ltd. (GBC) is based in Cape Coast, Ghana. We are shifting the website from a building portfolio into a job-matching service for customers who need skilled trade work and professionals looking for genuine jobs. Customers can post a job request, share the location and requirements, and receive follow-up from the GBC team. Tradespeople apply to join the network and are reviewed before a verified profile is published.'),
  ('sustainability.intro', 'A dependable job site begins with clear scopes, safe work practices and transparent expectations. We review trade evidence before listing a professional as verified and keep electrical wiring requests subject to the relevant certification checks.')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

