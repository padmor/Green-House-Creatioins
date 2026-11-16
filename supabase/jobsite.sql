-- Jobsite transition: private artisan applications and a safe public directory.
-- Apply once in the Supabase SQL editor after the existing GBC schema.
-- No artisan is public or marked verified merely by submitting this application.

-- Job progress stages for the customer job desk.
alter type public.enquiry_status add value if not exists 'scheduled';
alter type public.enquiry_status add value if not exists 'in_progress';
alter type public.enquiry_status add value if not exists 'completed';

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
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
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
      and verified_by is not null
      and verified_at is not null
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
