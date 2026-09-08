import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { STATS_DATA } from '../data/engineeringData';

interface CounterProps {
  value: number;
  suffix: string;
}

function AnimatedCounter({ value, suffix }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // EaseOutQuart curve for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOut * end);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-serif font-bold tabular-nums text-4xl sm:text-6xl lg:text-7xl text-[#0C0A09] tracking-tight">
      {count}
      <span className="text-[#EDA81C] text-3xl sm:text-5xl lg:text-6xl ml-0.5 font-normal">{suffix}</span>
    </span>
  );
}

export default function StatsBanner() {
  return (
    <section
      id="stats-banner"
      className="relative bg-transparent text-[#0C0A09] py-16 sm:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Tag */}
        <div className="flex items-center justify-center gap-3 mb-10 text-center">
          <span className="w-8 h-[2px] bg-[#EDA81C]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#EDA81C] font-sans font-bold">
            PROVEN TRACK RECORD • NUMERICAL INTEGRITY
          </span>
          <span className="w-8 h-[2px] bg-[#EDA81C]" />
        </div>

        {/* 4 Animated Counters in Glassmorphic Container */}
        <div className="rounded-3xl backdrop-blur-xl bg-white/80 border border-white/90 p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {STATS_DATA.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="relative flex flex-col items-center text-center p-2 sm:p-4"
              >
                {/* Counter Display */}
                <div className="mb-3">
                  <AnimatedCounter value={item.value} suffix={item.suffix} />
                </div>

                {/* Stat Label */}
                <h3 className="font-sans text-xs sm:text-sm font-bold text-[#0C0A09] uppercase tracking-[0.15em]">
                  {item.label}
                </h3>

                {/* Explanatory subtitle */}
                <p className="mt-2 text-xs text-[#292524] font-sans font-medium leading-relaxed max-w-[220px]">
                  {item.detail}
                </p>

                {/* Subtle divider between cols on desktop */}
                {idx < STATS_DATA.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-16 bg-[#F0EBE1]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
