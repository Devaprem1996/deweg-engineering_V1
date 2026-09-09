import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [stage, setStage] = useState<'visible' | 'exit' | 'done'>('visible');

  useEffect(() => {
    // Stage 1: Display DE WEG text
    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 1400);

    // Stage 2: Slide up complete
    const doneTimer = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          animate={{ y: stage === 'exit' ? '-100%' : 0 }}
          transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#F5F0E8] text-[#1C1917] select-none"
        >
          {/* Subtle architectural grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#1C1917 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-3"
            >
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#1C1917]">
                DE WEG
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-[#EDA81C] mb-3" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-4 flex items-center gap-3 text-xs tracking-[0.35em] text-[#78716C] uppercase font-sans font-medium"
            >
              <span>Engineering</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#EDA81C]" />
              <span>To Define The Path</span>
            </motion.div>

            {/* Minimal progress hairline */}
            <motion.div
              className="mt-10 h-[2px] bg-[#E2DACF] w-48 overflow-hidden rounded-full"
            >
              <motion.div
                className="h-full bg-[#EDA81C]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
    </AnimatePresence>
  );
}
