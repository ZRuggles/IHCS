import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronDown, ExternalLink,
  GraduationCap, Heart, LifeBuoy, LogIn, Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BrandShine } from "../components/BrandShine";
import { EditableText } from "../editor/Editable";
import { useText } from "../content/hooks";
import { ADMISSION_EMAIL, LMS_URL } from "../data/siteInfo";
import { ihsSiteUrl } from "../data/siteVariant";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55 },
};

// Current-student links first. Application steps stay available for
// anyone still applying.
const resources: { icon: LucideIcon; title: string; text: string; label: string; to?: string; href?: string }[] = [
  { icon: LogIn, title: "Student portal", text: "Sign in to Populi with your existing student account to reach your course information.", label: "Open student portal", href: LMS_URL },
  { icon: BookOpen, title: "Programs & course details", text: "Review program information, schedules, and course requirements.", label: "Explore programs", to: "/courses" },
  { icon: LifeBuoy, title: "A little help along the way", text: "Have a question about your program or your next step? Connect with our team.", label: "Contact the school", to: "/contact" },
  { icon: GraduationCap, title: "Still applying?", text: "Review the application steps for new students.", label: "View application steps", to: "/how-to-apply" },
];

const questions = [
  { title: "Where do I sign in as a current student?", answer: "Use the student portal link on this page to open Populi and sign in with your existing student account." },
  { title: "What if I need help accessing my account?", answer: "Start with the account recovery options on the Populi sign-in page. If you still need help, contact the school and describe the issue. Please do not send your password." },
  { title: "Where can I find program requirements and start dates?", answer: "Visit Programs and open the course you are interested in. Admissions can help clarify any requirements or questions about your enrollment." },
];

