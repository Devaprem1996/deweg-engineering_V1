import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useTransform,
  useMotionValueEvent
} from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  ABOUT_PAGE_ASSETS,
  ABOUT_PAGE_CONTENT,
  DEWEG_LEADERSHIP,
  FIRM_MILESTONES
} from '../data/aboutData';
import { TeamMember } from '../types';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/* ————————————————————————————————————————————
   Design tokens — light architectural monograph
   Paper #F6F5F0 · Ink #161614 · Muted #5E5B54
   Hairline #DDD9CF · Gold #C98A2D
   Tints #EFEEE8 / #E9E6DD
   ———————————————————————————————————————————— */

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

/* ————————————————————————————————————————————
   Assembly sequence — pinned canvas scrub
   ———————————————————————————————————————————— */

const TOTAL_FRAMES = 120;
const FRAME_PATH = '/frames/about/frame_';
const framePath = (index: number) => `${FRAME_PATH}${String(index + 1).padStart(4, '0')}.webp`;

const RADIAL_MASK =
  'radial-gradient(122% 122% at 50% 50%, #000 52%, rgba(0,0,0,0.62) 70%, transparent 80%)';

const HERO_METRICS = [
  { value: '2020', label: 'Chennai HQ' },
  { value: '100+', label: 'Practitioners' },
  { value: 'LOD 500', label: 'Accredited' }
];

function AssemblyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);
  const countRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [drawFrame0, setDrawFrame0] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  // Phase one — intro card fades up and away by 50% scroll.
  const phase1Opacity = useTransform(scrollYProgress, [0.35, 0.5], [1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0.35, 0.5], [0, -24]);

  // Phase two — commissioned data bar appears when the assembly completes.
  const phase2Opacity = useTransform(scrollYProgress, [0.78, 0.86], [0, 1]);
  const phase2Y = useTransform(scrollYProgress, [0.78, 0.86], [24, 0]);

  // Gold scanline sweep across the second half of the assembly.
  const scanTop = useTransform(scrollYProgress, [0.5, 1], ['0%', '100%']);
  const scanOpacity = useTransform(scrollYProgress, [0.5, 0.88], [0, 0.75]);

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
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(latest * (TOTAL_FRAMES - 1)))
    );
    if (frameIndex !== lastFrameRef.current) {
      lastFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }
  });

  // Preload the full sequence; paint frame 0 as soon as it arrives.
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

  // GSAP count-up for the "100+ Practitioners" metric, tied to the final stretch
  // of the hero where the commissioned data bar peers in (≈80% → 100%).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = countRef.current;
    if (!el) return;

    const state = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        n: 100,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${Math.round(state.n)}+`;
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top+=96vh top',
          end: 'top+=120vh top',
          scrub: 1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '220vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#F6F5F0]">
        {/* Scroll-scrubbed assembly canvas, dissolved into the paper via a radial mask */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: ready ? 1 : 0,
            transition: 'opacity 1s ease',
            maskImage: RADIAL_MASK,
            WebkitMaskImage: RADIAL_MASK
          }}
        />

        {/* Gold scanline sweep */}
        <motion.div
          aria-hidden="true"
          style={{ top: scanTop, opacity: scanOpacity }}
          className="absolute left-0 right-0 z-[15] h-px bg-[#C98A2D] pointer-events-none"
        />

        {/* Phase 1 — floating intro card (0% → 50%) */}
        <motion.div
          style={{ opacity: phase1Opacity, y: phase1Y }}
          className="absolute inset-x-0 top-[14%] sm:top-[16%] md:top-[20%] z-20 px-6 md:px-[7vw] pointer-events-none"
        >
          <div className="max-w-[640px] backdrop-blur-md bg-[#F6F5F0]/90 border border-[#DDD9CF] rounded-[2px] p-7 sm:p-9 md:p-10 shadow-[0_24px_60px_-32px_rgba(22,22,20,0.25)]">
            <div className="flex items-center gap-4">
              <span className="block h-px w-8 bg-[#C98A2D]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8C887E]">
                01 / WHO WE ARE
              </span>
            </div>

            <h1 className="mt-6 font-medium text-[#161614] tracking-[-0.035em] leading-[1.02] text-[clamp(2.6rem,5vw,4.5rem)]">
              {sentenceCase(ABOUT_PAGE_CONTENT.title)}
            </h1>

            <p className="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.6] text-[#5E5B54]">
              {ABOUT_PAGE_CONTENT.foundingStory}
            </p>

            <div className="mt-7 pt-5 border-t border-[#DDD9CF] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2D]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8C887E]">
                [ Scroll to assemble — 120 frames ]
              </span>
            </div>
          </div>
        </motion.div>

        {/* Phase 2 — commissioned data bar (80% → 100%) */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y }}
          className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-[7vw] pb-6 md:pb-8 pointer-events-none"
        >
          <div className="backdrop-blur-md bg-[#F6F5F0]/85 border border-[#DDD9CF] rounded-[2px] px-7 py-6 md:px-10 md:py-7 shadow-[0_-24px_60px_-36px_rgba(22,22,20,0.28)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C98A2D]">
                  [ Commissioned as-built twin ]
                </span>
                <h3 className="mt-3 font-medium text-[#161614] tracking-[-0.03em] leading-[1.08] text-[clamp(1.5rem,2.8vw,2.4rem)]">
                  Engineering certainty at full scale.
                </h3>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-[#DDD9CF]">
                {HERO_METRICS.map((metric) => (
                  <div key={metric.label} className="py-4 sm:py-0 sm:px-6 first:sm:pl-0">
                    <span
                      ref={metric.label === 'Practitioners' ? countRef : undefined}
                      className="block font-mono text-[12px] uppercase tracking-[0.14em] text-[#161614]"
                    >
                      {metric.value}
                    </span>
                    <span className="block mt-2 font-sans text-[13px] text-[#5E5B54]">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading hairline */}
        {!ready && (
          <div className="absolute inset-x-0 bottom-0 z-[50] h-[2px] bg-[#E4E1D8]">
            <div
              className="h-full bg-[#C98A2D] transition-[width] duration-300"
              style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* ————————————————————————————————————————————
   Shared editorial primitives
   ———————————————————————————————————————————— */

function Eyebrow({ label }: { label: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px 0px' }}
      className="flex items-center gap-4"
    >
      <motion.span
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        transition={{ duration: 0.8, ease: EASE }}
        className="block h-px w-8 bg-[#C98A2D] origin-left"
      />
      <motion.span
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#8C887E]"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-top">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-60px 0px' }}
            transition={{ duration: 0.8, delay: delay + i * 0.05, ease: EASE }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ————————————————————————————————————————————
   Data helpers
   ———————————————————————————————————————————— */

const sentenceCase = (input: string) =>
  input
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (m) => m.toUpperCase());

const shortBlurb = (leader: TeamMember) =>
  leader.secondaryRole || `${leader.bio.split('.')[0]}.`;

function ViewportPlate({
  src,
  alt,
  figure,
  caption,
  onExpand
}: {
  src: string;
  alt: string;
  figure: string;
  caption: string;
  onExpand: (src: string) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // GSAP parallax + slow zoom as the plate travels through the viewport.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current || !imgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { yPercent: -10, scale: 1.1 },
        {
          yPercent: 10,
          scale: 1.16,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#EBE9E1]">
      <button
        type="button"
        onClick={() => onExpand(src)}
        aria-label={`Expand image — ${caption}`}
        className="group absolute inset-0 block w-full h-full cursor-pointer"
      >
        <div className="w-full h-full overflow-hidden">
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-center will-change-transform"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="absolute inset-0 bg-[#161614]/0 transition-colors duration-500 group-hover:shadow-[inset_0_0_120px_rgba(22,22,20,0.18)]" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px 0px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="absolute bottom-6 left-4 right-4 sm:left-6 md:left-[7vw] z-10 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="backdrop-blur-md bg-[#F6F5F0]/90 border border-[#DDD9CF] rounded-[2px] px-5 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 shadow-[0_16px_40px_-24px_rgba(22,22,20,0.4)]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C98A2D]">
            {figure}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8C887E]">
            {caption}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onExpand(src)}
          className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#161614] hover:text-black transition-colors cursor-pointer max-lg:tap-hit"
        >
          <span className="whitespace-nowrap">Full image</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </motion.div>
    </section>
  );
}

/* ————————————————————————————————————————————
   Page
   ———————————————————————————————————————————— */

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
  const chronologyRef = useRef<HTMLDivElement>(null);

  const pageProgress = useScroll().scrollYProgress;

  // GSAP — chronology spine draws down and the milestone nodes pop as the
  // timeline module travels through the viewport.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!chronologyRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-spine',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: chronologyRef.current,
            start: 'top 72%',
            end: 'bottom 45%',
            scrub: 0.5
          }
        }
      );

      gsap.fromTo(
        '.about-node',
        { scale: 0 },
        {
          scale: 1,
          stagger: 0.12,
          ease: 'back.out(2.2)',
          scrollTrigger: {
            trigger: chronologyRef.current,
            start: 'top 70%',
            end: 'bottom 50%',
            scrub: 0.5
          }
        }
      );
    }, chronologyRef);

    return () => ctx.revert();
  }, []);

  // Close controls: Escape, backdrop click, body scroll lock.
  useEffect(() => {
    if (!selectedLeader && !lightboxImage) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedLeader(null);
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedLeader, lightboxImage]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#F6F5F0] text-[#161614] selection:bg-[#C98A2D]/25 pt-[72px] overflow-x-clip">
        {/* Global scroll progress — fixed 2px gold line */}
        <motion.div
          style={{ scaleX: pageProgress }}
          className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-[#C98A2D] origin-left"
        />

        {/* ─── 1. Breadcrumb header ─── */}
        <header className="max-w-[1600px] mx-auto px-[7vw]">
          <div className="min-h-16 pt-4 pb-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between border-b border-[#DDD9CF]">
            <button
              type="button"
              onClick={onNavigateHome}
              className="group self-start inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#5E5B54] hover:text-[#161614] transition-colors cursor-pointer shrink-0 min-w-0 max-lg:tap-hit"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="whitespace-nowrap">DEWEG Engineering</span>
              <span className="text-[#C4C0B6] tracking-[0.05em]">/</span>
              <span className="whitespace-nowrap text-[#161614]">About Deweg</span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="group self-start sm:self-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#161614] hover:text-black transition-colors cursor-pointer shrink-0 max-lg:tap-hit"
            >
              <span>Return to overview</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </header>

        {/* ─── 2. Pinned 3D assembly hero ─── */}
        <AssemblyHero />

        {/* ─── 2b. Full-viewport plate — Headquarters ─── */}
        <ViewportPlate
          src={ABOUT_PAGE_ASSETS.heroBanner}
          alt="DEWEG Engineering Headquarters & Inception Banner"
          figure="FIG 02"
          caption="Chennai Headquarters · Est. 2020"
          onExpand={setLightboxImage}
        />

        {/* ─── 3. Core Ethos — editorial split ─── */}
        <section className="border-t border-[#DDD9CF] py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-5">
                <Eyebrow label="02 / Core Ethos" />
                <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2rem,3.6vw,3rem)]">
                  <RevealText text="The philosophy behind the work." />
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                  className="mt-6 max-w-[420px] font-sans text-[15px] leading-[1.65] text-[#5E5B54]"
                >
                  {sentenceCase(ABOUT_PAGE_CONTENT.philosophyAndMantra.title)}
                </motion.p>
              </div>

              <div className="lg:col-span-7">
                <motion.blockquote
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                  className="flex gap-6 sm:gap-8"
                >
                  <motion.span
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '-60px 0px' }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="block w-[2px] bg-[#C98A2D] shrink-0 self-stretch origin-top"
                  />
                  <div>
                    <p className="max-w-[680px] font-sans font-medium text-[1.35rem] sm:text-[1.6rem] leading-[1.35] text-[#161614]">
                      {sentenceCase(ABOUT_PAGE_CONTENT.tagline)}
                    </p>
                    <p className="mt-6 max-w-[680px] font-sans text-[15px] leading-[1.65] text-[#5E5B54]">
                      {ABOUT_PAGE_CONTENT.philosophyAndMantra.context}
                    </p>
                  </div>
                </motion.blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3b. Full-viewport plate — The Practice, in Drawing ─── */}
        <ViewportPlate
          src={ABOUT_PAGE_ASSETS.aboutEdited}
          alt="Deweg Engineering Practice & Analytical Drawing"
          figure="FIG 03"
          caption="The Practice, in Drawing"
          onExpand={setLightboxImage}
        />

        {/* ─── 4. Purpose & Direction — tinted dual column ─── */}
        <section className="bg-[#EFEEE8] border-y border-[#DDD9CF] py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <header className="max-w-2xl">
              <Eyebrow label="03 / Purpose & Direction" />
              <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2rem,3.6vw,3rem)]">
                <RevealText text="Vision and mission in action." />
              </motion.h2>
            </header>

            <div className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2">
              {/* 01 Vision */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px 0px' }}
                transition={{ duration: 0.8, ease: EASE }}
                className="py-12 lg:pr-16"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C98A2D]">
                    01 / Vision
                  </span>
                  <span className="h-px flex-1 max-w-[96px] bg-[#DDD9CF]" />
                </div>
                <h3 className="mt-7 max-w-[480px] font-medium text-[#161614] tracking-[-0.02em] leading-[1.3] text-[1.4rem] sm:text-[1.6rem]">
                  {sentenceCase(ABOUT_PAGE_CONTENT.vision.statement)}
                </h3>
                <p className="mt-5 max-w-[480px] font-sans text-[15px] leading-[1.6] text-[#5E5B54]">
                  {sentenceCase(ABOUT_PAGE_CONTENT.vision.subtext)}
                </p>
              </motion.div>

              {/* 02 Mission */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px 0px' }}
                transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
                className="py-12 border-t border-[#DDD9CF] lg:border-t-0 lg:border-l lg:pl-16"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C98A2D]">
                    02 / Mission
                  </span>
                  <span className="h-px flex-1 max-w-[96px] bg-[#DDD9CF]" />
                </div>
                <h3 className="mt-7 max-w-[480px] font-medium text-[#161614] tracking-[-0.02em] leading-[1.3] text-[1.4rem] sm:text-[1.6rem]">
                  {sentenceCase(ABOUT_PAGE_CONTENT.mission.statement)}
                </h3>
                <p className="mt-5 max-w-[480px] font-sans text-[15px] leading-[1.6] text-[#5E5B54]">
                  {sentenceCase(ABOUT_PAGE_CONTENT.mission.subtext)}
                </p>

                <div className="mt-10 pt-6 border-t border-[#DDD9CF]">
                  <button
                    type="button"
                    onClick={() => setLightboxImage(ABOUT_PAGE_ASSETS.teamWorkplace)}
                    className="group flex items-center gap-4 text-left w-full cursor-pointer"
                  >
                    <span className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1] transition-colors duration-300 group-hover:border-[#B9B5A9]">
                      <img
                        src={ABOUT_PAGE_ASSETS.teamWorkplace}
                        alt="Deweg technical workplace culture"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </span>
                    <span className="inline-flex items-center gap-2 font-sans text-[15px] font-medium text-[#161614]">
                      Digital structural delivery
                      <ArrowUpRight className="w-4 h-4 text-[#8C887E] transition-all duration-300 group-hover:text-[#161614] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── 4b. Full-viewport plate — Structural drawings ─── */}
        <ViewportPlate
          src={ABOUT_PAGE_ASSETS.officeDrawing}
          alt="Deweg Structural Engineering Drawings"
          figure="FIG 04"
          caption="Structural Drawings in Review"
          onExpand={setLightboxImage}
        />

        {/* ─── 5. The People — frosted roster ─── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <header className="max-w-2xl">
              <Eyebrow label="04 / The People Behind The Practice" />
              <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2rem,3.6vw,3rem)]">
                <RevealText text="A team built on technical depth." />
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                className="mt-5 max-w-[620px] font-sans text-[15px] leading-[1.65] text-[#5E5B54]"
              >
                {ABOUT_PAGE_CONTENT.teamIntro.description}
              </motion.p>
            </header>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {DEWEG_LEADERSHIP.map((leader, idx) => (
                <motion.button
                  key={leader.name}
                  type="button"
                  onClick={() => setSelectedLeader(leader)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px 0px' }}
                  transition={{ duration: 0.7, delay: (idx % 3) * 0.08, ease: EASE }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.985 }}
                  className="group text-left cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1]">
                    {leader.image ? (
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#EBE9E1] text-[#B9B5A9]" />
                    )}
                  </div>

                  <div className="mt-4 backdrop-blur-sm bg-white/60 border border-[#DDD9CF] rounded-[2px] px-5 py-5 transition-colors duration-300 group-hover:border-[#B9B5A9]">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C98A2D]">
                        Node_{pad(idx + 1)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8C887E] text-right">
                        {leader.role}
                      </span>
                    </div>

                    <h3 className="mt-3 font-medium text-[#161614] tracking-[-0.02em] text-[1.2rem] leading-snug transition-transform duration-300 ease-out group-hover:translate-x-1">
                      {leader.name}
                    </h3>

                    <p className="mt-2 font-sans text-[13px] leading-[1.55] text-[#5E5B54] line-clamp-3">
                      {shortBlurb(leader)}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#161614]">
                      <span>View profile</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8C887E] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5b. Full-viewport plate — Practice studio ─── */}
        <ViewportPlate
          src={ABOUT_PAGE_ASSETS.teamWorkplace}
          alt="Deweg Technical Workplace Culture"
          figure="FIG 05"
          caption="Practice Studio · Chennai"
          onExpand={setLightboxImage}
        />

        {/* ─── 5c. Full-viewport plate — Team gathering ─── */}
        <ViewportPlate
          src={ABOUT_PAGE_ASSETS.teamOuting}
          alt="DEWEG Engineering Annual Team Gathering"
          figure="FIG 06"
          caption="Annual Team Gathering"
          onExpand={setLightboxImage}
        />

        {/* ─── 6 & 7. Chronology + Collaboration — warm summary module ─── */}
        <section className="bg-[#E9E6DD] border-y border-[#DDD9CF] py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
              {/* Timeline */}
              <div className="lg:col-span-7">
                <Eyebrow label="06 / Chronology of Excellence" />
                <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2rem,3.6vw,3rem)]">
                  <RevealText text="Our journey since 2020." />
                </motion.h2>

                <div ref={chronologyRef} className="mt-14 relative pl-10">
                  <div className="absolute left-[5px] top-1 bottom-1 w-px bg-[#C4C0B6] overflow-hidden">
                    <span className="about-spine absolute inset-y-0 left-0 w-px bg-[#C98A2D] origin-top" />
                  </div>
                  <div className="space-y-12">
                    {FIRM_MILESTONES.map((m, i) => {
                      const isCurrent = i === FIRM_MILESTONES.length - 1;
                      return (
                        <motion.div
                          key={m.year}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-40px 0px' }}
                          transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                          className="relative"
                        >
                          <span
                            className={`about-node absolute top-1 block h-3 w-3 rounded-full border-2 will-change-transform ${
                              isCurrent
                                ? 'border-[#C98A2D] bg-[#C98A2D]'
                                : 'border-[#C98A2D] bg-[#E9E6DD]'
                            }`}
                            style={{ left: '-38px' }}
                          />
                          <span className="block font-medium text-[#C98A2D] tracking-[-0.03em] leading-none text-[2rem]">
                            {m.year}
                          </span>
                          <h4 className="mt-2 font-medium text-[17px] tracking-[-0.01em] text-[#161614]">
                            {m.title}
                          </h4>
                          <p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#5E5B54] max-w-[520px]">
                            {m.description}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Collaboration CTA */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-24 flex flex-col justify-center h-full">
                  <Eyebrow label="07 / Ready to Collaborate" />
                  <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.05] text-[clamp(2rem,3.6vw,3rem)]">
                    <RevealText text="Experience the rigor of DEWEG Engineering." />
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px 0px' }}
                    transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                    className="mt-6 max-w-[480px] font-sans text-[15px] leading-[1.65] text-[#5E5B54]"
                  >
                    Explore our 7 specialized engineering practices, or discuss your project specifications with our leadership team.
                  </motion.p>

                  <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
                    {onNavigateToServices && (
                      <button
                        type="button"
                        onClick={onNavigateToServices}
                        className="group inline-flex items-center justify-center gap-2.5 rounded-[2px] bg-[#161614] text-[#F6F5F0] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-black cursor-pointer"
                      >
                        <span>Explore 7 disciplines</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[5px]" />
                      </button>
                    )}
                    {onNavigateToContact && (
                      <button
                        type="button"
                        onClick={onNavigateToContact}
                        className="group inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#161614] text-[#161614] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-[#161614] hover:text-[#E9E6DD] cursor-pointer"
                      >
                        <span>Contact leadership</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MODAL: Leader Bio ─── */}
        <AnimatePresence>
          {selectedLeader && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedLeader.name} profile`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedLeader(null)}
                className="fixed inset-0 bg-black/50"
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative w-full max-w-3xl bg-[#F6F5F0] border border-[#DDD9CF] z-10 my-auto max-h-[90vh] flex flex-col"
              >
                <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-[#DDD9CF]">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8C887E]">
                    Leadership profile
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedLeader(null)}
                    className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#161614] hover:text-black cursor-pointer"
                  >
                    <span>Close</span>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <div className="overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
                    <div className="md:col-span-4">
                      {selectedLeader.image && (
                        <div className="aspect-[4/5] overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1]">
                          <img
                            src={selectedLeader.image}
                            alt={selectedLeader.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-8 space-y-6">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C98A2D]">
                          {selectedLeader.role}
                        </p>
                        <h3 className="mt-2 font-medium text-[#161614] tracking-[-0.02em] text-[1.75rem] leading-snug">
                          {selectedLeader.name}
                        </h3>
                        {selectedLeader.secondaryRole && (
                          <p className="mt-1.5 font-sans text-[15px] text-[#5E5B54]">
                            {selectedLeader.secondaryRole}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.08em] border-y border-[#DDD9CF] py-4">
                        {selectedLeader.credentials && (
                          <span className="text-[#161614]">
                            {sentenceCase(selectedLeader.credentials)}
                          </span>
                        )}
                        {selectedLeader.experience && (
                          <span className="text-[#8C887E]">{selectedLeader.experience}</span>
                        )}
                        {selectedLeader.education && (
                          <span className="text-[#8C887E]">
                            {sentenceCase(selectedLeader.education)}
                          </span>
                        )}
                      </div>

                      {selectedLeader.bio && (
                        <div>
                          <h4 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8C887E]">
                            Biography
                          </h4>
                          <p className="font-sans text-[14px] leading-[1.7] text-[#5E5B54]">
                            {selectedLeader.bio}
                          </p>
                        </div>
                      )}

                      {selectedLeader.specialty && (
                        <div>
                          <h4 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8C887E]">
                            Domain specialization
                          </h4>
                          <p className="font-sans text-[14px] leading-[1.7] text-[#5E5B54]">
                            {selectedLeader.specialty}
                          </p>
                        </div>
                      )}

                      {selectedLeader.leadershipStatement && (
                        <blockquote className="border-l-2 border-[#C98A2D] pl-5">
                          <p className="font-sans font-medium text-[15px] leading-[1.6] text-[#161614]">
                            "{selectedLeader.leadershipStatement}"
                          </p>
                        </blockquote>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─── MODAL: Full Resolution Image Lightbox ─── */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[rgba(22,22,20,0.92)]"
              role="dialog"
              aria-modal="true"
              aria-label="Full resolution image"
            >
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="group absolute top-5 right-5 sm:top-8 sm:right-8 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#E7E4DC] hover:text-white cursor-pointer"
              >
                <span>Close</span>
                <span aria-hidden="true">×</span>
              </button>
              <img
                src={lightboxImage}
                alt="Full resolution view"
                className="max-h-[85vh] max-w-[90vw] object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}