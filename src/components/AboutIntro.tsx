import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { CORE_PRINCIPLES } from '../data/engineeringData';

const TOTAL_FRAMES = 120;
const FRAME_PATH = '/frames/section4/frame_';

function framePath(index: number): string {
  return `${FRAME_PATH}${String(index + 1).padStart(4, '0')}.webp`;
}

const PRINCIPLES = CORE_PRINCIPLES;

const STAGE_LABELS = [
  'INTACT BUILDING',
  'FIRST CUT',
  'STRUCTURAL REVEAL',
  'COORDINATION REVEAL',
  'FULL CUTAWAY',
];

const EYEBROW = 'Section 04 · To Define The Path';
const HEADLINE = 'Grounded in information flows.';

const CARD_IN = { opacity: 0, y: 24 };
const CARD_OUT = { opacity: 0, y: -16 };
const CARD_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;

export default function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [drawFrame0, setDrawFrame0] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const percentRef = useRef<HTMLSpanElement>(null);
  const stageLabelRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Paint one frame, object-cover fitted across the full viewport.
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || window.innerWidth;
    const cssH = rect.height || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || !img.naturalWidth) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    // object-cover equivalent
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cssW / iw, cssH / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cssW - w) / 2;
    const y = (cssH - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  };

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const stage = Math.min(PRINCIPLES.length - 1, Math.floor(latest * PRINCIPLES.length));
    if (stage !== active) setActive(stage);

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(latest * (TOTAL_FRAMES - 1)))
    );
    if (frameIndex !== lastFrameRef.current) {
      lastFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }

    if (percentRef.current) {
      percentRef.current.textContent = `${String(Math.round(latest * 100)).padStart(2, '0')}`;
    }
    if (stageLabelRef.current) {
      stageLabelRef.current.textContent = STAGE_LABELS[stage];
    }
  });

  // Preload all frames; the first one paints as soon as it arrives.
  useEffect(() => {
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
  }, []);

  // Paint frame 0 once available (and on resize).
  useEffect(() => {
    if (!drawFrame0) return;
    drawFrame(0);
  }, [drawFrame0]);

  useEffect(() => {
    const onResize = () => {
      if (lastFrameRef.current >= 0) drawFrame(lastFrameRef.current);
      else if (drawFrame0) drawFrame(0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame0]);

  const principle = PRINCIPLES[active];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '400vh' }}
    >
      {/* Sticky full-viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0A0A0A]">
        {/* Full-viewport scroll-scrubbed frame canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 1s ease' }}
        />

        {/* Subtle overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50 z-10" />

        {/* Technical viewfinder corners */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <span className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#0D9488]/50" />
          <span className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#0D9488]/50" />
          <span className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#0D9488]/50" />
          <span className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#0D9488]/50" />
        </div>

        {/* Top header — eyebrow + headline */}
        <div className="absolute inset-x-0 top-0 z-30 px-8 pt-12 md:pt-16 text-center pointer-events-none">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-[#DDEBF0]/70"
          >
            {EYEBROW}
          </motion.p>
          <motion.h2
            className="font-sans font-medium text-white leading-[1.08] tracking-[-0.03em] text-[clamp(2rem,4vw,3.4rem)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {HEADLINE}
          </motion.h2>
        </div>

        {/* Zig-zag editorial content — alternates left / right per stage */}
        <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={principle.number}
              initial={CARD_IN}
              animate={{ opacity: 1, y: 0 }}
              exit={CARD_OUT}
              transition={CARD_TRANSITION}
              className={`w-full px-8 md:px-12 lg:px-16 flex ${
                active % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}
            >
              <div className="relative w-full max-w-[820px] pointer-events-auto">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-px bg-[#0D9488]/60" />
                  <span className="font-mono text-[12px] font-bold uppercase tracking-[0.24em] text-[#0D9488] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    {STAGE_LABELS[active]}
                  </span>
                </div>

                <h3 className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-bold tracking-[-0.035em] text-white leading-[1.02] mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                  {principle.title}
                </h3>

                <p className="font-sans text-[clamp(1.3rem,2vw,1.7rem)] font-semibold tracking-[-0.01em] text-white leading-[1.35] max-w-[700px] mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
                  {principle.statement}
                </p>

                <p className="font-sans text-[clamp(1.05rem,1.4vw,1.2rem)] font-medium text-white/90 leading-[1.55] max-w-[680px] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                  {principle.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom HUD strip — stage rail + scrub progress */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-8 md:px-12 lg:px-16 pb-6">
          <div className="flex items-end justify-between gap-6">
            <div className="hidden md:flex flex-col gap-2 min-w-0">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#DDEBF0]/50">
                Section 04 · Scroll Timeline
              </span>
              <div className="flex items-center gap-0 min-w-0">
                {STAGE_LABELS.map((label, i) => (
                  <div key={label} className="flex items-center">
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-300 ${
                        active >= i ? 'text-white font-bold' : 'text-white/25'
                      }`}
                    >
                      {label}
                    </span>
                    {i < STAGE_LABELS.length - 1 && (
                      <span
                        className={`mx-3 h-px w-8 transition-colors duration-300 ${
                          active > i ? 'bg-[#EDA81C]' : 'bg-white/15'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-[#DDEBF0]/50">
              <span className="hidden sm:inline">Stage {String(active + 1).padStart(2, '0')} / 05</span>
              <span className="w-8 h-px bg-[#0D9488]/50" />
              <span className="text-[#0D9488]">
                <span ref={percentRef}>00</span>%
              </span>
            </div>
          </div>
        </div>

        {/* Stage label chip over canvas */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-[6px] bg-white/10 backdrop-blur-md border border-white/15">
          <span ref={stageLabelRef} className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/80">
            {STAGE_LABELS[active]}
          </span>
        </div>

        {/* Loading progress hairline */}
        {!ready && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-[2px] bg-white/10">
            <div
              className="h-full bg-[#0D9488] transition-[width] duration-300"
              style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}