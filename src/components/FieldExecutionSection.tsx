import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, CheckCircle2, Shield, Wrench, X } from 'lucide-react';
import { OFFICIAL_ASSETS } from '../data/engineeringData';
import { AnimatedHeading } from './AnimatedText';

export default function FieldExecutionSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fabrication' | 'erection'>('fabrication');

  const images = {
    fabrication: {
      url: OFFICIAL_ASSETS.section5ExecutionImg,
      title: 'High-Tolerance Structural Steel Joint Execution',
      desc: 'Live photograph from Deweg Engineering site assembly showing pre-drilled gusset plates, high-strength friction grip (HSFG) bolts, and precision cambered chord interfaces.',
      stats: [
        { label: 'Joint Geometry', value: 'Double Shear Splice' },
        { label: 'Bolt Specification', value: 'ASTM A325 / IS 3757 Grade 10.9' },
        { label: 'Tolerance Budget', value: '±1.5 mm across span' },
        { label: 'Non-Destructive Testing', value: '100% Ultrasonic Verified' }
      ]
    },
    erection: {
      url: OFFICIAL_ASSETS.structuralErectionImg,
      title: 'Long-Span Industrial Roof Truss Assembly',
      desc: 'Heavy structural crane lift and field alignment for an industrial portal hall. Pre-engineered in Tekla Structures with temporary shoring calculations and rigging safety studies.',
      stats: [
        { label: 'Clear Span Width', value: '54 Metres' },
        { label: 'Assembly Method', value: 'Tandem Crane Lift' },
        { label: 'Steel Grade', value: 'E350 / S355 Structural Steel' },
        { label: 'On-Site Rework', value: '0.00% Defect-Free' }
      ]
    }
  };

  const current = images[activeTab];

  return (
    <section
      id="field-execution"
      className="relative bg-transparent text-[#0C0A09] py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#EDA81C] font-sans font-bold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Section 05 • Field Execution &amp; Assembly</span>
            </div>
            <AnimatedHeading
              text="Micro-Tolerance Field Execution"
              highlightWord="Execution"
              highlightClass="text-[#EDA81C]"
              className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0C0A09] font-bold tracking-tight"
            />
          </div>

          {/* Tab Selector with Glassmorphism */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('fabrication')}
              className={`px-5 py-2 text-xs font-sans uppercase tracking-[0.16em] font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'fabrication'
                  ? 'bg-[#EDA81C] text-[#0C0A09] shadow-sm'
                  : 'text-[#292524] hover:text-[#0C0A09]'
              }`}
            >
              Joint Assembly &amp; Splice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('erection')}
              className={`px-5 py-2 text-xs font-sans uppercase tracking-[0.16em] font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'erection'
                  ? 'bg-[#EDA81C] text-[#0C0A09] shadow-sm'
                  : 'text-[#292524] hover:text-[#0C0A09]'
              }`}
            >
              Truss Crane Erection
            </button>
          </div>
        </div>

        {/* Interactive Image & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Photo with Glassmorphic Framing */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-2xl border border-white/90 p-3 shadow-xl group"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 cursor-pointer" onClick={() => setSelectedImage(current.url)}>
                <img
                  src={current.url}
                  alt={current.title}
                  className="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Inspection Trigger */}
                <button
                  type="button"
                  className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-xs font-sans font-bold text-[#0C0A09] hover:bg-[#EDA81C] hover:text-[#0C0A09] shadow-md transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(current.url);
                  }}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Inspect 7000px Ultra-HD</span>
                </button>

                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-sans font-bold">
                  On-Site Construction Verification
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Specs Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-md">
              <h3 className="font-serif text-xl sm:text-2xl text-[#0C0A09] font-bold">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#292524] mt-3 leading-relaxed font-normal">
                {current.desc}
              </p>

              <div className="mt-6 pt-6 border-t border-stone-200/80 space-y-3.5">
                {current.stats.map((stat, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs">
                    <span className="text-[#78716C] font-sans">{stat.label}</span>
                    <span className="font-semibold text-[#0C0A09] text-right font-mono">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-stone-200/80 flex items-center gap-2 text-xs text-[#0C0A09] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#EDA81C]" />
                <span>Zero On-Site Re-drilling Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image inspection"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="High resolution inspection"
              className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
