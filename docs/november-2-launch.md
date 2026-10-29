# November 2 program launch

The Practical Nursing (LPN) and Nurse Aide II programs launch at **midnight, November 2, 2026, America/Denver** (MST, UTC-7). The site includes the launch content only in builds made at or after that time.

## What the launch controls

One build-time setting controls all of these on the school site (IIHS):

- The Practical Nursing and Nurse Aide II program pages (`/courses/practical-nursing`, `/courses/nurse-aide-ii`), their program cards, footer links, and the program count.
- The LPN application-choice dialog. Before launch, every Apply button opens the general Populi application directly.
- The welcome video, when `holdUntilLaunch` is `true` in `src/data/welcomeVideo.ts`.

A pre-launch build does not contain this content. The page source and JavaScript do not include it, and a direct URL redirects to `/courses`, like any unknown program URL. The site has no search, sitemap, or `robots.txt`, so there is nothing else to exclude.

The setting is `VITE_NOV2_RELEASE`:

| Value | Effect |
| --- | --- |
| `auto` (default, or unset) | Included when the build runs at or after the launch time. |
| `on` | Always included. Use for local previews only. |
| `off` | Always held back, even after the launch time. Use to delay the launch. |

Each build logs its decision, for example `[launch] November 2 programs held back in this build`.

## Activate the launch

The sites are static. **Nothing rebuilds automatically on November 2.** Perform one of these steps at or after midnight Denver time:

- Sign in to the editor and press **Publish**. Publishing triggers both Render deploy hooks.
- In Render, open the school static site (IIHS) and select **Manual Deploy > Deploy latest commit**.

Only the school site needs the rebuild. The care site's existing LPN job opening and staffing mentions switch on by themselves at the launch time, checked in the visitor's browser.

To launch automatically instead, add an external scheduler that calls the school site's deploy hook after the launch time, such as a Render Cron Job or a scheduled GitHub Actions workflow with the hook URL stored as a secret. No scheduler is configured.

**Important:** Any publish or deploy after the launch time releases the content, even one made for an unrelated edit. To hold the launch, set `VITE_NOV2_RELEASE=off` on the school static site.

## Check after activation

1. In the Render deploy log, confirm `[launch] November 2 programs INCLUDED`.
2. Open `/courses`. Confirm both programs appear and the program count increased by two.
3. Open both program pages directly.
4. Select **Apply Online**. Confirm the application-choice dialog opens.
5. Choose **Yes, I'm applying to LPN** and confirm it opens the LPN application (`application_form=3`).

## Application access

Applications use the external Populi service, not a form on this site. Before launch, the site shows no LPN or Nurse Aide II application path. The site cannot close Populi itself: the general application at `APPLICATION_LINKS.schoolApplication` stays open. Whether that form offers LPN or Nurse Aide II as a choice before November 2 is a Populi setting to check.

The LPN application is Populi form 3 (`APPLICATION_LINKS.lpnApplication` in `src/data/siteInfo.ts`). It is compiled only into launch builds. Anyone who already has the Populi address can open it; whether it accepts submissions before November 2 is a Populi setting.

The school stated that LPN applications are open November 2 through December 2, 2026. The site does not close the LPN choice after December 2; remove it or update the dates when that window ends.

## Program content

Program content is in `src/data/launchPrograms.ts`, from the school's October 29, 2026 materials. Adding a program in the editor with the same slug takes precedence over that file.

Still not supplied, so the pages refer visitors to Admissions:

- Practical Nursing: curriculum, and approval, accreditation, and licensure statements. The school gave program dates of January 11 - February 11, 2027. Whether the technology, lab kit, liability, and Elsevier fees are in addition to the $18,574 tuition is unconfirmed, so the page lists them under "Other fees."
- Nurse Aide II: tuition, and approval status. The IIHS blueprint lists Nurse Aide II "if current IIHS/NCBON course approval is confirmed."

The Nurse Aide II calendar is generated: a new eight-week session every 56 days from Monday, January 18, 2027. The page shows the next seven sessions that have not ended. The school's calendar called January 18, 2027 a Sunday; it is a Monday.

## Welcome video

The video section stays hidden until `WELCOME_VIDEO.src` is set in `src/data/welcomeVideo.ts`. That file explains the setup. When set, the video appears below the school homepage hero and replaces the enrollment steps on the Programs page. The Apply Online box and a link to How to Apply remain.

## Roll back

Set `VITE_NOV2_RELEASE=off` on the school static site and redeploy, or redeploy the previous build in Render.
