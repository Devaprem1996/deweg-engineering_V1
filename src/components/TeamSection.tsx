import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Users } from 'lucide-react';
import { TEAM_DATA } from '../data/engineeringData';
import { ABOUT_PAGE_ASSETS } from '../data/aboutData';
import { AnimatedHeading } from './AnimatedText';

interface TeamSectionProps {
  onViewAboutPage?: () => void;
}

export default function TeamSection({ onViewAboutPage }: TeamSectionProps) {
  const [showAllRoster, setShowAllRoster] = useState(false);

  return (
    <section
      id="team"
      className="relative bg-transparent text-[#0C0A09] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Team / Engineering office visual with Glassmorphism */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden bg-white/85 backdrop-blur-xl shadow-xl border border-white/80 p-3">
                <div className="relative aspect-[4/3] sm:aspect-[16/12] rounded-2xl overflow-hidden bg-stone-900 group">
                  <img
                    src={ABOUT_PAGE_ASSETS.teamOuting}
                    alt="Deweg Engineering team annual celebration and solidarity in Chennai"
                    className="w-full h-full object-cover filter contrast-[1.03] group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle warm architectural gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Site badge with Glassmorphism */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 text-[#0C0A09] shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#EDA81C] uppercase tracking-wider">
                          Deweg Team &amp; Technical Council
                        </p>
                        <p className="text-xs text-[#292524] mt-0.5 font-medium">
                          Meticulously cultivated league of structural experts, BIM managers, and project heads in Chennai.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Team Statement */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-6 h-[2px] bg-[#EDA81C]" />
              <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#EDA81C]">
                OUR LEADERSHIP
              </span>
            </motion.div>

            {/* Heading in Serif with Animated Text */}
            <AnimatedHeading
              text="Built by Experts, Driven by Innovation."
              highlightWord="Innovation."
              highlightClass="text-[#EDA81C] italic font-normal"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.15] text-[#0C0A09] font-bold tracking-tight"
            />

            {/* 2 Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 space-y-4 text-base sm:text-lg text-[#292524] font-sans font-normal leading-[1.8]"
            >
              <p>
                Our multidisciplinary practice in Chennai brings together licensed structural designers, BIM managers, and project management professionals with decades of combined engineering leadership. Every design calculation undergoes rigorous peer stress-testing.
              </p>
              <p>
                We collaborate seamlessly with lead architectural studios, industrial conglomerates, and general contractors to resolve constructability challenges before fabrication starts. With mastery over Tekla, Revit, STAAD, and FEA automation, our team guarantees structures that endure.
              </p>
            </motion.div>

            {/* Meet the Team -> Link / Toggle Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-5"
            >
              <button
                type="button"
                id="meet-the-team-btn"
                onClick={() => setShowAllRoster(!showAllRoster)}
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#0C0A09] hover:text-[#EDA81C] transition-colors border-b-2 border-[#0C0A09] pb-1 hover:border-[#EDA81C] cursor-pointer"
              >
                <span>{showAllRoster ? 'Close Directory ↑' : 'Quick Leadership Directory →'}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-[#EDA81C]" />
              </button>

              {onViewAboutPage && (
                <button
                  type="button"
                  onClick={onViewAboutPage}
                  className="px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/80 text-xs font-sans font-bold text-[#0C0A09] hover:bg-[#EDA81C] transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#EDA81C]" />
                  <span>Dedicated About Page</span>
                </button>
              )}
            </motion.div>

          </div>

        </div>

        {/* Expandable Leadership Roster */}
        <AnimatePresence>
          {showAllRoster && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="mt-14 pt-10 border-t border-[#F0EBE1] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#0C0A09] font-bold">Key Technical Leadership</h3>
                  <p className="text-xs font-sans text-[#292524] mt-1 font-medium">
                    Licensed structural consultants directing De Weg Engineering&apos;s core practices.
                  </p>
                </div>
                <button
                  onClick={() => setShowAllRoster(false)}
                  className="p-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/80 hover:bg-[#EDA81C] text-[#0C0A09] transition-colors cursor-pointer"
                  aria-label="Close roster"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEAM_DATA.map((member, i) => (
                  <div
                    key={member.name}
                    className="p-7 rounded-2xl backdrop-blur-xl bg-white/85 border border-white/80 flex flex-col justify-between hover:border-[#EDA81C]/60 transition-all duration-300 shadow-sm"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#FFF9ED] text-[#0C0A09] flex items-center justify-center font-serif text-sm font-bold mb-4 border border-[#EDA81C]/40">
                        <span className="text-[#EDA81C]">0{i + 1}</span>
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#0C0A09]">
                        {member.name}
                      </h4>
                      <p className="text-xs text-[#EDA81C] font-sans font-bold mt-1">
                        {member.role}
                      </p>
                      <p className="text-[11px] font-sans font-medium text-[#292524] mt-2 pb-3 border-b border-[#F0EBE1]">
                        {member.credentials}
                      </p>
                      <p className="text-xs text-[#292524] font-sans font-normal mt-3 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#F0EBE1] text-[10px] uppercase tracking-wider text-[#EDA81C] font-sans font-bold">
                      Specialty: {member.specialty}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
