import { useState, useEffect, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { COMPANY_DETAILS, SERVICES_DATA } from '../data/engineeringData';
import DewegLogo from './DewegLogo';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'expertise', targetSection?: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Footer({ onNavigate }: FooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { index: '01', label: 'About the Practice', page: 'about' as const, href: '#about-page' },
    { index: '02', label: 'Domains of Expertise', page: 'expertise' as const, href: '#expertise-page' },
    { index: '03', label: 'Selected Engagements', page: 'home' as const, href: '#projects' },
    { index: '04', label: 'Field Execution', page: 'home' as const, href: '#field-execution' },
    { index: '05', label: 'Technical Leadership', page: 'home' as const, href: '#team' },
    { index: '06', label: 'Commence Engagement', page: 'home' as const, href: '#contact' }
  ];

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    item: { page: 'home' | 'about' | 'expertise'; href: string }
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.page, item.href);
    }
  };

  const socials = [
    { label: 'LinkedIn', href: COMPANY_DETAILS.social.linkedin },
    { label: 'Instagram', href: COMPANY_DETAILS.social.instagram },
    { label: 'Facebook', href: COMPANY_DETAILS.social.facebook }
  ];

  return (
    <footer
      id="footer"
      className="relative bg-[#EFEDE6] text-[#121210] border-t border-[#DDD9CE]"
    >
<div className="max-w-[1600px] mx-auto px-[6vw] lg:px-[7vw]">
        {/* ZONE 1 · Architectural information grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 py-16">
          {/* Cols 1–4: Practice statement */}
          <div className="lg:col-span-4">
            <DewegLogo className="h-9 w-auto" variant="full" />
            <p className="mt-6 max-w-xs font-sans text-[1rem] leading-[1.6] text-[#444440]">
              An engineering practice defined by load-path clarity, code compliance, and
              BIM-ready execution — from first intent to audited, construction-ready
              documentation.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2 font-sans text-[14px] font-normal text-[#222220]">
              {socials.map((social, i) => (
                <span key={social.label} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-[#B9B5A8]">·</span>}
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-black"
                  >
                    {social.label} <span aria-hidden="true" className="text-[#78766F]">↗</span>
                  </a>
                </span>
              ))}
            </div>
          </div>

          {/* Cols 5–6: Navigation */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#88857B]">
              01 / Navigation
            </h4>
            <ul className="mt-5 space-y-2">
              {navItems.map((item) => (
                <li key={item.index}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item)}
                    className="group inline-flex items-baseline gap-3 font-sans text-[14px] text-[#222220] transition-all duration-200 hover:text-black hover:translate-x-1"
                  >
                    <span className="font-mono text-[10px] tracking-[0.1em] text-[#A8A49B] group-hover:text-[#88857B]">
                      {item.index}
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cols 7–9: 7 Engineering Domains */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#88857B]">
              02 / Specialist Domains
            </h4>
            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2">
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
                    className="group inline-flex items-baseline gap-3 font-sans text-[14px] text-[#222220] transition-all duration-200 hover:text-black hover:translate-x-1 cursor-pointer"
                  >
                    <span className="font-mono text-[10px] tracking-[0.1em] text-[#A8A49B] group-hover:text-[#88857B]">
                      {srv.number}
                    </span>
                    <span>{srv.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cols 10–12: Registered office & direct lines */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#88857B]">
              03 / Correspondence
            </h4>
            <div className="mt-5 space-y-4 font-sans text-[14px] leading-[1.6] text-[#444440]">
              <p className="max-w-[300px]">{COMPANY_DETAILS.address}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#A8A49B]">
                CIN {COMPANY_DETAILS.cin}
              </p>
              <div className="space-y-1.5">
                <a
                  href={`tel:${COMPANY_DETAILS.phone}`}
                  className="block w-fit text-[#222220] transition-colors duration-200 hover:text-black"
                >
                  {COMPANY_DETAILS.phone}
                </a>
                <a
                  href={`tel:${COMPANY_DETAILS.mobile}`}
                  className="block w-fit text-[#222220] transition-colors duration-200 hover:text-black"
                >
                  {COMPANY_DETAILS.mobile}
                </a>
                <a
                  href={`mailto:${COMPANY_DETAILS.email}`}
                  className="block w-fit text-[#222220] transition-colors duration-200 hover:text-black"
                >
                  {COMPANY_DETAILS.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2 · Cinematic monumental wordmark */}
      <div className="relative overflow-hidden bg-[#EBE8DF] border-t border-[#DDD9CE] select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.985, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 16 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="flex flex-col items-center justify-end pt-8 pb-10"
        >
          <span className="block font-sans font-semibold uppercase tracking-[-0.02em] leading-[0.82] whitespace-nowrap text-[#181816] text-[clamp(4rem,16.5vw,280px)]">
            De Weg
          </span>
          <span className="mt-6 block font-sans font-medium uppercase whitespace-nowrap text-[#78766F] tracking-[0.6em] text-[clamp(0.8rem,1.8vw,1.4rem)]">
            Engineering
          </span>
        </motion.div>
      </div>

      {/* ZONE 3 · Legal bar */}
      <div className="border-t border-[#DDD9CE]">
        <div className="max-w-[1600px] mx-auto px-[6vw] lg:px-[7vw] py-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#78766F]">
          <p>© {new Date().getFullYear()} De Weg Engineering Pvt. Ltd.</p>
          <div className="flex items-center gap-5">
            <a href="#expertise-page" onClick={(e) => { e.preventDefault(); onNavigate?.('expertise', '#pmc'); }} className="hover:text-black transition-colors duration-200">
              ISO Compliance
            </a>
            <a href="#contact" onClick={(e) => handleLinkClick(e, { page: 'home', href: '#contact' })} className="hover:text-black transition-colors duration-200">
              Privacy &amp; NDA
            </a>
            <a href="#footer" className="hover:text-black transition-colors duration-200">
              Terms
            </a>
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 uppercase tracking-[0.14em] hover:text-black transition-colors duration-200 cursor-pointer"
          >
            ↑ Top
          </button>
        </div>
      </div>

      {/* Back to top — floating */}
      {showBackToTop && (
        <button
          type="button"
          id="back-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-white border border-[#DDD9CE] text-[#121210] hover:bg-[#C98A2D] hover:text-white hover:border-[#C98A2D] transition-all duration-300 shadow-xl flex items-center justify-center group"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      )}
    </footer>
  );
}