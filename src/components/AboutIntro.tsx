import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck, Award } from 'lucide-react';
import { COMPANY_DETAILS, CORE_PRINCIPLES, OFFICIAL_ASSETS } from '../data/engineeringData';
import { AnimatedHeading } from './AnimatedText';

interface AboutIntroProps {
  onViewAboutPage?: () => void;
  onViewExpertisePage?: () => void;
}

export default function AboutIntro({ onViewAboutPage, onViewExpertisePage }: AboutIntroProps) {
  return (
    <section
      id="about"
      className="relative bg-transparent text-[#0C0A09] py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Small label above with official Journey SVG icon from Wix */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <img
                src={OFFICIAL_ASSETS.domainIcons.journey}
                alt="Your Journey Starts Here Emblem"
                className="w-7 h-7 object-contain filter"
                loading="lazy"
              />
              <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#EDA81C]">
                SECTION 04 • TO DEFINE THE PATH
              </span>
            </motion.div>

            {/* Large editorial-style statement with text reveal animation */}
            <AnimatedHeading
              text="Grounded in how design information flows."
              highlightWord="flows."
              highlightClass="text-[#EDA81C]"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.18] text-[#0C0A09] font-bold tracking-tight"
            />

            {/* Core Practice Copy directly from deweg-engineering.com */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 space-y-4 text-base sm:text-lg text-[#292524] font-sans font-normal leading-[1.8] max-w-[65ch]"
            >
              <p className="font-semibold text-[#0C0A09]">
                {COMPANY_DETAILS.practiceStatement}
              </p>
              <p>
                From heavy industrial petrochemical modules to high-bay portal frames and aerodynamic high-rises, De Weg Engineering operates at the intersection of mathematical verification, buildability feedback loops, and strict statutory compliance.
              </p>
            </motion.div>

            {/* 5 Core Principles Grid with Glassmorphic styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 pt-8 border-t border-[#F0EBE1] grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {CORE_PRINCIPLES.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-4 rounded-2xl backdrop-blur-xl bg-white/80 border border-white/80 shadow-xs transition-shadow hover:shadow-md ${
                    idx === 4 ? 'sm:col-span-2 bg-white/90 border-white/90' : ''
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-[#FFF9ED] text-[#0C0A09] shrink-0 mt-0.5 border border-[#EDA81C]/40">
                    <span className="font-mono text-xs font-bold text-[#EDA81C]">{item.number}</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C0A09] flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EDA81C]" />
                    </h3>
                    <p className="text-xs text-[#292524] mt-1 leading-relaxed font-normal">{item.statement}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Regulatory Verification Details */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-[#0C0A09] font-sans font-medium"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#EDA81C]" />
                <span>CIN: {COMPANY_DETAILS.cin}</span>
              </div>
              <div className="flex items-center gap-4">
                {onViewAboutPage && (
                  <button
                    type="button"
                    onClick={onViewAboutPage}
                    className="inline-flex items-center gap-1.5 font-bold text-[#0C0A09] hover:text-[#EDA81C] transition-colors cursor-pointer"
                  >
                    <span>View Dedicated About Page</span>
                    <ArrowUpRight className="w-4 h-4 text-[#EDA81C]" />
                  </button>
                )}
                {onViewExpertisePage ? (
                  <button
                    type="button"
                    onClick={onViewExpertisePage}
                    className="inline-flex items-center gap-2 font-bold text-[#0C0A09] hover:text-[#EDA81C] transition-colors group cursor-pointer"
                  >
                    <span>Explore 7 Domains</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#EDA81C]" />
                  </button>
                ) : (
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 font-bold text-[#0C0A09] hover:text-[#EDA81C] transition-colors group"
                  >
                    <span>Explore Portfolio</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#EDA81C]" />
                  </a>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Column (5 cols) - Official Site Photography & Badges */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Vertical image container with authentic site execution photo from deweg-engineering.com */}
              <div className="relative rounded-3xl overflow-hidden bg-white/85 backdrop-blur-xl shadow-xl border border-white/80 p-3">
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src={OFFICIAL_ASSETS.section5ExecutionImg}
                    alt="Deweg Engineering on-site structural fabrication and erection execution"
                    className="w-full aspect-[4/5] object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle light architectural gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                  {/* Overlay Caption Banner with Glassmorphism */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/90 text-[#0C0A09] shadow-md">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-[#EDA81C] font-sans font-bold">
                        Site Erection &amp; Detailing
                      </p>
                      <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9ED] text-[#0C0A09]">
                        Field Verification
                      </span>
                    </div>
                    <p className="text-xs text-[#292524] mt-1 font-normal leading-relaxed">
                      Deweg field engineering team coordinating on-site structural steel erection, bolt torque calibration, and rebar schedules.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Quality Badge with Glassmorphism */}
              <div className="absolute -bottom-5 -right-3 bg-white/90 backdrop-blur-xl text-[#0C0A09] py-3.5 px-5 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 border border-white/90">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9ED] flex items-center justify-center text-[#EDA81C] shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-serif text-lg font-bold text-[#0C0A09]">ISO / Code Compliant</div>
                  <div className="text-[10px] tracking-widest uppercase text-[#EDA81C] font-bold">Engineering Rigor</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
