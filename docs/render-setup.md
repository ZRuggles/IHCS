# Set up the school site in Render

The planned school domain is `innovationinstituteofhealthcaresolutions.com`. It has not been purchased. Use the URL Render assigns to the school site for preview and review.

You perform the Render, Supabase, and domain-provider steps in this guide. No service, environment variable, deploy hook, or DNS record has been changed by the agent.

## Prepare the source

1. Review the local IHS preview at `http://127.0.0.1:5173/` and IIHS preview at `http://127.0.0.1:5174/`.
2. The repository's production branch is `master`. The site split is also retained on `feat/ihs-iihs-site-split`. Use the reviewed production code for both Render sites. Local `tmp/`, `output/`, generated builds, and `.env` files are excluded from source control.
3. Confirm the existing IHS production service tracks `master` and has auto-deploy enabled.

## Create the IIHS preview

In the IHCS Render account, select **New > Static Site** and connect the repository.

| Setting | Value |
| --- | --- |
| Repository | `ZRuggles/IHCS` |
| Branch | `master` |
| Name | `iihs-school` (or another available name) |
| Root directory | `IHCS-REACT_SITE_REDESIGN` |
| Build command | `npm ci && npm run build:school` |
| Publish directory | `dist-school` |

Copy these public frontend environment values from the existing site:

- `VITE_EDITOR_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set `VITE_IHS_SITE_URL=https://innovationhealthcaresolutions.com`. The explicit school build command selects IIHS; you do not need a separate `VITE_SITE_VARIANT` value. Do not copy the server's Supabase service-role key or database URL to the static site.

Under **Redirects/Rewrites**, add:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | Rewrite |

Create the site. Copy its actual `https://…onrender.com` address after the deploy succeeds. Check the homepage, `/courses`, a program deep link, `/how-to-apply`, `/student-resources`, and `/admin`. Confirm tuition, dates, program claims, and contact information before cutover.

## Connect the shared editor

1. In the editor API's environment settings, append the school origin to `ALLOWED_ORIGINS`. Preserve the existing origins.
2. In Supabase **Authentication > URL Configuration**, add the school callback `https://ACTUAL-SCHOOL-URL/admin/reset` to the redirect allowlist. Preserve the IHS callbacks.
3. In the school static site's settings, copy its deploy-hook URL. Set it on the editor API as `RENDER_SCHOOL_DEPLOY_HOOK_URL`.
4. Retain `RENDER_DEPLOY_HOOK_URL` for the IHS service. Deploy the reviewed API changes before testing dual-site publishing.
5. Sign in to the school editor, make a small draft edit, preview it, and publish. Confirm both configured sites rebuild and the published change appears. The API reports each hook result if one fails.

Both sites share editor access and course data. The school homepage retains the existing `home` content keys; care homepage copy uses `ihsHome`. This prevents existing school copy from replacing care copy.

## Cut over IHS after review

1. Confirm the existing IHS static service tracks the reviewed `master` branch.
2. On the existing IHS static service, retain its domain and set the build command to `npm ci && npm run build:ihs`. Keep the publish directory as `dist`.
3. Set `VITE_SCHOOL_SITE_URL` to the actual school Render URL. Rebuild IHS. Existing education paths then send visitors to the corresponding IIHS path.
4. Add permanent redirects for `/courses` and `/courses/*` to the corresponding school URLs, before the SPA rewrite. Keep the exact program slugs. The application gateway remains a fallback until the URL is configured.
5. Check the care homepage, services, careers, contact information, old program links, and both editor publish results.

The source includes a three-service blueprint at `ihcs-editor-api/render.yaml`. Use this manual setup when the existing services are managed individually. Importing a blueprint with different service names can create additional services; match the actual existing names before using a blueprint to manage production.

## Connect the purchased school domain

1. Purchase the correctly spelled domain when ready.
2. Add the domain under the school static site's **Settings > Custom Domains**.
3. Apply the DNS records Render displays at the domain provider. Use Render's displayed target, rather than guessing the assigned hostname.
4. Wait for verification and HTTPS, then update IHS's `VITE_SCHOOL_SITE_URL` and education redirects to the purchased domain.
5. Add the purchased school origin to API CORS and its `/admin/reset` URL to Supabase redirects. Test both editor sign-in and password recovery.

Keep the preceding IHS deploy and the editor's published-content snapshot available for rollback. Sitemap/canonical configuration and the final program content audit remain part of launch preparation.
