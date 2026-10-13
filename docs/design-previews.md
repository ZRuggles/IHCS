# Private design previews

Design Previews stores review concepts separately from website drafts and published content. It does not change public navigation or replace live pages. The starter IHS proposal includes Home, Services, Partnerships, Careers, and Contact concepts, plus the proposed site map, timeline, and content questions.

## Activate once

The user handles Render and Supabase setup. No client invitation or production database change was performed during development.

1. In Supabase's SQL Editor, run the contents of `ihcs-editor-api/supabase/migrations/0003_design_previews.sql`. It creates the private preview table and blocks direct access by public/browser database roles. If this project uses the repository migration runner, `npm run migrate` from the editor API directory is the alternative.
2. Deploy the updated editor API and both frontend builds from the reviewed source. Keep the existing public Supabase and editor API variables. There are no new secrets or deploy hooks.
3. Confirm the site's `/admin/reset` URL is allowed in Supabase Authentication's redirect URL configuration. Invitations now direct users to that site's password setup page when the request comes from an allowed origin.
4. Sign in to `/admin` and open **Design previews**. The database setup error indicates step 1 has not been completed.

## Prepare and share a concept

1. Select **Start with the IHS proposal**, or upload a standalone HTML design under 5 MB. Include CSS and scripts in the file. Images can be embedded as data URLs or reference existing public assets on the site. External scripts, remote images, network APIs, and form submissions are blocked inside the preview.
2. Set a title and client notes. Enter the email addresses allowed to review it.
3. Select **Save private preview**, then **Open design preview** to inspect it. The preview is private until sharing is enabled.
4. An administrator invites each client in **People**, choosing **View only**. The client uses the invitation to choose their own password. Existing editor/administrator accounts retain their broader permissions; use a viewer account for review-only access.
5. Enable **Allow these reviewers to view this design** and select **Save sharing settings**.
6. Copy the review link and send it to the client. Sharing settings do not send invitations or messages automatically.

Clients sign in at `/review/<preview-id>`. Their account must be active, have View only access, match an allowed reviewer email, and have sharing enabled for that preview. `/review` lists their shared designs. Desktop and Phone buttons change the preview frame width. Client accounts do not receive editing or publishing controls.

To revoke access, disable sharing, remove the client's email, or disable their account. Disabling sharing blocks subsequent requests; it cannot retract content already viewed or captured. Save each design variation as a new preview so clients can compare concepts through separate links.

## Validation

Both frontend variants build. API type checks, permission tests, and frontend lint pass. Local browser fixtures cover client login, design navigation, phone preview, private draft creation, and sharing controls. Live Supabase invitation delivery and database migration execution require the activation steps above.
