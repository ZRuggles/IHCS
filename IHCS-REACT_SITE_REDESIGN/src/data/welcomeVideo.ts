import { isLaunchReleased } from "./launch";

/**
 * The school's welcome video. One source feeds both placements: near the
 * top of the homepage and in place of the Programs page's enrollment steps.
 *
 * While `src` is empty, neither placement renders — no empty player, and
 * the Programs page keeps its enrollment steps.
 *
 * To add the video:
 *   1. Set `src` to a YouTube or Vimeo link, or to a self-hosted file in
 *      public/ (for example "/media/iihs-welcome.mp4").
 *   2. For a self-hosted file, add English captions as a WebVTT file in
 *      public/ and set `captions` (YouTube/Vimeo captions are managed there).
 *   3. Watch it. If it names or describes the new programs (Practical
 *      Nursing / LPN, Nurse Aide II, the first cohort) or invites
 *      applications, leave `holdUntilLaunch` true: it then appears only in
 *      builds made on or after November 2. Otherwise set it to false and it
 *      appears in the next build.
 */
export const WELCOME_VIDEO = {
  src: "",
  captions: "",
  poster: "",
  title: "Welcome to Innovation Institute of Healthcare Solutions",
  holdUntilLaunch: true,
};

export const isWelcomeVideoAvailable =
  WELCOME_VIDEO.src.trim() !== "" && (!WELCOME_VIDEO.holdUntilLaunch || isLaunchReleased);

/** Privacy-enhanced embed URL for YouTube/Vimeo links; null for a video file. */
export function welcomeVideoEmbedUrl(src: string): string | null {
  let url: URL;
  try {
    url = new URL(src, "https://placeholder.invalid");
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}?rel=0`;
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const id = url.searchParams.get("v") ?? url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
  }
  if (host === "vimeo.com") {
    const id = url.pathname.match(/^\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "player.vimeo.com") return url.href;
  return null;
}
