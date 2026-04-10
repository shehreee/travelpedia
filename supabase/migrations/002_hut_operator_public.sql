-- HUT: public operator profiles + past tours for agency pages
-- Run in Supabase SQL Editor after 001_initial_schema.sql

alter table public.profiles
  add column if not exists profile_photo_url text,
  add column if not exists hut_experience text,
  add column if not exists area_of_operation text;

comment on column public.profiles.profile_photo_url is 'Public logo or profile image URL for the operator HUT page';
comment on column public.profiles.hut_experience is 'Short bio / years of experience for HUT';
comment on column public.profiles.area_of_operation is 'Regions or routes the operator covers';

-- Anyone can read approved operator profiles (for /hut/[id] — contact + company info)
create policy "profiles_public_approved_operators_select"
  on public.profiles for select
  using (role = 'operator' and approval_status = 'approved');

-- Public can read closed tours from approved operators (past trips on HUT)
create policy "tours_public_read_closed_approved_operator"
  on public.tours for select
  using (
    status = 'closed'
    and exists (
      select 1 from public.profiles p
      where p.id = tours.operator_id
        and p.role = 'operator'
        and p.approval_status = 'approved'
    )
  );
