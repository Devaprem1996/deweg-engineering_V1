import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { CORE_PRINCIPLES } from '../data/engineeringData';

const VIDEO_SRC = '/videos/section4-cutaway.mp4';

const PRINCIPLES = CORE_PRINCIPLES;

const HUD_STATES: string[][] = [
  ['LOAD PATH: DEFINED', 'STRUCTURE: VERIFIED'],
  ['CODE: COMPLIANT', 'BUILDABILITY: REVIEWED'],
  ['BIM: READY', 'MODEL: PARAMETRIC'],
  ['REVISION: CONTROLLED', 'WORKFLOW: TRACEABLE'],
  ['REVIEW: VERIFIED', 'AUDIT: COMPLETE'],
];

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(5);
  const [active, setActive] = useState(0);

  const percentRef = useRef<HTMLSpanElement>(null);
  const stageLabelRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const stage = Math.min(PRINCIPLES.length - 1, Math.floor(latest * PRINCIPLES.length));
    if (stage !== active) setActive(stage);

    const video = videoRef.current;
    if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      video.currentTime = latest * durationRef.current;
    }

    if (percentRef.current) {
      percentRef.current.textContent = `${String(Math.round(latest * 100)).padStart(2, '0')}`;
    }
    if (stageLabelRef.current) {
      stageLabelRef.current.textContent = STAGE_LABELS[stage];
    }
  });

  const principle = PRINCIPLES[active];
  const hud = HUD_STATES[active];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '400vh' }}
    >
      {/* Sticky full-viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0A0A0A]">
        {/* Full-viewport background video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            if (d && Number.isFinite(d) && d > 0) durationRef.current = d;
          }}
          className="absolute inset-0 w-full h-full object-cover"
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
              <div className="relative w-full max-w-[420px] pointer-events-auto">
                {/* Card with frosted glass effect */}
                <div className="rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 p-7 md:p-8">
                  {/* Stage number */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-6 -right-3 font-mono font-bold text-[6rem] leading-none text-white/[0.04] select-none z-0"
                  >
                    {principle.number}
                  </span>

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-[13px] font-bold tracking-[0.15em] text-[#EDA81C]">
                        {principle.number}
                      </span>
                      <span className="w-10 h-px bg-[#0D9488]/50" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#0D9488]/70">
                        {STAGE_LABELS[active]}
                      </span>
                    </div>

                    <h3 className="font-sans text-[1.6rem] font-bold tracking-[-0.02em] text-white leading-[1.1] mb-3">
                      {principle.title}
                    </h3>

                    <p className="font-sans text-[15px] leading-[1.7] text-white/65 mb-5">
                      {principle.statement}
                    </p>

                    {/* HUD status chips */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {hud.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-[999px] px-3 py-1 bg-[#0D9488]/10 border border-[#0D9488]/30 font-mono text-[9px] font-semibold tracking-[0.14em] text-[#0D9488] uppercase"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#0D9488]" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="font-sans text-[13px] leading-[1.65] text-white/45 border-t border-white/10 pt-4">
                      {principle.description}
                    </p>
                  </div>
                </div>
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

        {/* Stage label chip over video */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-[6px] bg-white/10 backdrop-blur-md border border-white/15">
          <span ref={stageLabelRef} className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/80">
            {STAGE_LABELS[active]}
          </span>
        </div>
      </div>
    </section>
  );
}