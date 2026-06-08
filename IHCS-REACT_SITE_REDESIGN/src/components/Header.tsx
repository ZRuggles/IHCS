import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { APPLICATION_LINKS } from "../data/siteInfo";

type LogoMode = "company" | "course";
const LOGO_INTRO_KEY = "ihcs-logo-intro-played";
const LOGO_LAST_MODE_KEY = "ihcs-logo-last-mode";
const LOGO_FLIP_DELAY_MS = 140;
const LOGO_FLIP_RETURN_MS = 1140;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isCoursePage =
    location.pathname === "/courses" || location.pathname.startsWith("/courses/");
  const targetLogoMode: LogoMode = isCoursePage ? "course" : "company";
  const [activeLogoMode, setActiveLogoMode] = useState<LogoMode>(() => {
    const storedMode = window.sessionStorage.getItem(LOGO_LAST_MODE_KEY);
    if (storedMode === "company" || storedMode === "course") {
      return storedMode;
    }
    return targetLogoMode;
  });
  const [shouldAnimateLogo, setShouldAnimateLogo] = useState(false);
  const activeLogoModeRef = useRef<LogoMode>(activeLogoMode);
  const startupTimersRef = useRef<number[]>([]);

  const clearStartupTimers = useCallback(() => {
    startupTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    startupTimersRef.current = [];
  }, []);

  useEffect(() => {
    activeLogoModeRef.current = activeLogoMode;
    window.sessionStorage.setItem(LOGO_LAST_MODE_KEY, activeLogoMode);
  }, [activeLogoMode]);

  useEffect(() => {
    clearStartupTimers();
    const hasPlayedIntro = window.sessionStorage.getItem(LOGO_INTRO_KEY) === "true";

    if (!hasPlayedIntro) {
      window.sessionStorage.setItem(LOGO_INTRO_KEY, "true");
      setShouldAnimateLogo(true);
      const alternateLogoMode: LogoMode =
        targetLogoMode === "company" ? "course" : "company";
      const showOtherLogo = window.setTimeout(() => {
        setActiveLogoMode(alternateLogoMode);
      }, LOGO_FLIP_DELAY_MS);
      const settleOnTarget = window.setTimeout(() => {
        setActiveLogoMode(targetLogoMode);
      }, LOGO_FLIP_RETURN_MS);
      startupTimersRef.current = [showOtherLogo, settleOnTarget];
      return () => {
        clearStartupTimers();
      };
    }

    if (activeLogoModeRef.current !== targetLogoMode) {
      setShouldAnimateLogo(true);
      const switchToTarget = window.setTimeout(() => {
        setActiveLogoMode(targetLogoMode);
      }, LOGO_FLIP_DELAY_MS);
      startupTimersRef.current = [switchToTarget];
    } else {
      setShouldAnimateLogo(false);
    }

    return () => {
      clearStartupTimers();
    };
  }, [targetLogoMode, clearStartupTimers]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const logoConfig =
    activeLogoMode === "course"
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
            <a href="tel:+13369997123" className="flex items-center gap-2 text-xs sm:text-sm hover:opacity-80 transition-opacity">
              <Phone className="size-4" />
              <span>(336) 999-7123</span>
            </a>
            <a href="tel:+13369345354" className="hidden md:flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Phone className="size-4" />
              <span>After Hours: (336) 934-5354</span>
            </a>
            <a href="mailto:contact@innovationhealthcaresolutions.com" className="hidden lg:flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Mail className="size-4" />
              <span>contact@innovationhealthcaresolutions.com</span>
            </a>
          </div>
          <a
            href={APPLICATION_LINKS.schoolInformation}
            target="_blank"
            rel="noreferrer"
            className="bg-[#ffcc00] text-[#461464] px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Apply Online
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-24 sm:h-28 md:h-32">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                key={activeLogoMode}
                className="h-[88px] sm:h-[100px] w-[200px] sm:w-[240px] md:w-[280px] overflow-hidden shrink-0 bg-white"
                initial={shouldAnimateLogo ? { rotateY: -95, opacity: 0.35 } : false}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  key={activeLogoMode}
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
                      ? "text-[#561D7E] font-medium bg-[#eee5f5]"
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
