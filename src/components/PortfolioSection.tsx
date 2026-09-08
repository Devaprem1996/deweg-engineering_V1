import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { PROJECTS_DATA } from '../data/engineeringData';
import { Project } from '../types';
import { AnimatedHeading } from './AnimatedText';

interface PortfolioSectionProps {
  onSelectProject: (project: Project) => void;
}

export default function PortfolioSection({ onSelectProject }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = [
    'All',
    'Oil & Gas & Heavy Industry',
    'Structural Design & Detailing',
    'Commercial & High-Rise',
    'MEP & Building Systems'
  ];

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      className="relative bg-transparent text-[#0C0A09] py-24 md:py-32 lg:py-36 border-t border-[#E7E1D8]/60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[2px] bg-[#EDA81C]" />
              <span className="text-xs uppercase tracking-[0.28em] font-sans font-bold text-[#EDA81C]">
                ENGINEERING EXECUTION
              </span>
            </div>
            <AnimatedHeading
              text="Selected Engagements & Structures"
              highlightWord="Structures"
              highlightClass="text-[#EDA81C]"
              className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0C0A09] font-bold tracking-tight"
            />
          </div>

          {/* Filter Pills - Glassmorphic amber styling */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-sans tracking-wider px-4 py-2 rounded-xl transition-all duration-300 font-bold cursor-pointer border ${
                  activeFilter === cat
                    ? 'bg-[#EDA81C] text-[#0C0A09] border-[#EDA81C] shadow-sm'
                    : 'bg-white/80 backdrop-blur-md text-[#292524] border-white/80 hover:border-[#EDA81C] hover:text-[#0C0A09] shadow-xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project, idx) => {
            return (
              <motion.article
                key={project.id}
                id={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectProject(project)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg hover:shadow-2xl hover:border-[#EDA81C]/60 transition-all duration-400 flex flex-col justify-between"
              >
                {/* Image Container with smooth zoom */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover filter contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top-Right Category Tag */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-xl rounded-full border border-white/90 text-[11px] uppercase tracking-widest text-[#0C0A09] font-sans font-bold shadow-sm">
                      {project.category}
                    </span>
                  </div>

                  {/* Top-Left Year Tag */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xl rounded-full border border-white/90 text-[11px] text-[#0C0A09] font-sans font-bold shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-[#EDA81C]" />
                    <span>{project.year}</span>
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    {/* Location and client meta */}
                    <div className="flex items-center gap-2 text-xs text-[#0C0A09] mb-2.5 font-sans font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#EDA81C]" />
                      <span>{project.location}</span>
                      <span className="text-[#EDA81C]">•</span>
                      <span>{project.client}</span>
                    </div>

                    {/* Title */}
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-2xl text-[#0C0A09] font-bold tracking-tight group-hover:text-[#EDA81C] transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <div className="w-9 h-9 rounded-full border border-stone-200/80 bg-white/90 backdrop-blur-md flex items-center justify-center shrink-0 group-hover:border-[#EDA81C] group-hover:bg-[#EDA81C] group-hover:text-[#0C0A09] transition-all duration-300 shadow-xs">
                        <ArrowUpRight className="w-4 h-4 text-[#0C0A09]" />
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="mt-3 text-sm text-[#292524] font-sans font-normal leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Disciplines Chips */}
                  <div className="mt-6 pt-5 border-t border-[#F0EBE1] flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.disciplines.map((d, i) => (
                        <span
                          key={i}
                          className="text-[11px] text-[#0C0A09] font-medium bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/80 shadow-xs"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs uppercase font-sans tracking-widest text-[#EDA81C] font-bold group-hover:translate-x-1 transition-transform">
                      View Dossier →
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-16 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              id="view-all-projects-btn"
              onClick={() => {
                setActiveFilter('All');
                onSelectProject(PROJECTS_DATA[0]);
              }}
              className="group inline-flex items-center gap-3 text-xs sm:text-sm uppercase tracking-[0.25em] font-sans font-bold text-[#0C0A09] hover:text-[#EDA81C] transition-colors py-3 px-6 border-b-2 border-[#0C0A09] hover:border-[#EDA81C] cursor-pointer"
            >
              <span>Explore Technical Specifications &amp; Dossiers</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#EDA81C]" />
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
