import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Heart,
  Home,
  Activity,
  Users,
  CheckCircle,
  Pill,
  Utensils,
  Bath,
  Shield,
  Sparkles,
  Car,
  ShoppingCart,
} from "lucide-react";

export default function Services() {
  const homeAssistanceServices = [
    { icon: Utensils, title: "Meal Planning & Preparation", description: "Nutritious meal planning and cooking assistance" },
    { icon: Sparkles, title: "Light Housekeeping", description: "Maintaining a clean and safe living environment" },
    { icon: ShoppingCart, title: "Grocery Shopping", description: "Shopping assistance and errand support" },
    { icon: Shield, title: "Laundry Assistance", description: "Washing, folding, and organizing clothing" },
    { icon: Car, title: "Errands", description: "Transportation and errand assistance" },
    { icon: Car, title: "Doctor Appointments", description: "Transportation and companion care for medical visits" },
    { icon: Pill, title: "Medication Reminders", description: "Ensuring medications are taken on schedule" },
    { icon: CheckCircle, title: "Family Respite", description: "Temporary relief for family caregivers" },
  ];

  const personalCareServices = [
    { icon: Bath, title: "Bathing", description: "Safe bathing and showering assistance" },
    { icon: Shield, title: "Dressing", description: "Help with clothing and getting ready" },
    { icon: Sparkles, title: "Personal Hygiene", description: "Grooming and hygiene support" },
    { icon: Sparkles, title: "Grooming", description: "Hair care, shaving, and personal care" },
    { icon: Activity, title: "Mobility Assistance", description: "Safe movement and transfer support" },
    { icon: Heart, title: "Incontinence Care", description: "Dignified personal care assistance" },
  ];

  const specialtyServices = [
    {
      icon: Activity,
      title: "Home Infusion",
      description: "Comprehensive in-home infusion therapy services including nursing care, medication administration, and supplies for patients requiring IV treatments.",
      features: ["24/7 nursing support", "Medication management", "Administrative supplies", "Patient education"],
      backgroundImage: "/Home Infusion.jpeg"
    },
    {
      icon: Home,
      title: "Supplemental Staffing",
      description: "Professional healthcare staffing solutions for medical offices, facilities, and hospitals with qualified RNs, LPNs, CNAs, and patient sitters.",
      features: ["Registered Nurses (RN)", "Licensed Practical Nurses (LPN)", "Certified Nursing Assistants (CNA)", "Patient sitters"],
      backgroundImage: "/Supplemental Staffing.jpeg"
    },
    {
      icon: Activity,
      title: "Foot Care Nurse",
      description: "Specialized skilled nursing foot care services providing comprehensive treatment for nail care, calluses, corns, circulation support, and pain management.",
      features: ["Professional nail care", "Callus and corn treatment", "Circulation assessment", "Pain reduction therapy"],
      backgroundImage: "/FootCareNurse.jpeg"
    }
  ];
  const defaultSpecialtyImage = specialtyServices[0].backgroundImage;
  const [activeSpecialtyImage, setActiveSpecialtyImage] = useState(defaultSpecialtyImage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 lg:py-20">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/Home Care Services.jpeg')`
            }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-white/92 backdrop-blur-sm" />
          
          <div className="max-w-[1600px] mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="order-2 lg:order-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/PRN Home Visit.jpg"
                  alt="Home Care Services"
                  className="rounded-3xl shadow-2xl w-full"
                />
              </motion.div>
              <motion.div 
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-block bg-[#eee5f5] text-[#561D7E] px-4 py-2 rounded-full text-sm mb-6">
                  Home Care Services
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight text-[#101828]">
                  Compassionate Care in the Comfort of Home
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed mb-8">
                  Innovation Home Care Agency provides comprehensive in-home care services throughout Winston-Salem, North Carolina. We're dedicated to helping patients maintain independence and quality of life with one point of contact for all your care needs.
                </p>
                <a
                  href="#services"
                  className="inline-block bg-[#561D7E] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#461464] transition-all hover:scale-105"
                >
                  Explore Our Services
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="py-10 sm:py-14 lg:py-16 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "Continuity of Care", description: "One point of contact for all your home care needs" },
                { icon: Users, title: "Experienced Team", description: "Highly trained and compassionate healthcare professionals" },
                { icon: Home, title: "Stay at Home", description: "Quality care that allows you to remain independent" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div 
                      className="bg-[#eee5f5] p-4 rounded-2xl w-fit mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="size-8 text-[#561D7E]" />
                    </motion.div>
                    <h3 className="font-medium text-lg text-[#101828] mb-2">{item.title}</h3>
                    <p className="text-[#6a7282]">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Home Assistance Services */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white" id="services">
          <div className="max-w-[1600px] mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Home Assistance Services
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Daily living support to help you maintain your independence and quality of life
              </p>
            </motion.div>

            {/* Two-column service list with alternating highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {homeAssistanceServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white to-[#f9f6fc] border border-[#e6dff0] shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className="shrink-0 p-3 rounded-xl bg-[#eee5f5]"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="size-6 text-[#561D7E]" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-lg text-[#101828] mb-2">
                        {service.title}
                      </h3>
                      <p className="text-[#6a7282]">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Personal Care Services */}
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
                Personal Care Services
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Dignified personal care assistance provided with compassion and respect
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalCareServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-6 rounded-xl group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(86, 29, 126, 0.15)" }}
                  >
                    <motion.div 
                      className="bg-white p-3 rounded-xl w-fit mb-4"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="size-6 text-[#561D7E]" />
                    </motion.div>
                    <h3 className="font-medium text-lg text-[#101828] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-[#6a7282] text-sm">
                      {service.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Image Break Section */}
        <section className="relative h-[300px] sm:h-[420px] lg:h-[500px] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/LPN and RN.jpg')`,
              backgroundPosition: "center 20%"
            }}
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#561D7E]/90 to-[#561D7E]/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="max-w-[1600px] mx-auto px-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-6">
                Dedicated to Excellence in Care
              </h2>
              <p className="text-2xl text-white/90 max-w-3xl mx-auto">
                Our compassionate team is committed to providing the highest quality of care for you and your loved ones
              </p>
            </motion.div>
          </div>
        </section>

        {/* Specialty Services */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          <motion.div
            key={activeSpecialtyImage}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-sm brightness-[0.55]"
            style={{ backgroundImage: `url('${activeSpecialtyImage}')` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/90 to-[#f7f2fb]/92" />

          <div className="max-w-[1600px] mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-4">
                Specialty Healthcare Services
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Advanced care services for complex medical needs
              </p>
            </motion.div>

            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              onMouseLeave={() => setActiveSpecialtyImage(defaultSpecialtyImage)}
            >
              {specialtyServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group"
                    onMouseEnter={() => setActiveSpecialtyImage(service.backgroundImage)}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ y: -10 }}
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-[#561D7E] to-[#461464] p-4 rounded-2xl w-fit mb-6"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="size-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-medium text-[#101828] mb-4 group-hover:text-[#561D7E] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#4a5565] leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <motion.li 
                          key={idx} 
                          className="flex gap-3 items-start text-[#6a7282]"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: (index * 0.15) + (idx * 0.1) }}
                        >
                          <div className="bg-[#561D7E] rounded-full size-2 mt-2 shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
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
                How Our Services Work
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565]">
                Getting started is simple
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { num: 1, title: "Contact Us", desc: "Call or email to discuss your care needs" },
                { num: 2, title: "Care Assessment", desc: "We'll evaluate your needs and create a personalized care plan" },
                { num: 3, title: "Match Caregiver", desc: "We'll pair you with the perfect caregiver for your needs" },
                { num: 4, title: "Begin Care", desc: "Start receiving compassionate care in your home" }
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
                    className="bg-[#561D7E] text-white size-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                    whileHover={{ scale: 1.15, rotate: 360 }}
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
        <section className="bg-gradient-to-br from-white to-[#f7f2fb] border-t border-[#eee5f5] py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1600px] mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#101828] mb-6">
              Ready to Learn More About Our Services?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your home care needs. Our compassionate team is ready to help you or your loved one stay independent at home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="bg-[#561D7E] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#461464] transition-colors text-base sm:text-lg"
              >
                Request Information
              </a>
              <a
                href="tel:+13369997123"
                className="bg-white border-2 border-[#561D7E] text-[#561D7E] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-colors text-base sm:text-lg"
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





