# Inline editor — state of the work

Last updated: 2026-08-20

## Working and verified

Against the live Supabase project, not a mock:

- Database schema, migrations, RLS (10/10 tables; anon key gets nothing)
- Content seeded and verified: `npm run verify` → 129 checks, 0 mismatches
- API on Hono; every editing endpoint 401s without a token
- Supabase Auth; admin account for `ruggles.zackery@gmail.com`
- **Inline editing on course detail pages** — title, description, duration,
  price, overview, curriculum, requirements, photo
- **Home page** — hero (badge, 3-part headline, paragraph, stat pairs) and
  all four section headings below it
- **Employment job listings** — add / remove / reorder / edit, verified
  end to end including the publish gate
- **Services page** — all three card lists (home assistance, personal
  care, specialty) editable via `EditableCards`
- **Employment benefits** — editable, and the layout was restructured so
  removing entries can no longer crash the page
- **Courses listing page** — all four section headings and paragraphs
- Draft/publish separation — `npm run verify:gate` proves drafts stay
  private until published
- Dashboard at `/admin` — hide/show, remove/restore, class dates, people
- Static publish model: build fetches `/api/public/content` → `content.json`

## Not done

1. **Add a new program** — dashboard lists/hides/removes but has no create
   form. `POST /api/courses` already exists and is tested.
2. **Custom SMTP** — Supabase's built-in email is capped at ~2-4/hour and
   is not for production. Set up Resend before launch, or editors cannot
   reset their own passwords.
3. **Render deployment** — nothing deployed yet. `render.yaml` is written.
   Needs: API service, deploy hook into `RENDER_DEPLOY_HOOK_URL`, and the
   three `VITE_` vars on the static site.

## Three editor components — not interchangeable

| File | Edits | Writes to |
|---|---|---|
| `Editable.tsx` | page copy, plain strings | `content_blocks` |
| `EditableField.tsx` | course columns | `PATCH /api/courses/:id` |
| `EditableCards.tsx` | lists of objects | `content_blocks` (json) |

`EditableCards` renders labelled fields per card rather than raw JSON, so
an editor is never asked to get brackets and commas right. Declare the
fields with `{ key, label, type }` where type is `text`, `textarea`, or
`list`.

## Two bugs worth remembering

**Draft leak (fixed).** `buildContent("published")` filtered on
`status = 'published'` but then read the DRAFT scalar columns, so every
inline edit went live instantly. Fixed by reading `published_data`.

Fixing that exposed a second: `publish.ts` stamped `published_at` before
building the payload, which would have frozen the PREVIOUS snapshot. Both
had to change together. `scripts/verify-publish-gate.ts` guards this now —
run it after any change to `lib/content.ts` or `routes/publish.ts`.

The lesson: test what an anonymous HTTP request returns, not what the
database columns say. The earlier lifecycle test checked columns and
missed this entirely.

**Double-encoded jsonb (fixed).** The `postgres` driver serializes jsonb
itself; calling `JSON.stringify` first stored the JSON *string* `"[]"`
instead of an array, silently emptying course payment plans. Always use
`json()` from `src/lib/json.ts`.

## Open questions for the user

- `zack@sourcefortraining.com` is an admin with no usable password. Give
  it one (`npm run set-password -- <email> --generate`) or delete it.
- `Footer.tsx:92` links to `/courses/hybrid-medication-aide` but the slug
  is `medication-aide` — a pre-existing broken link, not from this work.

## Running it locally

```bash
# API  (port 8787)
cd ihcs-editor-api && npx tsx --env-file=.env src/server.ts

# Site (Vite picks 5173-5175; all three are in ALLOWED_ORIGINS)
cd IHCS-REACT_SITE_REDESIGN && npm run dev
```

Sign in at `/admin`, then browse to a course page to see the pencils.

## Checks

```bash
cd ihcs-editor-api
npm run verify         # seed data vs live site      (no DB needed)
npm run verify:db      # DB content vs live site     (needs seeded DB)
npm run verify:gate -- <email> <password>   # drafts stay private (needs API up)
npm run typecheck
```
