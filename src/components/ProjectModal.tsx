import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data/engineeringData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onChangeProject?: (project: Project) => void;
  onNavigateToContact?: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Small staggered fade-up used by every block of the dossier body. */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE },
});

export default function ProjectModal({
  project,
  onClose,
  onChangeProject,
  onNavigateToContact,
}: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isOpen = Boolean(project);

  /* Focus management + scroll-lock: trap Tab inside the dialog, restore
     focus to the trigger element when it closes. Runs only on open/close,
     not when switching records — so prev/next stays smooth. */
  useEffect(() => {
    if (!project) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const getFocusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'button, [href], input, [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = getFocusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    const frame = requestAnimationFrame(() => {
      const list = getFocusables();
      (list[0] ?? panel)?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const projectIndex = project
    ? Math.max(0, PROJECTS_DATA.findIndex((p) => p.id === project.id))
    : 0;
  const total = PROJECTS_DATA.length;
  const indexLabel = project
    ? `${String(projectIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    : '';

  const step = (dir: 1 | -1) => {
    if (!project || !onChangeProject) return;
    const next = (projectIndex + dir + total) % total;
    onChangeProject(PROJECTS_DATA[next]);
  };

  const handleDiscuss = () => {
    onClose();
    if (onNavigateToContact) onNavigateToContact();
    else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="project-dossier"
        data-lenis-prevent
        className="fixed inset-0 z-[11000] overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative min-h-full flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close dossier"
            onClick={onClose}
            tabIndex={-1}
            className="absolute inset-0 w-full h-full bg-[#292524]/45 cursor-default"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            aria-describedby="project-modal-desc"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative z-10 w-full max-w-3xl bg-[#FBFAF7] text-[#111111] rounded-[4px] border border-black/10 shadow-2xl outline-none"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-4 border-b border-black/10">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
                  Project Dossier
                </span>
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#EDA81C]">
                  {indexLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dossier (Esc)"
                className="p-1.5 -mr-1.5 text-[#888888] hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="p-6 sm:p-10 lg:p-12 space-y-8"
              >
                {/* Eyebrow */}
                <motion.p
                  {...fadeUp(0.05)}
                  className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
                >
                  {project.category}
                </motion.p>

                {/* Title */}
                <motion.h2
                  {...fadeUp(0.1)}
                  id="project-modal-title"
                  className="font-sans font-medium text-[#111111] tracking-[-0.02em] leading-[1.15] text-[clamp(1.75rem,3vw,2.5rem)]"
                >
                  {project.title}
                </motion.h2>

                {/* Mono metadata */}
                <motion.div
                  {...fadeUp(0.15)}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8580]"
                >
                  <span>{project.year}</span>
                  <span aria-hidden="true" className="text-[#D6D2C9]">•</span>
                  <span>{project.location}</span>
                  <span aria-hidden="true" className="text-[#D6D2C9]">•</span>
                  <span>{project.client}</span>
                </motion.div>

                {/* Museum image frame */}
                <motion.div
                  {...fadeUp(0.2)}
                  className="relative aspect-[16/9] w-full overflow-hidden rounded-[4px] border border-[#E2E0D8] bg-[#EBE9E1]"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t border-l border-white/60 pointer-events-none" />
                  <span className="absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t border-r border-white/60 pointer-events-none" />
                  <span className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b border-l border-white/60 pointer-events-none" />
                  <span className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b border-r border-white/60 pointer-events-none" />
                </motion.div>

                {/* Key metrics — hairline table */}
                <motion.div {...fadeUp(0.25)}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 border border-black/10">
                    {project.keyStats.map((stat, i) => (
                      <div
                        key={stat.label}
                        className={`py-5 px-5 ${i > 0 ? 'sm:border-l border-black/10 sm:border-t-0 border-t' : ''}`}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8580]">
                          {stat.label}
                        </div>
                        <div className="mt-2 font-sans text-xl sm:text-2xl font-medium text-[#111111] tracking-[-0.01em]">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Scope description */}
                <motion.div {...fadeUp(0.3)} className="space-y-3">
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
                    Engineering Scope &amp; Solution
                  </h3>
                  <p
                    id="project-modal-desc"
                    className="font-sans text-[15px] sm:text-base font-normal text-[#555555] leading-[1.75]"
                  >
                    {project.fullDescription}
                  </p>
                </motion.div>

                {/* Disciplines — editorial rows */}
                <motion.div {...fadeUp(0.35)}>
                  <h4 className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580] mb-3">
                    Disciplines &amp; Technical Methods
                  </h4>
                  <div className="border-t border-black/10">
                    {project.disciplines.map((d, i) => (
                      <div
                        key={d}
                        className="flex items-baseline justify-between gap-6 py-3 border-b border-black/10"
                      >
                        <span className="font-mono text-[11px] tracking-[0.1em] text-[#999999]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 text-right font-sans text-[14px] font-medium text-[#222222]">
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Footer — actions */}
            <div className="flex items-center justify-between gap-4 flex-wrap px-6 sm:px-8 py-4 border-t border-black/10 bg-[#FBFAF7]">
              {onChangeProject ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous record"
                    className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#555555] hover:text-[#111111] transition-colors px-2 py-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#8A8580] transition-colors duration-300 group-hover:text-[#EDA81C] group-hover:-translate-x-0.5" />
                    <span>Prev record</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next record"
                    className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#555555] hover:text-[#111111] transition-colors px-2 py-1.5 cursor-pointer"
                  >
                    <span>Next record</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8A8580] transition-colors duration-300 group-hover:text-[#EDA81C] group-hover:translate-x-0.5" />
                  </button>
                </div>
              ) : (
                <span aria-hidden="true" />
              )}

              <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleDiscuss}
                  className="group inline-flex items-center gap-2 font-sans text-[15px] font-medium text-[#111111] cursor-pointer"
                >
                  <span className="border-b border-[#111111] group-hover:text-[#EDA81C] group-hover:border-[#EDA81C] transition-colors">
                    Discuss similar challenge
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#EDA81C] transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8A8580] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}