export default function StudentResources() {
  const intro = useText("studentResources", "hero.description", "Everything current students need in one place. Sign in to your student portal, review your program information, or connect with the school for support.");
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#4a1a6d] via-[#6b2d94] to-[#9810fa] py-14 sm:py-20 lg:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-96 rounded-full bg-[#ffb900]/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-purple-300/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <motion.div {...reveal}>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white"><GraduationCap className="size-4 text-[#ffb900]" /> For current students</p>
              <h1 className="text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">Student <span className="text-[#ffb900]">Resources</span></h1>
              <EditableText page="studentResources" contentKey="hero.description" value={intro} multiline>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">{intro}</p>
              </EditableText>
              <a href="#resources" className="mt-8 inline-flex items-center gap-2 font-medium text-white hover:text-[#ffb900] transition-colors">Find what you need <ArrowRight className="size-5" /></a>
            </motion.div>
            <motion.div {...reveal} transition={{ duration: 0.6, delay: 0.1 }} className="relative overflow-hidden rounded-3xl border border-white/30 bg-white p-7 shadow-2xl sm:p-10">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9a7030] via-[#fff1be] to-[#d5a641]" />
              <BrandShine />
              <div className="mb-6 flex items-center justify-between gap-4"><div className="rounded-2xl bg-[#eee5f5] p-4"><BookOpen className="size-7 text-[#6b2d94]" /></div><span className="rounded-full bg-[#fff5d6] px-3 py-1 text-xs font-medium text-[#705000]">Current students</span></div>
              <h2 className="text-2xl font-medium text-[#28133e]">Your student portal</h2>
              <p className="mt-3 leading-7 text-[#6a7282]">Continue to Populi to access your existing student account and course information.</p>
              <motion.a href={LMS_URL} target="_blank" rel="noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-7 flex items-center justify-center gap-3 rounded-full bg-[#6b2d94] px-6 py-4 font-medium text-white transition-colors hover:bg-[#4a1a6d]">Open student portal <ExternalLink className="size-4" /><span className="sr-only"> (opens in a new tab)</span></motion.a>
              <p className="mt-4 text-center text-sm text-[#6a7282]">New to the school? <Link to="/how-to-apply" className="text-[#6b2d94] underline underline-offset-4">Start with Admissions</Link></p>
            </motion.div>
          </div>
        </section>

        <section id="resources" className="scroll-mt-40 py-14 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <motion.div {...reveal} className="mb-9"><p className="mb-3 text-sm font-medium text-[#6b2d94]">QUICK LINKS</p><h2 className="text-3xl font-medium text-[#28133e] sm:text-4xl">Find your next step</h2></motion.div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {resources.map(({ icon: Icon, ...resource }, index) => (
                <motion.div key={resource.title} {...reveal} transition={{ duration: 0.5, delay: index * 0.08 }} whileHover={{ y: -6 }} className="flex flex-col rounded-2xl border border-[#eee5f5] bg-gradient-to-br from-[#f7f2fb] to-white p-7 shadow-sm">
                  <div className="mb-6 w-fit rounded-xl bg-[#6b2d94] p-3 text-white"><Icon className="size-6" /></div>
                  <h3 className="text-xl font-medium text-[#28133e]">{resource.title}</h3><p className="mb-7 mt-3 leading-7 text-[#6a7282]">{resource.text}</p>
                  {resource.href ? (
                    <a href={resource.href} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-2 font-medium text-[#6b2d94] hover:underline">{resource.label}<ExternalLink className="size-4 shrink-0" /><span className="sr-only"> (opens in a new tab)</span></a>
                  ) : (
                    <Link to={resource.to ?? "/"} className="mt-auto inline-flex items-center gap-2 font-medium text-[#6b2d94] hover:underline">{resource.label}<ArrowRight className="size-4 shrink-0" /></Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f2fb] py-14 sm:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <motion.div {...reveal}>
              <p className="mb-3 text-sm font-medium text-[#6b2d94]">GETTING READY</p><h2 className="text-3xl font-medium text-[#28133e]">A good place to begin</h2><p className="mt-4 leading-7 text-[#6a7282]">A few simple steps can help you feel prepared. Follow the instructions provided for your specific program.</p>
              <ul className="mt-7 space-y-5">
                {[
                  ["Check your account access", "Make sure you can sign in to your student portal before you need it."],
                  ["Review your program details", "Keep your course information and any instructions from the school handy."],
                  ["Gather requested documents", "Follow up on any items Admissions has asked you to submit."],
                  ["Ask when something is unclear", "Contact the school for help with enrollment or your next step."],
                ].map(([title, text]) => <li key={title} className="flex gap-3"><CheckCircle2 className="mt-1 size-5 shrink-0 text-[#6b2d94]" /><div><h3 className="font-medium text-[#28133e]">{title}</h3><p className="mt-1 leading-7 text-[#6a7282]">{text}</p></div></li>)}
              </ul>
            </motion.div>
            <motion.div {...reveal} className="rounded-2xl border border-[#eee5f5] bg-white p-7 sm:p-9">
              <h2 className="mb-5 text-2xl font-medium text-[#28133e]">Common questions</h2>
              {questions.map(({ title, answer }) => <details key={title} className="group border-b border-[#eee5f5] py-5 last:border-b-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-[#28133e] [&::-webkit-details-marker]:hidden">{title}<ChevronDown className="size-5 shrink-0 text-[#6b2d94] transition-transform group-open:rotate-180" /></summary><p className="mt-4 leading-7 text-[#6a7282]">{answer}</p></details>)}
            </motion.div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <motion.div {...reveal} className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4a1a6d] to-[#6b2d94] p-7 sm:p-10 lg:p-12">
              <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div><Mail className="mb-5 size-8 text-[#ffb900]" /><h2 className="text-3xl font-medium text-white">Need a hand?</h2><p className="mt-4 max-w-xl leading-7 text-white/85">Whether you're applying or already enrolled, our team can help you find your next step.</p><a href={`mailto:${ADMISSION_EMAIL}`} className="mt-4 inline-block break-all text-sm text-[#ffb900] hover:underline">{ADMISSION_EMAIL.slice(0, ADMISSION_EMAIL.lastIndexOf("."))}<span className="whitespace-nowrap">{ADMISSION_EMAIL.slice(ADMISSION_EMAIL.lastIndexOf("."))}</span></a></div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffb900] px-6 py-3 font-medium text-[#28133e] hover:bg-[#ffd05b] transition-colors">Contact the school <ArrowRight className="size-4" /></Link></div>
              </div>
            </div>
          </motion.div>
        </section>
        <section className="border-t border-[#e8dfd1] bg-[#fff8e9] py-9">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4"><Heart className="mt-1 size-7 shrink-0 text-[#6b2d94]" /><div><h2 className="text-xl font-medium text-[#28133e]">Looking for care or staffing support?</h2><p className="mt-2 max-w-2xl leading-7 text-[#665d70]">Innovation Healthcare Solutions is our partner for home care services and healthcare staffing.</p></div></div>
            <a href={ihsSiteUrl} className="inline-flex shrink-0 items-center gap-2 font-medium text-[#6b2d94] hover:underline">Visit the healthcare website <ArrowRight className="size-5" /></a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
