import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

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
        <section className="relative bg-gradient-to-br from-[#f3e8ff] via-white to-[#faf5ff] py-16 border-b border-gray-200 overflow-hidden">
          {/* Floating background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-[#9810fa] rounded-full blur-3xl opacity-20"
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
            className="absolute bottom-0 left-0 w-64 h-64 bg-[#fdc700] rounded-full blur-3xl opacity-20"
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
                className="inline-block bg-white border-2 border-[#9810fa] text-[#8200db] px-4 py-2 rounded-full text-sm mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Get In Touch
              </motion.div>
              <h1 className="text-5xl font-medium mb-6 leading-tight text-[#101828]">
                Contact Us
              </h1>
              <p className="text-xl text-[#4a5565] leading-relaxed">
                Have questions about our programs or services? We're here to help! Reach out to us and our team will get back to you as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: MapPin, title: "Location", content: <p className="text-[#6a7282] text-sm">Winston-Salem<br />North Carolina</p> },
                { icon: Phone, title: "Phone", content: <a href="tel:555-123-4567" className="text-[#9810fa] hover:underline">(555) 123-4567</a> },
                { icon: Mail, title: "Email", content: <a href="mailto:info@healthcare.edu" className="text-[#9810fa] hover:underline text-sm">info@healthcare.edu</a> },
                { icon: Clock, title: "Hours", content: <p className="text-[#6a7282] text-sm">Mon-Fri: 8am-6pm<br />Sat: 9am-2pm</p> }
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div 
                    key={index}
                    className="bg-gradient-to-br from-[#f3e8ff] to-white border border-[#f3e8ff] p-6 rounded-xl text-center group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, boxShadow: "0 10px 30px rgba(152, 16, 250, 0.15)" }}
                  >
                    <motion.div 
                      className="bg-[#9810fa] p-3 rounded-xl w-fit mx-auto mb-4"
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
        <section className="py-20 bg-gradient-to-b from-white to-[#faf5ff]">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent transition-all"
                        placeholder="(555) 123-4567"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent transition-all"
                    >
                      <option value="">Select an option</option>
                      <option value="hybrid-nurse-aide">Hybrid Nurse Aide (CNA) Course</option>
                      <option value="hybrid-phlebotomy">Hybrid Phlebotomy Technician Course</option>
                      <option value="hybrid-medication-aide">Hybrid Medication Aide Course</option>
                      <option value="hybrid-refresher">Hybrid Refresher Course (CNA)</option>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9810fa] focus:border-transparent resize-none transition-all"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-[#9810fa] text-white py-4 rounded-full hover:bg-[#7c0cc8] transition-colors text-lg font-medium flex items-center justify-center gap-2"
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
                  className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1703669020978-9f12d83a895e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwY3VzdG9tZXIlMjBzZXJ2aWNlJTIwcGhvbmV8ZW58MXx8fHwxNzc0MTE3NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Contact Us"
                    className="w-full h-full object-cover"
                  />
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
                  className="bg-gradient-to-br from-[#9810fa] to-[#7c0cc8] text-white rounded-2xl p-8"
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
                    Our admissions team is available during business hours to answer your questions.
                  </p>
                  <div className="flex flex-col gap-3">
                    <motion.a
                      href="tel:555-123-4567"
                      className="bg-white text-[#9810fa] px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-center font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Call (555) 123-4567
                    </motion.a>
                    <motion.a
                      href="mailto:info@healthcare.edu"
                      className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors text-center font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Email Us
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section (Placeholder) */}
        <section className="py-20 bg-white">
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
                Located in Winston-Salem, North Carolina
              </p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-[#f3e8ff] to-[#faf5ff] rounded-2xl h-[400px] flex items-center justify-center border border-[#f3e8ff]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ boxShadow: "0 10px 30px rgba(152, 16, 250, 0.1)" }}
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className="size-16 text-[#9810fa] mx-auto mb-4" />
                </motion.div>
                <p className="text-xl text-[#4a5565] font-medium">Winston-Salem, NC</p>
                <p className="text-[#6a7282]">Map integration coming soon</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
