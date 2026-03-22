import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type LogoMode = "company" | "course";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [visibleLogoMode, setVisibleLogoMode] = useState<LogoMode>("company");

  const isCoursePage =
    location.pathname === "/courses" || location.pathname.startsWith("/courses/");
  const targetLogoMode: LogoMode = isCoursePage ? "course" : "company";

  useEffect(() => {
    const showCourseLogo = window.setTimeout(() => {
      setVisibleLogoMode("course");
    }, 400);
    const settleOnTarget = window.setTimeout(() => {
      setVisibleLogoMode(targetLogoMode);
    }, 900);

    return () => {
      window.clearTimeout(showCourseLogo);
      window.clearTimeout(settleOnTarget);
    };
  }, [targetLogoMode]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const logoConfig =
    visibleLogoMode === "course"
      ? {
          src: "/courselogo.png",
          alt: "Healthcare Training logo"
        }
      : {
          src: "/LOGO.png",
          alt: "Innovation Healthcare Solutions logo"
        };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/services", label: "Our Services" },
    { path: "/employment", label: "Employment" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#561D7E] text-white py-2">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="tel:555-123-4567" className="flex items-center gap-2 text-xs sm:text-sm hover:opacity-80 transition-opacity">
              <Phone className="size-4" />
              <span>(555) 123-4567</span>
            </a>
            <a href="mailto:info@healthcare.edu" className="hidden md:flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Mail className="size-4" />
              <span>info@healthcare.edu</span>
            </a>
          </div>
          <Link
            to="/contact"
            className="bg-[#ffb71b] text-[#461464] px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Request Info
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                className="h-12 sm:h-14 w-[170px] sm:w-[220px] md:w-[280px] overflow-hidden shrink-0 bg-white"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  key={visibleLogoMode}
                  src={logoConfig.src}
                  alt={logoConfig.alt}
                  className="size-full object-contain"
                  initial={{ opacity: 0.7, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
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
              className="md:hidden p-2 text-[#4a5565]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 transition-colors ${
                    isActive(link.path)
                      ? "text-[#561D7E] font-medium bg-[#f3e8ff]"
                      : "text-[#4a5565] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
