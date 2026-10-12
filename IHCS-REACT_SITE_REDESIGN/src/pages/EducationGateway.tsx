import { useEffect } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, GraduationCap, Mail } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BrandShine } from "../components/BrandShine";
import { ADMISSION_EMAIL, APPLICATION_LINKS, LMS_URL } from "../data/siteInfo";
import { schoolSiteUrl } from "../data/siteVariant";
import { useCourses, useText } from "../content/hooks";
import { EditableText } from "../editor/Editable";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55 },
};

export default function EducationGateway() {
  const { pathname, search, hash } = useLocation();
  const courses = useCourses();
  const schoolOrigin = schoolSiteUrl && schoolSiteUrl !== window.location.origin ? schoolSiteUrl : "";
  // Preserve old course/admissions links. Education remains a full page.
  const destination = schoolOrigin && pathname !== "/education"
    ? `${schoolOrigin}${pathname}${search}${hash}` : "";
  useEffect(() => {
    if (destination) window.location.replace(destination);
  }, [destination]);
  const intro = useText("ihsEducation", "hero.description", "Care, careers, and education are connected. Our education partner, Innovation Institute of Healthcare Solutions, is the home for healthcare training, admissions, and student learning.");
  const actions = [
    { icon: BookOpen, title: "Explore your options", text: "Find the training program that fits your next step. Ask Admissions about requirements and upcoming classes.", label: schoolOrigin ? "View school programs" : "Ask about programs", href: schoolOrigin ? `${schoolOrigin}/courses` : `mailto:${ADMISSION_EMAIL}` },
    { icon: FileText, title: "Ready to apply?", text: "Begin the school's online application through Populi. Admissions can help with the enrollment process.", label: "Open school application", href: APPLICATION_LINKS.schoolApplication },
    { icon: GraduationCap, title: "Already a student?", text: "Continue to your existing Populi account for student access and course information.", label: "Open student portal", href: LMS_URL },
  ];
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#fff8e9] via-white to-[#eee5f5] py-14 sm:py-20">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
            <motion.div {...reveal}>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#6b2d94]"><GraduationCap className="size-5" /> OUR EDUCATION PARTNER</p>
              <h1 className="text-4xl font-medium leading-tight text-[#28133e] sm:text-5xl">A dedicated home for <span className="text-[#6b2d94]">healthcare education</span></h1>
              <EditableText page="ihsEducation" contentKey="hero.description" value={intro} multiline>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#665d70]">{intro}</p>
              </EditableText>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={schoolOrigin || `mailto:${ADMISSION_EMAIL}`} className="relative overflow-hidden rounded-full bg-[#6b2d94] px-7 py-4 font-medium text-white transition-colors hover:bg-[#4a1a6d]">{schoolOrigin ? "Visit the school website" : "Connect with Admissions"}<BrandShine /></a>
                <a href="#programs" className="inline-flex items-center gap-2 rounded-full border border-[#6b2d94]/30 px-7 py-4 font-medium text-[#6b2d94] hover:bg-[#eee5f5] transition-colors">Explore training <ArrowRight className="size-4" /></a>
              </div>
            </motion.div>
            <motion.div {...reveal} className="relative overflow-hidden rounded-3xl border border-[#e8dfd1] bg-white p-8 shadow-xl sm:p-12">
              <BrandShine />
              <img src="/brands/iihs-logo.png" alt="Innovation Institute of Healthcare Solutions" className="mx-auto w-full max-w-sm" />
              <div className="mt-7 border-t border-[#eee5f5] pt-6 text-center">
                <p className="font-medium text-[#28133e]">Learn. Practice. Advance.</p>
                <p className="mt-3 leading-7 text-[#665d70]">Healthcare education and training in Winston-Salem, North Carolina.</p>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-[1400px] gap-6 px-5 sm:px-8 md:grid-cols-3">
            {actions.map(({ icon: Icon, title, text, label, href }) => (
              <motion.div key={title} {...reveal} whileHover={{ y: -5 }} className="flex flex-col rounded-2xl border border-[#eee5f5] bg-[#f7f2fb] p-7">
                <Icon className="mb-5 size-7 text-[#6b2d94]" />
                <h2 className="text-xl font-medium text-[#28133e]">{title}</h2>
                <p className="mb-6 mt-3 leading-7 text-[#665d70]">{text}</p>
                <a href={href} className="mt-auto inline-flex items-center gap-2 font-medium text-[#6b2d94] hover:underline">{label}<ArrowRight className="size-4" /></a>
              </motion.div>
            ))}
          </div>
        </section>
        <section id="programs" className="scroll-mt-40 bg-[#f7f2fb] py-14 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <motion.div {...reveal} className="mb-9">
              <p className="mb-3 text-sm font-medium text-[#6b2d94]">TRAINING THROUGH IIHS</p>
              <h2 className="text-3xl font-medium text-[#28133e] sm:text-4xl">Explore healthcare programs</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#665d70]">From starting your healthcare journey to building on existing skills, explore the school's programs and connect with Admissions for details.</p>
            </motion.div>
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <motion.div key={course.id} {...reveal} className="flex h-full flex-col rounded-2xl border border-[#eee5f5] bg-white p-7">
                  <h3 className="text-xl font-medium text-[#28133e]">{course.title}</h3>
                  <p className="mb-6 mt-4 leading-7 text-[#665d70]">{course.description}</p>
                  <a href={schoolOrigin ? `${schoolOrigin}/courses/${course.id}` : `mailto:${ADMISSION_EMAIL}?subject=${encodeURIComponent(`Program inquiry - ${course.title}`)}`} className="mt-auto inline-flex items-center gap-2 font-medium text-[#6b2d94] hover:underline">{schoolOrigin ? "View course details" : "Ask Admissions"}<ArrowRight className="size-4 shrink-0" /></a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-14 sm:py-20">
          <motion.div {...reveal} className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="grid gap-8 rounded-3xl bg-[#28133e] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Mail className="mb-4 size-7 text-[#f6d98b]" />
                <h2 className="text-3xl font-medium text-white">Let's find your next step</h2>
                <p className="mt-4 max-w-xl leading-7 text-white/80">Questions about a program, the application, or requested documents? The school's Admissions team is your next point of contact.</p>
                <a href={`mailto:${ADMISSION_EMAIL}`} className="mt-4 inline-block break-all text-sm text-[#f6d98b] hover:underline">{ADMISSION_EMAIL.slice(0, -4)}<span className="whitespace-nowrap">.com</span></a>
              </div>
              <div className="flex flex-col gap-3">
                <a href={`mailto:${ADMISSION_EMAIL}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f6d98b] px-6 py-3 font-medium text-[#28133e]">Email Admissions <ArrowRight className="size-4" /></a>
                {schoolOrigin && <a href={`${schoolOrigin}/student-resources`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-white">Student resources <ArrowRight className="size-4" /></a>}
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
