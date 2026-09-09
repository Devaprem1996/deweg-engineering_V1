import { useEffect, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import {
  ABOUT_PAGE_ASSETS,
  ABOUT_PAGE_CONTENT,
  DEWEG_LEADERSHIP,
  FIRM_MILESTONES
} from '../data/aboutData';
import { TeamMember } from '../types';

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

/* ————————————————————————————————————————————
   Design tokens — light editorial monograph
   ———————————————————————————————————————————— */

const STATS = [
  { value: '2020', label: 'Founded in Chennai' },
  { value: '100+', label: 'Engineering practitioners' },
  { value: 'ISO · LOD 500', label: 'Certified delivery standards' }
];

const ETHOS = [
  'Design intelligence into constructible reality',
  'Certainty and predictability at every stage'
];

const SPLIT_COLUMNS = [
  {
    index: '01',
    label: 'Vision',
    statement: ABOUT_PAGE_CONTENT.vision.statement,
    subtext: ABOUT_PAGE_CONTENT.vision.subtext,
    caption: 'Homegrown intellect',
    image: ABOUT_PAGE_ASSETS.officeDrawing,
    alt: 'Deweg Structural Engineering Drawings'
  },
  {
    index: '02',
    label: 'Mission',
    statement: ABOUT_PAGE_CONTENT.mission.statement,
    subtext: ABOUT_PAGE_CONTENT.mission.subtext,
    caption: 'Digital structural delivery',
    image: ABOUT_PAGE_ASSETS.teamWorkplace,
    alt: 'Deweg Technical Workplace Culture'
  }
];

const sentenceCase = (input: string) =>
  input
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (m) => m.toUpperCase());

const shortBlurb = (leader: TeamMember) =>
  leader.secondaryRole || `${leader.bio.split('.')[0]}.`;

