import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { TEAM_DATA } from '../data/engineeringData';
import { ABOUT_PAGE_ASSETS } from '../data/aboutData';
import { AnimatedHeading } from './AnimatedText';
import { TeamMember } from '../types';
import Magnetic from './Magnetic';
import { gsap, prefersReducedMotion } from '../lib/gsap';

/* —————————————————————————————————————————————————————
   Design tokens — Swiss editorial monograph
   Paper #F6F5F0 · Ink #111111 · Muted #8A8580
   Gold accent #EDA81C · Hairline black/10
   ————————————————————————————————————————————————————— */

const EASE = [0.22, 1, 0.36, 1] as const;

const MARQUEE_ITEMS = [
  'Advanced Structural Design',
  'BIM Coordination',
  'Steel Modeling & Detailing',
  'Finite Element Analysis',
  'MEP Interface',
  'Code & Compliance Audits'
];

/* —————————————————————————————————————————————————————
   Marquee — continuous role-band
   ————————————————————————————————————————————————————— */

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="font-mono text-[13px] uppercase tracking-[0.3em] text-[#8A8580] whitespace-nowrap px-8">
            {item}
          </span>
          <span className="block h-1.5 w-1.5 rotate-45 bg-[#EDA81C]" />
        </span>
      ))}
    </div>
  );
}

/* —————————————————————————————————————————————————————
   Rotating technical stamp — scroll-scrubbed rotation
   ————————————————————————————————————————————————————— */

function RotatingStamp() {
  return (
    <svg viewBox="0 0 120 120" className="h-[92px] w-[92px] sm:h-[112px] sm:w-[112px]" aria-hidden="true">
      <defs>
        <path
          id="team-stamp-path"
          d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
          fill="none"
        />
      </defs>
      <circle cx="60" cy="60" r="58" fill="#F6F5F0" />
      <circle cx="60" cy="60" r="58" fill="none" stroke="#111111" strokeOpacity="0.18" strokeWidth="1" />
      <text
        fontFamily="var(--font-mono)"
        fontSize="8.4"
        letterSpacing="0.12"
        fill="#111111"
        fillOpacity="0.82"
      >
        <textPath href="#team-stamp-path">STRESS-TESTED · CODE COMPLIANT · BIM-READY · </textPath>
      </text>
      <circle cx="60" cy="60" r="5.5" fill="none" stroke="#EDA81C" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="1.5" fill="#EDA81C" />
    </svg>
  );
}

/* —————————————————————————————————————————————————————
   3D Tilt Card — spring-driven rotateX / rotateY
   ————————————————————————————————————————————————————— */

function TiltCard({ member, index }: { member: TeamMember; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18 });
  const reduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 10);
    rotateY.set(px * 10);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d'
      }}
      className="group border-t border-black/10 pt-6 transition-colors duration-300 hover:border-[#EDA81C]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#888888]">
          <span className="text-[#EDA81C]">{String(index + 1).padStart(2, '0')}</span> / {member.role}
        </span>
        <ArrowUpRight className="w-4 h-4 text-[#111111] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
      </div>

      <h3 className="mt-5 font-sans font-medium text-[22px] leading-snug tracking-[-0.01em] text-[#111111] transition-transform duration-300 ease-out group-hover:translate-x-1">
        {member.name}
      </h3>

      <p className="mt-2 font-sans text-[14px] font-normal text-[#666666]">{member.credentials}</p>

      <p className="mt-4 font-sans text-[14px] font-normal leading-[1.5] text-[#555555] max-w-[300px]">
        {member.bio}
      </p>

      <div className="mt-5 overflow-hidden">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 transition-colors duration-300 group-hover:border-[#EDA81C]/50">
          <span className="block h-1 w-1 rounded-full bg-[#EDA81C] shrink-0" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555] whitespace-nowrap">
            {member.specialty}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

/* —————————————————————————————————————————————————————
   Section
   ————————————————————————————————————————————————————— */

interface TeamSectionProps {
  onViewAboutPage?: () => void;
}

