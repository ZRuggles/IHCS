import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1f2e] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Leading healthcare training institute providing state-approved certifications and quality education for aspiring healthcare professionals.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors" aria-label="Facebook">
                <Facebook className="size-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors" aria-label="Twitter">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors" aria-label="Instagram">
                <Instagram className="size-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors" aria-label="LinkedIn">
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
                <Link to="/courses/certified-nursing-assistant" className="text-gray-300 hover:text-white transition-colors">
                  CNA Training
                </Link>
              </li>
              <li>
                <Link to="/courses/medical-assistant" className="text-gray-300 hover:text-white transition-colors">
                  Medical Assistant
                </Link>
              </li>
              <li>
                <Link to="/courses/phlebotomy-technician" className="text-gray-300 hover:text-white transition-colors">
                  Phlebotomy
                </Link>
              </li>
              <li>
                <Link to="/courses/emt-basic" className="text-gray-300 hover:text-white transition-colors">
                  EMT Basic
                </Link>
              </li>
              <li>
                <Link to="/courses/dental-assistant" className="text-gray-300 hover:text-white transition-colors">
                  Dental Assistant
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
                <span>Winston-Salem, North Carolina</span>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Phone className="size-5 shrink-0" />
                <a href="tel:555-123-4567" className="hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex gap-3 text-gray-300">
                <Mail className="size-5 shrink-0" />
                <a href="mailto:info@healthcare.edu" className="hover:text-white transition-colors">
                  info@healthcare.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {currentYear} Healthcare Training Institute. All rights reserved.</p>
            <div className="flex gap-6">
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
