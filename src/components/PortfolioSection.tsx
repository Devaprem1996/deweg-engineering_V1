import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { PROJECTS_DATA } from '../data/engineeringData';
import { Project } from '../types';
import { AnimatedHeading, Parallax } from './AnimatedText';

interface PortfolioSectionProps {
  onSelectProject: (project: Project) => void;
}

const CATEGORIES = [
  'All',
  ...Array.from(new Set(PROJECTS_DATA.map((p) => p.category)))
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* Direction-free staggered reveal used inside the active record sheet */
const recordWrapper = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const recordItem = (reduced: boolean) => ({
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.45, ease: EASE } },
});

export default function PortfolioSection({ onSelectProject }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;

  const indexRef = useRef<HTMLDivElement>(null);
  const hoverIndexRef = useRef<number | null>(null);
  const scrollActiveRef = useRef(0);
  const filteredCountRef = useRef(0);

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  filteredCountRef.current = filteredProjects.length;

  const current = filteredProjects[active] ?? null;
  const paddedIndex = String(active + 1).padStart(2, '0');

  // Scroll activation: the record nearest the reading band becomes active.
  // Hover / focus overrides it; leaving the index returns to scroll position.
  const { scrollYProgress } = useScroll({
    target: indexRef,
    offset: ['start 0.7', 'end 0.45'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const total = filteredCountRef.current;
    if (total === 0) return;
    const next = Math.max(0, Math.min(total - 1, Math.floor(latest * total)));
    scrollActiveRef.current = next;
    if (hoverIndexRef.current !== null) return;
    setActive((prev) => (prev === next ? prev : next));
  });

  const handleFilter = (cat: string) => {
    setActiveFilter(cat);
    setActive(0);
    scrollActiveRef.current = 0;
    hoverIndexRef.current = null;
  };

  return (
    <section
      id="projects"
      className="relative bg-transparent text-[#111111] py-24 md:py-28 lg:py-36 border-t border-[#E7E1D8]/60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header row: eyebrow + editorial mono filters */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
          >
            Engineering Execution
          </motion.p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 lg:justify-end">
            {CATEGORIES.map((cat) => {
              const isActiveCat = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleFilter(cat)}
                  className={`max-lg:tap-hit relative text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer ${
                    isActiveCat ? 'text-[#111111]' : 'text-[#8A8580] hover:text-[#111111]'
                  }`}
                >
                  <span className={isActiveCat ? 'select-none' : 'select-none invisible'}>•</span>{' '}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Display headline — no highlights */}
        <AnimatedHeading
          text="Selected engagements."
          className="font-sans font-medium text-[clamp(2.5rem,4vw,3.8rem)] text-[#111111] tracking-[-0.03em] leading-[1.1] mb-12 lg:mb-16"
        />

        {/* 12-col body: inspection viewport (left) / index + active data (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT — STICKY ENGINEERING INSPECTION VIEWPORT */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {reducedMotion ? (
                <InspectionFrame
                  projects={filteredProjects}
                  active={active}
                  paddedIndex={paddedIndex}
                  onSelectProject={onSelectProject}
                />
              ) : (
                <Parallax offset={16} className="w-full">
                  <InspectionFrame
                    projects={filteredProjects}
                    active={active}
                    paddedIndex={paddedIndex}
                    onSelectProject={onSelectProject}
                  />
                </Parallax>
              )}
            </motion.div>
          </div>

          {/* RIGHT — COMPACT INDEX + ACTIVE RECORD SHEET */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* ACTIVE RECORD SHEET — first on mobile, right on desktop */}
            <div className="order-1 lg:order-2 w-full lg:w-[42%] lg:shrink-0 min-w-0">
              <div className="border-t border-black/10 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A8580]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#EDA81C] opacity-60 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#EDA81C]" />
                    </span>
                    {current ? `Active Record — ${paddedIndex}` : 'Active Record'}
                  </span>
                  {current && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8580]">
                      {current.year}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {current && (
                    <motion.article
                      key={current.id}
                      variants={recordWrapper}
                      initial="hidden"
                      animate="show"
                      exit={{
                        opacity: 0,
                        y: -8,
                        transition: { duration: reducedMotion ? 0 : 0.25, ease: 'easeIn' },
                      }}
                    >
                      <h3 className="mt-5 font-sans text-[1.35rem] lg:text-2xl font-bold tracking-[-0.02em] text-[#111111] leading-[1.15]">
                        {current.title}
                      </h3>

                      <motion.p
                        variants={recordItem(reducedMotion)}
                        className="mt-3 font-sans text-[15px] leading-[1.7] text-[#555555]"
                      >
                        {current.summary}
                      </motion.p>

                      <motion.p
                        variants={recordItem(reducedMotion)}
                        className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#111111]"
                      >
                        <span className="text-[#EDA81C]">{paddedIndex}</span>
                        <span className="text-[#8A8580]">
                          {' '}· {current.category} · {current.location}
                        </span>
                      </motion.p>

                      {/* Key metrics — archival stat sheet */}
                      {current.keyStats.length > 0 && (
                        <motion.div
                          variants={recordItem(reducedMotion)}
                          className="mt-6 border-t border-black/10"
                        >
                          <span className="mt-4 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#8A8580]">
                            Key Metrics
                          </span>
                          <dl className="mt-1">
                            {current.keyStats.map((stat) => (
                              <motion.div
                                key={stat.label}
                                variants={recordItem(reducedMotion)}
                                className="flex items-baseline justify-between gap-4 py-2.5 border-b border-black/[0.07]"
                              >
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8580]">
                                  {stat.label}
                                </dt>
                                <dd className="font-sans text-[15px] font-medium tracking-[-0.01em] text-[#111111] text-right">
                                  {stat.value}
                                </dd>
                              </motion.div>
                            ))}
                          </dl>
                        </motion.div>
                      )}

                      {/* Disciplines — tags */}
                      {current.disciplines.length > 0 && (
                        <motion.div
                          variants={recordItem(reducedMotion)}
                          className="mt-5 flex flex-wrap gap-2"
                        >
                          {current.disciplines.map((d) => (
                            <span
                              key={d}
                              className="rounded-full border border-black/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#555555]"
                            >
                              {d}
                            </span>
                          ))}
                        </motion.div>
                      )}

                      <motion.div
                        variants={recordItem(reducedMotion)}
                        className="mt-6 pt-4 border-t border-black/10"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectProject(current)}
                          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111] hover:text-[#EDA81C] transition-colors cursor-pointer"
                        >
                          Inspect full dossier
                          <ArrowUpRight className="w-4 h-4 text-[#EDA81C] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </motion.div>
                    </motion.article>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PROJECT INDEX — compact records as primary navigation */}
            <div
              ref={indexRef}
              className="order-2 lg:order-1 flex-1 min-w-0 border-t border-black/10"
              onMouseLeave={() => {
                hoverIndexRef.current = null;
                setActive(scrollActiveRef.current);
              }}
            >
              {filteredProjects.length === 0 && (
                <div className="py-6 border-b border-black/10">
                  <p className="font-sans text-[15px] text-[#666666]">
                    No engagements filed under this category yet. Select another filter.
                  </p>
                </div>
              )}
              {filteredProjects.map((project, i) => {
                const isActive = active === i;
                return (
                  <motion.div
                    key={project.id}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.1 + i * 0.05, ease: EASE }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => {
                        hoverIndexRef.current = i;
                        setActive(i);
                      }}
                      onFocus={() => {
                        hoverIndexRef.current = i;
                        setActive(i);
                      }}
                      onBlur={() => {
                        hoverIndexRef.current = null;
                      }}
                      onClick={() => onSelectProject(project)}
                      aria-label={`Open dossier — ${project.title}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group relative w-full text-left cursor-pointer border-b border-black/10 outline-none transition-colors duration-500 ${
                        isActive ? 'border-[#EDA81C]/40' : 'hover:border-black/30'
                      }`}
                    >
                      {/* Gold gauge tab slides out for the active record */}
                      <span
                        className={`absolute left-0 inset-y-0 w-[3px] bg-[#EDA81C] origin-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                        }`}
                      />
                      <span
                        className={`flex items-center gap-4 pl-5 py-[18px] transition-transform duration-300 ease-out ${
                          isActive ? 'translate-x-1.5' : 'group-hover:translate-x-1.5'
                        }`}
                      >
                        <span
                          className={`font-mono text-[12px] tracking-[0.15em] transition-colors duration-300 ${
                            isActive
                              ? 'text-[#EDA81C]'
                              : 'text-[#888888] group-hover:text-[#111111]'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 min-w-0 font-sans text-[15px] sm:text-[17px] font-bold leading-snug tracking-[-0.01em] text-[#111111]">
                          {project.title}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8580]">
                          {project.year}
                        </span>
                        <ArrowUpRight
                          className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                            isActive
                              ? 'text-[#EDA81C] opacity-100'
                              : 'text-[#888888] opacity-0 group-hover:opacity-100 group-hover:text-[#EDA81C]'
                          }`}
                        />
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mono dossier link */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-16 lg:mt-20 flex justify-end"
        >
          <button
            type="button"
            id="view-all-projects-btn"
            onClick={() => {
              handleFilter('All');
              onSelectProject(filteredProjects[0] ?? PROJECTS_DATA[0]);
            }}
            className="group inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#111111] hover:text-[#EDA81C] transition-colors border-b border-[#111111] hover:border-[#EDA81C] py-2 cursor-pointer"
          >
            View full practice dossiers
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#EDA81C]" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface InspectionFrameProps {
  projects: Project[];
  active: number;
  paddedIndex: string;
  onSelectProject: (project: Project) => void;
}

function InspectionFrame({
  projects,
  active,
  paddedIndex,
  onSelectProject,
}: InspectionFrameProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const activeProject = projects[active] ?? null;

  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#EBE9E1] border border-[#E2E0D8] group cursor-pointer"
      onClick={() => activeProject && onSelectProject(activeProject)}
      role="button"
      tabIndex={0}
      aria-label={activeProject ? `Open dossier — ${activeProject.title}` : 'No engagement selected'}
      onKeyDown={(e) => {
        if (activeProject && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelectProject(activeProject);
        }
      }}
    >
      {/* Stacked project visuals — cross-fade + sheet scale on active change */}
      {projects.map((project, i) => {
        const isActive = active === i;
        return (
          <motion.div
            key={project.id}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: reducedMotion ? 1 : isActive ? 1 : 1.015,
            }}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease: EASE }}
            className="absolute inset-0"
            aria-hidden={!isActive}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-center"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        );
      })}

      {/* Archival inspection annotation — case index, top-left */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#111111]/70">
        <span className="w-4 h-px bg-[#EDA81C]" />
        <span>{activeProject ? `Case ${paddedIndex} — Inspection View` : 'Empty Case'}</span>
      </div>

      {/* Cutline tag pinned bottom-right — cross-fades between projects */}
      <div className="absolute bottom-4 right-4 z-10">
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.span
              key={activeProject.id}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
              className="inline-block px-2.5 py-1.5 rounded-[4px] bg-white/55 backdrop-blur-md border border-white/60 text-[11px] font-mono uppercase tracking-[0.1em] text-[#666666]"
            >
              [ {paddedIndex} — {activeProject.year} · {activeProject.client} ]
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Drafting viewport corner marks */}
      <div className="absolute inset-3 pointer-events-none z-[5]">
        <span className="absolute top-0 left-0 h-4 w-4 border-t border-l border-[#111111]/25" />
        <span className="absolute top-0 right-0 h-4 w-4 border-t border-r border-[#111111]/25" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[#111111]/25" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#111111]/25" />
      </div>
    </div>
  );
}