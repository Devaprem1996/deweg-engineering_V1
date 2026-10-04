import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'motion/react';
import { AssemblyScene, type AssemblyViewMode, type AssemblyHotspot } from '../lib/three/AssemblyScene';

type MilestoneChapter = {
  kind: 'milestone';
  number: string;
  title: string;
  description: string;
  hud: string;
  metrics: string[];
};

type Chapter =
  | { kind: 'hero' }
  | (MilestoneChapter & { range: [number, number] })
  | { kind: 'cta'; range: [number, number] };

/**
 * Each chapter owns a scroll range. Ranges DO NOT overlap, so at any
 * scroll position exactly ONE chapter is active - never a stack of text.
 */
const CHAPTERS: Chapter[] = [
  // Hero intro - fully assembled model fills the canvas
  { kind: 'hero' },

  // Milestone 01 - Project Management & Controlling
  {
    kind: 'milestone',
    range: [0.085, 0.155],
    number: '01',
    title: 'Project Management & Controlling',
    description: 'Dynamic timelines, cost controlling, and project oversight govern the entire build.',
    hud: 'PROJECT CONTROLLING Active',
    metrics: ['CPM 4D/5D', 'EARNED VALUE', 'ISO 21500'],
  },

  // Milestone 02 - Structural Design & Detailed Engineering
  {
    kind: 'milestone',
    range: [0.155, 0.225],
    number: '02',
    title: 'Structural Design & Detailed Engineering',
    description: 'Non-linear analysis and resilient detailing, de-risking every load path.',
    hud: 'STRUCTURAL FEA Active',
    metrics: ['FEA', 'IS 1893', 'LRFD'],
  },

  // Milestone 03 - Building Information Modelling
  {
    kind: 'milestone',
    range: [0.225, 0.295],
    number: '03',
    title: 'Building Information Modelling',
    description: 'Interactive, data-rich 3D models unifying every phase of design.',
    hud: 'LOD 500 BIM DATA',
    metrics: ['ISO 19650', 'LOD 200-500'],
  },

  // Milestone 04 - Structural Steel Modelling & Detailing
  {
    kind: 'milestone',
    range: [0.295, 0.395],
    number: '04',
    title: 'Structural Steel Modelling & Detailing',
    description: 'Millimeter-precise detailing for massive steel skeletons.',
    hud: 'ASTM A36 STEEL',
    metrics: ['ASTM A36', 'DSTV/NC'],
  },

  // Milestone 05 - Oil & Gas Structural Engineering
  {
    kind: 'milestone',
    range: [0.395, 0.495],
    number: '05',
    title: 'Oil & Gas Structural Engineering',
    description: 'Offshore and industrial environments built to withstand the toughest forces on earth.',
    hud: 'OFFSHORE STRUCTURAL INTEGRITY',
    metrics: ['API', 'NORSOK', 'RISER'],
  },

  // Milestone 06 - MEP Design & Detailed Engineering
  {
    kind: 'milestone',
    range: [0.495, 0.6],
    number: '06',
    title: 'MEP Design & Detailed Engineering',
    description: 'Mechanical, electrical, plumbing, and fire safety systems engineered with absolute spatial coordination.',
    hud: 'MEP COORDINATION Active',
    metrics: ['NFPA 13', 'CLASH-FREE'],
  },

  // Milestone 07 - Information Technology Solutions
  {
    kind: 'milestone',
    range: [0.6, 0.7],
    number: '07',
    title: 'Information Technology Solutions',
    description: 'Structural data management, IT integration, and digital twin delivery.',
    hud: 'DIGITAL TWIN Online',
    metrics: ['DIGITAL TWIN', 'IT OPS'],
  },

  // Reassembly beat - canvas only, no text (short silent pause before the CTA)
  { kind: 'cta', range: [0.74, 1] },
];

const HERO_END = 0.085;

