/**
 * The November 2, 2026 program launch: Practical Nursing (LPN) and
 * Nurse Aide II, plus everything tied to them on the school site (program
 * cards, the LPN application choice, and a welcome video marked to wait
 * for the launch). The care site's LPN mentions switch in the browser
 * instead; see isLpnLaunched() in siteInfo.ts.
 *
 * The decision is made when the site is BUILT, not in the visitor's
 * browser (see vite.config.ts). A build made before the launch leaves this
 * content out of the JavaScript entirely, so it cannot be opened by direct
 * URL or read from the page source.
 *
 * Activation: rebuild the school site at or after LAUNCH_AT. Pressing
 * Publish in the editor triggers the Render deploy hooks; Render's Manual Deploy
 * also works. Nothing rebuilds on its own. See docs/november-2-launch.md.
 */

/** Midnight, November 2, 2026, America/Denver (MST, UTC-7). */
export const LAUNCH_AT = new Date(__NOV2_LAUNCH_AT__);

/** True only in builds that include the launch content. */
export const isLaunchReleased: boolean = __NOV2_RELEASED__;
