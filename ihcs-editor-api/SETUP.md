# Editor setup

Deployment runbook for the IHCS inline website editor. Follow in order —
each step depends on the one before it.

**Total cost: $7/month** (Render Starter for the API). Supabase's free
tier covers the database, authentication, and image storage.

---

## 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com) — free tier,
   region **US East** to sit near the Render Ohio region.
2. Save the database password somewhere safe; it is shown only once.
3. From **Settings → API**, copy:
   - Project URL → `SUPABASE_URL`
   - `anon` `public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **server only**
4. From **Settings → Database → Connection string → URI**, copy the
   connection string → `DATABASE_URL`. Use the **Session pooler** URI.

### Storage bucket

**Storage → New bucket**

- Name: `site-images`
- **Public bucket: on** — these are website photos, served to visitors.

### Auth settings

**Authentication → Providers → Email**

- Enable email, **disable "Allow new users to sign up"**. Accounts are
  created by invitation only; without this, anyone could register.

**Authentication → URL Configuration**

This is what invitation and password-reset emails link to. Supabase
defaults the Site URL to `http://localhost:3000`, which is a Next.js
convention and wrong for this project — Vite serves on **5173**.

- **Site URL:** `https://your-domain.com` (or `http://localhost:5173`
  while setting up locally)
- **Redirect URLs:** add every origin the reset page may be opened from:
  - `http://localhost:5173/admin/reset`
  - `https://your-domain.com/admin/reset`

The reset link must land on `/admin/reset`, which is served by
`src/editor/SetPassword.tsx`. Getting this wrong sends editors to a dead
page with a valid one-time token, and the token is consumed either way —
they have to request a fresh email.

---

## 2. Database schema

From the `ihcs-editor-api` directory, with `.env` filled in:

```bash
npm install
npm run migrate     # creates the tables
npm run seed        # loads your current website content
```

`npm run seed` is safe to re-run; it updates rather than duplicates.

**Before seeding, confirm the data matches your live site:**

```bash
npx tsx scripts/verify-seed.ts
```

This compares every course field, price, bullet point, and schedule
date against `src/data/courses.ts` and fails if anything differs. It
should report `129 checks, 0 mismatches`.

---

## 3. Deploy the API

On Render: **New → Web Service**, connect this repository.

| Setting | Value |
|---|---|
| Root directory | `ihcs-editor-api` |
| Runtime | Node |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Plan | **Starter ($7/mo)** |
| Health check path | `/health` |

Add every variable from `.env.example` under **Environment**.
`ALLOWED_ORIGINS` must list your live site, comma-separated, no spaces.

> **Why not the free tier?** Free services sleep after 15 minutes and
> take ~50 seconds to wake. Visitors never notice (they read a static
> `content.json` and never call this API), but *you* would wait almost a
> minute every time you signed in to edit.

---

## 4. Connect the website

On the existing static site service, add:

| Variable | Value |
|---|---|
| `VITE_EDITOR_API_URL` | `https://ihcs-editor-api.onrender.com` |
| `VITE_SUPABASE_URL` | your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | the `anon` key |

The anon key is safe in the browser: Row Level Security denies it every
read and write. See `supabase/migrations/0002_rls.sql`.

### Deploy hook

1. On the **static site** service: **Settings → Deploy Hook**, copy the URL.
2. Paste it into the **API** service as `RENDER_DEPLOY_HOOK_URL`.

This is what makes Publish work: pressing Publish tells Render to rebuild
the site, and the build fetches fresh content into `content.json`.

---

## 5. First administrator

```bash
npx tsx scripts/create-admin.ts you@example.com "Your Name"
```

Creates the account and emails a password setup link. The password is
chosen by that person — it is never typed into a terminal or sent to
anyone. Additional editors are invited from the dashboard afterwards.

---

## 6. Verify

- [ ] `https://ihcs-editor-api.onrender.com/health` returns `{"ok":true}`
- [ ] `/api/public/content` returns your 6 courses
- [ ] The public site looks unchanged
- [ ] `/admin` shows the sign-in page
- [ ] After signing in, the purple editing bar appears
- [ ] Pencil icons appear on hover over text
- [ ] An edit saves, then Publish makes it live within ~2 minutes
- [ ] Signed out, the site shows published content only

---

## Backups

Supabase takes daily backups on the free tier, retained 7 days
(**Database → Backups**).

**Restore drill — do this once, before launch.** A backup you have never
restored is a backup you do not know you have. Take a manual snapshot,
change a price, restore, and confirm the old price returns.

For a longer retention window:

```bash
pg_dump "$DATABASE_URL" > ihcs-backup-$(date +%Y-%m-%d).sql
```

---

## Troubleshooting

**Changes do not appear after Publish**
The publish saved but the rebuild did not start. Check
`RENDER_DEPLOY_HOOK_URL` on the API service, and the static site's
Events tab for a build. The editor shows a warning when this happens.

**"Could not reach the editor service"**
The API is down or `ALLOWED_ORIGINS` does not list your site's exact
origin — it must match scheme and host precisely, no trailing slash.

**Sign-in rejected for a valid password**
Confirm the account is active: `editor_profiles.is_active` must be
`true`. Invited users are activated automatically; users who somehow
self-registered are not.

**A course shows the wrong "Next Start"**
It reads the soonest cohort start date on or after today. If every date
is in the past it falls back to "Check Upcoming Schedule section" — add
upcoming dates under **Dashboard → Class dates**.
