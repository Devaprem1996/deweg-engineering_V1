import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/engineeringData';

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto advance every 7 seconds if not hovered/paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const current = TESTIMONIALS_DATA[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  return (
    <section
      id="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-transparent text-[#0C0A09] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        {/* Large quotation mark icon in clean glassmorphic card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/80 bg-white/85 backdrop-blur-xl flex items-center justify-center text-[#EDA81C] mb-10 shadow-lg"
        >
          <Quote className="w-8 h-8 sm:w-9 sm:h-9 transform scale-x-[-1] fill-current opacity-90" />
        </motion.div>

        {/* Animated Testimonial Card in Glass Container */}
        <div className="w-full rounded-3xl backdrop-blur-xl bg-white/80 border border-white/80 p-8 sm:p-14 shadow-xl min-h-[260px] sm:min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Quote in high visibility serif */}
              <blockquote className="font-serif italic font-normal text-2xl sm:text-3xl md:text-4xl text-[#0C0A09] leading-[1.38] tracking-tight max-w-4xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Client name and company below */}
              <div className="mt-8 flex flex-col items-center gap-1.5">
                <p className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#0C0A09]">
                  {current.clientName}
                </p>
                <p className="text-xs tracking-[0.15em] uppercase text-[#EDA81C] font-sans font-bold">
                  {current.clientRole} • {current.company}
                </p>
                <span className="text-xs font-sans font-medium text-[#57534E] mt-0.5">
                  Project: {current.project}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel controls */}
        <div className="mt-10 flex items-center gap-6">
          <button
            type="button"
            onClick={handlePrev}
            className="p-3 rounded-full border border-white/80 bg-white/85 hover:border-[#EDA81C] text-[#292524] hover:text-[#0C0A09] transition-all shadow-sm cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS_DATA.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === i ? 'w-8 bg-[#EDA81C]' : 'w-2 bg-[#DDD6CC] hover:bg-[#A8A29E]'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-3 rounded-full border border-white/80 bg-white/85 hover:border-[#EDA81C] text-[#292524] hover:text-[#0C0A09] transition-all shadow-sm cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
