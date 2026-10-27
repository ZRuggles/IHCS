import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ADMISSION_EMAIL, LMS_URL } from "../data/siteInfo";

import { isSchoolSite, siteBrand, siteNavigation } from "../data/siteVariant";

// Headers remount between routes. Keep the intro's lifetime tied to this
// browser document, so navigation never replays it and a full reload can.
let logoIntroHasMounted = false;

export function Header() {
  const [shouldAnimateLogo] = useState(() => !logoIntroHasMounted);
  useEffect(() => { logoIntroHasMounted = true; }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path + "/"));
  const navLinks = siteNavigation;
  const logoConfig = { src: siteBrand.logo, alt: siteBrand.name };
  const contactEmail = isSchoolSite
    ? ADMISSION_EMAIL
    : "contact@innovationhealthcaresolutions.com";
  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#561D7E] text-white py-2">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            {!isSchoolSite && (
              <a
                href="tel:+13369997123"
                className="flex items-center gap-2 text-xs sm:text-sm hover:opacity-80 transition-opacity"
              >
                <Phone className="size-4" />
                <span>(336) 999-7123</span>
              </a>
            )}
            {!isSchoolSite && (
              <a
                href="tel:+13369345354"
                className="hidden md:flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
              >
                <Phone className="size-4" />
                <span>After Hours: (336) 934-5354</span>
              </a>
            )}
            <a
              href={`mailto:${contactEmail}`}
              className={`${isSchoolSite ? "flex" : "hidden lg:flex"} items-center gap-2 text-xs sm:text-sm hover:opacity-80 transition-opacity`}
            >
              <Mail className="size-4" />
              <span className="max-w-[150px] truncate sm:max-w-none">
                {isSchoolSite ? "Contact Admissions" : contactEmail}
              </span>
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {isSchoolSite &&
              (LMS_URL ? (
                <a
                  href={LMS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 border border-white/40 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-white/20 transition-colors whitespace-nowrap"
                >
                  <span className="sm:hidden">Student LMS</span>
                  <span className="hidden sm:inline">Current Student LMS</span>
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="Student LMS link coming soon"
                  className="bg-white/5 border border-white/20 text-white/50 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap cursor-not-allowed"
                >
                  Current Student LMS
                </span>
              ))}
            {isSchoolSite ? (
              <Link
                to="/apply"
                className="bg-[#ffcc00] text-[#461464] px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Apply Online
              </Link>
            ) : (
              <Link
                to="/contact"
                className="bg-[#ffcc00] text-[#461464] px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Contact Us
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-24 sm:h-28 md:h-32">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                key={siteBrand.shortName}
                className="h-[88px] sm:h-[100px] w-[200px] sm:w-[240px] md:w-[280px] overflow-hidden shrink-0 bg-white"
                initial={shouldAnimateLogo ? { rotateY: -95, opacity: 0.35 } : false}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  key={siteBrand.shortName}
                  src={logoConfig.src}
                  alt={logoConfig.alt}
                  className="size-full object-contain"
                  initial={shouldAnimateLogo ? { opacity: 0, scale: 0.96 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              aria-label="Main navigation"
              className="hidden lg:flex items-center gap-6 xl:gap-8"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[15px] transition-colors ${
                    isActive(link.path)
                      ? "text-[#561D7E] font-medium"
                      : "text-[#4a5565] hover:text-[#561D7E]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4a5565]"
              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                id="mobile-navigation"
                aria-label="Mobile navigation"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="lg:hidden border-t overflow-hidden"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 transition-colors ${
                      isActive(link.path)
                        ? "text-[#561D7E] font-medium bg-[#eee5f5]"
                        : "text-[#4a5565] hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
