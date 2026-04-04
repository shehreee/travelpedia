-- Travelpedia Phase 1 — run in Supabase SQL Editor (or supabase db push)
--
-- After creating an admin user in Authentication → Users, promote the profile:
--   update public.profiles
--   set role = 'admin', approval_status = 'approved'
--   where id = '<auth user uuid>';

create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'operator' check (role in ('operator', 'admin')),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  company_name text,
  created_at timestamptz not null default now()
);

create table public.tours (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references public.profiles (id) on delete cascade,
  listing_company text not null default '',
  destination text not null,
  departure_city text not null,
  departure_date date not null,
  return_date date not null,
  duration text not null,
  price numeric(12, 2) not null,
  seats_total int,
  seats_remaining int,
  itinerary text,
  itinerary_pdf_path text,
  inclusions text,
  exclusions text,
  cancellation_policy text,
  whatsapp_contact text,
  status text not null default 'pending' check (status in ('pending', 'active', 'closed')),
  created_at timestamptz not null default now()
);

create index tours_destination_idx on public.tours (destination);
create index tours_departure_date_idx on public.tours (departure_date);
create index tours_status_idx on public.tours (status);
create index tours_operator_idx on public.tours (operator_id);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours (id) on delete cascade,
  operator_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  phone text not null,
  message text,
  seats_requested int not null default 1 check (seats_requested >= 1),
  created_at timestamptz not null default now()
);

create index inquiries_operator_idx on public.inquiries (operator_id);
create index inquiries_tour_idx on public.inquiries (tour_id);

-- Set operator_id from tour (public forms never send operator_id)
create or replace function public.inquiries_set_operator()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select t.operator_id into new.operator_id
  from public.tours t
  where t.id = new.tour_id;
  if new.operator_id is null then
    raise exception 'Invalid tour';
  end if;
  return new;
end;
$$;

create trigger inquiries_set_operator_trigger
  before insert on public.inquiries
  for each row
  execute function public.inquiries_set_operator();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.approval_status = 'approved'
  );
$$;

create or replace function public.is_approved_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'operator'
      and p.approval_status = 'approved'
  );
$$;

-- New auth users → profile row
-- Always creates an operator pending approval (never trust client metadata for role).
-- Promote admins in SQL: update public.profiles set role = 'admin', approval_status = 'approved' where id = '<auth uid>';
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role, approval_status, company_name)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'phone', '')), ''),
    'operator',
    'pending',
    nullif(trim(coalesce(new.raw_user_meta_data->>'company_name', '')), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.tours enable row level security;
alter table public.inquiries enable row level security;

-- Profiles
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_self"
  on public.profiles for update
  using (id = auth.uid());

create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin());

-- Tours: public reads active only
create policy "tours_public_read_active"
  on public.tours for select
  using (status = 'active');

create policy "tours_operator_read_own"
  on public.tours for select
  using (operator_id = auth.uid());

create policy "tours_admin_read_all"
  on public.tours for select
  using (public.is_admin());

create policy "tours_operator_insert"
  on public.tours for insert
  with check (
    operator_id = auth.uid()
    and public.is_approved_operator()
  );

create policy "tours_operator_update_own"
  on public.tours for update
  using (operator_id = auth.uid() and public.is_approved_operator());

create policy "tours_admin_update"
  on public.tours for update
  using (public.is_admin());

create policy "tours_operator_delete_own"
  on public.tours for delete
  using (operator_id = auth.uid() and public.is_approved_operator());

create policy "tours_admin_delete"
  on public.tours for delete
  using (public.is_admin());

-- Inquiries: insert without login if tour is active
create policy "inquiries_anon_insert_active_tour"
  on public.inquiries for insert
  with check (
    exists (
      select 1 from public.tours t
      where t.id = tour_id and t.status = 'active'
    )
  );

create policy "inquiries_operator_read"
  on public.inquiries for select
  using (operator_id = auth.uid());

create policy "inquiries_admin_read"
  on public.inquiries for select
  using (public.is_admin());

-- Storage: create bucket "itinerary-pdfs" in Dashboard, then:
-- (optional) Policies for authenticated upload to own folder — add via Supabase UI if using PDFs.