export default function ScrollytellingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<AssemblyScene | null>(null);
  const lastChapterRef = useRef(0);
  const lastProgressRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Creative Enhancements: Shading mode, hotspots, and 360 drag orbit
  const [viewMode, setViewMode] = useState<AssemblyViewMode>('solid');
  const [hotspots, setHotspots] = useState<AssemblyHotspot[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Viewfinder HUD readouts - updated via textContent in the scroll handler
  // to avoid re-renders at 60fps.
  const percentRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Raw progress drives the 3D WebGL assembly
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    let active = lastChapterRef.current;
    if (latest < HERO_END) {
      active = 0;
    } else {
      for (let i = 1; i < CHAPTERS.length; i++) {
        const ch = CHAPTERS[i];
        if (ch.kind !== 'hero' && latest >= ch.range[0] && latest < ch.range[1]) {
          active = i;
          break;
        }
      }
    }
    lastChapterRef.current = active;
    if (active !== activeIndex) setActiveIndex(active);
    lastProgressRef.current = latest;

    // Viewfinder HUD readouts update in place (no React re-render needed)
    if (percentRef.current) {
      percentRef.current.textContent = `${String(Math.round(latest * 100)).padStart(2, '0')}%`;
    }
    if (frameRef.current) {
      const ch = CHAPTERS[active];
      const label =
        ch.kind === 'hero' ? 'IDLE' : ch.kind === 'cta' ? 'END' : ch.number;
      frameRef.current.textContent = `${label} / 07`;
    }

    // Pass scroll progress to Three.js AssemblyScene
    if (sceneRef.current) {
      const isMobile = window.innerWidth < 768;
      sceneRef.current.updateProgress(latest, isMobile);
      if (!isMobile) {
        setHotspots(sceneRef.current.getHotspots());
      }
    }
  });

  // Switch shading view mode
  const handleModeChange = (mode: AssemblyViewMode) => {
    setViewMode(mode);
    sceneRef.current?.setViewMode(mode);
  };

  // Initialize Three.js Assembly Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const scene = new AssemblyScene(canvas, { isMobile });
    sceneRef.current = scene;

    // Fade-in model surface
    const timer = setTimeout(() => {
      setReady(true);
      scene.updateProgress(lastProgressRef.current, window.innerWidth < 768);
      if (!isMobile) {
        setHotspots(scene.getHotspots());
      }
    }, 60);

    // Responsive resize handler
    const handleResize = () => {
      scene.resize();
      scene.updateProgress(lastProgressRef.current, window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setHotspots(scene.getHotspots());
      }
    };
    window.addEventListener('resize', handleResize);

    // Mouse tilt interaction on desktop
    const handlePointerMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      scene.setPointer(nx, ny);
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // IntersectionObserver to sleep WebGL loop when section is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scene.start();
        } else {
          scene.pause();
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  const activeChapter: Chapter | undefined = CHAPTERS[activeIndex];
  const activeMilestone =
    activeChapter?.kind === 'milestone'
      ? (activeChapter as MilestoneChapter)
      : undefined;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '300vh' }}
    >
      {/* Blueprint drawing board */}
      <div className="scrolly-blueprint-grid">
        <div className="scrolly-ruler" />
      </div>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Frame paint surface - with interactive 360 drag orbit */}
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            if (window.innerWidth < 768) return;
            setIsDraggingCanvas(true);
            setHasInteracted(true);
            sceneRef.current?.startDrag(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (window.innerWidth < 768 || !isDraggingCanvas) return;
            sceneRef.current?.moveDrag(e.clientX, e.clientY);
            setHotspots(sceneRef.current?.getHotspots() || []);
          }}
          onPointerUp={() => {
            setIsDraggingCanvas(false);
            sceneRef.current?.endDrag();
          }}
          onPointerLeave={() => {
            setIsDraggingCanvas(false);
            sceneRef.current?.endDrag();
          }}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
            isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ opacity: ready ? 1 : 0 }}
        />

        {/* Soft vignette to seat the model on the drawing board */}
        <div className="absolute inset-0 pointer-events-none scrolly-vignette" />

        {/* Cinematic viewfinder frame - corner brackets + technical readouts */}
        <div className="absolute inset-4 md:inset-6 pointer-events-none z-20 hidden md:block">
          <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#0D9488]/40" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#0D9488]/40" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#0D9488]/40" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#0D9488]/40" />
        </div>

        {/* Shading View Mode Switcher (Solid / X-Ray / CAD Wireframe) */}
        <div className="absolute top-20 left-8 md:left-14 z-30 hidden md:flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-md border border-[#0D9488]/25 shadow-sm pointer-events-auto">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#64748B] px-2 py-0.5 font-bold">
            VIEW:
          </span>
          {(['solid', 'xray', 'cad'] as AssemblyViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-[#0D9488] text-white font-bold shadow-xs'
                  : 'text-[#0F172A]/70 hover:text-[#0D9488] hover:bg-[#0D9488]/10'
              }`}
            >
              {mode === 'solid' ? 'Solid PBR' : mode === 'xray' ? 'X-Ray' : 'CAD Wire'}
            </button>
          ))}
        </div>

        {/* 360 Drag Orbit Subtle Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
          <motion.div
            animate={{ opacity: hasInteracted ? 0 : [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="flex items-center gap-2 px-3 py-1 bg-white/70 backdrop-blur-md border border-[#0D9488]/20 rounded-full font-mono text-[9px] tracking-[0.2em] text-[#0F172A]/60 uppercase shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-ping" />
            <span>DRAG 360° TO INSPECT ASSEMBLY</span>
          </motion.div>
        </div>

        {/* Viewfinder Telemetry Readouts */}
        <div className="absolute bottom-8 left-10 md:left-14 z-20 pointer-events-none hidden md:block">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] text-[#0F172A]/55">
            <span className="w-8 h-px bg-[#0D9488]/50" />
            <span ref={percentRef}>00%</span>
          </div>
        </div>

        <div className="absolute bottom-8 right-10 md:right-14 z-20 pointer-events-none hidden md:block">
          <span ref={frameRef} className="font-mono text-[10px] tracking-[0.24em] text-[#0F172A]/55">
            IDLE / 07
          </span>
        </div>

        {/* Active HUD tag - one at a time, top-right, away from the text */}
        <AnimatePresence>
          {activeMilestone && (
            <motion.div
              key={`hud-${activeMilestone.number}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute top-20 right-8 md:right-16 z-30 hidden md:block"
            >
              <div className="scrolly-hud-tag">
                <span className="scrolly-hud-dot" />
                <span className="scrolly-hud-text">[{activeMilestone.hud}]</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Component Hotspots pinned to 3D Coordinates */}
        {hotspots.map((spot) => (
          spot.visible && (
            <div
              key={spot.id}
              className="absolute z-30 pointer-events-auto transition-transform duration-75 hidden md:block"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="group relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                  }}
                  className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/90 border border-[#0D9488] shadow-md hover:scale-115 transition-transform cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
                </button>

                {/* Hotspot Floating Editorial Card */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-white/95 backdrop-blur-lg border border-[#0D9488]/30 rounded-lg shadow-xl transition-all duration-200 pointer-events-auto ${
                    activeHotspot === spot.id
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[9px] font-bold text-[#0D9488] uppercase tracking-wider">
                      {spot.tag}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#EDA81C]" />
                  </div>
                  <p className="font-sans font-bold text-[12px] text-[#0F172A] leading-tight">
                    {spot.title}
                  </p>
                  <p className="font-sans text-[11px] text-[#64748B] leading-snug mt-0.5">
                    {spot.subtitle}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {spot.metrics.map((m) => (
                      <span
                        key={m}
                        className="font-mono text-[8px] px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}

        {/* Active chapter text - ONLY one of these renders at a time */}
        <AnimatePresence mode="wait">
          {activeChapter && (
            <motion.div
              key={activeChapter.kind === 'hero' ? 'hero' : activeChapter.kind === 'cta' ? 'cta' : `ch-${activeChapter.number}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-40 pointer-events-none"
            >
              {activeChapter.kind === 'hero' && (
                <HeroChapter ready={ready} />
              )}
              {activeChapter.kind === 'milestone' && (
                <MilestoneChapter chapter={activeChapter} />
              )}
              {activeChapter.kind === 'cta' && <CtaChapter />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading progress hairline */}
        {!ready && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-[2px] bg-[#E2E8F0]/40 overflow-hidden">
            <div className="h-full w-full bg-[#0D9488] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

// Kinetic headline: each word rises from behind a mask with a staggered delay,
// then a soft light sweeps across the finished line every few seconds.
// Words listed in `accentIndexes` are filled with the brand gold gradient
// (bg-clip-text) for a bright "wow" beat on the key phrase.
function KineticHeadline({
  ready,
  text,
  className,
  accentIndexes = [],
}: {
  ready: boolean;
  text: string;
  className: string;
  accentIndexes?: number[];
}) {
  const words = text.split(' ');
  return (
    <h1 className={`relative ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-top pb-[0.08em] -mb-[0.08em]"
        >
          <motion.span
            className={`inline-block will-change-transform ${
              accentIndexes.includes(i)
                ? 'bg-gradient-to-r from-[#D49110] via-[#EDA81C] to-[#C9860F] bg-clip-text text-transparent'
                : ''
            }`}
            initial={{ y: '118%', rotate: 3 }}
            animate={ready ? { y: '0%', rotate: 0 } : {}}
            transition={{ delay: 0.35 + i * 0.065, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      {/* Slow light sweep over the finished headline */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.3, duration: 1 }}
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[0.25em]"
        aria-hidden
      >
        <motion.span
          animate={{ x: ['-130%', '230%'] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', repeatDelay: 1.6 }}
          className="absolute top-[-25%] bottom-[-25%] w-[30%] rotate-6 bg-gradient-to-r from-transparent via-[#0D9488]/15 to-transparent blur-md mix-blend-multiply"
        />
      </motion.span>
    </h1>
  );
}

// Kinetic line: sub-copy rises line-to-line behind a mask, staggered after the headline.
function KineticLine({
  ready,
  text,
  className,
}: {
  ready: boolean;
  text: string;
  className: string;
}) {
  const words = text.split(' ');
  return (
    <p className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '100%' }}
            animate={ready ? { y: '0%' } : {}}
            transition={{ delay: 0.75 + i * 0.03, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </p>
  );
}

// Eyebrow with a technical "measure" rule that draws in beside the label.
function HeroEyebrow({ ready, center }: { ready: boolean; center?: boolean }) {
  return (
    <div className={`mb-6 flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.5em' }}
        animate={ready ? { opacity: 1, letterSpacing: '0.3em' } : {}}
        transition={{ delay: 0.15, duration: 0.9, ease: 'easeOut' }}
        className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#0D9488]/80"
      >
        DEWEG Engineering · Chennai
      </motion.p>
      <motion.span
        initial={{ scaleX: 0 }}
        animate={ready ? { scaleX: 1 } : {}}
        transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden sm:block h-px w-14 bg-gradient-to-r from-[#F97316]/70 to-transparent origin-left"
      />
    </div>
  );
}

function HeroChapter({
  ready,
}: {
  ready: boolean;
}) {
  return (
    <div className="absolute inset-0">
      {/* DESKTOP - Left Column layout perfectly aligned with milestones and unobstructed 3D stage */}
      <div className="absolute inset-0 hidden md:flex items-center">
        <div className="w-full md:w-[38vw] max-w-[560px] px-6 md:px-10 lg:px-14">
          <HeroEyebrow ready={ready} />
          <KineticHeadline
            ready={ready}
            text="Engineering the Future Through Digital Precision."
            accentIndexes={[4, 5]}
            className="font-display font-black text-[#0F172A] leading-[1.0] tracking-[-0.04em] text-[clamp(2.3rem,4vw,3.6rem)]"
          />
          <div className="mt-6 max-w-[560px]">
            <KineticLine
              ready={ready}
              text="Complex structural, industrial, and digital engineering, deconstructed to absolute certainty."
              className="font-sans text-[clamp(1.05rem,1.3vw,1.2rem)] leading-[1.6] text-[#475569]"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="mt-8"
          >
            <span className="scrolly-scroll-cue">
              <span>Scroll to explore</span>
              <span className="scrolly-scroll-line">
                <motion.span
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="scrolly-scroll-dot"
                />
              </span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* MOBILE - compact top layout with legibility scrim */}
      <div className="absolute inset-0 flex items-start md:hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#F6F8F7]/95 via-[#F6F8F7]/60 to-transparent pointer-events-none" />
        <div className="w-full px-6 pt-24">
          <HeroEyebrow ready={ready} />
          <KineticHeadline
            ready={ready}
            text="Engineering the Future Through Digital Precision."
            accentIndexes={[4, 5]}
            className="font-display font-black text-[#0F172A] leading-[1.04] tracking-[-0.03em] text-[clamp(1.8rem,8vw,2.6rem)]"
          />
          <div className="mt-4">
            <KineticLine
              ready={ready}
              text="Complex structural, industrial, and digital engineering, deconstructed to absolute certainty."
              className="font-sans text-[0.95rem] leading-[1.6] text-[#475569]"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="mt-8"
          >
            <span className="scrolly-scroll-cue scrolly-scroll-cue--center">
              <span>Scroll to explore</span>
              <span className="scrolly-scroll-line">
                <motion.span
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="scrolly-scroll-dot"
                />
              </span>
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MilestoneChapter({
  chapter,
}: {
  chapter: MilestoneChapter & { range: [number, number] };
}) {
  return (
    <div className="absolute inset-0">
      {/* Mobile legibility scrim (bottom third) */}
      <div className="absolute inset-x-0 bottom-0 h-72 md:hidden bg-gradient-to-t from-[#F6F8F7]/95 via-[#F6F8F7]/55 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-[8vh] md:inset-0 md:flex md:items-center">
        <div className="w-full md:w-[38vw] max-w-[560px] px-6 md:px-10 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-[680px]"
          >
            {/* Editorial ghost number behind the copy */}
            <span aria-hidden="true" className="scrolly-milestone-ghost">
              {chapter.number}
            </span>

            <div className="flex items-center gap-3 mb-4">
              <span className="scrolly-milestone-number">{chapter.number}</span>
              <span className="w-10 h-px bg-[#0D9488]/40" />
            </div>
            <h2 className="scrolly-milestone-title">{chapter.title}</h2>
            <p className="scrolly-milestone-desc">{chapter.description}</p>

            {chapter.metrics.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {chapter.metrics.map((metric) => (
                  <span key={metric} className="scrolly-metric-chip">
                    {metric}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CtaChapter() {
  return (
    <div className="absolute inset-0">
      {/* Mobile legibility scrim (bottom third) */}
      <div className="absolute inset-x-0 bottom-0 h-80 md:hidden bg-gradient-to-t from-[#F6F8F7]/95 via-[#F6F8F7]/55 to-transparent pointer-events-none" />

      <div className="absolute inset-y-0 flex items-end pb-[12vh] md:items-center md:pb-0">
        <div className="w-full md:w-[38vw] max-w-[560px] px-6 md:px-10 lg:px-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black text-[#0F172A] leading-[0.98] tracking-[-0.03em] text-[clamp(2rem,4vw,3.5rem)]"
          >
            Let&apos;s build what&apos;s next.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
            className="mt-4 max-w-[520px] font-sans text-[clamp(1rem,1.2vw,1.1rem)] leading-[1.55] text-[#475569]"
          >
            From detailed structural steel to complete BIM and MEP engineering.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-7 flex items-center gap-4 pointer-events-auto"
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="scrolly-cta-primary"
            >
              Partner with Us
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="scrolly-cta-secondary"
            >
              View case studies
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}