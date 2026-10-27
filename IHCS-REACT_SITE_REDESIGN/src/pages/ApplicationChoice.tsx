import { Link } from "react-router-dom";
import { CheckCircle, GraduationCap } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { APPLICATION_LINKS } from "../data/siteInfo";

export default function ApplicationChoice() {
  return (
    <div className="min-h-screen bg-[#f7f2fb]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#dfd1eb] sm:p-12">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#eee5f5] text-[#561D7E]">
            <GraduationCap className="size-6" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#6b2d94]">
            Admissions
          </p>
          <h1 className="mt-3 text-3xl font-medium text-[#101828] sm:text-4xl">
            Are you applying to the LPN program?
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4a5565]">
            Choose the application that matches the program you plan to attend.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href={APPLICATION_LINKS.lpnApplication || APPLICATION_LINKS.schoolApplication}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#561D7E] p-6 text-left text-white transition-transform hover:-translate-y-1 hover:bg-[#461464]"
            >
              <CheckCircle className="size-7" />
              <span className="mt-5 block text-xl font-medium">Yes, I&apos;m applying to LPN</span>
              <span className="mt-2 block text-sm leading-6 text-white/80">Open the LPN application</span>
            </a>
            <a
              href={APPLICATION_LINKS.schoolApplication}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border-2 border-[#6b2d94] bg-white p-6 text-left text-[#561D7E] transition-transform hover:-translate-y-1 hover:bg-[#f7f2fb]"
            >
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-current text-sm font-semibold">No</span>
              <span className="mt-5 block text-xl font-medium">No, another program</span>
              <span className="mt-2 block text-sm leading-6 text-[#4a5565]">Open the general school application</span>
            </a>
          </div>
          {!APPLICATION_LINKS.lpnApplication && (
            <p className="mt-6 rounded-xl bg-[#fff8e9] px-4 py-3 text-sm leading-6 text-[#665d70]">
              The LPN application is being finalized. Until its link is supplied, both choices open the general school application.
            </p>
          )}
          <Link to="/how-to-apply" className="mt-8 inline-block font-medium text-[#561D7E] underline underline-offset-4">
            Review the application steps first
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
