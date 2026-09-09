import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/engineeringData';

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

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto advance every 7s — respects hover pause and reduced-motion preferences
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const current = TESTIMONIALS_DATA[currentIndex];
  const indexLabel = `${String(currentIndex + 1).padStart(2, '0')} / ${String(
    TESTIMONIALS_DATA.length
  ).padStart(2, '0')}`;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  return (
    <section
      id="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-transparent text-[#171714] py-[90px] lg:py-[120px] overflow-hidden"
    >
      {/* Extremely subtle engineering grid — visible only toward the outer edges */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(23,23,20,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,23,20,0.6) 1px, transparent 1px)',
          backgroundSize: '140px 140px',
          WebkitMaskImage: 'radial-gradient(130% 100% at 50% 0%, transparent 45%, black 100%)',
          maskImage: 'radial-gradient(130% 100% at 50% 0%, transparent 45%, black 100%)'
        }}
      />
      <div className="absolute inset-y-0 left-[1.5vw] w-px bg-[#111]/[0.05] pointer-events-none" />
      <div className="absolute inset-y-0 right-[1.5vw] w-px bg-[#111]/[0.05] pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto px-[6vw] lg:px-[7.5vw]">
        {/* Eyebrow + horizontal rule */}
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

        {/* Quote — the centerpiece, line-by-line masked reveal */}
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
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

        {/* Divider */}
        <div className="mt-14 h-px w-full bg-[#E2E0D8]" />

        {/* Attribution row — name strongest, role secondary, company quieter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
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

        {/* Nearly invisible text navigation — index shown once, in accent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          className="mt-6 flex items-center justify-end gap-8"
        >
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#444444] hover:text-[#111111] transition-colors cursor-pointer max-lg:tap-hit"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8A8580] transition-colors duration-300 group-hover:text-[#EDA81C] group-hover:-translate-x-1" />
            <span>Prev</span>
          </button>
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#EDA81C]">{indexLabel}</span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#444444] hover:text-[#111111] transition-colors cursor-pointer max-lg:tap-hit"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8A8580] transition-colors duration-300 group-hover:text-[#EDA81C] group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}