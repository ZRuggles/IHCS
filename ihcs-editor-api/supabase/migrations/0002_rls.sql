-- =============================================================
-- Row Level Security
--
-- Threat model: the Supabase anon key is public by design — it
-- ships in any browser bundle that talks to Supabase. RLS is what
-- makes that safe. Default deny on every table; the API service
-- uses the service_role key (which bypasses RLS) and does its own
-- authorization in application code.
--
-- Net effect: even with the anon key in hand, an attacker can
-- read nothing and write nothing.
-- =============================================================

alter table editor_profiles  enable row level security;
alter table images           enable row level security;
alter table courses          enable row level security;
alter table schedule_groups  enable row level security;
alter table schedule_entries enable row level security;
alter table content_blocks   enable row level security;
alter table site_settings    enable row level security;
alter table revisions        enable row level security;
alter table audit_log        enable row level security;
alter table publishes        enable row level security;

-- No policies are created for anon/authenticated roles.
-- With RLS enabled and zero permissive policies, every read and
-- write from those roles is denied. Access flows exclusively
-- through the API service using service_role.

-- ---------------------------------------------------------------
-- One exception: a signed-in editor may read their OWN profile.
-- This lets the admin UI show "signed in as ..." and check role
-- without a round trip through the API.
-- ---------------------------------------------------------------
create policy editor_reads_own_profile
  on editor_profiles
  for select
  to authenticated
  using (id = auth.uid());

-- ---------------------------------------------------------------
-- Helper used by the API when it validates a user's JWT.
-- security definer so it can read editor_profiles regardless of
-- the caller's own RLS context.
-- ---------------------------------------------------------------
create or replace function current_editor_role()
returns editor_role
language sql
security definer
set search_path = public
as $fn$
  select role
  from editor_profiles
  where id = auth.uid()
    and is_active = true;
$fn$;

revoke all on function current_editor_role() from public;
grant execute on function current_editor_role() to authenticated;

-- ---------------------------------------------------------------
-- Auto-provision a profile whenever a Supabase Auth user is
-- created. New users land as inactive 'editor' — an admin must
-- activate them. This means creating an auth user is NOT by
-- itself enough to gain edit access.
-- ---------------------------------------------------------------
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  insert into editor_profiles (id, email, full_name, role, is_active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'editor',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$fn$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
