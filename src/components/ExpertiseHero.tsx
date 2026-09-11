import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { EXPERTISE_DOMAINS } from '../data/expertiseData';

interface ExpertiseHeroProps {
  onNavigateToContact: (discipline?: string) => void;
  onEnterIndex?: () => void;
}

const INK = '#141412';
const MUTED = '#8A877E';
const HAIRLINE = '#DDD9CE';
const ACCENT = '#C98A2D';
const EASE = [0.16, 1, 0.3, 1] as const;

const metrics = [
  { value: '7', label: 'Core Disciplines' },
  { value: 'LOD 500', label: 'BIM Precision' },
  { value: '100%', label: 'Code Compliant' },
  { value: 'ISO', label: 'Certified QA' }
];

/** Count-up for numeric-leading stats; pass-through for alpha strings. */
function CountUp({
  raw,
  delay = 0,
  className
}: {
  raw: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const [text, setText] = useState(raw);
  const match = raw.match(/^(\d+)(.*)$/);

  useEffect(() => {
    if (!inView || !match) return;
    const target = parseInt(match[1], 10);
    const t0 = performance.now() + delay * 1000;
    let raf = 0;
    const tick = (now: number) => {
      if (now < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (now - t0) / 1600);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(`${Math.round(target * eased)}${match[2]}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, raw, delay, match]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

/** Rotational engineering dial: conic ticks, dashed orbit, orbiting bead, readouts. */
function Dial() {
  return (
    <div className="relative w-[min(70vw,340px)] lg:w-[400px] aspect-square" aria-hidden="true">
      {/* hairline crosshair through the instrument */}
      <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-[#DDD9CE]" />
      <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#DDD9CE]" />

      {/* rotating conic tick ring */}
      <div
        data-dial="ticks"
        className="absolute inset-[4%] rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(201,138,45,0.6) 0deg 0.8deg, transparent 0.8deg 15deg)',
          WebkitMask: 'radial-gradient(circle, transparent 62%, #000 63%)',
          mask: 'radial-gradient(circle, transparent 62%, #000 63%)'
        }}
      />
      {/* dashed orbit (counter-rotating) */}
      <div
        data-dial="dash"
        className="absolute inset-[14%] rounded-full border border-dashed border-[#C98A2D]/50"
      />
      {/* solid inner ring */}
      <div className="absolute inset-[28%] rounded-full border border-[#DDD9CE]" />
      {/* orbiting accent bead */}
      <div data-dial="bead" className="absolute inset-0">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C98A2D]" />
      </div>
      {/* pulsing core */}
      <div
        data-dial="core"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[9%] aspect-square rounded-full bg-[#141412]"
      >
        <span
          data-dial="pulse"
          className="absolute inset-0 rounded-full bg-[#141412]"
        />
      </div>

      {/* readouts */}
      <span className="absolute -top-7 left-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A877E]">
        Azimuth 45.2°
      </span>
      <span className="absolute -bottom-7 right-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A877E]">
        LOD 500 · Coordinated
      </span>
    </div>
  );
}

export default function ExpertiseHero({ onNavigateToContact, onEnterIndex }: ExpertiseHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dialWrapRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  /* ── Scroll-bound parallax (GSAP + ScrollTrigger scrub) ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const scrub = { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.2 };

      gsap.utils.toArray<HTMLElement>('[data-par]').forEach((el) => {
        gsap.fromTo(el, { yPercent: 22 }, { yPercent: -22, ease: 'none', scrollTrigger: scrub });
      });

      gsap.fromTo(
        gridRef.current,
        { xPercent: 5 },
        { xPercent: -5, ease: 'none', scrollTrigger: scrub }
      );

      gsap.fromTo(
        ghostRef.current,
        { yPercent: 36 },
        { yPercent: -36, ease: 'none', scrollTrigger: scrub }
      );

      gsap.fromTo(
        dialWrapRef.current,
        { scale: 1, opacity: 1 },
        {
          scale: 0.9,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 20%', end: 'bottom top', scrub: 1.4 }
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  /* ── Continuous loops (rotation, orbit, pulse, scan, marquee) ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const q = (n: string) => sectionRef.current?.querySelector<HTMLElement>(n);
    const tweens = [
      gsap.to(q('[data-dial="ticks"]'), { rotation: 360, duration: 140, repeat: -1, ease: 'none' }),
      gsap.to(q('[data-dial="dash"]'), { rotation: -360, duration: 90, repeat: -1, ease: 'none' }),
      gsap.to(q('[data-dial="bead"]'), { rotation: 360, duration: 26, repeat: -1, ease: 'none' }),
      gsap.to(q('[data-dial="pulse"]'), {
        scale: 1.9,
        opacity: 0,
        duration: 2.4,
        ease: 'sine.out',
        repeat: -1,
        repeatDelay: 0.4
      })
    ];
    if (scanRef.current) {
      tweens.push(gsap.to(scanRef.current, { yPercent: 420, duration: 5.5, ease: 'none', repeat: -1, repeatDelay: 1.2 }));
    }
    if (marqueeRef.current) {
      tweens.push(gsap.to(marqueeRef.current, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 }));
    }
    return () => tweens.forEach((t) => t.kill());
  }, []);

  /* ── Cursor drift on the dial (desktop only) ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const wrap = dialWrapRef.current;
    if (!wrap) return;

    const xTo = gsap.quickTo(wrap, 'x', { duration: 0.8, ease: 'power2.out' });
    const yTo = gsap.quickTo(wrap, 'y', { duration: 0.8, ease: 'power2.out' });
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo(nx * 26);
      yTo(ny * 20);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const domainCodes = EXPERTISE_DOMAINS.map((d) => d.code);
  const marquee = [...domainCodes, ...domainCodes];

  const lineA = ['Domain'];
  const lineB = ['We', 'Expertise.'];

  return (
    <section
      id="expertise-hero"
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-72px)] w-full flex-col overflow-hidden bg-[#F5F4EE] text-[#141412]"
    >
      {/* ── Background layers ── */}
      {/* vertical blueprint grid */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #DDD9CE 1px, transparent 1px), linear-gradient(to bottom, #DDD9CE 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
          backgroundPosition: '0 0',
          opacity: 0.5
        }}
      />
      {/* gold scanning beam */}
      <span
        ref={scanRef}
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-[22vh] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(201,138,45,0.07) 45%, rgba(201,138,45,0.35) 50%, rgba(201,138,45,0.07) 55%, transparent)'
        }}
      />
      {/* ghost watermark */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="absolute -bottom-[9vw] -right-[3vw] pointer-events-none select-none font-sans font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(20,20,18,0.10)]"
        style={{ fontSize: '24vw' }}
      >
        E/07
      </div>
      {/* corner registration marks */}
      <span aria-hidden="true" className="absolute left-6 top-5 h-4 w-4 border-l border-t border-[#141412]/30" />
      <span aria-hidden="true" className="absolute right-6 top-5 h-4 w-4 border-r border-t border-[#141412]/30" />
      <span aria-hidden="true" className="absolute bottom-6 left-6 h-4 w-4 border-b border-l border-[#141412]/30" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-[7vw] pt-10 lg:pt-14">
        {/* Top hairline row */}
        <div className="flex items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="block h-px w-10 bg-[#141412] origin-left"
            />
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8A877E]"
            >
              Official Practice Reference
            </motion.span>
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.22em] text-[#C98A2D]"
          >
            07 · Discipline Index
          </motion.span>
        </div>

        {/* Middle: headline + paragraph / dial */}
        <div className="mt-10 grid flex-1 grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:mt-6">
          <div className="lg:col-span-7">
            {/* Headline — masked word reveal + GSAP scroll parallax */}
            <h1 className="font-sans font-medium text-[#141412] tracking-[-0.04em] leading-[0.95] text-[clamp(3.6rem,11vw,9.5rem)]">
              {[
                { line: lineA, base: 0 },
                { line: lineB, base: 1 }
              ].map((row) => (
                <span key={row.line[0]} className="block overflow-hidden pb-[0.08em] -mb-[0.06em]">
                  {row.line.map((word, wi) => (
                    <span key={word} className="inline-block overflow-visible">
                      <motion.span
                        initial={{ y: '112%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.35 + (row.base + wi) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className={`inline-block ${
                          word === 'We'
                            ? 'text-transparent [-webkit-text-stroke:1.5px_#141412]'
                            : ''
                        }`}
                      >
                        <span data-par className="inline-block">
                          {word}&nbsp;
                        </span>
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            {/* Paragraph + CTA */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
              className="mt-8 max-w-[520px] font-sans text-[1.0625rem] leading-[1.65] text-[#5C5A53]"
            >
              From concept to construction-level reality across seven engineering disciplines.
              Detailed analysis, high-fidelity BIM coordination, offshore platforms, and
              proprietary IT automations engineered for zero field rework.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-8"
            >
              <button
                type="button"
                onClick={() => onNavigateToContact()}
                className="group inline-flex items-center gap-2.5 rounded-[2px] bg-[#141412] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F5F4EE] transition-colors duration-300 hover:bg-[#C98A2D] cursor-pointer"
              >
                <span className="whitespace-nowrap">Consult an Engineer</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[6px]" />
              </button>
              <button
                type="button"
                onClick={onEnterIndex}
                className="group inline-flex items-center gap-2 py-3 -my-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141412] hover:text-[#C98A2D] transition-colors cursor-pointer"
              >
                <span className="whitespace-nowrap">Enter the Index</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
              </button>
            </motion.div>
          </div>

          {/* Dial (replaces the image) */}
          <div ref={dialWrapRef} className="lg:col-span-5 hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center justify-center py-10"
            >
              <Dial />
            </motion.div>
          </div>
        </div>

        {/* Metrics row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative z-10 border-t border-[#DDD9CE] -mx-[7vw] px-[7vw]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`px-5 py-6 lg:py-8 ${i > 0 ? 'lg:border-l border-[#DDD9CE]' : ''} ${
                  i % 2 === 1 ? 'border-l border-[#DDD9CE]' : ''
                } ${i >= 2 ? 'border-t border-[#DDD9CE] lg:border-t-0' : ''}`}
              >
                <CountUp
                  raw={m.value}
                  delay={0.95 + i * 0.1}
                  className="block font-sans font-medium text-[#141412] tracking-[-0.02em] text-[clamp(2.25rem,3.4vw,3.25rem)] leading-none"
                />
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-[#8A877E]">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Domain code marquee ── */}
      <div className="relative z-10 border-t border-[#DDD9CE] overflow-hidden bg-[#EDEBE3]" aria-hidden="true">
        <div ref={marqueeRef} className="flex w-max items-center gap-[7vw] px-[3.5vw] py-3.5">
          {marquee.map((code, i) => (
            <span
              key={`${code}-${i}`}
              className="flex items-center gap-[7vw] font-mono text-[12px] uppercase tracking-[0.2em] text-[#8A877E]"
            >
              {code}
              <span className="text-[#C98A2D]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}