import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  const handleDiscuss = () => {
    onClose();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-[11000] flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Project dossier — ${project.title}`}
        >
          {/* Warm blurred backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-[#292524]/45 backdrop-blur-sm"
          />

          {/* Editorial broadsheet panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl bg-[#FBFAF7] text-[#111111] z-10 rounded-[4px] border border-black/10 shadow-2xl my-auto max-h-[90vh] flex flex-col"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-black/10">
              <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
                Project Dossier
              </span>
              <button
                onClick={onClose}
                aria-label="Close dossier"
                className="p-1.5 -mr-1.5 text-[#888888] hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="p-6 sm:p-10 lg:p-12 overflow-y-auto space-y-8"
            >
              {/* Eyebrow */}
              <motion.p
                variants={itemVariants}
                className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
              >
                {project.category}
              </motion.p>

              {/* Title */}
              <motion.h2
                variants={itemVariants}
                className="font-sans font-medium text-[#111111] tracking-[-0.02em] leading-[1.15] text-[clamp(1.75rem,3vw,2.5rem)]"
              >
                {project.title}
              </motion.h2>

              {/* Mono metadata */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8580]"
              >
                <span>{project.year}</span>
                <span aria-hidden="true" className="text-[#D6D2C9]">
                  •
                </span>
                <span>{project.location}</span>
                <span aria-hidden="true" className="text-[#D6D2C9]">
                  •
                </span>
                <span>{project.client}</span>
              </motion.div>

              {/* Museum image frame */}
              <motion.div
                variants={itemVariants}
                className="relative aspect-[16/9] w-full overflow-hidden rounded-[4px] border border-[#E2E0D8] bg-[#EBE9E1]"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Key metrics — hairline table */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 sm:grid-cols-3 border border-black/10">
                  {project.keyStats.map((stat, i) => (
                    <div
                      key={i}
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
              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
                  Engineering Scope &amp; Solution
                </h3>
                <p className="font-sans text-[15px] sm:text-base font-normal text-[#555555] leading-[1.75]">
                  {project.fullDescription}
                </p>
              </motion.div>

              {/* Disciplines — editorial rows */}
              <motion.div variants={itemVariants}>
                <h4 className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580] mb-3">
                  Disciplines &amp; Technical Methods
                </h4>
                <div className="border-t border-black/10">
                  {project.disciplines.map((d, i) => (
                    <div
                      key={i}
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

              {/* Footer actions */}
              <motion.div
                variants={itemVariants}
                className="pt-6 border-t border-black/10 flex items-center justify-between flex-wrap gap-4"
              >
                <button
                  type="button"
                  onClick={handleDiscuss}
                  className="group inline-flex items-center gap-2 font-sans text-[15px] font-medium text-[#111111] cursor-pointer"
                >
                  <span className="border-b border-[#111111] group-hover:text-[#EDA81C] group-hover:border-[#EDA81C] transition-colors">
                    Discuss similar engineering challenge
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#EDA81C] transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8A8580] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}