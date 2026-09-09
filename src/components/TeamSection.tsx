import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { TEAM_DATA } from '../data/engineeringData';
import { ABOUT_PAGE_ASSETS } from '../data/aboutData';
import { AnimatedHeading } from './AnimatedText';

interface TeamSectionProps {
  onViewAboutPage?: () => void;
}

export default function TeamSection({ onViewAboutPage }: TeamSectionProps) {
  return (
    <section
      id="team"
      className="relative bg-[#F6F5F0] text-[#111111] py-[90px] lg:py-[120px] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Eyebrow + single CTA aligned top-right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#8A8580]"
          >
            Our Leadership
          </motion.p>

          {onViewAboutPage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            >
              <button
                type="button"
                onClick={onViewAboutPage}
                className="group inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#111111] hover:text-[#EDA81C] transition-colors border-b border-[#111111] hover:border-[#EDA81C] py-2 cursor-pointer"
              >
                Explore Full Team Directory
                <ArrowRight className="w-4 h-4 text-[#EDA81C] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Top split: statement / studio photograph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col justify-center">
            <AnimatedHeading
              text="Built by engineering rigor. Driven by technical mastery."
              className="font-sans font-medium text-[#111111] tracking-[-0.03em] leading-[1.12] text-[clamp(1.9rem,3.2vw,2.8rem)]"
            />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-[520px] font-sans text-[1.125rem] leading-[1.6] text-[#555555]"
            >
              A multidisciplinary council in Chennai — licensed structural engineers, BIM managers,
              project heads, and computational specialists — stress-tests every calculation before
              it reaches fabrication.
            </motion.p>
          </div>

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-black/10 bg-[#EBE9E1]">
              <img
                src={ABOUT_PAGE_ASSETS.teamWorkplace}
                alt="De Weg Engineering technical council at work in the Chennai practice studio"
                className="w-full h-full object-cover grayscale-[0.45] contrast-[1.02]"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8580]">
                [ FIG. 02 — De Weg Practice Studio ]
              </span>
              <span className="hidden sm:block font-sans text-[13px] text-[#666666]">
                Chennai, India
              </span>
            </figcaption>
          </motion.figure>
        </div>

        {/* Swiss-style leadership roster */}
        <div className="mt-20 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-10">
          {TEAM_DATA.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group border-t border-black/10 pt-6 transition-colors duration-300 hover:border-t-[#111111]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#888888]">
                  {String(i + 1).padStart(2, '0')} / {member.role}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
              </div>
              <h3 className="mt-5 font-sans font-medium text-[22px] leading-snug tracking-[-0.01em] text-[#111111]">
                {member.name}
              </h3>
              <p className="mt-2 font-sans text-[14px] font-normal text-[#666666]">
                {member.credentials}
              </p>
              <p className="mt-4 font-sans text-[14px] font-normal leading-[1.5] text-[#555555] max-w-[300px]">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}