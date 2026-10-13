-- Private review artifacts. Public content/publishing never reads these tables.
create table if not exists design_previews (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  html text not null,
  reviewer_emails text[] not null default '{}',
  is_shared boolean not null default false,
  created_by uuid references editor_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Access goes through the API, which verifies both identity and sharing.
alter table design_previews enable row level security;
revoke all on design_previews from anon, authenticated;
