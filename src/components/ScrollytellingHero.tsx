import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'motion/react';

const TOTAL_FRAMES = 90;
const FRAME_PATH = '/frames/frame_';

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

function framePath(index: number): string {
  return `${FRAME_PATH}${String(index + 1).padStart(4, '0')}.webp`;
}

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
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);
  const lastChapterRef = useRef(0);
  const lastProgressRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [drawFrame0, setDrawFrame0] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Viewfinder HUD readouts - updated via textContent in the scroll handler
  // to avoid re-renders at 60fps.
  const percentRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Hero "transfer": centered full-width headline crossfades into the left column
  // while the model slides right - all driven by the first HERO_END of the scroll.
  const heroProgress = useTransform(scrollYProgress, [0, HERO_END], [0, 1]);
  const heroCenterOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroCenterX = useTransform(heroProgress, [0, 1], [0, -70]);
  const heroCenterScale = useTransform(heroProgress, [0, 1], [1, 1.05]);
  const heroLeftOpacity = useTransform(heroProgress, [0.25, 0.75], [0, 1]);
  const heroLeftX = useTransform(heroProgress, [0, 1], [46, 0]);

  // Paint one frame, contain-fitted into a model zone on the right two-thirds
  // (desktop) so the left column stays free for text - text never covers the model.
  // A slow zoom applied across the journey adds a subtle "camera breathe".
  const drawFrame = (frameIndex: number, progress = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || !img.naturalWidth) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const isDesktop = cssW >= 768;
    // Hero transfer: at progress 0 the model is large, centered and covering the
    // width; by hero end (p >= HERO_END) it has slid right and settled into the
    // right-side column. The lift-in (y push) makes it feel like the bridge rises
    // into place as the user scrolls.
    let zoneX: number;
    let zoneW: number;
    let zoneH: number;
    if (isDesktop) {
      const hp = Math.min(1, progress / HERO_END);
      const e = hp * hp * (3 - 2 * hp); // smoothstep
      const lerp = (from: number, to: number) => from + (to - from) * e;
      zoneX = lerp(cssW * 0.125, cssW * 0.44);
      zoneW = lerp(cssW * 0.75, cssW * 0.56);
      zoneH = lerp(cssH * 0.75, cssH * 0.78);
    } else {
      zoneX = cssW * 0.125;
      zoneW = cssW * 0.75;
      zoneH = cssH * 0.75;
    }
    const zoneY = (cssH - zoneH) / 2;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const baseScale = Math.min(zoneW / iw, zoneH / ih);
    // Slow push-in, ~4% across the full journey - barely perceptible, adds depth.
    const zoom = 1 + progress * 0.04;
    const w = iw * baseScale * zoom;
    const h = ih * baseScale * zoom;
    const x = zoneX + (zoneW - w) / 2;
    // Model starts slightly lower and rises into place during the hero transfer.
    const liftIn = isDesktop ? (1 - Math.min(1, progress / HERO_END) ** 2) * cssH * 0.06 : 0;
    const y = zoneY + (zoneH - h) / 2 - cssH * 0.02 + liftIn;

    // Soft contact shadow on the drawing board beneath the model
    const cx = x + w / 2;
    const cy = y + h;
    const shadow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.45);
    shadow.addColorStop(0, 'rgba(15, 23, 42, 0.13)');
    shadow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.14);
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = shadow;
    ctx.fill();
    ctx.restore();

    ctx.drawImage(img, x, y, w, h);
  };

  // Raw progress drives the scrub (Lenis already smooths the scroll itself).
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Which chapter is active? Ranges are exclusive and non-overlapping,
    // so exactly one chapter owns a given scroll position. The last known
    // chapter is kept across the silent reassembly gap (no chapter match).
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

    // Viewfinder HUD readouts update in place (no React re-render needed).
    if (percentRef.current) {
      percentRef.current.textContent = `${String(Math.round(latest * 100)).padStart(2, '0')}%`;
    }
    if (frameRef.current) {
      const ch = CHAPTERS[active];
      const label =
        ch.kind === 'hero' ? 'IDLE' : ch.kind === 'cta' ? 'END' : ch.number;
      frameRef.current.textContent = `${label} / 07`;
    }

    // Which frame to paint? Linear mapping - one frame per scroll step.
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(latest * (TOTAL_FRAMES - 1)))
    );
    if (frameIndex !== lastFrameRef.current) {
      lastFrameRef.current = frameIndex;
      drawFrame(frameIndex, latest);
    }
  });

  // Preload all frames; first frame paints as soon as it arrives.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.fetchPriority = i < 5 ? 'high' : 'low';
      images.push(img);
    }

    imagesRef.current = images;

    let loaded = 0;
    const onLoad = () => {
      if (cancelled) return;
      loaded += 1;
      setLoadedCount(loaded);
      if (loaded === 1) setDrawFrame0(true);
      if (loaded >= TOTAL_FRAMES) setReady(true);
    };

    images.forEach((img) => {
      if (img.complete) onLoad();
      else {
        img.onload = onLoad;
        img.onerror = onLoad;
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Paint frame 0 once available (and on resize).
  useEffect(() => {
    if (!drawFrame0) return;
    drawFrame(0);
  }, [drawFrame0]);

  useEffect(() => {
    const onResize = () => {
      if (lastFrameRef.current >= 0) drawFrame(lastFrameRef.current, lastProgressRef.current);
      else if (drawFrame0) drawFrame(0, lastProgressRef.current);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame0]);

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
        {/* Frame paint surface - fades in with the assembled model */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out"
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
                <HeroChapter
                  ready={ready}
                  centerStyle={{
                    opacity: heroCenterOpacity,
                    x: heroCenterX,
                    scale: heroCenterScale,
                  }}
                  leftStyle={{ opacity: heroLeftOpacity, x: heroLeftX }}
                />
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
          <div className="absolute inset-x-0 bottom-0 z-50 h-[2px] bg-[#E2E8F0]/40">
            <div
              className="h-full bg-[#0D9488] transition-[width] duration-300"
              style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type HeroScrollStyle = {
  opacity: MotionValue<number>;
  x: MotionValue<number>;
  scale?: MotionValue<number>;
};

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
  centerStyle,
  leftStyle,
}: {
  ready: boolean;
  centerStyle: HeroScrollStyle;
  leftStyle: HeroScrollStyle;
}) {
  return (
    <div className="absolute inset-0">
      {/* CENTER INTRO (desktop) - full-width, centered on load; crossfades out as you scroll */}
      <motion.div
        style={{ opacity: centerStyle.opacity, x: centerStyle.x, scale: centerStyle.scale }}
        className="absolute inset-0 hidden md:flex items-center justify-center"
      >
        {/* Legibility scrim behind the centered headline */}
        <div className="absolute -inset-10 bg-[#F6F8F7]/65 blur-2xl pointer-events-none" />

        {/* Centered surveyor compass rings - slow counter-rotation adds the wow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 90, ease: 'linear' }}
            className="absolute w-[min(84vw,920px)] aspect-square rounded-full border border-dashed border-[#0D9488]/20"
          />
          <motion.span
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
            className="absolute w-[min(60vw,660px)] aspect-square rounded-full border border-[#0D9488]/10"
          />
          <span className="absolute font-mono text-[10px] tracking-[0.5em] text-[#0D9488]/25">
            N&nbsp;E&nbsp;W&nbsp;S&nbsp;S&nbsp;E
          </span>
        </div>

        <div className="relative px-8 text-center max-w-[1200px]">
          <HeroEyebrow ready={ready} center />
          <KineticHeadline
            ready={ready}
            text="Engineering the Future Through Digital Precision."
            accentIndexes={[4, 5]}
            className="font-display font-black text-[#0F172A] leading-[0.96] tracking-[-0.04em] text-[clamp(3rem,7vw,6.75rem)]"
          />
          <div className="mt-8 mx-auto max-w-[680px]">
            <KineticLine
              ready={ready}
              text="Complex structural, industrial, and digital engineering, deconstructed to absolute certainty."
              className="font-sans text-[clamp(1.15rem,1.7vw,1.45rem)] leading-[1.6] text-[#475569]"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="mt-10"
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
      </motion.div>

      {/* LEFT COLUMN (desktop) - slides/fades in as the user scrolls */}
      <motion.div
        style={{ opacity: leftStyle.opacity, x: leftStyle.x }}
        className="absolute inset-0 hidden md:flex items-center"
      >
        <div className="w-full md:w-[56vw] max-w-[880px] px-6 md:px-10 lg:px-14">
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
      </motion.div>

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
        <div className="w-full md:w-[56vw] max-w-[880px] px-6 md:px-10 lg:px-14">
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
        <div className="w-full md:w-[56vw] max-w-[880px] px-6 md:px-10 lg:px-14">
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