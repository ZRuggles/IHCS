import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { GraduationCap, Clock, DollarSign, Calendar, ArrowRight } from "lucide-react";
import { courses, cnaAndRefresherSchedule, phlebotomySchedule } from "../data/courses";
import { APPLICATION_LINKS } from "../data/siteInfo";

export default function Courses() {
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
              backgroundImage: `url('/NursesHoldingDiplomas.jpg')`
            }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
          
          <div className="max-w-[1600px] mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block bg-[#eee5f5] text-[#6b2d94] px-4 py-2 rounded-full text-sm mb-6">
                  Healthcare Training Programs
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight text-[#101828]">
                  Explore Our Healthcare Training Programs
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed">
                  State-approved certifications designed to launch your healthcare career. Flexible schedules, expert instruction, and hands-on training to help you succeed.
                </p>
              </motion.div>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6b2d94] to-[#4a1a6d] rounded-3xl rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-[#6b2d94]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#ffcc00] p-2 rounded-lg">
                        <GraduationCap className="size-6 text-[#5b2484]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#101828]">{courses.length} Programs Available</div>
                        <div className="text-sm text-[#6a7282]">Healthcare training programs</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#eee5f5] p-2 rounded-lg">
                        <Calendar className="size-6 text-[#6b2d94]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#101828]">Classes Starting Soon</div>
                        <div className="text-sm text-[#6a7282]">2026 schedule is now posted</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#eee5f5] p-2 rounded-lg">
                        <Clock className="size-6 text-[#6b2d94]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#101828]">Flexible Options</div>
                        <div className="text-sm text-[#6a7282]">Day, evening & weekend classes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Course Schedules */}
        <section className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-white to-[#f7f2fb] border-y border-[#eee5f5]">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Course Schedules
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-3xl mx-auto">
                Published schedules for 2026 and early 2027 cohorts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                className="bg-white border border-[#dfd1eb] rounded-2xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-medium text-[#101828] mb-4">
                  CNA and CNA Refresher Schedule
                </h3>
                <ul className="space-y-3 text-[#4a5565]">
                  {cnaAndRefresherSchedule.map((date) => (
                    <li key={date} className="flex items-start gap-3">
                      <div className="bg-[#6b2d94] rounded-full size-2 mt-2 shrink-0" />
                      <span>{date}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="bg-white border border-[#dfd1eb] rounded-2xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-2xl font-medium text-[#101828] mb-4">
                  Phlebotomy Dates
                </h3>
                <ul className="space-y-3 text-[#4a5565]">
                  {phlebotomySchedule.map((date) => (
                    <li key={date} className="flex items-start gap-3">
                      <div className="bg-[#6b2d94] rounded-full size-2 mt-2 shrink-0" />
                      <span>{date}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-10 sm:py-14 lg:py-16 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-4 bg-white border-2 border-[#6b2d94] rounded-full px-6 py-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#6b2d94] p-3 rounded-full shrink-0">
                  <GraduationCap className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-base text-[#101828]">State Approved</h3>
                  <p className="text-[#6a7282] text-sm">All programs certified</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white border-2 border-[#dfd1eb] rounded-full px-6 py-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#eee5f5] p-3 rounded-full shrink-0">
                  <Clock className="size-6 text-[#6b2d94]" />
                </div>
                <div>
                  <h3 className="font-medium text-base text-[#101828]">Flexible Schedules</h3>
                  <p className="text-[#6a7282] text-sm">Day, evening & weekend</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#ffcc00] rounded-full px-6 py-4 shadow-lg">
                <div className="bg-[#5b2484]/10 p-3 rounded-full shrink-0">
                  <DollarSign className="size-6 text-[#5b2484]" />
                </div>
                <div>
                  <h3 className="font-medium text-base text-[#5b2484]">Affordable Tuition</h3>
                  <p className="text-[#5b2484]/80 text-sm">Payment plans available</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-full px-6 py-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#eee5f5] p-3 rounded-full shrink-0">
                  <Calendar className="size-6 text-[#6b2d94]" />
                </div>
                <div>
                  <h3 className="font-medium text-base text-[#101828]">Starting Soon</h3>
                  <p className="text-[#6a7282] text-sm">Multiple start dates</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-[#f7f2fb]">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Available Programs
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Choose the program that fits your career goals and schedule. All courses include hands-on training and certification preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Link
                    to={`/courses/${course.id}`}
                    className="block bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-2xl transition-all"
                  >
                    <div className="relative h-48 lg:h-52 xl:h-56 overflow-hidden">
                      <motion.img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover object-center xl:object-[center_56%]"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      {course.badge && (
                        <div className="absolute top-4 left-4 bg-[#ffcc00] text-[#5b2484] px-3 py-1 rounded-full text-sm font-medium">
                          {course.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-base sm:text-lg lg:text-xl font-medium text-[#101828] mb-2 group-hover:text-[#6b2d94] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-[#6a7282] mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[#6a7282] mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          <span>{course.nextStart}</span>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-[#6b2d94] font-medium group-hover:gap-3 transition-all">
                        Learn More
                        <ArrowRight className="size-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enrollment Process */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Simple Enrollment Process
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565]">
                Get started in just four easy steps
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-[#6b2d94] text-white size-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-medium text-lg text-[#101828] mb-2">Choose Program</h3>
                <p className="text-[#6a7282]">
                  Select the healthcare program that matches your career goals
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#6b2d94] text-white size-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-medium text-lg text-[#101828] mb-2">Submit Application</h3>
                <p className="text-[#6a7282]">
                  Complete the simple application form and provide required documents
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#6b2d94] text-white size-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-medium text-lg text-[#101828] mb-2">Meet Advisor</h3>
                <p className="text-[#6a7282]">
                  Schedule a meeting with our admissions team
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#6b2d94] text-white size-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-medium text-lg text-[#101828] mb-2">Start Learning</h3>
                <p className="text-[#6a7282]">
                  Begin your journey to a rewarding healthcare career
                </p>
              </div>
            </div>

            <div className="mt-12 bg-[#f7f2fb] border border-[#dfd1eb] rounded-2xl p-6 sm:p-8 text-center">
              <h3 className="text-2xl font-medium text-[#101828] mb-3">
                Apply Online
              </h3>
              <p className="text-[#4a5565] max-w-2xl mx-auto mb-6">
                Start with the School Application Form, then complete the Enrollment Agreement Forms for admissions review.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={APPLICATION_LINKS.schoolApplication}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#6b2d94] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#4a1a6d] transition-colors"
                >
                  School Application Form
                </a>
                <a
                  href={APPLICATION_LINKS.enrollmentAgreement}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border-2 border-[#6b2d94] text-[#6b2d94] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-colors"
                >
                  Enrollment Forms
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#eee5f5] to-[#f7f2fb] py-10 sm:py-14 lg:py-16">
          <div className="max-w-[1600px] mx-auto px-4 text-center">
            <h2 className="text-3xl font-medium text-[#101828] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-[#4a5565] mb-8 max-w-2xl mx-auto">
              Have questions about our programs? Our admissions team is here to help you find the perfect training program.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={APPLICATION_LINKS.schoolApplication}
                target="_blank"
                rel="noreferrer"
                className="bg-[#6b2d94] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#4a1a6d] transition-colors"
              >
                Apply Online
              </a>
              <a
                href={APPLICATION_LINKS.enrollmentAgreement}
                target="_blank"
                rel="noreferrer"
                className="bg-white border-2 border-[#6b2d94] text-[#6b2d94] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-colors"
              >
                Enrollment Forms
              </a>
              <a
                href="tel:+13369997123"
                className="bg-white border-2 border-[#6b2d94] text-[#6b2d94] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-colors"
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





