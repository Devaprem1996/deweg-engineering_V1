import { useState, useEffect, MouseEvent } from 'react';
import { ArrowUp, Linkedin, Instagram, Facebook } from 'lucide-react';
import { COMPANY_DETAILS, SERVICES_DATA } from '../data/engineeringData';
import DewegLogo from './DewegLogo';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'expertise', targetSection?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About Deweg Engineering', page: 'about' as const, href: '#about-page' },
    { label: 'Domain We Expertise', page: 'expertise' as const, href: '#expertise-page' },
    { label: 'Engineering Reel', page: 'home' as const, href: '#engineering-reel' },
    { label: 'Selected Engagements', page: 'home' as const, href: '#projects' },
    { label: 'Field Execution', page: 'home' as const, href: '#field-execution' },
    { label: 'Key Technical Leadership', page: 'home' as const, href: '#team' },
    { label: 'Client Endorsements', page: 'home' as const, href: '#testimonials' },
    { label: 'Commence Collaboration', page: 'home' as const, href: '#contact' },
  ];

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, item: { page: 'home' | 'about' | 'expertise'; href: string }) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.page, item.href);
    }
  };

  return (
    <footer id="footer" className="relative bg-[#FAF7F2] text-[#1C1917] border-t border-[#DDD6CC] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#DDD6CC]">
          
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <a href="#" aria-label="Deweg Engineering Home" className="inline-block">
              <DewegLogo className="h-9 w-auto" variant="full" />
            </a>

            <p className="text-sm text-[#57534E] font-sans font-normal leading-relaxed max-w-sm">
              An architectural and industrial engineering practice dedicated to rigorous structural calculation, resilient foundation systems, and innovative built delivery.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={COMPANY_DETAILS.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#DDD6CC] bg-white flex items-center justify-center text-[#57534E] hover:text-[#EDA81C] hover:border-[#EDA81C] transition-all shadow-xs"
                aria-label="Deweg Engineering on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={COMPANY_DETAILS.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#DDD6CC] bg-white flex items-center justify-center text-[#57534E] hover:text-[#EDA81C] hover:border-[#EDA81C] transition-all shadow-xs"
                aria-label="Deweg Engineering on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={COMPANY_DETAILS.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-[#DDD6CC] bg-white flex items-center justify-center text-[#57534E] hover:text-[#EDA81C] hover:border-[#EDA81C] transition-all shadow-xs"
                aria-label="Deweg Engineering on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#EDA81C] font-sans font-bold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-sans font-normal text-[#57534E]">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item)}
                    className="hover:text-[#EDA81C] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: 7 Domains (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#EDA81C] font-sans font-bold">
              7 Domains
            </h4>
            <ul className="space-y-2 text-xs font-sans font-normal text-[#57534E]">
              {SERVICES_DATA.map((srv) => (
                <li key={srv.id}>
                  <a
                    href="#expertise-page"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) {
                        onNavigate('expertise', `#${srv.id}`);
                      }
                    }}
                    className="hover:text-[#EDA81C] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-[10px] font-mono text-[#EDA81C] font-semibold">{srv.number}</span>
                    <span className="truncate">{srv.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#EDA81C] font-sans font-bold">
              Registered Office
            </h4>
            <div className="space-y-2.5 text-sm font-sans font-normal text-[#57534E] leading-relaxed">
              <p className="text-[#1C1917] font-medium text-xs">{COMPANY_DETAILS.address}</p>
              <p className="text-[11px] font-mono text-[#78716C]">CIN: {COMPANY_DETAILS.cin}</p>
              <div className="pt-2 text-xs space-y-1">
                <p><span className="font-semibold text-[#1C1917]">Desk:</span> {COMPANY_DETAILS.phone}</p>
                <p><span className="font-semibold text-[#1C1917]">Mobile:</span> {COMPANY_DETAILS.mobile}</p>
                <p><span className="font-semibold text-[#1C1917]">Email:</span> {COMPANY_DETAILS.email}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#78716C]">
          <p>© 2025 De Weg Engineering Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-[#EDA81C] transition-colors">
              ISO & Code Compliance
            </a>
            <span>•</span>
            <a href="#contact" className="hover:text-[#EDA81C] transition-colors">
              Confidentiality & NDA
            </a>
            <span>•</span>
            <a href="#contact" className="hover:text-[#EDA81C] transition-colors">
              Statutory Disclosures
            </a>
          </div>
        </div>

      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          id="back-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-white border border-[#DDD6CC] text-[#1C1917] hover:bg-[#EDA81C] hover:text-white hover:border-[#EDA81C] transition-all duration-300 shadow-xl flex items-center justify-center group"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      )}
    </footer>
  );
}
