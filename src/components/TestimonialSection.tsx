import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
  animate,
  type Variants
} from 'motion/react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/engineeringData';
import Magnetic from './Magnetic';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/* —————————————————————————————————————————————————————
   Design tokens — editorial warm monograph
   Ink #171714 · Muted #8A8580 · Hairline #E2E0D8
   Gold accent #EDA81C
   ————————————————————————————————————————————————————— */

const AUTO_DURATION = 7000;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Break the quote into composed lines for editorial rhythm:
 * snap at punctuation/phrase boundaries (≥6 words) or hard-wrap near 9 words.
 */
function splitLines(text: string) {
  const words = text.split(' ');
  const lines: string[] = [];
  let current: string[] = [];

  for (const word of words) {
    current.push(word);
    const lastChar = word.charAt(word.length - 1);
    const isPunctuationBoundary = ',.;—'.includes(lastChar);
    if (current.length >= 9 || (current.length >= 6 && isPunctuationBoundary)) {
      lines.push(current.join(' '));
      current = [];
    }
  }
  if (current.length) lines.push(current.join(' '));
  return lines;
}

const lineWrapper = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
};

const lineVariants = {
  hidden: { y: 18, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }
  }
};

/* Direction-aware slide choreography */
const quoteVariants: Variants = {
  enter: (dir: 'next' | 'prev') => ({ opacity: 0, x: dir === 'next' ? 56 : -56 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: 'next' | 'prev') => ({ opacity: 0, x: dir === 'next' ? -56 : 56 })
};

const metaVariants: Variants = {
  enter: (dir: 'next' | 'prev') => ({ opacity: 0, y: 14, x: dir === 'next' ? 14 : -14 }),
  center: { opacity: 1, y: 0, x: 0 },
  exit: (dir: 'next' | 'prev') => ({ opacity: 0, y: -10, x: dir === 'next' ? -12 : 12 })
};

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const sectionRef = useRef<HTMLElement>(null);
  const hoverRef = useRef(false);
  const reduced = useReducedMotion();

  /* Auto-advance progress (rAF-driven so it can freeze on hover/pause) */
  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, { stiffness: 34, damping: 20, mass: 0.6 });

  /* Drag/swipe release spring */
  const dragX = useSpring(0, { stiffness: 300, damping: 28 });

  /* Subtle mouse parallax for the technical grid layer */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridX = useTransform(mouseX, (v) => -v * 14);
  const gridY = useTransform(mouseY, (v) => -v * 10);

  const current = TESTIMONIALS_DATA[currentIndex];
  const indexLabel = `${String(currentIndex + 1).padStart(2, '0')} / ${String(
    TESTIMONIALS_DATA.length
  ).padStart(2, '0')}`;

  /* —─ unifies the setInterval + a real progress readout in one loop ─— */
  useAnimationFrame((_, delta) => {
    if (reduced || isPaused) return;
    const dt = Math.min(delta, 150);
    const next = progress.get() + dt / AUTO_DURATION;
    if (next >= 1) {
      progress.set(0);
      setDirection('next');
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    } else {
      progress.set(next);
    }
  });

  const handlePrev = () => {
    setDirection('prev');
    progress.set(0);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const handleNext = () => {
    setDirection('next');
    progress.set(0);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    progress.set(0);
    setCurrentIndex(index);
  };

  const handleSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
    mouseY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
  };

  /* —─ GSAP scroll choreography — ghost quote parallax ─— */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ts-ghost',
        { yPercent: -10, rotation: -5 },
        {
          yPercent: 14,
          rotation: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      onMouseEnter={() => {
        hoverRef.current = true;
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        setIsPaused(false);
      }}
      onMouseMove={handleSectionMove}
      className="relative bg-transparent text-[#171714] py-[90px] lg:py-[120px] overflow-hidden"
    >
      {/* Extremely subtle engineering grid — mouse-parallax layer */}
      <motion.div
        style={{ x: gridX, y: gridY }}
        className="absolute -inset-10 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(23,23,20,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,23,20,0.6) 1px, transparent 1px)',
            backgroundSize: '140px 140px',
            WebkitMaskImage:
              'radial-gradient(130% 100% at 50% 0%, transparent 45%, black 100%)',
            maskImage: 'radial-gradient(130% 100% at 50% 0%, transparent 45%, black 100%)'
          }}
        />
      </motion.div>
      <div className="absolute inset-y-0 left-[1.5vw] w-px bg-[#111]/[0.05] pointer-events-none" />
      <div className="absolute inset-y-0 right-[1.5vw] w-px bg-[#111]/[0.05] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-[6vw] lg:px-[7.5vw]">
        {/* ─── Eyebrow + horizontal rule ─── */}
        <div className="flex items-center gap-5 mb-14 origin-left">
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-25% 0px -25% 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="block h-px w-14 sm:w-20 bg-[#E2E0D8] shrink-0"
          />
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-25% 0px -25% 0px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
          >
            05 / Client Perspective
          </motion.span>
        </div>

        {/* ─── Quote — drag + swipe + direction-aware masked reveal ─── */}
        <div className="relative">
          {/* Ghost quote mark — GSAP parallax + keyed crossfade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[2vw] sm:-right-[3vw] -top-8 sm:-top-10 z-0 select-none"
          >
            <div className="ts-ghost block will-change-transform">
              <motion.span
                key={current.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="block"
              >
                <Quote
                  strokeWidth={1}
                  className="h-[clamp(8rem,18vw,16rem)] w-[clamp(8rem,18vw,16rem)] text-[#171714] opacity-[0.05]"
                />
              </motion.span>
            </div>
          </div>

          <motion.div
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: -120, right: 120 }}
            dragElastic={0.14}
            dragMomentum={false}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={(_, info) => {
              const threshold = 64;
              if (info.offset.x < -threshold || info.velocity.x < -480) handleNext();
              else if (info.offset.x > threshold || info.velocity.x > 480) handlePrev();
              animate(dragX, 0, { type: 'spring', stiffness: 280, damping: 26 });
              if (!hoverRef.current) setIsPaused(false);
            }}
            style={{ x: dragX, touchAction: 'pan-y' }}
            className="relative z-10 cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={current.id}
                custom={direction}
                variants={quoteVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: EASE }}
                className="text-left"
              >
                <motion.span
                  variants={lineWrapper}
                  initial="hidden"
                  animate="show"
                  className="block font-sans font-medium text-[#171714] tracking-[-0.03em] leading-[1.08] text-[clamp(2rem,9vw,3rem)] lg:text-[clamp(2.5rem,4.2vw,4.75rem)] max-w-[1100px]"
                >
                  {splitLines(current.quote).map((line, i) => (
                    <span key={i} className="block overflow-hidden">
                      <motion.span variants={lineVariants} className="block">
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </motion.span>
              </motion.blockquote>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ─── Divider ─── */}
        <div className="mt-14 h-px w-full bg-[#E2E0D8]" />

        {/* ─── Attribution — direction-aware crossfade ─── */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={metaVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-7 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6"
          >
            <div className="space-y-1.5">
              <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#171714]">
                {current.clientName}
              </p>
              <p className="font-sans text-[14px] font-normal text-[#666666]">
                {current.clientRole}, {current.company}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8A8580]">
                {current.project}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── Interactive index rail + magnetic navigation ─── */}
        <div className="mt-10">
          <div role="tablist" aria-label="Testimonials" className="flex items-center gap-3">
            {TESTIMONIALS_DATA.map((t, i) => {
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS_DATA.length}`}
                  onClick={() => goTo(i)}
                  className="group flex-1 py-2 cursor-pointer"
                >
                  <span className="block h-px w-full bg-[#E2E0D8] relative overflow-hidden transition-colors duration-300 group-hover:bg-[#C9C5BA]">
                    {i < currentIndex && <span className="absolute inset-0 bg-[#EDA81C]" />}
                    {isCurrent && (
                      <motion.span
                        style={{ scaleX: springProgress }}
                        className="absolute inset-0 bg-[#EDA81C] origin-left"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8A8580]">
              Drag / swipe to browse
            </span>
            <div className="flex items-center gap-6">
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#EDA81C]">
                {indexLabel}
              </span>
              <div className="flex items-center gap-1">
                <Magnetic strength={0.4}>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#444444] hover:text-[#111111] transition-colors px-2 py-2 cursor-pointer max-lg:tap-hit"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#8A8580] transition-colors duration-300 group-hover:text-[#EDA81C] group-hover:-translate-x-1" />
                    <span>Prev</span>
                  </button>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#444444] hover:text-[#111111] transition-colors px-2 py-2 cursor-pointer max-lg:tap-hit"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8A8580] transition-colors duration-300 group-hover:text-[#EDA81C] group-hover:translate-x-1" />
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}