import { useEffect } from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, GraduationCap, Users } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BrandShine } from "../components/BrandShine";
import { ADMISSION_EMAIL, APPLICATION_LINKS, LMS_URL } from "../data/siteInfo";
import { schoolSiteUrl } from "../data/siteVariant";
import { useText } from "../content/hooks";
import { EditableText } from "../editor/Editable";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55 },
};

function Copy({ contentKey, fallback }: { contentKey: string; fallback: string }) {
  const value = useText("ihsEducation", contentKey, fallback);
  return (
    <EditableText page="ihsEducation" contentKey={contentKey} value={value} multiline>
      {value}
    </EditableText>
  );
}

export default function EducationGateway() {
  const { pathname, search, hash } = useLocation();
  const schoolOrigin = schoolSiteUrl && schoolSiteUrl !== window.location.origin ? schoolSiteUrl : "";
  // Preserve old school URLs; Education itself remains an IHS page.
  const destination = schoolOrigin && pathname !== "/education"
    ? `${schoolOrigin}${pathname}${search}${hash}` : "";
  useEffect(() => {
    if (destination) window.location.replace(destination);
  }, [destination]);
  useEffect(() => {
    if (hash !== "#workforce") return;
    const frame = requestAnimationFrame(() => document.getElementById("workforce")?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#fff8e9] via-white to-[#eee5f5] py-14 sm:py-20">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
            <motion.div {...reveal}>
              <p className="mb-4 text-sm font-medium text-[#6b2d94]">INNOVATION HEALTHCARE SOLUTIONS</p>
              <h1 className="text-4xl font-medium leading-tight text-[#28133e] sm:text-5xl">Education, skills & <span className="text-[#6b2d94]">workforce partnerships</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#665d70]">
                <Copy contentKey="overview.description" fallback="Education & Skill Expansion and Workforce Pipeline Development are two of IHS's four pillars. Talk with our team about education-related services, skill-development needs, and workforce partnerships for your healthcare organization." />
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/contact?interest=education-workforce" className="relative overflow-hidden rounded-full bg-[#6b2d94] px-7 py-4 font-medium text-white transition-colors hover:bg-[#4a1a6d]">Discuss your education needs<BrandShine /></Link>
                <Link to="/contact?interest=partnership" className="inline-flex items-center gap-2 rounded-full border border-[#6b2d94]/30 px-7 py-4 font-medium text-[#6b2d94] hover:bg-[#eee5f5] transition-colors">Partner With IHS <ArrowRight className="size-4" /></Link>
              </div>
            </motion.div>
            <motion.div {...reveal} className="relative overflow-hidden rounded-3xl border border-[#e8dfd1] bg-white p-8 shadow-xl sm:p-10">
              <BrandShine />
              <BookOpen className="mb-6 size-9 text-[#6b2d94]" />
              <h2 className="text-2xl font-medium text-[#28133e]">Start with your organization's goals</h2>
              <p className="mt-4 leading-7 text-[#665d70]">Share the skills you want to develop, the workforce needs you are planning for, and the type of partnership you have in mind.</p>
              <ul className="mt-6 space-y-3 border-t border-[#eee5f5] pt-6 text-[#665d70]">
                <li>Education and skill-development priorities</li>
                <li>Healthcare talent and workforce needs</li>
                <li>Collaboration with education partners</li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section id="workforce" className="scroll-mt-40 py-14 sm:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-6 px-5 sm:px-8 md:grid-cols-2">
            {[
              { icon: BookOpen, title: "Education & Skill Expansion", key: "skills.description", text: "Connect with IHS about your team's learning objectives and skill-development priorities. Our team can discuss education-related services and partnership opportunities relevant to your needs." },
              { icon: Users, title: "Workforce Pipeline Development", key: "workforce.description", text: "Bring your organization's workforce needs into the conversation. Discuss how education partnerships, talent development, and healthcare staffing could support your workforce plans." },
            ].map(({ icon: Icon, title, key, text }) => (
              <motion.div key={key} {...reveal} whileHover={{ y: -5 }} className="flex flex-col rounded-2xl border border-[#eee5f5] bg-[#f7f2fb] p-7 sm:p-9">
                <Icon className="mb-5 size-7 text-[#6b2d94]" />
                <h2 className="text-2xl font-medium text-[#28133e]">{title}</h2>
                <p className="mb-6 mt-4 leading-8 text-[#665d70]"><Copy contentKey={key} fallback={text} /></p>
                <Link to="/contact?interest=education-workforce" className="mt-auto inline-flex items-center gap-2 font-medium text-[#6b2d94]">Talk with IHS <ArrowRight className="size-4" /></Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f2fb] py-14 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <motion.div {...reveal} className="mb-8 max-w-2xl">
              <p className="mb-3 text-sm font-medium text-[#6b2d94]">A SEPARATE EDUCATIONAL INSTITUTION</p>
              <h2 className="text-3xl font-medium text-[#28133e] sm:text-4xl">Looking for IIHS school programs?</h2>
              <p className="mt-5 leading-8 text-[#665d70]">Innovation Institute of Healthcare Solutions (IIHS) has its own identity, branding, admissions, and student portal. The school links below lead to IIHS resources; inquiries about IHS services and organizational partnerships go to the IHS team.</p>
            </motion.div>
            <motion.div {...reveal} className="grid gap-8 rounded-3xl border border-[#eee5f5] bg-white p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <img src="/brands/iihs-logo.png" alt="Innovation Institute of Healthcare Solutions — IIHS" className="mx-auto w-full max-w-sm" />
              <div>
                <h3 className="text-xl font-medium text-[#28133e]">IIHS admissions & student access</h3>
                <p className="mt-3 leading-7 text-[#665d70]">Explore the school's healthcare training, begin an application, or sign in to your existing student account.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {schoolOrigin && <a href={`${schoolOrigin}/courses`} className="inline-flex items-center gap-2 rounded-full bg-[#6b2d94] px-5 py-3 font-medium text-white">IIHS programs <ArrowRight className="size-4" /></a>}
                  <a href={APPLICATION_LINKS.schoolApplication} className="inline-flex items-center gap-2 rounded-full border border-[#6b2d94]/30 px-5 py-3 font-medium text-[#6b2d94]"><FileText className="size-4" /> IIHS application</a>
                  <a href={LMS_URL} className="inline-flex items-center gap-2 rounded-full border border-[#6b2d94]/30 px-5 py-3 font-medium text-[#6b2d94]"><GraduationCap className="size-4" /> IIHS student portal</a>
                </div>
                <a href={`mailto:${ADMISSION_EMAIL}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#6b2d94] hover:underline">Contact IIHS Admissions <ArrowRight className="size-4" /></a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <motion.div {...reveal} className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="flex flex-col gap-7 rounded-3xl bg-[#28133e] p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl"><h2 className="text-3xl font-medium text-[#f6d98b]">Build the conversation with IHS</h2><p className="mt-4 leading-8 text-white/80">Tell us about your organization and your education, workforce, or staffing priorities. Our team will help you explore the next step.</p></div>
              <Link to="/contact?interest=partnership" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f6d98b] px-6 py-4 font-medium text-[#28133e]">Partner With IHS <ArrowRight className="size-4" /></Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
