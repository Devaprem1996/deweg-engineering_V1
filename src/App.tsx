/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutIntro from './components/AboutIntro';
import AboutPage from './components/AboutPage';
import ExpertisePage from './components/ExpertisePage';
import PortfolioSection from './components/PortfolioSection';
import FieldExecutionSection from './components/FieldExecutionSection';
import StatsBanner from './components/StatsBanner';
import TeamSection from './components/TeamSection';
import TestimonialSection from './components/TestimonialSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import ServiceModal from './components/ServiceModal';
import { Project, Service } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'expertise'>('home');
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [expertiseTargetId, setExpertiseTargetId] = useState<string | undefined>(undefined);

  // Services ids (footer domain list) -> expertise chapter ids (sidebar / chapters)
  const serviceToDomainId: Record<string, string> = {
    pmc: 'project-management',
    sde: 'structural-design',
    bim: 'bim-solutions',
    sme: 'structural-steel',
    oge: 'oil-and-gas',
    mep: 'mep-design',
    it: 'information-technology'
  };

  // Synchronize with URL hash for persistent page state and bookmarking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#about-page' || hash === '#/about' || hash === '#about') {
        setCurrentPage('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#expertise-page' ||
        hash === '#/expertise' ||
        hash === '#expertise' ||
        hash === '#reference-page' ||
        hash === '#reference'
      ) {
        setCurrentPage('expertise');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
      }
    };

    // Run on initial mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    // Only init smooth scroll if reduced motion is not preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose so components (TOC index) can route nav through Lenis for clean offsets
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (page: 'home' | 'about' | 'expertise', targetSection?: string) => {
    setCurrentPage(page);
    if (page === 'about') {
      window.location.hash = '#about-page';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'expertise') {
      window.location.hash = '#expertise-page';
      const targetId = targetSection && targetSection.startsWith('#')
        ? serviceToDomainId[targetSection.slice(1)]
        : undefined;
      setExpertiseTargetId(targetId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (targetSection && targetSection.startsWith('#')) {
        window.location.hash = targetSection;
        setTimeout(() => {
          const el = document.querySelector(targetSection);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] text-[#0C0A09] selection:bg-[#EDA81C]/25 selection:text-[#0C0A09] overflow-x-clip">
      {/* Ambient Architectural Atmosphere Behind Glassmorphic Panels */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#F5EDE1]/70 via-[#F3E6D7]/40 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#F9EFE4]/60 via-[#EFE7DC]/40 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[70%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-[#F4ECE1]/65 via-[#F7EFE6]/40 to-transparent blur-3xl opacity-80" />
      </div>

      {/* Editorial Custom Cursor for Desktop */}
      <CustomCursor />

      {/* Archipelago-style Preloader with DE WEG branding */}
      <Preloader onComplete={() => setIsPreloaderDone(true)} />

      {/* Fixed Frosted Navbar */}
      <Navbar
        activePage={currentPage}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleNavigate('home', '#contact')}
      />

      {/* Page Routing */}
      {currentPage === 'about' ? (
        <main id="main-content">
          <AboutPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToServices={() => handleNavigate('expertise')}
            onNavigateToContact={() => handleNavigate('home', '#contact')}
          />
        </main>
      ) : currentPage === 'expertise' ? (
        <main id="main-content">
          <ExpertisePage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToContact={() => handleNavigate('home', '#contact')}
            initialDomainId={expertiseTargetId}
            initialScrollId={expertiseTargetId}
          />
        </main>
      ) : (
        /* Main Single-Page Sections matching deweg-engineering.com */
        <main id="main-content">
          {/* Section 01: European Minimal Creative Hero */}
          <Hero
            introReady={isPreloaderDone}
            onNavigateToContact={() => handleNavigate('home', '#contact')}
          />

          {/* Section 04: "To Define The Path" / Practice Philosophy */}
          <AboutIntro />

          {/* Selected Engagements / Portfolio */}
          <PortfolioSection onSelectProject={(project) => setSelectedProject(project)} />

          {/* Section 05: Field Execution & Heavy Structural Assembly Photo */}
          <FieldExecutionSection />

          {/* Numerical Integrity / Stats Banner */}
          <StatsBanner />

          {/* Technical Leadership & Team */}
          <TeamSection onViewAboutPage={() => handleNavigate('about')} />

          {/* Client Endorsements / Testimonials */}
          <TestimonialSection />

          {/* Contact & Technical Consultation */}
          <ContactSection />
        </main>
      )}

      {/* 9. Minimal Dark Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
