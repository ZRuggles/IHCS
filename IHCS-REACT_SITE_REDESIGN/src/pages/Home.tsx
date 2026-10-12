import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BrandShine } from "../components/BrandShine";
import {
  ArrowRight,
  GraduationCap,
  Users,
  Clock,
  CheckCircle,
  Award,
  Heart,
} from "lucide-react";
import { useCourses, useText } from "../content/hooks";
import { EditableText } from "../editor/Editable";
import { APPLICATION_LINKS } from "../data/siteInfo";
import { isSchoolSite } from "../data/siteVariant";

const careServices: HomeCourseCardProps[] = [
  {
    id: "home-assistance",
    to: "/services#services",
    title: "Home Assistance",
    description:
      "Support with meal preparation, errands, housekeeping, and everyday routines in the comfort of home.",
    duration: "Everyday support",
    nextStart: "Home care",
    image: "/Home Care Services.jpeg",
  },
  {
    id: "personal-care",
    to: "/services",
    title: "Personal Care",
    description:
      "Compassionate assistance with personal care and mobility to help people maintain independence.",
    duration: "Personal support",
    nextStart: "Home care",
    image: "/PRN Home Visit.jpg",
  },
  {
    id: "staffing",
    to: "/services",
    title: "Healthcare Staffing",
    description:
      "Staffing support for healthcare facilities, medical offices, and organizations.",
    duration: "Workforce support",
    nextStart: "For employers",
    image: "/Supplemental Staffing.jpeg",
  },
  {
    id: "specialty-care",
    to: "/services",
    title: "Specialty Care Services",
    description:
      "Explore home infusion and specialized foot care services with our team.",
    duration: "Specialty services",
    nextStart: "Contact our team",
    image: "/Home Infusion.jpeg",
  },
];

