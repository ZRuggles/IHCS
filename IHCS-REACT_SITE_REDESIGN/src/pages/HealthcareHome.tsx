import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Heart, Home, Users, Activity, Phone, GraduationCap } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BrandShine } from "../components/BrandShine";
import { EditableText } from "../editor/Editable";
import { useText } from "../content/hooks";
import { withoutLpn } from "../data/siteInfo";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6 },
};

const services = [
  { icon: Home, title: "Home assistance", text: "A helping hand with meals, errands, housekeeping, and everyday routines at home.", label: "Everyday support" },
  { icon: Heart, title: "Personal care", text: "Compassionate support with personal care and mobility, with dignity at the center.", label: "For individuals & families" },
  { icon: Users, title: "Healthcare staffing", text: "Staffing support for facilities, medical offices, and healthcare organizations seeking RNs, LPNs, CNAs, and patient sitters.", label: "For healthcare organizations" },
  { icon: Activity, title: "Specialty services", text: "Home infusion and specialized nursing foot care. Talk with our team about the services available for your needs.", label: "Specialized support" },
];

const pillars = [
  { icon: GraduationCap, title: "Education & Skill Expansion", text: "Connect with IHS about skill-development needs and education-related partnerships.", to: "/education" },
  { icon: Users, title: "Workforce Pipeline Development", text: "Discuss partnerships that connect healthcare talent development with your organization's workforce needs.", to: "/education#workforce" },
  { icon: Activity, title: "Healthcare Staffing Solutions", text: "Explore staffing support for healthcare facilities, medical offices, and organizations.", to: "/services" },
  { icon: Heart, title: "Quality In-Home Care", text: "Find compassionate home assistance, personal care, and specialty support for individuals and families.", to: "/services" },
];

function Copy({ contentKey, fallback }: { contentKey: string; fallback: string }) {
  const value = useText("ihsHome", contentKey, fallback);
  return <EditableText page="ihsHome" contentKey={contentKey} value={value} multiline>{value}</EditableText>;
}

