import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArrowRight, GraduationCap, Users, Clock, CheckCircle, Award, Star } from "lucide-react";
import { courses } from "../data/courses";
import { APPLICATION_LINKS } from "../data/siteInfo";

export default function Home() {
  const featuredCourses = courses.slice(0, 6);

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
                  Healthcare Programs
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#101828] leading-tight mb-6">
                  Your Path to a <span className="text-[#561D7E]">Rewarding</span><br />Healthcare Career
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed mb-8">
                  Transform your future with state-approved healthcare training programs. Get the skills, certification, and confidence to excel in your new career.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <a
                    href={APPLICATION_LINKS.schoolApplication}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#561D7E] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#461464] transition-all hover:scale-105 text-base sm:text-lg"
                  >
                    Apply Online
                  </a>
                  <Link
                    to="/courses"
                    className="bg-white border-2 border-[#561D7E] text-[#561D7E] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-all hover:scale-105 text-base sm:text-lg"
                  >
                    Explore Programs
                  </Link>
                  <Link
                    to="/contact"
                    className="bg-white border-2 border-gray-300 text-[#4a5565] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-50 transition-all hover:scale-105 text-base sm:text-lg"
                  >
                    Schedule A Tour
                  </Link>
                </div>
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg flex flex-wrap justify-around gap-4 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div>
                    <div className="text-3xl font-bold text-[#561D7E]">{courses.length}</div>
                    <div className="text-sm text-[#6a7282]">Programs</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#561D7E]">120-Hour</div>
                    <div className="text-sm text-[#6a7282]">CNA Training</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#561D7E]">State</div>
                    <div className="text-sm text-[#6a7282]">Approved</div>
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
                  src="/NursesHoldingDiplomas.jpg"
                  alt="Healthcare Training"
                  className="rounded-2xl shadow-2xl w-full"
                />
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
                      <div className="font-semibold text-[#101828]">Next Class</div>
                      <div className="text-sm text-[#6a7282]">Start dates throughout 2026</div>
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
                Healthcare Programs
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Find Your Perfect Program
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Choose from our range of comprehensive healthcare training programs, each designed to prepare you for a successful career.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  nextStart={course.nextStart}
                  image={course.image}
                  badge={course.badge}
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
                We're Invested in Your Success
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Our commitment goes beyond education - we provide the resources and support you need to thrive in your healthcare career.
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
                    Expert Instructors
                  </h3>
                  <p className="text-[#4a5565] leading-relaxed">
                    Learn from experienced healthcare professionals with real-world expertise who are passionate about your success.
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
                  Career Support
                </h3>
                <p className="text-[#4a5565] text-lg leading-relaxed">
                  We provide job placement assistance and career support to help every graduate take the next step in their career.
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
                  Flexible Scheduling
                </h3>
                <p className="text-[#461464]/80 text-lg leading-relaxed">
                  Day, evening, and weekend classes designed to fit your busy lifestyle and work schedule.
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
                    Hands-On Training
                  </h3>
                  <p className="text-[#4a5565] leading-relaxed">
                    Practical, real-world training with clinical experience built into every program.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Hear From Our Graduates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-[#ffcc00] text-[#ffcc00]" />
                  ))}
                </div>
                <p className="text-[#4a5565] mb-6 leading-relaxed">
                  "The program was excellent! The instructors were knowledgeable and supportive. I passed my state exam on the first try and got hired immediately."
                </p>
                <div>
                  <div className="font-medium text-[#101828]">Maria Rodriguez</div>
                  <div className="text-sm text-[#6a7282]">CNA Graduate</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-[#ffcc00] text-[#ffcc00]" />
                  ))}
                </div>
                <p className="text-[#4a5565] mb-6 leading-relaxed">
                  "The Medication Aide class fit perfectly around my work schedule. The online lessons were easy to follow and the in-person skills check-off gave me real confidence. Highly recommend!"
                </p>
                <div>
                  <div className="font-medium text-[#101828]">James Chen</div>
                  <div className="text-sm text-[#6a7282]">Medication Aide Graduate</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-[#ffcc00] text-[#ffcc00]" />
                  ))}
                </div>
                <p className="text-[#4a5565] mb-6 leading-relaxed">
                  "Great program! I was nervous at first, but the instructors made everything easy to understand. I'm so grateful for this opportunity to change my career."
                </p>
                <div>
                  <div className="font-medium text-[#101828]">Alyssa Bennett</div>
                  <div className="text-sm text-[#6a7282]">Phlebotomy Tech</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#561D7E] py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1600px] mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white mb-6">
              Ready to Begin?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Take the first step towards a fulfilling career in healthcare. Our admissions team is here to guide you through the enrollment process.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={APPLICATION_LINKS.schoolApplication}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-[#561D7E] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-100 transition-colors text-base sm:text-lg"
              >
                Apply Online
              </a>
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
                to="/courses"
                className="bg-white/10 border-2 border-white/70 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/15 transition-colors text-base sm:text-lg"
              >
                View Programs
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
  id: string;
  title: string;
  description: string;
  duration: string;
  nextStart: string;
  image: string;
  badge?: string;
}

function CourseCard({ id, title, description, duration, nextStart, image, badge }: HomeCourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link
        to={`/courses/${id}`}
        className="block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
      >
        <div className="relative h-48 overflow-hidden">
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
        <div className="p-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-medium text-[#101828] mb-2 group-hover:text-[#561D7E] transition-colors">
            {title}
          </h3>
          <p className="text-[#6a7282] mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-4 text-sm text-[#6a7282]">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="size-4" />
              <span>{nextStart}</span>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-[#561D7E] font-medium group-hover:gap-3 transition-all">
            Learn More 
            <ArrowRight className="size-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}





