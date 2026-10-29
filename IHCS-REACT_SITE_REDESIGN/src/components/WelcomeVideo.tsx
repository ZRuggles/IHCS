import type { ReactNode } from "react";
import { motion } from "motion/react";
import { PlayCircle } from "lucide-react";
import { WELCOME_VIDEO, isWelcomeVideoAvailable, welcomeVideoEmbedUrl } from "../data/welcomeVideo";

/**
 * The welcome video section. Renders nothing until a video is configured
 * (and, for a launch-held video, until the launch build) — see
 * src/data/welcomeVideo.ts. Never autoplays.
 */
export function WelcomeVideo({ className = "bg-white", children }: { className?: string; children?: ReactNode }) {
  if (!isWelcomeVideoAvailable) return null;
  const embedUrl = welcomeVideoEmbedUrl(WELCOME_VIDEO.src);

  return (
    <section aria-labelledby="welcome-video-heading" className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <div className="max-w-[1100px] mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#eee5f5] text-[#561D7E] px-4 py-2 rounded-full text-sm mb-4">
            <PlayCircle className="size-4" aria-hidden="true" />
            Welcome
          </div>
          <h2 id="welcome-video-heading" className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828]">
            A Welcome From Our Team
          </h2>
        </motion.div>
        <div className="overflow-hidden rounded-2xl bg-black shadow-xl aspect-video">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={WELCOME_VIDEO.title}
              className="h-full w-full"
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <video
              controls
              playsInline
              preload="metadata"
              poster={WELCOME_VIDEO.poster || undefined}
              aria-label={WELCOME_VIDEO.title}
              className="h-full w-full"
            >
              <source src={WELCOME_VIDEO.src} />
              {WELCOME_VIDEO.captions && (
                <track kind="captions" src={WELCOME_VIDEO.captions} srcLang="en" label="English" default />
              )}
            </video>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
