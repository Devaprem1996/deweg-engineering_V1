import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  Compass,
  Layers,
  Box,
  Cpu,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { OFFICIAL_ASSETS, COMPANY_DETAILS } from '../data/engineeringData';
import { AnimatedHeading } from './AnimatedText';

interface HeroProps {
  onExploreClick: () => void;
  onNavigateToExpertise?: () => void;
  onNavigateToPortfolio?: () => void;
  onNavigateToContact?: () => void;
}

type ShowcaseMode = 'reel' | 'tekla3d' | 'bim' | 'field';

export default function Hero({
  onExploreClick,
  onNavigateToExpertise,
  onNavigateToPortfolio,
  onNavigateToContact
}: HeroProps) {
  const [activeMode, setActiveMode] = useState<ShowcaseMode>('reel');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const showcaseModes = [
    {
      id: 'reel' as ShowcaseMode,
      label: 'Site Project Reel',
      icon: Play,
      type: 'video' as const,
      src: OFFICIAL_ASSETS.heroVideo1080,
      fallbackSrc: OFFICIAL_ASSETS.heroVideo720,
      poster: OFFICIAL_ASSETS.heroVideoPoster,
      caption: 'Deweg Engineering Site Operations • Heavy Industrial Erection',
      tag: 'Live Field Capture',
      specs: '1080p Drone & Crane View • EPC Execution'
    },
    {
      id: 'tekla3d' as ShowcaseMode,
      label: 'Tekla 3D Steel Model',
      icon: Box,
      type: 'video' as const,
      src: OFFICIAL_ASSETS.referenceVideos.sdeDynamic3D,
      poster: OFFICIAL_ASSETS.referenceVideos.sdePoster,
      caption: 'Detailed High-Bay Structural Steel Framework • Dynamic Tekla Detailing',
      tag: 'Tekla Structures',
      specs: 'LOD 400 Shop Drawings • CNC NC1 Export'
    },
    {
      id: 'bim' as ShowcaseMode,
      label: 'BIM LOD 500 Coordination',
      icon: Layers,
      type: 'video' as const,
      src: OFFICIAL_ASSETS.referenceVideos.bimClash,
      poster: OFFICIAL_ASSETS.referenceVideos.bimClashPoster,
      caption: 'Multi-Disciplinary Clash Detection & Federated Piping Skid Modeling',
      tag: 'Navisworks & Revit',
      specs: 'Zero Clash Tolerances • 4D Phasing'
    },
    {
      id: 'field' as ShowcaseMode,
      label: 'Erection & Field Assembly',
      icon: Cpu,
      type: 'image' as const,
      src: OFFICIAL_ASSETS.section5ExecutionImg,
      caption: '7000px Ultra-HD Field Heavy Truss Assembly & High-Load Bolted Connections',
      tag: 'Fabrication & Erection',
      specs: 'AISC / IS Code Verified • Ultrasonic Tested'
    }
  ];

  const currentShowcase = showcaseModes.find(m => m.id === activeMode) || showcaseModes[0];

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#FBF9F5] text-[#0C0A09] pt-24 sm:pt-28 md:pt-32 pb-12"
    >
      {/* Precision CAD Engineering Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0C0A09 1px, transparent 1px), linear-gradient(to bottom, #0C0A09 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Warm Golden Glows matching brand logo */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#EDA81C]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[#EDA81C]/8 blur-3xl pointer-events-none" />

      {/* CAD Boundary Framing Lines with Technical Corner Marks */}
      <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 top-0 bottom-0 border-x border-[#E7E1D8]/80 pointer-events-none">
        <div className="absolute top-28 left-0 -translate-x-1/2 text-[10px] font-mono text-[#78716C] bg-[#FBF9F5] px-1 select-none">
          + 13°04&apos;N
        </div>
        <div className="absolute top-28 right-0 translate-x-1/2 text-[10px] font-mono text-[#78716C] bg-[#FBF9F5] px-1 select-none">
          + 80°16&apos;E
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center my-auto">
        
        {/* Top Status & Verification Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-xs text-xs font-sans uppercase tracking-[0.2em] text-[#0C0A09] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#EDA81C] animate-pulse" />
            <Compass className="w-3.5 h-3.5 text-[#EDA81C]" />
            <span>Path to Perfection</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/80 border border-stone-200/80 text-[11px] font-mono text-[#292524]">
            <span>ISO 9001:2015</span>
            <span className="w-1 h-1 rounded-full bg-[#EDA81C]" />
            <span>IS • AISC • Eurocode Standards</span>
          </div>
        </motion.div>

        {/* Hero Two-Column Full-Page Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headline, Narrative & Conversion CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            
            {/* Fluid Staggered Animated Headline */}
            <div className="overflow-hidden">
              <AnimatedHeading
                as="h1"
                text="Engineering The Path To Structural Perfection."
                highlightWord="Structural"
                highlightClass="text-[#EDA81C] italic font-serif"
                className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-[4.2rem] leading-[1.08] tracking-tight text-[#0C0A09] font-bold"
              />
            </div>

            {/* Sub-narrative strictly from company details */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-6 text-base sm:text-lg text-[#292524] font-sans font-normal leading-[1.75] max-w-xl"
            >
              <strong className="font-semibold text-[#0C0A09]">
                From Concept to Creation.
              </strong>{' '}
              Delivering turnkey Project Management Consultancy, Structural Design &amp; Detailing, Tekla 3D Steel Modeling, BIM LOD 500, and Oil &amp; Gas plant engineering with uncompromised mathematical rigor.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
            >
              {onNavigateToExpertise ? (
                <button
                  type="button"
                  id="hero-explore-domains-btn"
                  onClick={onNavigateToExpertise}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#EDA81C] text-[#0C0A09] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all duration-300 hover:bg-[#D49110] shadow-md hover:shadow-xl cursor-pointer"
                >
                  <span>Explore 7 Domains</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  id="hero-explore-btn"
                  onClick={onExploreClick}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#EDA81C] text-[#0C0A09] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all duration-300 hover:bg-[#D49110] shadow-md hover:shadow-xl cursor-pointer"
                >
                  <span>Begin Your Journey</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}

              <a
                href="#projects"
                id="hero-portfolio-btn"
                onClick={(e) => {
                  if (onNavigateToPortfolio) {
                    e.preventDefault();
                    onNavigateToPortfolio();
                  }
                }}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl backdrop-blur-xl bg-white/80 border border-stone-200/80 text-xs font-sans uppercase tracking-[0.2em] font-bold text-[#0C0A09] hover:bg-white hover:border-[#EDA81C] hover:text-[#0C0A09] transition-all shadow-xs cursor-pointer"
              >
                <span>View Portfolio</span>
              </a>
            </motion.div>

            {/* Core Verification Telemetry Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="mt-10 p-4 rounded-2xl backdrop-blur-2xl bg-white/80 border border-white/90 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#292524]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#EDA81C] shrink-0" />
                <span className="font-bold text-[#0C0A09]">Clear Load Paths</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#EDA81C]" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EDA81C] shrink-0" />
                <span className="font-bold text-[#0C0A09]">Zero Clash LOD 500</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#EDA81C]" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0C0A09]">Fabrication-Ready</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Creative Interactive Multi-Mode Showcase Console */}
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/90 bg-white/80 backdrop-blur-2xl p-3 sm:p-4"
            >
              {/* Interactive Showcase Mode Switcher Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                {showcaseModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = activeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setActiveMode(mode.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#0C0A09] text-white shadow-md'
                          : 'bg-stone-100/80 text-[#292524] hover:bg-stone-200/80 hover:text-[#0C0A09]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#EDA81C]' : 'text-[#78716C]'}`} />
                      <span>{mode.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="active-showcase-tab"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#EDA81C] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Media Viewport with Dynamic Transition */}
              <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900">
                <AnimatePresence mode="wait">
                  {currentShowcase.type === 'video' ? (
                    <motion.div
                      key={currentShowcase.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative w-full h-full"
                    >
                      <video
                        ref={videoRef}
                        src={currentShowcase.src}
                        poster={currentShowcase.poster}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        onError={() => {
                          if (
                            videoRef.current &&
                            currentShowcase.fallbackSrc &&
                            videoRef.current.src !== currentShowcase.fallbackSrc
                          ) {
                            videoRef.current.src = currentShowcase.fallbackSrc;
                            videoRef.current.load();
                          }
                        }}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentShowcase.id}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative w-full h-full"
                    >
                      <img
                        src={currentShowcase.src}
                        alt={currentShowcase.caption}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ambient Top Tag */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C0A09]/80 backdrop-blur-md border border-white/20 text-[11px] font-sans font-bold text-white shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#EDA81C] animate-pulse" />
                  <span>{currentShowcase.tag}</span>
                </div>

                {/* Floating Telemetry Badge */}
                <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/90">
                  <span>{currentShowcase.specs}</span>
                </div>

                {/* Video Play / Mute Controls */}
                {currentShowcase.type === 'video' && (
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#0C0A09] hover:bg-[#EDA81C] hover:text-[#0C0A09] transition-all shadow-md focus:outline-none cursor-pointer"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#0C0A09] hover:bg-[#EDA81C] hover:text-[#0C0A09] transition-all shadow-md focus:outline-none cursor-pointer"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Lower Console Information Footer */}
              <div className="p-4 sm:p-5 rounded-2xl mt-3 bg-white/90 backdrop-blur-xl border border-white/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#EDA81C] font-bold">
                      DEWEG TECHNICAL CONSOLE
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0C0A09] font-bold mt-1">
                    {currentShowcase.caption}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#0C0A09] text-[#EDA81C] flex items-center justify-center font-bold text-xs shrink-0 ml-3 shadow-sm">
                  DW
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>

      {/* Elegant Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-2 mt-8 pointer-events-auto"
      >
        <a
          href="#about"
          className="group flex flex-col items-center text-[10px] uppercase tracking-[0.3em] text-[#78716C] hover:text-[#0C0A09] transition-colors"
          aria-label="Scroll down to About section"
        >
          <span className="mb-1 font-semibold">Explore Engineering Firm</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#EDA81C]" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
