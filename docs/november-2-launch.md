# November 2 program launch

The Practical Nursing (LPN) and Nurse Aide II programs launch at **midnight, November 2, 2026, America/Denver** (MST, UTC-7). The site includes the launch content only in builds made at or after that time.

## What the launch controls

One build-time setting controls all of these on both sites:

- The Practical Nursing and Nurse Aide II program pages (`/courses/practical-nursing`, `/courses/nurse-aide-ii`), their program cards, footer links, and the program count.
- The LPN application-choice dialog. Before launch, every Apply button opens the general Populi application directly.
- LPN mentions on the care site (the LPN job opening and LPN staffing copy).
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
- In Render, open each static site (IHS and IIHS) and select **Manual Deploy > Deploy latest commit**.

Rebuild both sites. The care site's LPN mentions follow the IHS build; the programs and application choice follow the IIHS build.

To launch automatically instead, add an external scheduler that calls both deploy hooks after the launch time, such as a Render Cron Job or a scheduled GitHub Actions workflow with the hook URLs stored as secrets. No scheduler is configured.

**Important:** Any publish or deploy after the launch time releases the content, even one made for an unrelated edit. Before November 2, confirm the program content below, or set `VITE_NOV2_RELEASE=off` on both static sites to hold the launch.

## Check after activation

1. In the Render deploy log, confirm `[launch] November 2 programs INCLUDED`.
2. Open `/courses`. Confirm both programs appear and the program count increased by two.
3. Open both program pages directly.
4. Select **Apply Online**. Confirm the application-choice dialog opens.
5. On the care site, confirm the LPN job opening appears on Careers.

## Application access

Applications use the external Populi service, not a form on this site. Before launch, the site shows no LPN or Nurse Aide II application path. The site cannot close Populi itself: the general application at `APPLICATION_LINKS.schoolApplication` stays open. Whether that form offers LPN or Nurse Aide II as a choice before November 2 is a Populi setting to check.

No separate LPN application link has been supplied. Until `APPLICATION_LINKS.lpnApplication` in `src/data/siteInfo.ts` is set, both dialog choices open the general application.

## Program content still needed

Neither program has confirmed details beyond its name and the first-cohort launch. The pages direct visitors to Admissions for the following. Add confirmed values in `src/data/launchPrograms.ts`, or add the program in the editor with the same slug; the editor entry takes precedence.

- Admission requirements and prerequisites
- Tuition, fees, and costs not included in tuition
- Program length, format, schedule, and start date
- Curriculum
- Approval, accreditation, licensure, and credential statements

The IIHS blueprint proposes a January 2027 inaugural cohort and a 13-month hybrid format for Practical Nursing, and lists Nurse Aide II "if current IIHS/NCBON course approval is confirmed." These are unconfirmed and are not published.

## Welcome video

The video section stays hidden until `WELCOME_VIDEO.src` is set in `src/data/welcomeVideo.ts`. That file explains the setup. When set, the video appears below the school homepage hero and replaces the enrollment steps on the Programs page. The Apply Online box and a link to How to Apply remain.

## Roll back

Set `VITE_NOV2_RELEASE=off` on both static sites and redeploy, or redeploy the previous build in Render.
