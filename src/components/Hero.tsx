import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface HeroProps {
  introReady?: boolean;
  onNavigateToContact?: () => void;
}

const HEADLINE_WORDS = ['Structural', 'certainty,', 'engineered', 'with', 'precision.'];
const ACCENT_INDEX = 1;

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Hero({ introReady, onNavigateToContact }: HeroProps) {
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [started, setStarted] = useState(reduced);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Begin the entrance sequence only once the preloader curtain has lifted
  useEffect(() => {
    if (reduced) return;
    if (introReady === undefined) {
      const t = window.setTimeout(() => setStarted(true), 200);
      return () => window.clearTimeout(t);
    }
    if (introReady) setStarted(true);
  }, [introReady, reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  // Gentle persistent parallax: headline block drifts at ~0.3x, blob at ~0.1x
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  const handleCta = () => {
    if (onNavigateToContact) {
      onNavigateToContact();
      return;
    }
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] flex flex-col overflow-hidden bg-[#F8F7F4] text-[#1A1A1A] pt-40 pb-20"
    >
      {/* Soft grain texture for depth (3–4%) */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: NOISE }}
      />

      {/* Gallery-piece abstract form: matte sand blob, floating gently */}
      <motion.div
        style={{ y: blobY }}
        className="absolute -right-[14vw] top-[10%] w-[42vw] max-w-[680px] aspect-square pointer-events-none select-none"
      >
        <motion.div
          initial={started ? false : { opacity: 0, scale: 0.94 }}
          animate={started ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          <motion.div
            animate={started ? { y: [0, -10, 0] } : { y: 0 }}
            transition={
              started
                ? { repeat: Infinity, duration: 7, ease: 'easeInOut' }
                : { duration: 0 }
            }
            className="w-full h-full rounded-[58%_42%_51%_49%/48%_56%_44%_52%] bg-[#E4D8C0] opacity-40"
          />
        </motion.div>
      </motion.div>

      {/* Content — single column, optically centered, generous breathing room */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-[7vw] md:px-[7vw] flex-1 flex flex-col justify-center"
      >
        {/* Editorial eyebrow */}
        <motion.p
          initial={started ? false : { opacity: 0, y: 8 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-10 text-[11px] font-mono uppercase tracking-[0.3em] text-[#8A8580]"
        >
          DE WEG — Engineering Consultancy · Chennai
        </motion.p>

        {/* Display headline: 5 words, sentence case, word-by-word reveal */}
        <h1
          className="font-sans font-bold text-[#1A1A1A] leading-[0.95] tracking-[-0.03em] text-[clamp(2.5rem,7.5vw,7.5rem)]"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={started ? false : { y: 40, opacity: 0 }}
              animate={started ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              transition={
                started
                  ? { delay: i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.3 }
              }
              className={`inline-block ${i === ACCENT_INDEX ? 'text-[#EDA81C]' : ''}`}
            >
              {word}
              {i < HEADLINE_WORDS.length - 1 ? '\u00A0' : ''}
            </motion.span>
          ))}
        </h1>

        {/* Subline under 12 words, calm warm gray */}
        <motion.p
          initial={started ? false : { opacity: 0, y: 15 }}
          animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={
            started
              ? { delay: 0.28, duration: 0.9, ease: 'easeOut' }
              : { duration: 0.3 }
          }
          className="mt-8 max-w-[480px] font-sans font-normal text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.5] tracking-[0.01em] text-[#6E6E66]"
        >
          From concept to clash-free erection — 20 years of structural engineering.
        </motion.p>

        {/* Single ghost-style CTA with underline wipe */}
        <motion.div
          initial={started ? false : { opacity: 0 }}
          animate={started ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mt-12"
        >
          <a
            href="#contact"
            onClick={e => {
              e.preventDefault();
              handleCta();
            }}
            className="relative inline-flex pb-2 font-sans font-medium text-[clamp(1rem,1.2vw,1.1rem)] tracking-[0.01em] text-[#1A1A1A] hover:text-[#C9860F] transition-colors duration-300 cursor-pointer"
            aria-label="Request a consultation"
          >
            Request a consultation
            <motion.span
              initial={started ? false : { scaleX: 0 }}
              animate={started ? { scaleX: 1 } : { scaleX: 0 }}
              transition={
                started
                  ? { delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0 }
              }
              style={{ transformOrigin: 'left' }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EDA81C] rounded-full"
            />
          </a>
        </motion.div>
      </motion.div>

      {/* Minimal scroll cue */}
      <motion.div
        initial={started ? false : { opacity: 0 }}
        animate={started ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="relative z-10 flex flex-col items-center gap-3 pb-2"
      >
        <a
          href="#about"
          onClick={e => {
            e.preventDefault();
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#8A8580] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          aria-label="Scroll to explore"
        >
          <span>Scroll</span>
          <span className="block h-12 w-px bg-[#1A1A1A]/15 overflow-hidden">
            <motion.span
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="block w-px h-full bg-[#EDA81C]"
            />
          </span>
        </a>
      </motion.div>
    </section>
  );
}