export default function TeamSection({ onViewAboutPage }: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rosterRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  /* ── GSAP scroll choreography ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* Studio photograph — slow parallax drift + zoom */
      gsap.fromTo(
        '.team-photo',
        { yPercent: -10, scale: 1.12 },
        {
          yPercent: 10,
          scale: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.team-photo-wrap',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );

      /* Gold scanline sweeps vertically across the photograph */
      gsap.fromTo(
        '.team-scanline',
        { top: '-10%', opacity: 0 },
        {
          top: '105%',
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: '.team-photo-wrap',
            start: 'top 82%',
            end: 'bottom 55%',
            scrub: 0.8
          }
        }
      );

      /* Rotating stamp — one full 360° per full-section scroll */
      gsap.fromTo(
        '.team-stamp',
        { rotation: 0 },
        {
          rotation: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );

      /* Council counter — count up 00 → n when scrolled into view */
      const counter = countRef.current;
      if (counter) {
        const state = { v: 0 };
        gsap.to(state, {
          v: TEAM_DATA.length,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = String(Math.round(state.v)).padStart(2, '0');
          },
          scrollTrigger: { trigger: counter, start: 'top 92%' }
        });
      }

      /* Roster — Swiss blinds: each column peels away via clipPath,
         then the card inside slides into place with a stagger */
      if (rosterRef.current) {
        gsap
          .timeline({
            scrollTrigger: { trigger: rosterRef.current, start: 'top 84%' }
          })
          .fromTo(
            '.team-col',
            { clipPath: 'inset(0% 100% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              stagger: 0.16,
              duration: 0.9,
              ease: 'power3.inOut'
            }
          )
          .fromTo(
            '.team-card-inner',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.09, duration: 0.7, ease: 'power2.out' },
            '-=0.45'
          );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative bg-[#F6F5F0] text-[#111111] py-[90px] lg:py-[120px] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ─── Eyebrow + magnetic CTA ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
          >
            Our Leadership
          </motion.p>

          {onViewAboutPage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            >
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={onViewAboutPage}
                  className="group inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#111111] hover:text-[#EDA81C] transition-colors border-b border-[#111111] hover:border-[#EDA81C] py-2 cursor-pointer"
                >
                  Explore Full Team Directory
                  <ArrowRight className="w-4 h-4 text-[#EDA81C] transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Magnetic>
            </motion.div>
          )}
        </div>

        {/* ─── Top split: heading / studio photograph ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — editorial column */}
          <div className="flex flex-col justify-center">
            <AnimatedHeading
              text="Built by engineering rigor. Driven by technical mastery."
              className="font-sans font-medium text-[#111111] tracking-[-0.03em] leading-[1.12] text-[clamp(1.9rem,3.2vw,2.8rem)]"
            />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-6 max-w-[520px] font-sans text-[1.125rem] leading-[1.6] text-[#555555]"
            >
              A multidisciplinary council in Chennai — licensed structural engineers, BIM managers,
              project heads, and computational specialists — stress-tests every calculation before
              it reaches fabrication.
            </motion.p>

            {/* Council counter — GSAP-driven count-up */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
              className="mt-8 flex items-end gap-4 border-t border-black/10 pt-5 max-w-[340px]"
            >
              <span
                ref={countRef}
                className="font-mono text-[2.6rem] leading-none tracking-[-0.05em] text-[#111111] tabular-nums"
              >
                {String(TEAM_DATA.length).padStart(2, '0')}
              </span>
              <span className="pb-1 font-mono text-[11px] uppercase leading-[1.6] tracking-[0.2em] text-[#8A8580]">
                Directors on the council
                <br />— stress-tested, every day
              </span>
            </motion.div>
          </div>

          {/* Right — studio figure with GSAP parallax + scanline + stamp */}
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative"
          >
            <div className="team-photo-wrap relative aspect-[4/3] overflow-hidden rounded-[2px] border border-black/10 bg-[#EBE9E1]">
              <img
                src={ABOUT_PAGE_ASSETS.teamWorkplace}
                alt="Deweg Engineering technical council at work in the Chennai practice studio"
                className="team-photo w-full h-full object-cover grayscale-[0.45] contrast-[1.02] will-change-transform"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />

              {/* Gold scanline sweep */}
              <span className="team-scanline absolute left-0 right-0 h-[2px] bg-[#EDA81C]/80 shadow-[0_0_20px_rgba(237,168,28,0.5)] pointer-events-none" />

              {/* Corner registration marks */}
              <span className="absolute top-3 left-3 h-4 w-4 border-t border-l border-[#111111]/25 pointer-events-none" />
              <span className="absolute top-3 left-3 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EDA81C]/70 pointer-events-none" />
              <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[#111111]/25 pointer-events-none" />
            </div>

            {/* Rotating technical stamp — positioned outside overflow-hidden wrap */}
            <div className="team-stamp absolute -top-6 -right-4 sm:-right-6 z-10 hidden sm:block will-change-transform">
              <RotatingStamp />
            </div>

            <figcaption className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8580]">
                [ FIG. 02 — Deweg Practice Studio ]
              </span>
              <span className="hidden sm:block font-sans text-[13px] text-[#666666]">
                Chennai, India
              </span>
            </figcaption>
          </motion.figure>
        </div>

        {/* ─── Swiss-style leadership roster (GSAP clip-path blinds) ─── */}
        <div
          ref={rosterRef}
          className="mt-20 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-14"
        >
          {TEAM_DATA.map((member, i) => (
            <div key={member.name} className="team-col relative will-change-[clip-path]">
              <div className="team-card-inner">
                <TiltCard member={member} index={i} />
              </div>
            </div>
          ))}
        </div>

        {/* ─── Role-band marquee ─── */}
        <div className="mt-16 overflow-hidden border-t border-black/10 pt-5" aria-hidden="true">
          {reduced ? (
            <MarqueeTrack />
          ) : (
            <motion.div
              className="flex w-max"
              initial={{ x: 0 }}
              animate={{ x: '-50%' }}
              transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
            >
              <MarqueeTrack />
              <MarqueeTrack />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}