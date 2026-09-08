import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Compass } from 'lucide-react';
import DewegLogo from './DewegLogo';

interface NavbarProps {
  activePage?: 'home' | 'about' | 'expertise';
  onNavigate?: (page: 'home' | 'about' | 'expertise', targetSection?: string) => void;
  onOpenConsultation?: () => void;
}

export default function Navbar({ activePage = 'home', onNavigate, onOpenConsultation }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', page: 'home' as const, href: '#hero', id: 'nav-link-home' },
    { label: 'About', page: 'about' as const, href: '#about-page', id: 'nav-link-about' },
    { label: 'Expertise', page: 'expertise' as const, href: '#expertise-page', id: 'nav-link-expertise' },
    { label: 'Portfolio', page: 'home' as const, href: '#projects', id: 'nav-link-projects' },
    { label: 'Team', page: 'home' as const, href: '#team', id: 'nav-link-team' },
    { label: 'Contact', page: 'home' as const, href: '#contact', id: 'nav-link-contact' },
  ];

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, link: { page: 'home' | 'about' | 'expertise'; href: string }) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (onNavigate) {
      onNavigate(link.page, link.href);
      return;
    }

    if (link.page === 'about') {
      window.location.hash = '#about-page';
    } else if (link.page === 'expertise') {
      window.location.hash = '#expertise-page';
    } else {
      const targetElement = document.querySelector(link.href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/80 py-3.5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
            : 'bg-white/40 backdrop-blur-md py-4 md:py-5 border-b border-white/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            id="brand-logo"
            onClick={(e) => handleLinkClick(e, { page: 'home', href: '#hero' })}
            className="group flex items-center gap-3 text-[#0C0A09] focus:outline-none cursor-pointer"
            aria-label="Deweg Engineering Home"
          >
            <DewegLogo className="h-8 sm:h-9 w-auto transition-transform duration-300 group-hover:scale-[1.02]" variant="full" />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Desktop Navigation">
            {navLinks.map((link) => {
              const isActive =
                (link.page === activePage && (link.page === 'about' || link.page === 'expertise')) ||
                (activePage === 'home' && link.label === 'Home');
              return (
                <a
                  key={link.label}
                  id={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-sm font-sans tracking-wide transition-colors duration-200 relative py-1 cursor-pointer ${
                    isActive
                      ? 'text-[#C9860F] font-bold'
                      : 'text-[#0C0A09] font-medium hover:text-[#C9860F]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EDA81C] rounded-full"
                    />
                  )}
                </a>
              );
            })}

            {/* Consultation CTA button */}
            <a
              href="#contact"
              id="nav-cta-btn"
              onClick={(e) => handleLinkClick(e, { page: 'home', href: '#contact' })}
              className="ml-3 inline-flex items-center gap-2 rounded-xl border border-[#EDA81C] px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider text-[#0C0A09] bg-white/80 hover:bg-[#EDA81C] hover:text-[#0C0A09] transition-all duration-300 shadow-xs group cursor-pointer"
            >
              <span>Engage Firm</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#0C0A09] hover:text-[#EDA81C] focus:outline-none transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-2xl md:hidden flex flex-col justify-between px-8 pt-28 pb-12 overflow-y-auto"
          >
            <div className="flex flex-col space-y-7">
              <span className="text-xs uppercase tracking-[0.3em] text-[#78716C] font-sans">
                Navigation
              </span>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * (idx + 1), duration: 0.4 }}
                >
                  <a
                    href={link.href}
                    id={`mobile-${link.id}`}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="group flex items-baseline justify-between py-2 border-b border-[#E7E1D8]"
                  >
                    <span className="font-serif text-3xl sm:text-4xl text-[#0C0A09] group-hover:text-[#EDA81C] transition-colors">
                      {link.label}
                    </span>
                    <span className="text-xs font-mono text-[#78716C]">
                      0{idx + 1}
                    </span>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Mobile Footer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-12 pt-6 border-t border-[#E7E1D8] flex flex-col gap-3 text-xs text-[#78716C] font-sans"
            >
              <div className="flex items-center gap-2 text-[#0C0A09]">
                <Compass className="w-4 h-4 text-[#EDA81C]" />
                <span>Chennai, India • Global Engineering Standards</span>
              </div>
              <p>contact@deweg-engineering.com</p>
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, { page: 'home', href: '#contact' })}
                className="mt-2 inline-flex items-center justify-center w-full py-3 bg-[#EDA81C] text-[#0C0A09] font-sans font-bold uppercase tracking-wider text-xs rounded-xl shadow-md"
              >
                Initiate Project Brief
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
