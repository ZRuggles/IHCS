import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { Briefcase, DollarSign, GraduationCap, Heart, Users, TrendingUp, Award, Clock, Shield, Headphones } from "lucide-react";

const JOB_APPLICATION_URL = "https://innjobs.sembra1.com/";
const NURSING_APPLICATION_PDF_URL =
  "https://innovationhealthcaresolutions.com/wp-content/uploads/2024/08/Innovation-Healthcare-Solutions-Nursing-Applic.pdf";
const EMPLOYMENT_HERO_IMAGE = "/Supplemental Staffing.jpeg";
const TEAM_BREAK_IMAGE = "/Home Care Services.jpeg";
const HEALTHCARE_INSTRUCTOR_IMAGE =
  "https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdHJhaW5pbmclMjBjbGFzc3Jvb20lMjBzdHVkZW50c3xlbnwxfHx8fDE3NzQxMTc3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export default function Employment() {
  const positionBackgroundImageByTitle: Record<string, string> = {
    "Registered Nurse (RN)": "/LPN and RN.jpg",
    "Licensed Practical Nurse (LPN)": "/PRN Home Visit.jpg",
    "Certified Nursing Assistant (CNA)": "/NurseAide.jpg",
    "Medical Assistant": "/Home Care Services.jpeg",
    "Phlebotomy Technician": "/Infusion.jpeg",
    "Healthcare Instructor": HEALTHCARE_INSTRUCTOR_IMAGE
  };

  const positions = [
    {
      title: "Registered Nurse (RN)",
      type: "Full-time / Part-time",
      description: "Provide skilled nursing care for in-home infusion therapy and patient care. Work with diverse patient populations across all ages.",
      requirements: ["Active RN license", "Infusion therapy experience preferred", "Reliable transportation", "Excellent communication skills"]
    },
    {
      title: "Licensed Practical Nurse (LPN)",
      type: "Full-time / Part-time",
      description: "Support patient care in home health settings. Administer medications, monitor vital signs, and provide quality nursing care.",
      requirements: ["Active LPN license", "Home health experience preferred", "Strong clinical skills", "Compassionate care approach"]
    },
    {
      title: "Certified Nursing Assistant (CNA)",
      type: "Full-time / Part-time / PRN",
      description: "Provide direct patient care including bathing, dressing, and mobility assistance. Help patients maintain independence at home.",
      requirements: ["Current CNA certification", "Clean background check", "Reliable transportation", "Caring and patient demeanor"]
    },
    {
      title: "Medical Assistant",
      type: "Full-time",
      description: "Support clinical operations including patient intake, vital signs, EKG, phlebotomy, and administrative tasks.",
      requirements: ["MA certification or equivalent", "Clinical experience", "Proficiency in EHR systems", "Strong organizational skills"]
    },
    {
      title: "Phlebotomy Technician",
      type: "Full-time / Part-time",
      description: "Perform blood draws for home health patients and clinical settings. Maintain quality specimen collection and processing.",
      requirements: ["Phlebotomy certification", "Venipuncture experience", "Attention to detail", "Professional patient interaction"]
    },
    {
      title: "Healthcare Instructor",
      type: "Full-time / Part-time",
      description: "Teach healthcare certification courses including CNA, phlebotomy, and medical assistant programs. Shape the next generation of healthcare professionals.",
      requirements: ["Relevant healthcare certification", "Teaching experience preferred", "Strong communication skills", "Passion for education"]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Competitive wages with regular performance reviews and raises"
    },
    {
      icon: Shield,
      title: "Retirement Plan",
      description: "Simple IRA with 3% company match to secure your future"
    },
    {
      icon: GraduationCap,
      title: "Paid Training",
      description: "Comprehensive training from day one with ongoing education opportunities"
    },
    {
      icon: Heart,
      title: "Free Supplies",
      description: "Complimentary supplies for basic lab draws and antibiotic therapy"
    },
    {
      icon: Users,
      title: "Simulation Labs",
      description: "Access to state-of-the-art training facilities and equipment"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Around-the-clock clinical support and guidance"
    },
    {
      icon: Clock,
      title: "Flexible Schedules",
      description: "Full-time, part-time, and PRN positions available"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Advancement opportunities and career development programs"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-white py-12 sm:py-16 lg:py-20 border-b border-gray-200 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${EMPLOYMENT_HERO_IMAGE}')`
            }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
          
          <div className="max-w-[1600px] mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              <motion.div 
                className="lg:col-span-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block bg-[#eee5f5] text-[#561D7E] px-4 py-2 rounded-full text-sm mb-6">
                  Join Our Team
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight text-[#101828]">
                  Build Your Career in Healthcare
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed mb-8">
                  Join Innovation Healthcare as a skilled nursing professional. We're seeking compassionate, dedicated individuals to provide exceptional in-home care and education throughout Winston-Salem, North Carolina.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#positions"
                    className="bg-[#561D7E] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#461464] transition-all hover:scale-105 text-base sm:text-lg"
                  >
                    View Open Positions
                  </a>
                  <a
                    href="#benefits"
                    className="bg-white border-2 border-[#561D7E] text-[#561D7E] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-all hover:scale-105 text-base sm:text-lg"
                  >
                    See Benefits
                  </a>
                </div>
              </motion.div>
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-gradient-to-br from-[#ffcc00] to-[#ffcc00] rounded-3xl p-8 shadow-xl">
                  <div className="space-y-6">
                    {[
                      { value: "$30-40", label: "Per Hour PRN Rate" },
                      { value: "3%", label: "Company 401K Match" },
                      { value: "Multiple", label: "Counties Served" }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className={index > 0 ? "border-t border-[#5b2484]/20 pt-4" : ""}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                      >
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5b2484] mb-2">{stat.value}</div>
                        <div className="text-[#5b2484]/80">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Why Choose Innovation Healthcare
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                We invest in our team members with competitive benefits, ongoing training, and a supportive work environment
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <motion.div 
                className="bg-gradient-to-br from-[#eee5f5] to-white p-8 rounded-2xl border border-[#eee5f5] group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(152, 16, 250, 0.15)" }}
              >
                <motion.div 
                  className="bg-[#561D7E] p-3 rounded-xl w-fit mb-4"
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Award className="size-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-medium text-[#101828] mb-3">
                  Quality Care Focus
                </h3>
                <p className="text-[#4a5565] leading-relaxed">
                  Join a team that prioritizes patient outcomes and quality care delivery. We support our staff with the resources needed to excel.
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-[#6b2d94] to-[#4a1a6d] p-8 rounded-2xl text-white group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(152, 16, 250, 0.3)" }}
              >
                <motion.div 
                  className="bg-white/20 p-3 rounded-xl w-fit mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="size-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-medium mb-3">
                  Supportive Team
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Work alongside experienced professionals in a collaborative environment. We believe in teamwork and mutual support.
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-[#ffcc00] to-[#ffcc00] p-8 rounded-2xl group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(253, 199, 0, 0.3)" }}
              >
                <motion.div 
                  className="bg-[#5b2484]/10 p-3 rounded-xl w-fit mb-4"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <TrendingUp className="size-8 text-[#5b2484]" />
                </motion.div>
                <h3 className="text-2xl font-medium text-[#5b2484] mb-3">
                  Career Growth
                </h3>
                <p className="text-[#5b2484]/80 leading-relaxed">
                  Advance your career with continuing education opportunities, mentorship programs, and promotion pathways.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-[#f7f2fb]">
          <div className="max-w-[1600px] mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Comprehensive Benefits Package
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                We take care of our team members with competitive benefits and ongoing support
              </p>
            </motion.div>

            {/* Bento-box style layout with varying sizes */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* Large feature card */}
              <motion.div 
                className="md:col-span-3 bg-gradient-to-br from-[#6b2d94] to-[#4a1a6d] text-white p-8 rounded-2xl shadow-lg group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: "0 30px 60px rgba(152, 16, 250, 0.4)" }}
              >
                <motion.div 
                  className="bg-white/20 p-3 rounded-xl w-fit mb-4"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DollarSign className="size-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-medium mb-3">
                  {benefits[0].title}
                </h3>
                <p className="text-white/90 text-lg">
                  {benefits[0].description}
                </p>
              </motion.div>

              {/* Medium card */}
              <motion.div 
                className="md:col-span-3 bg-[#ffcc00] p-8 rounded-2xl shadow-lg group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 30px 60px rgba(253, 199, 0, 0.4)" }}
              >
                <motion.div 
                  className="bg-[#5b2484]/10 p-3 rounded-xl w-fit mb-4"
                  whileHover={{ y: -8, rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Shield className="size-10 text-[#5b2484]" />
                </motion.div>
                <h3 className="text-2xl font-medium text-[#5b2484] mb-3">
                  {benefits[1].title}
                </h3>
                <p className="text-[#5b2484]/80 text-lg">
                  {benefits[1].description}
                </p>
              </motion.div>

              {/* Compact cards row */}
              {[benefits[2], benefits[3], benefits[4]].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div 
                    key={index}
                    className="md:col-span-2 bg-white border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                    whileHover={{ y: -5, borderColor: "rgba(152, 16, 250, 0.3)" }}
                  >
                    <motion.div 
                      className="bg-[#eee5f5] p-3 rounded-xl w-fit mb-3"
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="size-6 text-[#6b2d94]" />
                    </motion.div>
                    <h3 className="font-medium text-base text-[#101828] mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-[#6a7282] text-sm">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}

              {/* Bottom row */}
              {[benefits[5], benefits[6], benefits[7]].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div 
                    key={index}
                    className="md:col-span-2 bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 rounded-xl group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)" }}
                  >
                    <motion.div 
                      className="bg-[#eee5f5] p-3 rounded-xl w-fit mb-3"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="size-6 text-[#6b2d94]" />
                    </motion.div>
                    <h3 className="font-medium text-base text-[#101828] mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-[#6a7282] text-sm">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Image Break */}
        <section className="relative h-[300px] sm:h-[420px] lg:h-[500px] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${TEAM_BREAK_IMAGE}')`
            }}
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffcc00]/85 to-[#ffcc00]/65" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="max-w-[1600px] mx-auto px-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#5b2484] mb-6">
                Join a Team That Values You
              </h2>
              <p className="text-2xl text-[#5b2484]/90 max-w-3xl mx-auto">
                Be part of a healthcare organization that invests in your growth, supports your career, and celebrates your success
              </p>
            </motion.div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Current Openings
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Explore our available positions and find the perfect role for your skills and experience
              </p>
            </motion.div>
            <div className="flex justify-center mb-8">
              <a
                href={NURSING_APPLICATION_PDF_URL}
                target="_blank"
                rel="noreferrer"
                className="bg-white border-2 border-[#6b2d94] text-[#6b2d94] px-6 py-3 rounded-full hover:bg-[#eee5f5] transition-colors text-sm sm:text-base"
              >
                Nursing Application (PDF)
              </a>
            </div>

            <div className="space-y-6">
              {positions.map((position, index) => {
                const cardBackgroundImage =
                  positionBackgroundImageByTitle[position.title] ?? "/NurseAide.jpg";

                return (
                <motion.div 
                  key={index} 
                  className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[42%]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${cardBackgroundImage}')` }}
                    />
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/90 to-transparent" />
                  </div>

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:pr-[40%]">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div 
                          className="bg-[#eee5f5] p-3 rounded-xl shrink-0"
                          whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Briefcase className="size-6 text-[#6b2d94]" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-medium text-[#101828] mb-2 group-hover:text-[#6b2d94] transition-colors">
                            {position.title}
                          </h3>
                          <div className="inline-block bg-[#eee5f5] text-[#6b2d94] px-3 py-1 rounded-full text-sm">
                            {position.type}
                          </div>
                        </div>
                      </div>
                      <p className="text-[#4a5565] leading-relaxed mb-4">
                        {position.description}
                      </p>
                      <div>
                        <h4 className="font-medium text-[#101828] mb-2">Requirements:</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {position.requirements.map((req, idx) => (
                            <li key={idx} className="flex gap-2 items-start text-[#6a7282]">
                              <div className="bg-[#6b2d94] rounded-full size-2 mt-2 shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="shrink-0 space-y-2">
                      <a
                        href={JOB_APPLICATION_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="block bg-[#6b2d94] text-white px-8 py-3 rounded-full hover:bg-[#4a1a6d] transition-all hover:scale-105 text-center whitespace-nowrap"
                      >
                        Apply Now
                      </a>
                      {position.title === "Registered Nurse (RN)" ? (
                        <a
                          href={NURSING_APPLICATION_PDF_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="block bg-white border border-[#6b2d94] text-[#6b2d94] px-8 py-3 rounded-full hover:bg-[#eee5f5] transition-colors text-center whitespace-nowrap text-sm"
                        >
                          Nursing PDF
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-[#f7f2fb]">
          <div className="max-w-[1600px] mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                How to Apply
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565]">
                Join our team in four simple steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { num: 1, title: "Submit Application", desc: "Complete our online application form with your information and experience" },
                { num: 2, title: "Phone Screening", desc: "Brief phone conversation to discuss your background and the position" },
                { num: 3, title: "Interview", desc: "Meet with our team to learn more about the role and our organization" },
                { num: 4, title: "Start Your Career", desc: "Complete onboarding and begin making a difference in patients' lives" }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <motion.div 
                    className="bg-[#6b2d94] text-white size-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="font-medium text-lg text-[#101828] mb-2">{step.title}</h3>
                  <p className="text-[#6a7282]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#6b2d94] to-[#4a1a6d] py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1600px] mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our team of dedicated healthcare professionals. Apply today or contact us to learn more about career opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={JOB_APPLICATION_URL}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-[#6b2d94] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-100 transition-colors text-base sm:text-lg"
              >
                Apply Now
              </a>
              <a
                href="tel:+13369997123"
                className="bg-transparent border-2 border-white text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/10 transition-colors text-base sm:text-lg"
              >
                Call (336) 999-7123
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}





