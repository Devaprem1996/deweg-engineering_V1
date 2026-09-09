import { useState, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { OFFICIAL_ASSETS, CORE_PRINCIPLES } from '../data/engineeringData';
import { Parallax } from './AnimatedText';

const GALLERY = [
  OFFICIAL_ASSETS.referenceVideos.sdePoster,
  OFFICIAL_ASSETS.section1DrawingImg,
  OFFICIAL_ASSETS.referenceVideos.bimClashPoster,
  OFFICIAL_ASSETS.mediaLibrary.blueprintDetail,
  OFFICIAL_ASSETS.structuralErectionImg
];

const LIST_DATA = CORE_PRINCIPLES.map((principle, i) => ({
  number: principle.number,
  title: principle.title,
  statement: principle.statement,
  src: GALLERY[i],
  alt: `Deweg Engineering — ${principle.title} visual`
}));

const HEADLINE = 'Grounded in information flows.';
const LEAD_PARAGRAPH =
  'From first intent to issued execution output—every project begins with problem framing, passes through collaborative detailing, and ends in auditable, construction-ready documentation.';

export default function AboutIntro() {
  const [active, setActive] = useState(0);

  const handleHover = (index: number) => (_e: MouseEvent<HTMLButtonElement>) => setActive(index);
  const handleLeave = () => setActive(0);

  return (
    <section
      id="about"
      className="relative bg-[#F5F4EE] text-[#111111] py-24 md:py-28 lg:py-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* Left Column (cols 1–6): headline + body + editorial list */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-10 text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
            >
              Section 04 · To Define The Path
            </motion.p>

            {/* Short editorial headline — medium weight, tight, no highlight */}
            <h2
              aria-label={HEADLINE}
              className="font-sans font-medium text-[#111111] leading-[1.1] tracking-[-0.03em] text-[clamp(2.5rem,4vw,3.8rem)]"
            >
              {HEADLINE.split(' ').map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </h2>

            {/* Body paragraph — lighter, below the headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 mb-12 max-w-[520px] font-sans font-normal text-[1.125rem] leading-[1.6] text-[#555555]"
            >
              {LEAD_PARAGRAPH}
            </motion.p>

            {/* Swiss editorial list 01–05 */}
            <div className="border-t border-black/10">
              {LIST_DATA.map((item, i) => {
                const isActive = active === i;
                return (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      onMouseEnter={handleHover(i)}
                      onMouseLeave={handleLeave}
                      aria-label={`View ${item.title}`}
                      className="group w-full text-left cursor-pointer border-b border-black/10 outline-none"
                    >
                      <span
                          className={`flex items-start gap-6 py-5 transition-transform duration-300 ease-out ${
                            isActive ? 'translate-x-2' : 'group-hover:translate-x-2'
                          }`}
                        >
                        <span
                          className={`font-mono text-[13px] tracking-[0.15em] pt-0.5 transition-colors duration-300 ${
                            isActive ? 'text-[#111111]' : 'text-[#888888] group-hover:text-[#111111]'
                          }`}
                        >
                          {isActive ? <span className="select-none">•&nbsp;&nbsp;</span> : null}
                          {item.number}
                        </span>
                        <span className="flex flex-col gap-1">
                          <span className="font-sans text-[16px] font-bold leading-snug tracking-[-0.01em] text-[#111111]">
                            {item.title}
                          </span>
                          <span className="font-sans text-[14px] font-normal leading-[1.4] text-[#666666]">
                            {item.statement}
                          </span>
                        </span>
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column (cols 7–12): museum architectural frame, cross-fades on hover */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <Parallax offset={16} className="w-full">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#EBE9E1] border border-[#E2E0D8] pointer-events-none">
                  {LIST_DATA.map((item, i) => (
                    <motion.div
                      key={item.number}
                      initial={false}
                      animate={{
                        opacity: active === i ? 1 : 0,
                        scale: active === i ? 1 : 1.02
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover object-center"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ))}

                  {/* Tag pinned bottom-right */}
                  <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1.5 rounded-[4px] bg-white/55 backdrop-blur-md border border-white/60 text-[11px] font-mono uppercase tracking-[0.1em] text-[#666666]">
                    [ {String(active + 1).padStart(2, '0')} — {LIST_DATA[active].title} ]
                  </div>
                </div>
              </Parallax>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}