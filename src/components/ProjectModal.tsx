import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Building, Check, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop blur with soft warm tone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#292524]/50 backdrop-blur-sm"
        />

        {/* Modal Window in Warm Light Architectural Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E7E1D8] text-[#1C1917] z-10 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E1D8] bg-[#F5F0E8]">
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C4703F] font-sans font-bold">
                Project Dossier • {project.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE4D9] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="p-6 sm:p-10 overflow-y-auto space-y-7">
            {/* Title & Metadata */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] tracking-tight">
                {project.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#57534E] font-sans">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C4703F]" />
                  <span>Completion: {project.year}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C4703F]" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#C4703F]" />
                  <span>Client: {project.client}</span>
                </div>
              </div>
            </div>

            {/* Hero Project Image */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E7E1D8] shadow-sm">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover filter contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 p-5 rounded-xl bg-[#F5F0E8] border border-[#E7E1D8]">
              {project.keyStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs uppercase tracking-wider text-[#78716C] font-sans font-semibold">
                    {stat.label}
                  </div>
                  <div className="font-serif text-xl sm:text-2xl text-[#C4703F] font-bold mt-1">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Description */}
            <div className="space-y-3">
              <h3 className="font-serif text-xl text-[#1C1917] font-semibold">Engineering Scope & Solution</h3>
              <p className="text-sm sm:text-base text-[#57534E] font-sans font-normal leading-[1.8]">
                {project.fullDescription}
              </p>
            </div>

            {/* Disciplines Employed */}
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#C4703F] font-sans font-bold mb-3">
                Disciplines & Technical Methods
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.disciplines.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F0E8] border border-[#E7E1D8] rounded-md text-xs text-[#1C1917] font-medium"
                  >
                    <Check className="w-3 h-3 text-[#C4703F]" />
                    <span>{d}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-6 border-t border-[#E7E1D8] flex items-center justify-between flex-wrap gap-4">
              <a
                href="#contact"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4703F] text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#A65A2E] transition-colors shadow-sm"
              >
                <span>Discuss Similar Engineering Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                Close Project Dossier
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
