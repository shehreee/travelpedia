-- Lead-gen marketplace: listing categories, moderated reviews, operator ban
-- Run in Supabase SQL Editor after 002_hut_operator_public.sql

alter table public.profiles
  add column if not exists banned boolean not null default false;

alter table public.tours
  add column if not exists listing_category text not null default 'group_tour';

create index if not exists tours_listing_category_idx on public.tours (listing_category);

create table public.tour_reviews (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours (id) on delete cascade,
  author_name text not null,
  author_email text,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists tour_reviews_tour_idx on public.tour_reviews (tour_id);
create index if not exists tour_reviews_status_idx on public.tour_reviews (status);

alter table public.tour_reviews enable row level security;

create policy "tour_reviews_select_approved"
  on public.tour_reviews for select
  using (status = 'approved');

create policy "tour_reviews_select_admin"
  on public.tour_reviews for select
  using (public.is_admin());

create policy "tour_reviews_insert_pending_active_tour"
  on public.tour_reviews for insert
  with check (
    status = 'pending'
    and exists (
      select 1 from public.tours t
      where t.id = tour_id and t.status = 'active'
    )
  );

create policy "tour_reviews_update_admin"
  on public.tour_reviews for update
  using (public.is_admin());

create policy "tour_reviews_delete_admin"
  on public.tour_reviews for delete
  using (public.is_admin());
