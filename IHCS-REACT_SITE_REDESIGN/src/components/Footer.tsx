import { Link } from "react-router-dom";
import { Facebook, Linkedin, Phone, MapPin, Clock, Mail, Shield, Headphones } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1f2e] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Leading healthcare training institute providing state-approved certifications and quality education for aspiring healthcare professionals.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/InnovationHealthcareSolutions"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/innovation-healthcare-solutions-enterprise-inc/?viewAsMember=true"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/employment" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses/hybrid-nurse-aide" className="text-gray-300 hover:text-white transition-colors">
                  CNA Training
                </Link>
              </li>
              <li>
                <Link to="/courses/hybrid-phlebotomy-technician" className="text-gray-300 hover:text-white transition-colors">
                  Phlebotomy
                </Link>
              </li>
              <li>
                <Link to="/courses/hybrid-medication-aide" className="text-gray-300 hover:text-white transition-colors">
                  Medication Aide
                </Link>
              </li>
              <li>
                <Link to="/courses/hybrid-refresher-course" className="text-gray-300 hover:text-white transition-colors">
                  Refresher Course
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 text-gray-300">
                <MapPin className="size-5 shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=609+Peters+Creek+Parkway+Winston+Salem+NC+27103"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  609 Peters Creek Parkway
                  <br />
                  Winston Salem, North Carolina 27103
                </a>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Phone className="size-5 shrink-0" />
                <a href="tel:+13369997123" className="hover:text-white transition-colors">
                  Main: (336) 999-7123
                </a>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Shield className="size-5 shrink-0" />
                <a href="tel:+13369345354" className="hover:text-white transition-colors">
                  After Hours Emergency: (336) 934-5354
                </a>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Headphones className="size-5 shrink-0" />
                <a href="tel:+18774455698" className="hover:text-white transition-colors">
                  Help Desk / Fax: (877) 445-5698
                </a>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Mail className="size-5 shrink-0" />
                <a href="mailto:contact@innovationhealthcaresolutions.com" className="hover:text-white transition-colors break-all">
                  contact@innovationhealthcaresolutions.com
                </a>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Clock className="size-5 shrink-0 mt-0.5" />
                <span>
                  Mon - Thu: 9:00 AM - 2:00 PM
                  <br />
                  Fri - Sun: Closed
                </span>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Facebook className="size-5 shrink-0 mt-0.5" />
                <a
                  href="https://www.facebook.com/InnovationHealthcareSolutions"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Linkedin className="size-5 shrink-0 mt-0.5" />
                <a
                  href="https://www.linkedin.com/company/innovation-healthcare-solutions-enterprise-inc/?viewAsMember=true"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 text-center md:text-left">
            <p>&copy; {currentYear} Healthcare Training Institute. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
