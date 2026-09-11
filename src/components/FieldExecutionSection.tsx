import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import { X } from 'lucide-react';
import { OFFICIAL_ASSETS } from '../data/engineeringData';
import { AnimatedHeading, Parallax } from './AnimatedText';

export default function FieldExecutionSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fabrication' | 'erection'>('fabrication');

  // Scanner wipe: the field photo starts as a technical blueprint wireframe and a
  // glowing scanline sweeps left → right (clip-path driven by scroll progress),
  // revealing the photoreal site image underneath.
  const imageBandRef = useRef<HTMLDivElement>(null);
  const scanReadoutRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageBandRef,
    offset: ['start 0.85', 'end 0.1'],
  });

  const scanPct = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const wireFrameClip = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(0 0 0 0%)', 'inset(0 0 0 100%)']
  );
  const scanlineX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const scanHudOpacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (scanReadoutRef.current) {
      scanReadoutRef.current.textContent = `${String(Math.round(latest * 100)).padStart(2, '0')}%`;
    }
  });

  const tabs = [
    {
      id: 'fabrication' as const,
      index: '01',
      label: 'Joint Assembly & Splice',
      url: OFFICIAL_ASSETS.section5ExecutionImg,
      title: 'High-Tolerance Structural Steel Joint Execution',
      short: 'High-Tolerance Joint Execution',
      desc: 'Live photograph from Deweg Engineering site assembly showing pre-drilled gusset plates, high-strength friction grip (HSFG) bolts, and precision cambered chord interfaces.',
      stats: [
        { label: 'Joint Geometry', value: 'Double Shear Splice' },
        { label: 'Bolt Specification', value: 'ASTM A325 / Grade 10.9' },
        { label: 'Tolerance Budget', value: '±1.5 mm across span' },
        { label: 'Non-Destructive Testing', value: '100% Ultrasonic Verified' }
      ]
    },
    {
      id: 'erection' as const,
      index: '02',
      label: 'Truss Crane Erection',
      url: OFFICIAL_ASSETS.mediaLibrary.craneErection,
      title: 'Long-Span Industrial Roof Truss Assembly',
      short: 'Long-Span Truss Crane Erection',
      desc: 'Heavy structural crane lift and field alignment for an industrial portal hall. Pre-engineered in Tekla Structures with temporary shoring calculations and rigging safety studies.',
      stats: [
        { label: 'Clear Span Width', value: '54 Metres' },
        { label: 'Assembly Method', value: 'Tandem Crane Lift' },
        { label: 'Steel Grade', value: 'E350 / S355' },
        { label: 'On-Site Rework', value: '0.00% Defect-Free' }
      ]
    }
  ];

  const current = tabs.find((t) => t.id === activeTab)!;

  return (
    <section
      id="field-execution"
      className="relative bg-transparent text-[#111111] py-24 md:py-28 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Intro: headline left, statement + tabs right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-10 text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
            >
              Section 05 · Field Execution &amp; Assembly
            </motion.p>

            <AnimatedHeading
              text="Field execution, measured in millimeters."
              className="font-sans font-medium text-[#111111] tracking-[-0.03em] leading-[1.1] text-[clamp(2.5rem,4vw,3.8rem)]"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[1.125rem] leading-[1.6] text-[#555555]"
            >
              On-site photographs, verified tolerances, and erection sequencing — documented live
              from Deweg's fabrication floors and assembly yards.
            </motion.p>

            {/* Mono underline tabs */}
            <div className="mt-10 flex gap-8 flex-wrap">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-[11px] font-mono uppercase tracking-[0.18em] border-b-2 transition-colors duration-300 cursor-pointer ${
                      isActive
                        ? 'text-[#111111] border-[#EDA81C]'
                        : 'text-[#8A8580] border-transparent hover:text-[#111111]'
                    }`}
                  >
                    {tab.index} — {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full-width field image band — cross-fades on tab switch */}
        <div className="mt-14 lg:mt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Parallax offset={24} className="w-full">
                <div
                  ref={imageBandRef}
                  className="relative aspect-[16/8] lg:aspect-[21/9] overflow-hidden rounded-[6px] bg-[#EBE9E1] border border-[#E2E0D8] cursor-pointer group"
                  onClick={() => setSelectedImage(current.url)}
                >
                  {/* Bottom layer: finished photoreal field image */}
                  <img
                    src={current.url}
                    alt={current.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top layer: blueprint wireframe version — clipped away as the
                      scanline sweeps left → right, revealing the photo beneath */}
                  <motion.div
                    className="absolute inset-0 z-[5] will-change-[clip-path]"
                    style={{ clipPath: wireFrameClip }}
                  >
                    <div className="absolute inset-0 bg-[#DDEBF0]">
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(13, 148, 136, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 148, 136, 0.35) 1px, transparent 1px)',
                          backgroundSize: '28px 28px',
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            'linear-gradient(rgba(13, 148, 136, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 148, 136, 0.4) 1px, transparent 1px)',
                          backgroundSize: '140px 140px',
                        }}
                      />
                    </div>
                    <img
                      src={current.url}
                      alt={`${current.title} — blueprint wireframe`}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                      style={{
                        filter: 'grayscale(1) invert(0.88) contrast(2.1) brightness(0.95) saturate(0.6)',
                      }}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>

                  {/* Glowing cyan/orange scanline at the reveal boundary */}
                  <motion.div
                    className="absolute top-0 bottom-0 z-10 pointer-events-none"
                    style={{ left: scanlineX }}
                  >
                    <div
                      className="relative h-full w-[2px] bg-gradient-to-b from-[#0D9488] via-white to-[#EDA81C]"
                      style={{
                        boxShadow:
                          '0 0 12px 2px rgba(13, 148, 136, 0.65), 0 0 28px 5px rgba(237, 168, 28, 0.45)',
                      }}
                    />
                  </motion.div>

                  {/* Scan HUD readout */}
                  <motion.div
                    style={{ opacity: scanHudOpacity }}
                    className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:block"
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#0D9488]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EDA81C] animate-pulse" />
                      <span>Scan</span>
                      <span ref={scanReadoutRef} className="text-[#111111]">
                        00%
                      </span>
                    </div>
                  </motion.div>

                  {/* Legibility wash + cutline */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 z-10 font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">
                    FIG 05.{current.index} — {current.short}
                  </div>

                  {/* Inspect trigger */}
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 z-10 px-3.5 py-2 rounded-[4px] bg-[#111111]/55 backdrop-blur-md border border-white/25 font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-[#EDA81C] hover:text-[#111111] hover:border-[#EDA81C] transition-colors duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(current.url);
                    }}
                  >
                    Inspect Full Resolution
                  </button>
                </div>
              </Parallax>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Field readout: title/desc + hairline metric strip */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <motion.h3
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#111111]"
            >
              {current.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 font-sans text-[15px] leading-[1.7] text-[#555555]"
            >
              {current.desc}
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-black/10"
            >
              {current.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`py-5 px-5 ${
                    idx > 0 ? 'border-t sm:border-t-0 border-black/10 sm:border-l' : ''
                  }`}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8580]">
                    {stat.label}
                  </div>
                  <div className="mt-2 font-sans text-[15px] font-medium tracking-[-0.01em] text-[#111111]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Field inspection lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[11000] bg-[#111111]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 p-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer"
              onClick={() => setSelectedImage(null)}
              aria-label="Close field inspection"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              src={selectedImage}
              alt="High resolution field inspection"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] max-w-[95vw] object-contain rounded-[4px] border border-white/15 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}