-- =============================================================
-- IHCS Inline Website Editor — initial schema
-- Postgres / Supabase
--
-- Design notes:
--  * Every editable entity carries BOTH a draft and a published
--    representation. The public site is built from the published
--    columns only; editors see drafts. This is what makes
--    "Publish" a real gate rather than a cosmetic button.
--  * Schedules store REAL DATE columns. The legacy site parsed
--    hand-written strings like
--      "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM): May 11 - July 8, 2026"
--    with a regex to compute "Next Start". Storing dates and
--    GENERATING that string removes that whole class of bug.
--  * Auth is handled by Supabase Auth (auth.users). We keep a
--    thin profile table for roles so we never duplicate
--    credentials.
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Editors: a thin role layer on top of Supabase Auth.
-- auth.users holds the credentials; this holds "may they edit".
-- ---------------------------------------------------------------
create type editor_role as enum ('admin', 'editor', 'viewer');

create table editor_profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text        not null,
  full_name    text,
  role         editor_role not null default 'editor',
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);

comment on table editor_profiles is
  'Role/permission layer over Supabase auth.users. Credentials live in auth.users.';

-- ---------------------------------------------------------------
-- Images. Files live in Supabase Storage; this is the index.
-- ---------------------------------------------------------------
create table images (
  id          uuid primary key default gen_random_uuid(),
  storage_key text        not null unique,  -- path within the storage bucket
  filename    text        not null,
  alt_text    text        not null default '',
  width       integer,
  height      integer,
  bytes       integer,
  mime_type   text,
  -- Legacy files that shipped in /public and are not in Storage.
  -- These resolve to the site's own origin instead of Supabase.
  is_legacy   boolean     not null default false,
  uploaded_by uuid        references editor_profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index images_created_idx on images (created_at desc);

-- ---------------------------------------------------------------
-- Courses / programs.
--
-- The scalar columns are the DRAFT state and are what the editor
-- writes to directly. published_data holds a frozen JSON snapshot
-- of the whole course as it should appear publicly.
-- ---------------------------------------------------------------
create type publish_status as enum ('draft', 'published', 'hidden');

create table courses (
  id            uuid primary key default gen_random_uuid(),
  -- URL segment, e.g. "hybrid-nurse-aide" -> /courses/hybrid-nurse-aide.
  -- Stable and user-visible; changing it breaks inbound links.
  slug          text not null unique,

  -- ---- draft fields (what the editor edits) ----
  title         text not null,
  description   text not null default '',
  duration      text not null default '',
  -- Static fallback label used ONLY when a course has no schedule rows
  -- (e.g. "Every Monday", "Contact Admissions").
  next_start    text not null default '',
  badge         text,
  icon          text not null default 'heart',
  cost          text not null default '',
  image_id      uuid references images(id) on delete set null,

  -- Detail-page fields. Arrays are text[] because they are simple
  -- ordered lists of bullet points with no per-item metadata.
  overview          text   not null default '',
  curriculum        text[] not null default '{}',
  requirements      text[] not null default '{}',
  tuition_includes  text[] not null default '{}',
  additional_notes  text[] not null default '{}',
  certification     text   not null default '',
  schedule_summary  text   not null default '',

  -- Stripe / payment links.
  full_payment_url  text,
  payment_plans     jsonb not null default '[]'::jsonb,  -- [{label,url}]

  -- ---- publishing state ----
  status         publish_status not null default 'draft',
  published_data jsonb,
  published_at   timestamptz,

  sort_order  integer     not null default 0,
  -- Soft delete: removals are recoverable for 30 days.
  deleted_at  timestamptz,
  updated_by  uuid        references editor_profiles(id) on delete set null,
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

create index courses_sort_idx on courses (sort_order) where deleted_at is null;
create index courses_status_idx on courses (status) where deleted_at is null;

-- ---------------------------------------------------------------
-- Cohort schedules.
--
-- Shared across courses: the CNA and Refresher programs run on one
-- calendar, so a schedule_group lets one set of dates drive several
-- courses without duplicate data entry.
-- ---------------------------------------------------------------
create table schedule_groups (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,   -- 'cna-refresher', 'phlebotomy'
  name       text not null,
  created_at timestamptz not null default now()
);

create table schedule_entries (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references schedule_groups(id) on delete cascade,
  -- Optional cohort prefix, e.g. "Cohort 1 (Mon/Wed, 9:00 AM - 1:00 PM)".
  label      text,
  start_date date not null,
  end_date   date not null,
  -- Trailing parenthetical, e.g. "Thanksgiving break observed".
  note       text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint schedule_dates_ordered check (end_date >= start_date)
);

create index schedule_entries_group_idx on schedule_entries (group_id, start_date);

-- Which schedule group (if any) drives a given course.
alter table courses
  add column schedule_group_id uuid references schedule_groups(id) on delete set null;

-- ---------------------------------------------------------------
-- Free-form page content: headings, paragraphs, and list blocks
-- that live in page components rather than in a course record.
--
-- Addressed as (page, key), e.g. ('home', 'hero.headline').
-- ---------------------------------------------------------------
create type content_kind as enum ('text', 'richtext', 'image', 'list', 'json');

create table content_blocks (
  id              uuid primary key default gen_random_uuid(),
  page            text not null,            -- 'home' | 'services' | 'employment' | 'contact' | 'global'
  key             text not null,            -- 'hero.headline'
  kind            content_kind not null default 'text',
  label           text not null default '', -- human label shown in the editor UI
  draft_value     jsonb,
  published_value jsonb,
  published_at    timestamptz,
  sort_order      integer not null default 0,
  updated_by      uuid references editor_profiles(id) on delete set null,
  updated_at      timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (page, key)
);

create index content_blocks_page_idx on content_blocks (page, sort_order);

-- ---------------------------------------------------------------
-- Site-wide settings (contact info, apply links, LMS URL...).
-- Same draft/published split as everything else.
-- ---------------------------------------------------------------
create table site_settings (
  key             text primary key,
  label           text not null default '',
  draft_value     jsonb,
  published_value jsonb,
  published_at    timestamptz,
  updated_by      uuid references editor_profiles(id) on delete set null,
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Revision history — the undo safety net. Every write snapshots
-- the prior state so any field can be rolled back.
-- ---------------------------------------------------------------
create table revisions (
  id          bigserial primary key,
  entity_type text not null,   -- 'course' | 'content_block' | 'setting' | 'schedule'
  entity_id   text not null,
  snapshot    jsonb not null,
  changed_by  uuid references editor_profiles(id) on delete set null,
  changed_at  timestamptz not null default now()
);

create index revisions_entity_idx on revisions (entity_type, entity_id, changed_at desc);

-- ---------------------------------------------------------------
-- Audit log — who did what, for security review.
-- ---------------------------------------------------------------
create table audit_log (
  id         bigserial primary key,
  user_id    uuid references editor_profiles(id) on delete set null,
  action     text not null,
  entity     text,
  detail     jsonb,
  ip         inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_log_created_idx on audit_log (created_at desc);

-- ---------------------------------------------------------------
-- Publish snapshots — every Publish writes one row, so a bad
-- publish can be rolled back wholesale to the previous good one.
-- ---------------------------------------------------------------
create table publishes (
  id           bigserial primary key,
  payload      jsonb not null,   -- the exact content.json that was shipped
  published_by uuid references editor_profiles(id) on delete set null,
  note         text,
  created_at   timestamptz not null default now()
);

create index publishes_created_idx on publishes (created_at desc);

-- ---------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------
create or replace function touch_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

create trigger courses_touch
  before update on courses
  for each row execute function touch_updated_at();

create trigger content_blocks_touch
  before update on content_blocks
  for each row execute function touch_updated_at();

create trigger site_settings_touch
  before update on site_settings
  for each row execute function touch_updated_at();
