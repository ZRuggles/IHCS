import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { MapPin, Phone, Clock, Send, Facebook, Linkedin, Mail, Shield, Headphones, FileText } from "lucide-react";
import { useState } from "react";
import { APPLICATION_LINKS, CONTACT_INFO, ADMISSION_EMAIL, buildDocumentEmailHref } from "../data/siteInfo";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interest: "",
        message: ""
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#eee5f5] via-white to-[#f7f2fb] py-10 sm:py-14 lg:py-16 border-b border-gray-200 overflow-hidden">
          {/* Floating background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-[#6b2d94] rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffcc00] rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="max-w-[1600px] mx-auto px-4 relative">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-block bg-white border-2 border-[#6b2d94] text-[#6b2d94] px-4 py-2 rounded-full text-sm mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Get In Touch
              </motion.div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight text-[#101828]">
                Contact Us
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed">
                Have questions about our programs or services? We're here to help! Reach out to us and our team will get back to you as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-10 sm:py-14 lg:py-16 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {[
                {
                  icon: MapPin,
                  title: "Location",
                  content: (
                    <a
                      href="https://maps.google.com/?q=609+Peters+Creek+Parkway+Winston+Salem+NC+27103"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#6b2d94] hover:underline text-sm"
                    >
                      609 Peters Creek Parkway
                      <br />
                      Winston Salem, NC 27103
                    </a>
                  )
                },
                {
                  icon: Phone,
                  title: "Main Line",
                  content: (
                    <a href="tel:+13369997123" className="text-[#6b2d94] hover:underline">
                      (336) 999-7123
                    </a>
                  )
                },
                {
                  icon: Shield,
                  title: "After Hours Emergency",
                  content: (
                    <a href="tel:+13369345354" className="text-[#6b2d94] hover:underline">
                      (336) 934-5354
                    </a>
                  )
                },
                {
                  icon: Headphones,
                  title: "Help Desk / Fax",
                  content: (
                    <a href={CONTACT_INFO.faxHref} className="text-[#6b2d94] hover:underline">
                      {CONTACT_INFO.faxNumber}
                    </a>
                  )
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: (
                    <a href="mailto:contact@innovationhealthcaresolutions.com" className="text-[#6b2d94] hover:underline break-all">
                      contact@innovationhealthcaresolutions.com
                    </a>
                  )
                },
                {
                  icon: Clock,
                  title: "Hours",
                  content: (
                    <p className="text-[#6a7282] text-sm">
                      Mon - Thu: 9:00 AM - 2:00 PM
                      <br />
                      Fri - Sun: Closed
                    </p>
                  )
                }
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div 
                    key={index}
                    className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-6 rounded-xl text-center group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, boxShadow: "0 10px 30px rgba(152, 16, 250, 0.15)" }}
                  >
                    <motion.div 
                      className="bg-[#6b2d94] p-3 rounded-xl w-fit mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="size-6 text-white" />
                    </motion.div>
                    <h3 className="font-medium text-lg text-[#101828] mb-2">{card.title}</h3>
                    {card.content}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Image */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-[#f7f2fb]">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-medium text-[#101828] mb-4">
                  Send Us a Message
                </h2>
                <p className="text-lg text-[#4a5565] mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {submitted && (
                  <motion.div 
                    className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Send className="size-5" />
                    <p>Thank you! Your message has been sent successfully.</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-[#101828] mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2d94] focus:border-transparent transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-[#101828] mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2d94] focus:border-transparent transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#101828] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2d94] focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#101828] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2d94] focus:border-transparent transition-all"
                        placeholder="(336) 999-7123"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-[#101828] mb-2">
                      I'm Interested In *
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2d94] focus:border-transparent transition-all"
                    >
                      <option value="">Select an option</option>
                      <option value="hybrid-nurse-aide">Nurse Aide / Nursing Assistant Program</option>
                      <option value="hybrid-phlebotomy-technician">Phlebotomy Course</option>
                      <option value="medication-aide">Medication Aide Class</option>
                      <option value="med-tech">Med Tech Course</option>
                      <option value="hybrid-refresher-course">Nurse Aide Refresher / CNA Refresher Course</option>
                      <option value="aha-cpr-instructor">American Heart Association CPR Instructor Course</option>
                      <option value="home-care">Home Care Services</option>
                      <option value="employment">Employment Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#101828] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2d94] focus:border-transparent resize-none transition-all"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-[#6b2d94] text-white py-4 rounded-full hover:bg-[#4a1a6d] transition-colors text-base sm:text-lg font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="size-5" />
                    Send Message
                  </motion.button>
                </form>
              </motion.div>

              {/* Image & Additional Info */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="relative h-[260px] sm:h-[340px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="/Supplemental Staffing.jpeg"
                    alt="Contact Us"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  className="bg-white border border-gray-200 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-[#eee5f5] p-3 rounded-xl w-fit mb-4">
                    <FileText className="size-6 text-[#6b2d94]" />
                  </div>
                  <h3 className="text-2xl font-medium text-[#101828] mb-3">
                    Apply Online
                  </h3>
                  <p className="text-[#4a5565] mb-6">
                    Complete the School Application Form and submit any required documents for admissions review.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={APPLICATION_LINKS.schoolApplication}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#6b2d94] text-white px-6 py-3 rounded-full hover:bg-[#4a1a6d] transition-colors text-center font-medium"
                    >
                      School Application Form
                    </a>
                    {/* Enrollment Agreement Forms — temporarily disabled while the Populi flow is confirmed.
                    <a
                      href={APPLICATION_LINKS.enrollmentAgreement}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white border-2 border-[#6b2d94] text-[#6b2d94] px-6 py-3 rounded-full hover:bg-[#eee5f5] transition-colors text-center font-medium"
                    >
                      Enrollment Agreement Forms
                    </a>
                    */}
                  </div>
                </motion.div>

                {/* Send Documents by Email */}
                <motion.div
                  className="bg-white border border-gray-200 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.28 }}
                  whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-[#eee5f5] p-3 rounded-xl w-fit mb-4">
                    <Mail className="size-6 text-[#6b2d94]" />
                  </div>
                  <h3 className="text-2xl font-medium text-[#101828] mb-3">
                    Send Your Documents
                  </h3>
                  <p className="text-[#4a5565] mb-6">
                    Send all other requested documents to our admissions team. Click the button below to open your email app with everything pre-filled — just attach your documents (Valid ID, Social Security Card, Official Transcript or GED, immunization records, etc.) and hit send.
                  </p>
                  <a
                    href={buildDocumentEmailHref()}
                    className="inline-flex items-center justify-center gap-2 bg-[#6b2d94] text-white px-6 py-3 rounded-full hover:bg-[#4a1a6d] transition-colors text-center font-medium"
                  >
                    <Mail className="size-5" />
                    Email Your Documents
                  </a>
                  <p className="text-sm text-[#6a7282] mt-4 break-all">
                    Or email us directly at{" "}
                    <a href={buildDocumentEmailHref()} className="text-[#6b2d94] hover:underline">
                      {ADMISSION_EMAIL}
                    </a>
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white border border-gray-200 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                  <h3 className="text-2xl font-medium text-[#101828] mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {[
                      { q: "How do I enroll in a program?", a: "Contact us by phone or email, and our admissions team will guide you through the enrollment process and answer any questions." },
                      { q: "What payment options are available?", a: "We offer flexible payment plans and accept various forms of payment. Financial aid may be available for those who qualify." },
                      { q: "Can I schedule a campus tour?", a: "Yes! We welcome prospective students to tour our facilities. Call us to schedule a visit." }
                    ].map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                      >
                        <h4 className="font-medium text-[#101828] mb-2">{faq.q}</h4>
                        <p className="text-[#6a7282] text-sm">
                          {faq.a}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#6b2d94] to-[#4a1a6d] text-white rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(152, 16, 250, 0.3)" }}
                >
                  <h3 className="text-2xl font-medium mb-4">
                    Prefer to Talk?
                  </h3>
                  <p className="mb-6 text-white/90">
                    Call the right line for your needs, or connect on social media.
                  </p>
                  <div className="flex flex-col gap-3">
                    <motion.a
                      href="tel:+13369997123"
                      className="bg-white text-[#6b2d94] px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-center font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Main: (336) 999-7123
                    </motion.a>
                    <motion.a
                      href="tel:+13369345354"
                      className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors text-center font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      After Hours Emergency: (336) 934-5354
                    </motion.a>
                    <motion.a
                      href={CONTACT_INFO.faxHref}
                      className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors text-center font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Help Desk / Fax: {CONTACT_INFO.faxNumber}
                    </motion.a>
                    <motion.a
                      href="mailto:contact@innovationhealthcaresolutions.com"
                      className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors text-center font-medium break-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      contact@innovationhealthcaresolutions.com
                    </motion.a>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a
                      href="https://www.facebook.com/share/1JZceNDsCH/"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="size-5 text-white" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/innovation-healthcare-solutions-enterprise-inc/?viewAsMember=true"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="size-5 text-white" />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-medium text-[#101828] mb-4">
                Visit Our Campus
              </h2>
              <p className="text-lg text-[#4a5565]">
                609 Peters Creek Parkway, Winston Salem, North Carolina 27103
              </p>
            </motion.div>
            <motion.div 
              className="rounded-2xl h-[260px] sm:h-[340px] lg:h-[400px] overflow-hidden border border-[#eee5f5] shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ boxShadow: "0 10px 30px rgba(152, 16, 250, 0.1)" }}
            >
              <iframe
                title="Innovation Healthcare Solutions Location"
                src="https://www.google.com/maps?q=609+Peters+Creek+Parkway,+Winston+Salem,+North+Carolina+27103&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
              />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}