/* ————————————————————————————————————————————
   Shared editorial motion primitives
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

        {/* ─── 2. Hero — Who We Are & Inception ─── */}
        <section className="max-w-[1600px] mx-auto px-[7vw] pt-14 sm:pt-20 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left: copy */}
            <div className="lg:col-span-7">
              <Eyebrow label="01 / WHO WE ARE" />

              <motion.h1
                aria-label={sentenceCase(ABOUT_PAGE_CONTENT.title)}
                className="mt-8 font-medium text-[#161614] tracking-[-0.035em] leading-[1.02] text-[clamp(3.5rem,6vw,6.5rem)]"
              >
                <RevealText text="Defining the path to better build." />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                className="mt-6 max-w-[620px] font-sans text-[15px] sm:text-base leading-[1.6] text-[#5E5B54]"
              >
                {sentenceCase(ABOUT_PAGE_CONTENT.tagline)}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
                className="mt-5 max-w-[620px] font-sans text-[15px] sm:text-[16px] leading-[1.65] text-[#5E5B54]"
              >
                {ABOUT_PAGE_CONTENT.foundingStory}
              </motion.p>

              {/* Data strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px 0px' }}
                transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                className="mt-12 border-t border-[#DDD9CF]"
              >
                <div className="divide-y divide-[#DDD9CF] sm:divide-y-0 sm:grid sm:grid-cols-3 sm:divide-x">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="py-6 sm:px-7 first:sm:pl-0 sm:py-5">
                      <span className="block font-mono text-[12px] uppercase tracking-[0.14em] text-[#161614]">
                        {stat.value}
                      </span>
                      <span className="block mt-2 font-sans text-[13px] text-[#5E5B54]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: editorial frame */}
            <div className="lg:col-span-5">
              <motion.figure
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                className="m-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1]">
                  <img
                    src={ABOUT_PAGE_ASSETS.heroBanner}
                    alt="DEWEG Engineering Headquarters & Inception Banner"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8C887E]">
                    [ FIG 01 — CHENNAI HEADQUARTERS · EST. 2020 ]
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxImage(ABOUT_PAGE_ASSETS.heroBanner)}
className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#161614] hover:text-black transition-colors cursor-pointer shrink-0 max-lg:tap-hit"
                    >
                      <span className="whitespace-nowrap">View image</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </section>

        {/* ─── 3. Philosophy & Mantra ─── */}
        <section className="border-t border-[#DDD9CF] py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left: technical image */}
              <div className="lg:col-span-5">
                <motion.figure
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="m-0"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1]">
                    <img
                      src={ABOUT_PAGE_ASSETS.aboutEdited}
                      alt="Deweg Engineering Practice & Analytical Drawing"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8C887E]">
                    [ FIG 02 — THE PRACTICE, IN DRAWING ]
                  </figcaption>
                </motion.figure>
              </div>

              {/* Right: copy */}
              <div className="lg:col-span-7">
                <Eyebrow label="02 / CORE ETHOS" />

                <motion.h2
                  className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2.25rem,4vw,3.5rem)]"
                >
                  <RevealText text="The philosophy behind the work." />
                </motion.h2>

                <motion.blockquote
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                  className="mt-8 border-l-2 border-[#C98A2D] pl-6"
                >
                  <p className="max-w-[560px] font-sans font-medium text-[1.35rem] sm:text-[1.5rem] leading-[1.4] text-[#161614]">
                    {ABOUT_PAGE_CONTENT.philosophyAndMantra.quote.replace('DEFINING THE PATH', 'defining the path')}
                  </p>
                </motion.blockquote>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                  className="mt-7 max-w-[560px] font-sans text-[15px] leading-[1.65] text-[#5E5B54]"
                >
                  {ABOUT_PAGE_CONTENT.philosophyAndMantra.context}
                </motion.p>

                {/* Ethos list */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px 0px' }}
                  transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
                  className="mt-10 border-t border-[#DDD9CF]"
                >
                  {ETHOS.map((item, i) => (
                    <div
                      key={item}
                      className="flex items-baseline gap-6 border-b border-[#DDD9CF] py-5"
                    >
                      <span className="font-mono text-[11px] tracking-[0.14em] text-[#8C887E]">
                        {pad(i + 1)}
                      </span>
                      <span className="font-sans text-[15px] text-[#161614]">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. Vision & Mission ─── */}
        <section className="bg-[#EFEEE8] border-y border-[#DDD9CF] py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <header className="max-w-2xl">
              <Eyebrow label="03 / PURPOSE & DIRECTION" />
              <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2.25rem,4vw,3.5rem)]">
                <RevealText text="Vision and mission in action." />
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                className="mt-5 max-w-[600px] font-sans text-[15px] leading-[1.6] text-[#5E5B54]"
              >
                How homegrown intellect and modern digital infrastructure combine to serve world-class projects.
              </motion.p>
            </header>

            <div className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2">
              {SPLIT_COLUMNS.map((col, i) => (
                <motion.div
                  key={col.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px 0px' }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                  className={`py-12 ${i === 0 ? 'lg:pr-16' : ''} ${
                    i === 1 ? 'border-t border-[#DDD9CF] lg:border-t-0 lg:border-l lg:pl-16' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C98A2D]">
                      {col.index} / {col.label}
                    </span>
                    <span className="h-px flex-1 max-w-[96px] bg-[#DDD9CF]" />
                  </div>

                  <h3 className="mt-7 max-w-[480px] font-medium text-[#161614] tracking-[-0.02em] leading-[1.3] text-[1.5rem] sm:text-[1.75rem]">
                    "{sentenceCase(col.statement)}"
                  </h3>

                  <p className="mt-5 max-w-[480px] font-sans text-[15px] leading-[1.6] text-[#5E5B54]">
                    {sentenceCase(col.subtext)}
                  </p>

                  <div className="mt-10 pt-6 border-t border-[#DDD9CF]">
                    <button
                      type="button"
                      onClick={() => setLightboxImage(col.image)}
                      className="group flex items-center gap-4 text-left w-full cursor-pointer"
                    >
                      <span className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1] transition-colors duration-300 group-hover:border-[#B9B5A9]">
                        <img
                          src={col.image}
                          alt={col.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      </span>
                      <span className="inline-flex items-center gap-2 font-sans text-[15px] font-medium text-[#161614]">
                        {col.caption}
                        <ArrowUpRight className="w-4 h-4 text-[#8C887E] transition-all duration-300 group-hover:text-[#161614] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. Team — Editorial Roster ─── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <header className="max-w-2xl">
              <Eyebrow label="04 / THE PEOPLE BEHIND THE PRACTICE" />
              <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2.25rem,4vw,3.5rem)]">
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

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {DEWEG_LEADERSHIP.map((leader, idx) => (
                <motion.button
                  key={leader.name}
                  type="button"
                  onClick={() => setSelectedLeader(leader)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px 0px' }}
                  transition={{ duration: 0.7, delay: (idx % 3) * 0.08, ease: EASE }}
                  className="group text-left cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1]">
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

                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8C887E]">
                    {pad(idx + 1)} / {leader.role}
                  </p>

                  <h3 className="mt-2 font-medium text-[#161614] tracking-[-0.02em] text-[1.35rem] leading-snug transition-transform duration-300 ease-out group-hover:translate-x-1">
                    {leader.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.08em]">
                    <span className="text-[#C98A2D]">
                      {leader.credentials ? sentenceCase(leader.credentials) : ''}
                    </span>
                    {leader.experience && (
                      <span className="text-[#8C887E]">{leader.experience}</span>
                    )}
                  </div>

                  <p className="mt-3 font-sans text-[14px] leading-[1.55] text-[#5E5B54] line-clamp-2">
                    {shortBlurb(leader)}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#161614]">
                    <span>View profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8C887E] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 6. Team Culture Photo Panel ─── */}
        <section className="bg-[#EFEEE8] border-t border-[#DDD9CF] py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
              {/* Left: copy */}
              <div className="lg:col-span-5">
                <Eyebrow label="05 / PEOPLE & PASSION" />
                <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2rem,3.6vw,3rem)]">
                  <RevealText text="A practice built on people." />
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                  className="mt-5 max-w-[480px] font-sans text-[15px] leading-[1.65] text-[#5E5B54]"
                >
                  DEWEG stands on the brawn of its illustrious team—engineers, BIM architects, project managers, and quality controllers united by a singular focus: precision delivery for international infrastructure.
                </motion.p>
                <motion.button
                  type="button"
                  onClick={() => setLightboxImage(ABOUT_PAGE_ASSETS.teamOuting)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px 0px' }}
                  transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                  className="group mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#161614] hover:text-black transition-colors cursor-pointer max-lg:tap-hit"
                >
                  <span>View full image</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.button>
              </div>

              {/* Right: image */}
              <div className="lg:col-span-7">
                <motion.figure
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                  className="m-0"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-[2px] border border-[#DDD9CF] bg-[#EBE9E1]">
                    <img
                      src={ABOUT_PAGE_ASSETS.teamOuting}
                      alt="DEWEG Engineering Annual Team Gathering"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8C887E]">
                      [ FIG 05 — DEWEG TEAM GATHERING ]
                    </span>
                    <button
                      type="button"
                      onClick={() => setLightboxImage(ABOUT_PAGE_ASSETS.teamOuting)}
                      className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#161614] hover:text-black transition-colors cursor-pointer shrink-0 max-lg:tap-hit"
                    >
                      <span className="whitespace-nowrap">View full image</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </figcaption>
                </motion.figure>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. Milestones — Editorial Timeline ─── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <header className="max-w-xl">
              <Eyebrow label="06 / CHRONOLOGY OF EXCELLENCE" />
              <motion.h2 className="mt-7 font-medium text-[#161614] tracking-[-0.035em] leading-[1.08] text-[clamp(2rem,3.6vw,3rem)]">
                <RevealText text="Our journey since 2020." />
              </motion.h2>
            </header>

            {/* Desktop: alternating above/below a central hairline */}
            <div className="hidden lg:block mt-16 relative">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[#DDD9CF]" />
              <div className="grid grid-cols-4 gap-x-10">
                {FIRM_MILESTONES.map((m, i) => {
                  const above = i % 2 === 0;
                  const isCurrent = i === FIRM_MILESTONES.length - 1;
                  return (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px 0px' }}
                      transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                      className="relative h-full min-h-[340px]"
                    >
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 block h-3 w-3 rounded-full border-2 ${
                          isCurrent
                            ? 'border-[#C98A2D] bg-[#C98A2D]'
                            : 'border-[#B9B5A9] bg-[#F6F5F0]'
                        }`}
                      />
                      <div
                        className={`flex flex-col ${above ? '' : 'h-full justify-end'}`}
                      >
                        <div className={above ? 'pb-24 pr-4' : 'pt-24 pr-4'}>
                          <span className="block font-medium text-[#161614] tracking-[-0.03em] leading-none text-[2.5rem]">
                            {m.year}
                          </span>
                          <h4 className="mt-3 font-medium text-[17px] tracking-[-0.01em] text-[#161614]">
                            {m.title}
                          </h4>
                          <p className="mt-3 font-sans text-[14px] leading-[1.6] text-[#5E5B54]">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: vertical list with left rule */}
            <div className="lg:hidden mt-14">
              <div className="relative pl-9">
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-[#DDD9CF]" />
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
                          className={`absolute top-1 block h-3 w-3 rounded-full border-2 ${
                            isCurrent
                              ? 'border-[#C98A2D] bg-[#C98A2D]'
                              : 'border-[#B9B5A9] bg-[#F6F5F0]'
                          }`}
                          style={{ left: '-38px' }}
                        />
                        <span className="block font-medium text-[#161614] tracking-[-0.03em] leading-none text-[2rem]">
                          {m.year}
                        </span>
                        <h4 className="mt-2 font-medium text-[17px] tracking-[-0.01em] text-[#161614]">
                          {m.title}
                        </h4>
                        <p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#5E5B54]">
                          {m.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. Bottom CTA — Light Closing Statement ─── */}
        <section className="bg-[#E9E6DD] border-y border-[#DDD9CF] py-24 sm:py-[120px]">
          <div className="max-w-[1600px] mx-auto px-[7vw]">
            <div className="max-w-3xl">
              <Eyebrow label="07 / READY TO COLLABORATE" />
              <motion.h2 className="mt-8 font-medium text-[#161614] tracking-[-0.035em] leading-[1.05] text-[clamp(2.4rem,4.6vw,4rem)]">
                <RevealText text="Experience the rigor of DEWEG Engineering." />
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="mt-6 max-w-[560px] font-sans text-[15px] leading-[1.65] text-[#5E5B54]"
              >
                Explore our 7 specialized engineering practices, or discuss your project specifications with our leadership team.
              </motion.p>

              <div className="mt-10 flex flex-wrap items-center gap-8">
                {onNavigateToServices && (
                  <button
                    type="button"
                    onClick={onNavigateToServices}
                    className="group inline-flex items-center gap-2.5 rounded-[2px] bg-[#161614] text-[#F6F5F0] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-black cursor-pointer"
                  >
                    <span>Explore 7 disciplines</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[5px]" />
                  </button>
                )}
                {onNavigateToContact && (
                  <button
                    type="button"
                    onClick={onNavigateToContact}
                    className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#161614] hover:text-black transition-colors cursor-pointer max-lg:tap-hit"
                  >
                    <span>Contact leadership</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                )}
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
                    {/* Image */}
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

                    {/* Content */}
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