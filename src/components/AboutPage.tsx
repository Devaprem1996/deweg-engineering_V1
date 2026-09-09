import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Building2, 
  Users, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import { 
  ABOUT_PAGE_ASSETS, 
  ABOUT_PAGE_CONTENT, 
  DEWEG_LEADERSHIP, 
  FIRM_MILESTONES 
} from '../data/aboutData';
import { TeamMember } from '../types';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateToServices?: () => void;
  onNavigateToContact?: () => void;
}

export default function AboutPage({
  onNavigateHome,
  onNavigateToServices,
  onNavigateToContact
}: AboutPageProps) {
  const [selectedLeader, setSelectedLeader] = useState<TeamMember | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-transparent text-[#0C0A09] pt-24 sm:pt-28 pb-20">
      
      {/* Editorial Breadcrumbs & Back Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex items-center justify-between py-3 border-b border-white/80">
          <div className="flex items-center gap-2 text-xs font-sans text-[#57534E]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#EDA81C] transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
            <span className="text-[#0C0A09] font-bold">About Deweg</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/85 border border-white/80 text-xs font-sans font-bold text-[#0C0A09] hover:border-[#EDA81C] hover:text-[#EDA81C] transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </button>
        </div>
      </div>

      {/* 1. HERO SECTION: Who We Are & Inception */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Authentic Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#E5E3DC]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
                {ABOUT_PAGE_CONTENT.badge}
              </span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl text-[#0C0A09] font-bold tracking-[-0.02em] leading-[1.05]">
              Defining the Path to Build Better
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#EDA81C] italic font-semibold">
              "{ABOUT_PAGE_CONTENT.tagline}"
            </p>

            <p className="text-sm sm:text-base text-[#292524] font-sans font-normal leading-relaxed">
              {ABOUT_PAGE_CONTENT.foundingStory}
            </p>

            {/* Inception Key Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div className="text-xs font-sans font-bold text-[#EDA81C] uppercase tracking-wider">
                  2020
                </div>
                <div className="text-xs font-bold text-[#0C0A09] mt-0.5">
                  Founded in Chennai
                </div>
                <div className="text-[11px] font-medium text-[#57534E] mt-0.5">
                  Headquarters & Design Lab
                </div>
              </div>

              <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div className="text-xs font-sans font-bold text-[#EDA81C] uppercase tracking-wider">
                  100+
                </div>
                <div className="text-xs font-bold text-[#0C0A09] mt-0.5">
                  Engineering Brawn
                </div>
                <div className="text-[11px] font-medium text-[#57534E] mt-0.5">
                  Meticulously Cultivated Team
                </div>
              </div>

              <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] col-span-2 sm:col-span-1">
                <div className="text-xs font-sans font-bold text-[#EDA81C] uppercase tracking-wider">
                  ISO & LOD 500
                </div>
                <div className="text-xs font-bold text-[#0C0A09] mt-0.5">
                  Certified Standards
                </div>
                <div className="text-[11px] font-medium text-[#57534E] mt-0.5">
                  European & International Codes
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Banner Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/80 backdrop-blur-xl bg-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)] group">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={ABOUT_PAGE_ASSETS.heroBanner}
                  alt="Deweg Engineering Headquarters & Inception Banner"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5 text-white">
                <div>
                  <div className="text-[10px] font-sans font-bold tracking-widest text-[#E7E1D8] uppercase">
                    CHENNAI HEADQUARTERS • EST. 2020
                  </div>
                  <div className="text-sm font-serif font-medium mt-0.5">
                    DEWEG ENGINEERING PRIVATE LIMITED
                  </div>
                </div>
              </div>

              <button
                onClick={() => setLightboxImage(ABOUT_PAGE_ASSETS.heroBanner)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                aria-label="Enlarge hero image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY AND THE MANTRA */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 p-8 sm:p-14 shadow-[0_12px_40px_rgb(0,0,0,0.04)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Image: About_edited.jpg */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-[#E7E1D8] shadow-md group bg-[#FFF9ED]">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={ABOUT_PAGE_ASSETS.aboutEdited}
                      alt="Deweg Engineering Practice & Analytical Drawing"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 bg-white/95 border-t border-[#F0EBE1]">
                    <p className="text-xs text-[#292524] font-sans font-medium">
                      Constructible Frameworks • Design Intelligence • FEA Simulation
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Copy: Verbatim Philosophy & Ethos */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9ED] border border-[#E7E1D8] text-[11px] font-sans font-bold text-[#EDA81C]">
                  <span>CORE ETHOS</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl text-[#0C0A09] font-bold tracking-tight">
                  {ABOUT_PAGE_CONTENT.philosophyAndMantra.title}
                </h2>

                <blockquote className="border-l-2 border-[#EDA81C] pl-5 my-4">
                  <p className="font-serif text-lg sm:text-xl text-[#0C0A09] italic font-semibold leading-snug">
                    "{ABOUT_PAGE_CONTENT.philosophyAndMantra.quote}"
                  </p>
                </blockquote>

                <p className="text-sm sm:text-base text-[#292524] font-sans leading-relaxed">
                  {ABOUT_PAGE_CONTENT.philosophyAndMantra.context}
                </p>

                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#292524] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#EDA81C] shrink-0 mt-0.5" />
                    <span>Transforming design codes into constructible reality</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#292524] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#EDA81C] shrink-0 mt-0.5" />
                    <span>Certainty and predictability at every stage</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION: Architectural Dual Cards */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
            PURPOSE & DIRECTION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0C0A09] font-bold tracking-tight mt-2">
            Vision & Mission in Action
          </h2>
          <p className="text-xs sm:text-sm text-[#292524] mt-2 font-sans font-medium">
            How homegrown intellect and modern digital infrastructure combine to serve world-class projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* VISION CARD */}
          <div className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)] hover:border-[#EDA81C]/50 transition-all relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-bold text-[#EDA81C] bg-[#FFF9ED] border border-[#E7E1D8] uppercase tracking-wider">
                  {ABOUT_PAGE_CONTENT.vision.title}
                </span>
                <Building2 className="w-5 h-5 text-[#EDA81C]" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl text-[#0C0A09] font-bold leading-relaxed">
                "{ABOUT_PAGE_CONTENT.vision.statement}"
              </h3>

              <p className="text-xs sm:text-sm text-[#292524] font-sans leading-relaxed">
                {ABOUT_PAGE_CONTENT.vision.subtext}
              </p>
            </div>

            {/* Visual Attachment: IMG_0003.JPG */}
            <div className="mt-6 pt-5 border-t border-[#F0EBE1] flex items-center gap-4">
              <div className="w-20 h-16 rounded-xl overflow-hidden border border-[#E7E1D8] shrink-0">
                <img
                  src={ABOUT_PAGE_ASSETS.officeDrawing}
                  alt="Deweg Structural Engineering Drawings"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-[#57534E] font-sans">
                <span className="font-bold text-[#0C0A09] block">Homegrown Intellect</span>
                Mentoring the next generation of structural specialists in Chennai.
              </div>
            </div>
          </div>

          {/* MISSION CARD */}
          <div className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)] hover:border-[#EDA81C]/50 transition-all relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-bold text-[#EDA81C] bg-[#FFF9ED] border border-[#E7E1D8] uppercase tracking-wider">
                  {ABOUT_PAGE_CONTENT.mission.title}
                </span>
                <Cpu className="w-5 h-5 text-[#EDA81C]" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl text-[#0C0A09] font-bold leading-relaxed">
                "{ABOUT_PAGE_CONTENT.mission.statement}"
              </h3>

              <p className="text-xs sm:text-sm text-[#292524] font-sans leading-relaxed">
                {ABOUT_PAGE_CONTENT.mission.subtext}
              </p>
            </div>

            {/* Visual Attachment: DSC_0787.jpg */}
            <div className="mt-6 pt-5 border-t border-[#F0EBE1] flex items-center gap-4">
              <div className="w-20 h-16 rounded-xl overflow-hidden border border-[#E7E1D8] shrink-0">
                <img
                  src={ABOUT_PAGE_ASSETS.teamWorkplace}
                  alt="Deweg Technical Workplace Culture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-[#57534E] font-sans">
                <span className="font-bold text-[#0C0A09] block">Digital Structural Delivery</span>
                Connecting design intelligence to international construction sites.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. TEAM BEHIND DEWEG: Illustrious Leadership Directorate */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#EDA81C]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
                ILLUSTRIOUS TEAM
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0C0A09] font-bold tracking-tight">
              {ABOUT_PAGE_CONTENT.teamIntro.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#292524] font-sans leading-relaxed">
              {ABOUT_PAGE_CONTENT.teamIntro.description}
            </p>
          </div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEWEG_LEADERSHIP.map((leader, idx) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setSelectedLeader(leader)}
                className="group cursor-pointer rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 overflow-hidden hover:border-[#EDA81C] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] bg-[#1C1917] overflow-hidden">
                  {leader.image ? (
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 filter contrast-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#292524] text-[#A8A29E]">
                      <Users className="w-12 h-12" />
                    </div>
                  )}

                  {/* Experience Badge */}
                  {leader.experience && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#1C1917]/85 backdrop-blur-xs text-white border border-[#44403C]/50">
                      {leader.experience}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                  {/* Identity text overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-mono text-[#E7E1D8] uppercase tracking-wider block">
                      {leader.role}
                    </span>
                    <h3 className="font-serif text-lg font-medium leading-snug">
                      {leader.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {leader.credentials && (
                      <div className="text-xs font-mono text-[#EDA81C] font-semibold mb-2">
                        {leader.credentials}
                      </div>
                    )}
                    {leader.secondaryRole && (
                      <div className="text-xs font-serif italic text-[#78716C] mb-3">
                        {leader.secondaryRole}
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-[#57534E] font-sans line-clamp-3 leading-relaxed">
                      {leader.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-sans font-semibold text-[#EDA81C] group-hover:text-[#D49110]">
                    <span>Read Full Profile & Accolades</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. TEAM CULTURE & WORKPLACE CELEBRATION PHOTO */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 p-8 sm:p-12 md:p-14 shadow-[0_12px_40px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EDA81C]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
                  PEOPLE & PASSION
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0C0A09] font-bold tracking-tight">
                Cultivated on Reliability, Integrity & Team Solidarity
              </h3>
              <p className="text-sm text-[#292524] font-sans leading-relaxed">
                DEWEG stands on the brawn of its illustrious team—engineers, BIM architects, project managers, and quality controllers united by a singular focus: precision delivery for international infrastructure.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-xs font-sans font-bold text-[#EDA81C]">
                  <Users className="w-4 h-4" />
                  <span>Homegrown Intellect Serving Global Projects</span>
                </div>
              </div>
            </div>

            {/* Whole Team Outing Image (Team-Outing-Final1.jpg) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-white/80 bg-[#1C1917] shadow-lg group">
                <img
                  src={ABOUT_PAGE_ASSETS.teamOuting}
                  alt="Deweg Engineering Annual Team Celebration & Solidarity"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 text-white">
                  <div className="flex items-center justify-between w-full text-xs">
                    <span className="font-sans font-semibold">DEWEG Team Annual Gathering</span>
                    <button
                      onClick={() => setLightboxImage(ABOUT_PAGE_ASSETS.teamOuting)}
                      className="inline-flex items-center gap-1 text-xs font-sans font-bold text-[#E7E1D8] hover:text-[#EDA81C] transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full View</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FIRM MILESTONES & JOURNEY */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
              CHRONOLOGY OF EXCELLENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0C0A09] font-bold tracking-tight mt-2">
              Our Journey Since 2020
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {FIRM_MILESTONES.map((m) => (
              <div
                key={m.year}
                className="relative p-7 rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)] space-y-3"
              >
                <div className="text-2xl font-serif font-bold text-[#EDA81C]">
                  {m.year}
                </div>
                <h4 className="font-serif text-base font-bold text-[#0C0A09]">
                  {m.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#292524] font-sans leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#1C1917] text-[#F5F5F4] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold text-[#EDA81C]">
              READY TO COLLABORATE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              Experience the Rigor of Deweg Engineering
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A29E] font-sans leading-relaxed">
              Explore our 7 specialized engineering practices or discuss your project specifications with our leadership team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToServices && (
              <button
                onClick={onNavigateToServices}
                className="px-5 py-3 rounded-lg bg-[#EDA81C] hover:bg-[#D49110] text-[#0C0A09] text-xs font-sans font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                Explore 7 Disciplines
              </button>
            )}
            {onNavigateToContact && (
              <button
                onClick={onNavigateToContact}
                className="px-5 py-3 rounded-lg bg-[#292524] hover:bg-[#38332E] text-[#E7E5E4] text-xs font-sans font-medium uppercase tracking-wider border border-[#44403C] transition-colors"
              >
                Contact Leadership
              </button>
            )}
          </div>
        </div>
      </section>

      {/* MODAL: Full Leader Bio Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLeader(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E7E1D8] shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E1D8] bg-[#FFF9ED]">
                <span className="text-xs font-mono font-bold text-[#EDA81C] uppercase tracking-wider">
                  DEWEG LEADERSHIP PROFILE
                </span>
                <button
                  onClick={() => setSelectedLeader(null)}
                  className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE4D9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap">
                  {selectedLeader.image && (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-[#E7E1D8] shrink-0 bg-[#1C1917]">
                      <img
                        src={selectedLeader.image}
                        alt={selectedLeader.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-mono text-[#EDA81C] uppercase tracking-wider font-semibold block">
                      {selectedLeader.role}
                    </span>
                    <h3 className="font-serif text-2xl text-[#1C1917] font-semibold mt-0.5">
                      {selectedLeader.name}
                    </h3>
                    {selectedLeader.secondaryRole && (
                      <p className="text-xs font-serif italic text-[#78716C] mt-0.5">
                        {selectedLeader.secondaryRole}
                      </p>
                    )}
                    {selectedLeader.experience && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium text-[#EDA81C] bg-[#FFF9ED] border border-[#E7E1D8]">
                        {selectedLeader.experience}
                      </span>
                    )}
                  </div>
                </div>

                {selectedLeader.credentials && (
                  <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EFE9DF] text-xs font-mono text-[#1C1917]">
                    <span className="text-[#78716C]">Credentials: </span>
                    {selectedLeader.credentials}
                  </div>
                )}

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#1C1917] font-sans mb-2">
                    Executive Biography
                  </h4>
                  <p className="text-xs sm:text-sm text-[#57534E] font-sans leading-relaxed">
                    {selectedLeader.bio}
                  </p>
                </div>

                {selectedLeader.specialty && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#1C1917] font-sans mb-1.5">
                      Domain Specialization
                    </h4>
                    <p className="text-xs text-[#57534E] font-sans">
                      {selectedLeader.specialty}
                    </p>
                  </div>
                )}

                {selectedLeader.leadershipStatement && (
                  <div className="p-4 rounded-xl bg-[#FFF9ED] border border-[#E7E1D8]">
                    <p className="font-serif text-xs sm:text-sm text-[#1C1917] italic">
                      "{selectedLeader.leadershipStatement}"
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-[#E7E1D8] flex justify-end">
                  <button
                    onClick={() => setSelectedLeader(null)}
                    className="px-5 py-2 rounded-lg bg-[#1C1917] text-white text-xs font-sans font-medium hover:bg-[#38332E] transition-colors"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Full Resolution Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Full Resolution View"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