export default function HealthcareHome() {
  return (
    <div className="min-h-screen bg-[#fffdf8]">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-[#251334]">
          <img src="/PRN Home Visit.jpg" alt="Home care support" className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_center]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#251334] via-[#251334]/90 to-[#251334]/25" />
          <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
            <motion.div {...reveal} className="max-w-2xl">
              <p className="mb-6 flex items-center gap-3 text-sm font-medium text-[#f6d98b]"><span className="h-px w-10 bg-[#e7be60]" /><Copy contentKey="hero.eyebrow" fallback="Home Care & Healthcare Staffing" /></p>
              <h1 className="text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
                <Copy contentKey="hero.headlineLead" fallback="Your Partner in" />{" "}
                <span className="bg-gradient-to-r from-[#e7be60] via-[#fff1be] to-[#d5a641] bg-clip-text text-transparent"><Copy contentKey="hero.headlineAccent" fallback="Compassionate" /></span><br />
                <Copy contentKey="hero.headlineTail" fallback="Care & Staffing" />
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85"><Copy contentKey="hero.overview" fallback="Connecting education, workforce development, healthcare staffing, and compassionate support at home. Explore how Innovation Healthcare Solutions can support your family or organization." /></p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/contact" className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#d5a641] via-[#f8dd93] to-[#e7be60] px-7 py-4 font-medium text-[#251334] shadow-lg transition-transform hover:-translate-y-1">Let's talk about your needs<BrandShine /></Link>
                <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-7 py-4 font-medium text-white transition-colors hover:bg-white/10">Explore care & staffing <ArrowRight className="size-4" /></Link>
              </div>
            </motion.div>
          </div>
          <div className="h-1 bg-gradient-to-r from-[#9a7030] via-[#fff1be] to-[#d5a641]" />
        </section>

        <section className="border-b border-[#e8dfd1] bg-[#fff8e9]">
          <div className="mx-auto grid max-w-[1500px] divide-y divide-[#e8dfd1] px-5 md:grid-cols-3 md:divide-x md:divide-y-0 sm:px-8">
            {[
              { icon: Heart, title: "For your family", text: "Find support at home", to: "/services" },
              { icon: Users, title: "For your organization", text: "Partner With IHS", to: "/contact?interest=partnership" },
              { icon: Activity, title: "For your career", text: "Join our healthcare team", to: "/employment" },
            ].map(({ icon: Icon, title, text, to }) => <Link key={title} to={to} className="group flex items-center gap-4 px-4 py-7 transition-colors hover:bg-white/60 lg:px-8"><Icon className="size-7 shrink-0 text-[#6b2d94]" /><div><h2 className="font-medium text-[#28133e]">{title}</h2><p className="mt-1 text-sm text-[#665d70]">{text}</p></div><ArrowRight className="ml-auto size-5 shrink-0 text-[#9a7030] transition-transform group-hover:translate-x-1" /></Link>)}
          </div>
        </section>

        <section aria-labelledby="pillars-heading" className="border-b border-[#e8dfd1] bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
            <motion.div {...reveal} className="mb-9 max-w-2xl">
              <p className="mb-3 text-sm font-medium tracking-wider text-[#9a7030]">THE FOUR PILLARS OF IHS</p>
              <h2 id="pillars-heading" className="text-3xl font-medium text-[#28133e] sm:text-4xl"><Copy contentKey="pillars.heading" fallback="Connected services. A shared purpose." /></h2>
              <p className="mt-4 leading-7 text-[#665d70]"><Copy contentKey="pillars.description" fallback="Supporting people at home, strengthening healthcare teams, and connecting education with workforce needs." /></p>
            </motion.div>
            <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {pillars.map(({ icon: Icon, title, text, to }, index) => (
                <motion.div key={title} {...reveal} transition={{ duration: 0.5, delay: index * 0.08 }}>
                  <Link to={to} className="group flex h-full flex-col border-l-2 border-[#d5a641] bg-[#fffdf8] p-6 transition-colors hover:bg-[#fff8e9]">
                    <Icon className="mb-5 size-7 text-[#6b2d94]" />
                    <h3 className="text-xl font-medium text-[#28133e]">{title}</h3>
                    <p className="mb-6 mt-3 leading-7 text-[#665d70]"><Copy contentKey={`pillars.${index}.description`} fallback={text} /></p>
                    <span className="mt-auto inline-flex items-center gap-2 font-medium text-[#6b2d94]">Explore this pillar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
            <motion.div {...reveal} className="mb-10 grid gap-5 lg:grid-cols-2 lg:items-end">
              <div><p className="mb-3 text-sm font-medium tracking-wider text-[#9a7030]">CARE THAT CONNECTS</p><h2 className="max-w-lg text-3xl font-medium text-[#28133e] sm:text-4xl"><Copy contentKey="programs.heading" fallback="Care & Support for Your Needs" /></h2></div>
              <p className="max-w-xl leading-7 text-[#665d70]"><Copy contentKey="programs.subheading" fallback="Explore home care and workforce services designed around individuals, families, and healthcare organizations." /></p>
            </motion.div>
            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {services.map(({ icon: Icon, title, text, label }, index) => <motion.div key={title} {...reveal} transition={{ duration: 0.5, delay: index * 0.08 }} whileHover={{ y: -6 }} className="h-full"><Link to="/services" className="group flex h-full flex-col rounded-2xl border border-[#e8dfd1] bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"><div className="mb-7 w-fit rounded-full bg-[#f4edf8] p-4"><Icon className="size-7 text-[#6b2d94]" /></div><p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8a652d]">{label}</p><h3 className="text-xl font-medium text-[#28133e]">{title}</h3><p className="mb-8 mt-3 leading-7 text-[#665d70]">{withoutLpn(text)}</p><span className="mt-auto flex items-center gap-2 font-medium text-[#6b2d94]">Explore services <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link></motion.div>)}
            </div>
          </div>
        </section>

        <section className="pb-14 sm:pb-20">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
            <div className="grid overflow-hidden rounded-3xl bg-[#eee5f5] lg:grid-cols-2">
              <motion.img {...reveal} src="/Supplemental Staffing.jpeg" alt="Healthcare staffing team" loading="lazy" className="h-72 w-full object-cover lg:h-full lg:min-h-[420px]" />
              <motion.div {...reveal} className="flex flex-col justify-center p-7 sm:p-12 lg:p-14"><p className="mb-4 text-sm font-medium text-[#6b2d94]">FOR HEALTHCARE FACILITIES & ORGANIZATIONS</p><h2 className="text-3xl font-medium text-[#28133e] sm:text-4xl"><Copy contentKey="staffing.heading" fallback="Workforce support for your healthcare team" /></h2><p className="mt-5 leading-8 text-[#665d70]"><Copy contentKey="staffing.description" fallback="From medical offices to healthcare facilities, IHS works with organizations seeking staffing support. Tell us about your setting, the roles you need, and your staffing priorities so we can discuss how to support your team." /></p><p className="mt-4 text-sm leading-7 text-[#665d70]">{withoutLpn("Registered nurses, licensed practical nurses, certified nursing assistants, and patient sitters.")}</p><Link to="/contact?interest=partnership" className="mt-7 inline-flex items-center gap-2 font-medium text-[#6b2d94]">Partner With IHS <ArrowRight className="size-5" /></Link></motion.div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8dfd1] bg-white py-10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-4"><GraduationCap className="mt-1 size-8 shrink-0 text-[#6b2d94]" /><div><h2 className="text-xl font-medium text-[#28133e]">Education, skills & workforce partnerships</h2><p className="mt-2 text-[#665d70]">Connect with IHS about your organization's needs, or explore IIHS as a separate educational institution.</p></div></div><Link to="/education" className="inline-flex shrink-0 items-center gap-2 font-medium text-[#6b2d94]">Explore education <ArrowRight className="size-5" /></Link></div>
        </section>

        <section className="relative overflow-hidden bg-[#28133e] py-14 sm:py-20">
          <BrandShine />
          <motion.div {...reveal} className="relative mx-auto flex max-w-[1500px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><h2 className="text-3xl font-medium text-[#f6d98b]"><Copy contentKey="cta.heading" fallback="How Can We Help?" /></h2><p className="mt-4 leading-8 text-white/80"><Copy contentKey="cta.subheading" fallback="Connect with our team to discuss home care for a loved one or staffing support for your organization." /></p></div><a href="tel:+13369997123" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#f6d98b] px-7 py-4 font-medium text-[#28133e] transition-transform hover:-translate-y-1"><Phone className="size-5" /> (336) 999-7123</a></motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