export default function Home() {
  const courses = useCourses();
  const featuredCourses = courses.slice(0, 6);
  const featuredItems = isSchoolSite ? featuredCourses : careServices;
  const page = isSchoolSite ? "home" : "ihsHome";

  // Each fallback is the copy the site showed before the editor existed,
  // so an unseeded key still renders the original text rather than a gap.
  const heroEyebrow = useText(
    page,
    "hero.eyebrow",
    isSchoolSite ? "Healthcare Programs" : "Home Care & Healthcare Staffing",
  );
  const headlineLead = useText(
    page,
    "hero.headlineLead",
    isSchoolSite ? "Your Path to a" : "Your Partner in",
  );
  const headlineAccent = useText(
    page,
    "hero.headlineAccent",
    isSchoolSite ? "Rewarding" : "Compassionate",
  );
  const headlineTail = useText(
    page,
    "hero.headlineTail",
    isSchoolSite ? "Healthcare Career" : "Care & Staffing",
  );
  const heroSubheading = useText(
    page,
    "hero.subheading",
    isSchoolSite
      ? "Transform your future with state-approved healthcare training programs. Get the skills, certification, and confidence to excel in your new career."
      : "Supporting individuals and families at home while helping healthcare organizations build stronger teams. Explore care and staffing services with Innovation Healthcare Solutions.",
  );
  const stat2Value = useText(
    page,
    "hero.stat2.value",
    isSchoolSite ? "120-Hour" : "Personal",
  );
  const stat2Label = useText(
    page,
    "hero.stat2.label",
    isSchoolSite ? "CNA Training" : "Support",
  );
  const stat3Value = useText(
    page,
    "hero.stat3.value",
    isSchoolSite ? "State" : "Healthcare",
  );
  const stat3Label = useText(
    page,
    "hero.stat3.label",
    isSchoolSite ? "Approved" : "Staffing",
  );

  const programsHeading = useText(
    page,
    "programs.heading",
    isSchoolSite
      ? "Find Your Perfect Program"
      : "Care & Support for Your Needs",
  );
  const programsSubheading = useText(
    page,
    "programs.subheading",
    isSchoolSite
      ? "Choose from our range of comprehensive healthcare training programs, each designed to prepare you for a successful career."
      : "Explore home care and workforce services designed around individuals, families, and healthcare organizations.",
  );
  const successHeading = useText(
    page,
    "success.heading",
    isSchoolSite
      ? "We're Invested in Your Success"
      : "We're Invested in Your Well-Being",
  );
  const successSubheading = useText(
    page,
    "success.subheading",
    isSchoolSite
      ? "Our commitment goes beyond education - we provide the resources and support you need to thrive in your healthcare career."
      : "Care starts with understanding your needs. Our team helps you explore the support that fits your family or organization.",
  );
  const ctaHeading = useText(
    page,
    "cta.heading",
    isSchoolSite ? "Ready to Begin?" : "How Can We Help?",
  );
  const ctaSubheading = useText(
    page,
    "cta.subheading",
    isSchoolSite
      ? "Take the first step towards a fulfilling career in healthcare. Our admissions team is here to guide you through the enrollment process."
      : "Connect with our team to discuss home care for a loved one or staffing support for your organization.",
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#eee5f5] via-white to-[#f7f2fb] py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block bg-[#eee5f5] text-[#561D7E] px-4 py-2 rounded-full text-sm mb-4">
                  <EditableText
                    page={page}
                    contentKey="hero.eyebrow"
                    value={heroEyebrow}
                    label="hero badge"
                  >
                    {heroEyebrow}
                  </EditableText>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#101828] leading-tight mb-6">
                  <EditableText
                    page={page}
                    contentKey="hero.headlineLead"
                    value={headlineLead}
                    label="headline, first line"
                  >
                    {headlineLead}
                  </EditableText>{" "}
                  <span className="text-[#561D7E]">
                    <EditableText
                      page={page}
                      contentKey="hero.headlineAccent"
                      value={headlineAccent}
                      label="highlighted word"
                    >
                      {headlineAccent}
                    </EditableText>
                  </span>
                  <br />
                  <EditableText
                    page={page}
                    contentKey="hero.headlineTail"
                    value={headlineTail}
                    label="headline, second line"
                  >
                    {headlineTail}
                  </EditableText>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed mb-8">
                  <EditableText
                    page={page}
                    contentKey="hero.subheading"
                    value={heroSubheading}
                    label="hero paragraph"
                    multiline
                  >
                    {heroSubheading}
                  </EditableText>
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  {isSchoolSite ? (
                    <a
                      href={APPLICATION_LINKS.schoolApplication}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#561D7E] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#461464] transition-all hover:scale-105 text-base sm:text-lg"
                    >
                      Apply Online
                    </a>
                  ) : (
                    <Link
                      to="/contact"
                      className="bg-[#561D7E] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#461464] transition-all hover:scale-105 text-base sm:text-lg"
                    >
                      Contact Our Team
                    </Link>
                  )}
                  <Link
                    to={isSchoolSite ? "/courses" : "/services"}
                    className="bg-white border-2 border-[#561D7E] text-[#561D7E] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-all hover:scale-105 text-base sm:text-lg"
                  >
                    {isSchoolSite ? "Explore Programs" : "Explore Services"}
                  </Link>
                  <Link
                    to={isSchoolSite ? "/how-to-apply" : "/employment"}
                    className="bg-white border-2 border-gray-300 text-[#4a5565] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-50 transition-all hover:scale-105 text-base sm:text-lg"
                  >
                    {isSchoolSite ? "How to Apply" : "Join Our Team"}
                  </Link>
                </div>
                <motion.div
                  className="bg-white rounded-2xl p-6 shadow-lg flex flex-wrap justify-around gap-4 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div>
                    <div className="text-3xl font-bold text-[#561D7E]">
                      {isSchoolSite ? courses.length : "Home"}
                    </div>
                    <div className="text-sm text-[#6a7282]">
                      {isSchoolSite ? "Programs" : "Care"}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#561D7E]">
                      <EditableText
                        page={page}
                        contentKey="hero.stat2.value"
                        value={stat2Value}
                        label="second stat"
                      >
                        {stat2Value}
                      </EditableText>
                    </div>
                    <div className="text-sm text-[#6a7282]">
                      <EditableText
                        page={page}
                        contentKey="hero.stat2.label"
                        value={stat2Label}
                        label="second stat label"
                      >
                        {stat2Label}
                      </EditableText>
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#561D7E]">
                      <EditableText
                        page={page}
                        contentKey="hero.stat3.value"
                        value={stat3Value}
                        label="third stat"
                      >
                        {stat3Value}
                      </EditableText>
                    </div>
                    <div className="text-sm text-[#6a7282]">
                      <EditableText
                        page={page}
                        contentKey="hero.stat3.label"
                        value={stat3Label}
                        label="third stat label"
                      >
                        {stat3Label}
                      </EditableText>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src={
                    isSchoolSite
                      ? "/NursesHoldingDiplomas.jpg"
                      : "/PRN Home Visit.jpg"
                  }
                  alt={
                    isSchoolSite ? "Healthcare Training" : "Home care support"
                  }
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute inset-0 rounded-2xl"><BrandShine /></div>
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#ffcc00] p-2 rounded-lg">
                      <CheckCircle className="size-5 text-[#461464]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#101828]">
                        {isSchoolSite ? "Your Next Step" : "Care That Fits"}
                      </div>
                      <div className="text-sm text-[#6a7282]">
                        {isSchoolSite
                          ? "Explore programs & admissions"
                          : "Support for families & healthcare teams"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block bg-[#eee5f5] text-[#561D7E] px-4 py-2 rounded-full text-sm mb-4">
                {isSchoolSite ? "Healthcare Programs" : "Healthcare Services"}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                <EditableText
                  page={page}
                  contentKey="programs.heading"
                  value={programsHeading}
                  label="programs section heading"
                >
                  {programsHeading}
                </EditableText>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                <EditableText
                  page={page}
                  contentKey="programs.subheading"
                  value={programsSubheading}
                  label="programs paragraph"
                  multiline
                >
                  {programsSubheading}
                </EditableText>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {featuredItems.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  nextStart={course.nextStart}
                  image={course.image}
                  badge={course.badge}
                  to={"to" in course ? course.to : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Investment Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#f7f2fb] to-[#eee5f5]">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                <EditableText
                  page={page}
                  contentKey="success.heading"
                  value={successHeading}
                  label="success section heading"
                >
                  {successHeading}
                </EditableText>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                <EditableText
                  page={page}
                  contentKey="success.subheading"
                  value={successSubheading}
                  label="success paragraph"
                  multiline
                >
                  {successSubheading}
                </EditableText>
              </p>
            </div>

            {/* Horizontal feature cards with images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-[#561D7E] to-[#461464] flex items-center justify-center">
                  <Users className="size-20 text-white/90 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-[#101828] mb-2">
                    {isSchoolSite
                      ? "Expert Instructors"
                      : "A People-First Approach"}
                  </h3>
                  <p className="text-[#4a5565] leading-relaxed">
                    {isSchoolSite
                      ? "Learn from experienced healthcare professionals with real-world expertise who are passionate about your success."
                      : "Talk with a team focused on the needs of individuals, families, and healthcare organizations."}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-white border border-[#dfd1eb] rounded-2xl p-8 shadow-lg flex flex-col justify-center group hover:shadow-2xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-[#eee5f5] p-4 rounded-xl w-fit mb-4 group-hover:bg-[#dfd1eb] transition-colors">
                  <CheckCircle className="size-12 text-[#561D7E]" />
                </div>
                <h3 className="text-2xl font-medium text-[#101828] mb-3">
                  {isSchoolSite ? "Career Support" : "Support at Home"}
                </h3>
                <p className="text-[#4a5565] text-lg leading-relaxed">
                  {isSchoolSite
                    ? "We provide job placement assistance and career support to help every graduate take the next step in their career."
                    : "Explore assistance with everyday routines, personal care, and support for family caregivers."}
                </p>
              </motion.div>

              <motion.div
                className="bg-[#ffcc00] rounded-2xl p-8 flex flex-col justify-center shadow-lg group hover:shadow-2xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-[#461464]/10 p-4 rounded-xl w-fit mb-4 group-hover:bg-[#461464]/20 transition-colors">
                  <Clock className="size-12 text-[#461464]" />
                </div>
                <h3 className="text-2xl font-medium text-[#461464] mb-3">
                  {isSchoolSite
                    ? "Flexible Scheduling"
                    : "Explore Your Options"}
                </h3>
                <p className="text-[#461464]/80 text-lg leading-relaxed">
                  {isSchoolSite
                    ? "Day, evening, and weekend classes designed to fit your busy lifestyle and work schedule."
                    : "Discuss your care or staffing needs with our team and learn about available services."}
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-[#eee5f5] via-[#f7f2fb] to-white flex items-center justify-center border-b border-gray-200">
                  <Award className="size-20 text-[#561D7E] group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-[#101828] mb-2">
                    {isSchoolSite
                      ? "Hands-On Training"
                      : "Healthcare Workforce Support"}
                  </h3>
                  <p className="text-[#4a5565] leading-relaxed">
                    {isSchoolSite
                      ? "Practical, real-world training with clinical experience built into every program."
                      : "Connect with our team about staffing support for medical offices and healthcare facilities."}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#561D7E] py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1600px] mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white mb-6">
              <EditableText
                page={page}
                contentKey="cta.heading"
                value={ctaHeading}
                label="closing heading"
              >
                {ctaHeading}
              </EditableText>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              <EditableText
                page={page}
                contentKey="cta.subheading"
                value={ctaSubheading}
                label="closing paragraph"
                multiline
              >
                {ctaSubheading}
              </EditableText>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isSchoolSite ? (
                <a
                  href={APPLICATION_LINKS.schoolApplication}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-[#561D7E] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-100 transition-colors text-base sm:text-lg"
                >
                  Apply Online
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="bg-white text-[#561D7E] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-100 transition-colors text-base sm:text-lg"
                >
                  Contact Our Team
                </Link>
              )}
              {/* Enrollment Forms — temporarily disabled while the Populi flow is confirmed.
              <a
                href={APPLICATION_LINKS.enrollmentAgreement}
                target="_blank"
                rel="noreferrer"
                className="bg-transparent border-2 border-white text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/10 transition-colors text-base sm:text-lg"
              >
                Enrollment Forms
              </a>
              */}
              <Link
                to={isSchoolSite ? "/courses" : "/services"}
                className="bg-white/10 border-2 border-white/70 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/15 transition-colors text-base sm:text-lg"
              >
                {isSchoolSite ? "View Programs" : "View Services"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface HomeCourseCardProps {
  to?: string;
  id: string;
  title: string;
  description: string;
  duration: string;
  nextStart: string;
  image: string;
  badge?: string;
}

function CourseCard({
  id,
  title,
  description,
  duration,
  nextStart,
  image,
  badge,
  to,
}: HomeCourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link
        to={to ?? `/courses/${id}`}
        className="flex h-full flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
      >
        <div className="relative h-48 shrink-0 overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {badge && (
            <div className="absolute top-4 left-4 bg-[#ffcc00] text-[#461464] px-3 py-1 rounded-full text-sm font-medium">
              {badge}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-medium text-[#101828] mb-2 group-hover:text-[#561D7E] transition-colors">
            {title}
          </h3>
          <p className="text-[#6a7282] mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 text-sm text-[#6a7282]">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              {isSchoolSite ? (
                <GraduationCap className="size-4" />
              ) : (
                <Heart className="size-4" />
              )}
              <span>{nextStart}</span>
            </div>
          </div>
          <div className="mt-auto pt-4 inline-flex items-center gap-2 text-[#561D7E] font-medium group-hover:gap-3 transition-all">
            Learn More
            <ArrowRight className="size-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
