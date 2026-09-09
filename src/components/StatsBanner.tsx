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
    <span
      ref={ref}
      className="font-sans font-medium tabular-nums tracking-[-0.03em] leading-[1] text-[#111111] text-[clamp(2.75rem,4.5vw,4rem)]"
    >
      {count}
      <span className="text-[#EDA81C] text-[0.55em] font-normal align-super">{suffix}</span>
    </span>
  );
}

export default function StatsBanner() {
  return (
    <section
      id="stats-banner"
      className="relative bg-transparent text-[#111111] py-16 sm:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section tag */}
        <div className="flex items-center justify-center gap-5 mb-12 text-center">
          <span className="w-10 h-[2px] bg-[#E5E3DC]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]">
            PROVEN TRACK RECORD · NUMERICAL INTEGRITY
          </span>
          <span className="w-10 h-[2px] bg-[#E5E3DC]" />
        </div>

        {/* Open hairline strip of counters */}
        <div className="border-t border-b border-black/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-black/10 sm:divide-y-0 sm:divide-x">
            {STATS_DATA.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center justify-center text-center py-10 lg:py-14 px-6"
              >
                <AnimatedCounter value={item.value} suffix={item.suffix} />
                <div className="w-7 h-[2px] bg-[#EDA81C] mt-4" />
                <h3 className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111]">
                  {item.label}
                </h3>
                <p className="mt-2 font-sans text-[11px] font-normal leading-relaxed text-[#8A8580] max-w-[210px]">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}