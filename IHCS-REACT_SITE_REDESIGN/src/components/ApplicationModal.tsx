import { useEffect } from "react";
import { X } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APPLICATION_LINKS } from "../data/siteInfo";
import { isLaunchReleased } from "../data/launch";

// /apply: the LPN choice modal once launched, otherwise the general application.
export function ApplyRedirect() {
  const launched = isLaunchReleased;
  useEffect(() => {
    if (!launched) window.location.replace(APPLICATION_LINKS.schoolApplication);
  }, [launched]);
  return launched ? <Navigate to="/?apply=1" replace /> : null;
}

// Before the launch the choice dialog is not just closed but absent: the
// build-time constant lets the bundler drop it, so its LPN wording is not
// in a pre-launch bundle at all.
export function ApplicationModal() {
  return isLaunchReleased ? <ApplicationChoiceModal /> : null;
}

function ApplicationChoiceModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const isOpen = new URLSearchParams(location.search).get("apply") === "1";

  const close = () => {
    const params = new URLSearchParams(location.search);
    params.delete("apply");
    navigate({ pathname: location.pathname, search: params.toString() ? `?${params}` : "" }, { replace: true });
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <button aria-label="Close application choices" className="absolute inset-0 bg-[#1a1027]/60 backdrop-blur-sm" onClick={close} />
      <section role="dialog" aria-modal="true" aria-labelledby="application-choice-title" className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        <button onClick={close} className="absolute right-5 top-5 rounded-full p-2 text-[#4a5565] hover:bg-[#f7f2fb]" aria-label="Close">
          <X className="size-5" />
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b2d94]">Admissions</p>
        <h2 id="application-choice-title" className="mt-3 pr-8 text-3xl font-medium text-[#101828]">Are you applying to the LPN program?</h2>
        <p className="mt-4 text-lg leading-8 text-[#4a5565]">Choose the application that matches the program you plan to attend.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a href={APPLICATION_LINKS.lpnApplication || APPLICATION_LINKS.schoolApplication} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#561D7E] p-6 text-left text-white transition-transform hover:-translate-y-1 hover:bg-[#461464]">
            <span className="block text-xl font-medium">Yes, I&apos;m applying to LPN</span>
            <span className="mt-2 block text-sm leading-6 text-white/80">Open the LPN application</span>
          </a>
          <a href={APPLICATION_LINKS.schoolApplication} target="_blank" rel="noreferrer" className="rounded-2xl border-2 border-[#6b2d94] bg-white p-6 text-left text-[#561D7E] transition-transform hover:-translate-y-1 hover:bg-[#f7f2fb]">
            <span className="block text-xl font-medium">No, another program</span>
            <span className="mt-2 block text-sm leading-6 text-[#4a5565]">Open the general school application</span>
          </a>
        </div>
        {!APPLICATION_LINKS.lpnApplication && <p className="mt-6 rounded-xl bg-[#fff8e9] px-4 py-3 text-sm leading-6 text-[#665d70]">The LPN application is being finalized. Until its link is supplied, both choices open the general school application.</p>}
      </section>
    </div>
  );
}
