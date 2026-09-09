import { useState } from 'react';
import { motion } from 'motion/react';
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

export default function PortfolioSection({ onSelectProject }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [active, setActive] = useState(0);

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  const handleFilter = (cat: string) => {
    setActiveFilter(cat);
    setActive(0);
  };

  const current = filteredProjects[active];

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
                  className={`text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer ${
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
          className="font-sans font-medium text-[clamp(2.5rem,4vw,3.8rem)] text-[#111111] tracking-[-0.03em] leading-[1.1] mb-16 lg:mb-20"
        />

        {/* 12-col body: museum frame (left) / editorial rows (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left — architectural frame cross-fades on row hover */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Parallax offset={16} className="w-full">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#EBE9E1] border border-[#E2E0D8] pointer-events-none">
                  {filteredProjects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={false}
                      animate={{
                        opacity: active === i ? 1 : 0,
                        scale: active === i ? 1 : 1.02
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
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
                  ))}

                  {/* Cutline tag pinned bottom-right */}
                  <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1.5 rounded-[4px] bg-white/55 backdrop-blur-md border border-white/60 text-[11px] font-mono uppercase tracking-[0.1em] text-[#666666]">
                    {current ? (
                      <>
                        [ {String(active + 1).padStart(2, '0')} — {current.year} · {current.client} ]
                      </>
                    ) : (
                      '[ No Engagement In This Category ]'
                    )}
                  </div>
                </div>
              </Parallax>
            </motion.div>
          </div>

          {/* Right — editorial engagement rows */}
          <div className="lg:col-span-7 border-t border-black/10">
            {filteredProjects.length === 0 && (
              <div className="py-10 border-b border-black/10">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(0)}
                    onClick={() => onSelectProject(project)}
                    aria-label={`Open dossier — ${project.title}`}
                    className="group w-full text-left cursor-pointer border-b border-black/10 outline-none"
                  >
                    <span
                      className={`flex items-start gap-6 py-5 transition-transform duration-300 ease-out ${
                        isActive ? 'translate-x-2' : 'group-hover:translate-x-2'
                      }`}
                    >
                      <span
                        className={`font-mono text-[13px] tracking-[0.15em] pt-1 transition-colors duration-300 ${
                          isActive ? 'text-[#111111]' : 'text-[#888888] group-hover:text-[#111111]'
                        }`}
                      >
                        {isActive ? <span className="select-none">•&nbsp;&nbsp;</span> : null}
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 flex flex-col gap-1">
                        <span className="flex items-start justify-between gap-4">
                          <span className="font-sans text-[16px] sm:text-lg font-bold leading-snug tracking-[-0.01em] text-[#111111]">
                            {project.title}
                          </span>
                          <ArrowUpRight
                            className={`w-4 h-4 mt-1 shrink-0 transition-all duration-300 ${
                              isActive
                                ? 'text-[#EDA81C] opacity-100'
                                : 'text-[#888888] opacity-0 group-hover:opacity-100 group-hover:text-[#EDA81C]'
                            }`}
                          />
                        </span>
                        <span className="font-sans text-[14px] font-normal leading-[1.4] text-[#666666]">
                          {project.summary}
                        </span>
                        <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8580]">
                          {project.category} — {project.location}
                        </span>
                      </span>
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mono dossier link */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 lg:mt-20 flex justify-end"
        >
          <button
            type="button"
            id="view-all-projects-btn"
            onClick={() => {
              handleFilter('All');
              onSelectProject(PROJECTS_DATA[0]);
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