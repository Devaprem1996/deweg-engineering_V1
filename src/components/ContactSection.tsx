import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/engineeringData';
import { ContactFormData } from '../types';

const MUTED = '#8A877E';
const INK = '#141412';
const ACCENT = '#C98A2D';
const EASE = [0.16, 1, 0.3, 1] as const;

const correspondence = [
  {
    index: '01',
    title: 'Registered Office',
    lines: [COMPANY_DETAILS.address],
    meta: `CIN ${COMPANY_DETAILS.cin}`
  },
  {
    index: '02',
    title: 'Telephone',
    links: [
      { href: `tel:${COMPANY_DETAILS.phone}`, label: COMPANY_DETAILS.phone },
      { href: `tel:${COMPANY_DETAILS.mobile}`, label: COMPANY_DETAILS.mobile }
    ]
  },
  {
    index: '03',
    title: 'Electronic',
    links: [
      { href: `mailto:${COMPANY_DETAILS.email}`, label: COMPANY_DETAILS.email },
      { href: `mailto:${COMPANY_DETAILS.careersEmail}`, label: COMPANY_DETAILS.careersEmail }
    ]
  },
  {
    index: '04',
    title: 'Operating Hours',
    lines: [COMPANY_DETAILS.workingHours]
  }
];

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  focused: boolean;
  children: React.ReactNode;
}

const EASE_DC = { duration: 0.3, ease: EASE };

function FieldShell({ id, label, required, focused, children }: FieldShellProps) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`block text-[11px] font-mono uppercase tracking-[0.12em] transition-colors duration-300 mb-1 ${
          focused ? 'text-[#141412]' : 'text-[#8A877E]'
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#C98A2D]">*</span>}
      </label>
      <div className="relative">
        {children}
        {/* Accent underline draws in on focus */}
        <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px]">
          <motion.span
            className="block h-full w-full origin-left bg-[#C98A2D]"
            initial={false}
            animate={{ scaleX: focused ? 1 : 0 }}
            transition={EASE_DC}
          />
        </span>
      </div>
    </div>
  );
}

const fieldClass =
  'w-full bg-transparent border-b border-[#D9D6CC] focus:border-[#141412] outline-none px-0 py-3.5 text-[1.05rem] text-[#141412] placeholder:text-[#B0ACA2] transition-colors duration-300';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: 'Structural Design & Detailed Engineering (SDE)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Transient success state — button eases to accent for 2s, then resets
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => setIsSuccess(false), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: 'Structural Design & Detailed Engineering (SDE)',
        message: ''
      });
    }, 800);
  };

  const projectTypes = [
    'Project Management and Controlling (PMC)',
    'Structural Design & Detailed Engineering (SDE)',
    'Building Information Modelling (BIM Solutions)',
    'Structural Steel Modelling & Detailing (SME / Tekla)',
    'Oil & Gas Structural Engineering (OGE)',
    'MEP Design & Detailed Engineering (MEP)',
    'Information Technology Solutions (IT Automation)'
  ];

  const headline = 'Commence engagement.'.split(' ');
  const fieldIdx = (n: number) => 0.15 + n * 0.05;

  return (
    <section
      id="contact"
      className="relative bg-[#F1EFE9] text-[#141412] py-[100px] lg:py-[140px] overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-[6vw] lg:px-[7vw]">
        {/* Eyebrow with drawing rule */}
        <div className="flex items-center gap-5 mb-16 origin-left">
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="block h-px w-10 bg-[#E0DDD3] shrink-0"
          />
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8A877E]"
          >
            06 / Commence Engagement
          </motion.span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left column (span 5): headline + intro + correspondence */}
          <div className="lg:col-span-5">
            <h2
              aria-label="Commence engagement."
              className="font-sans font-medium text-[#141412] leading-[1.05] tracking-[-0.03em] text-[clamp(2.6rem,4.5vw,4.2rem)]"
            >
              {headline.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block overflow-hidden align-top">
                  <motion.span
                    initial={{ y: '100%', opacity: 0 }}
                    whileInView={{ y: '0%', opacity: 1 }}
                    viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                </span>
              ))}
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="mt-6 max-w-[440px] font-sans text-[1.05rem] leading-[1.6] text-[#5C5A53]"
            >
              Peer review validation, heavy industrial Tekla steel detailing, or turnkey PMC
              oversight — our directors and chartered consultants are ready to review your
              parameters.
            </motion.p>

            {/* Correspondence list */}
            <div className="mt-10">
              {correspondence.map((block, i) => (
                <motion.div
                  key={block.index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                  className="border-t border-[#E0DDD3] py-5 first:hover:border-[#C98A2D]"
                >
                  <p className="font-mono text-[11px] tracking-[0.1em] text-[#A8A49B]">
                    {block.index}
                  </p>
                  <h3 className="mt-1 font-sans text-[0.95rem] font-medium text-[#141412]">
                    {block.title}
                  </h3>
                  <div className="mt-1 font-sans text-[0.95rem] font-normal text-[#5C5A53] leading-[1.6]">
                    {block.links
                      ? block.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            className="relative inline-flex items-start text-[#141412] overflow-hidden transition-colors duration-300 hover:text-[#C98A2D]"
                          >
                            <span className="relative after:absolute after:left-0 after:bottom-[1px] after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#C98A2D] after:transition-transform after:duration-300 hover:after:scale-x-100">
                              {link.label}
                            </span>
                          </a>
                        ))
                      : block.lines?.map((line) => <p key={line}>{line}</p>)}
                    {block.meta && (
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#A8A49B]">
                        {block.meta}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column (span 6, offset 1): underline-only form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              {/* Full name */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                transition={{ duration: 0.6, delay: fieldIdx(0), ease: EASE }}
              >
                <FieldShell
                  id="contact-name"
                  label="Full Name"
                  required
                  focused={focusedField === 'name'}
                >
                  <input
                    type="text"
                    id="contact-name"
                    required
                    placeholder="e.g. Julian Sterling"
                    value={formData.name}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={fieldClass}
                  />
                </FieldShell>
              </motion.div>

              {/* Email + phone */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                transition={{ duration: 0.6, delay: fieldIdx(1), ease: EASE }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              >
                <FieldShell
                  id="contact-email"
                  label="Corporate Email"
                  required
                  focused={focusedField === 'email'}
                >
                  <input
                    type="email"
                    id="contact-email"
                    required
                    placeholder="julian@enterprise.com"
                    value={formData.email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={fieldClass}
                  />
                </FieldShell>
                <FieldShell
                  id="contact-phone"
                  label="Telephone / WhatsApp"
                  focused={focusedField === 'phone'}
                >
                  <input
                    type="tel"
                    id="contact-phone"
                    placeholder="+91 98408 55422"
                    value={formData.phone}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={fieldClass}
                  />
                </FieldShell>
              </motion.div>

              {/* Discipline select */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                transition={{ duration: 0.6, delay: fieldIdx(2), ease: EASE }}
              >
                <FieldShell
                  id="contact-project-type"
                  label="Primary Engineering Discipline"
                  required
                  focused={focusedField === 'type'}
                >
                  <div className="relative">
                    <select
                      id="contact-project-type"
                      value={formData.projectType}
                      onFocus={() => setFocusedField('type')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className={`${fieldClass} appearance-none pr-6 cursor-pointer`}
                    >
                      {projectTypes.map((type) => (
                        <option key={type} value={type} className="bg-white text-[#141412] py-1">
                          {type}
                        </option>
                      ))}
                    </select>
                    {/* Thin 1px line chevron */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 top-1/2 -translate-y-[70%] flex flex-col items-center gap-[3px]"
                    >
                      <span className="block w-[7px] h-[7px] -rotate-45 border-b border-r border-[#141412]" />
                      <span className="block w-[7px] h-[7px] -rotate-45 border-b border-r border-[#141412]" />
                    </span>
                  </div>
                </FieldShell>
              </motion.div>

              {/* Scope textarea */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                transition={{ duration: 0.6, delay: fieldIdx(3), ease: EASE }}
              >
                <FieldShell
                  id="contact-message"
                  label="Project Specifications & Scope"
                  required
                  focused={focusedField === 'msg'}
                >
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Outline site location, building archetype, structural tonnage estimate, codes required (e.g. IS / AISC), target schedule, and file attachments..."
                    value={formData.message}
                    onFocus={() => setFocusedField('msg')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${fieldClass} min-h-[120px] resize-none leading-[1.6]`}
                  />
                </FieldShell>
              </motion.div>

              {/* CTA + NDA — NDA on its own line, below the button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                transition={{ duration: 0.6, delay: fieldIdx(4), ease: EASE }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group inline-flex items-center justify-center gap-3 px-9 py-5 rounded-[2px] text-[11px] font-mono uppercase tracking-[0.14em] transition-colors duration-500 cursor-pointer disabled:opacity-60 ${
                    isSuccess ? 'bg-[#C98A2D] text-[#F6F5F0]' : 'bg-[#141412] text-[#F6F5F0]'
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isSuccess ? (
                      <motion.span
                        key="ok"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="inline-flex items-center gap-2.5 whitespace-nowrap"
                      >
                        <Check className="w-4 h-4" />
                        Dossier Dispatched — We Respond Within 24h
                      </motion.span>
                    ) : (
                      <motion.span
                        key="dispatch"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="inline-flex items-center gap-2.5 whitespace-nowrap"
                      >
                        <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Project Dossier'}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[6px]" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <p className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                  <Lock className="w-3 h-3" />
                  NDA &amp; confidentiality protocols enforced.
                </p>
              </motion.div>
            </form>
          </div>
        </div>

        {/* Bottom full-width strip: light printed site plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative h-[300px] lg:h-[320px] mt-20 overflow-hidden rounded-[2px] border border-[#E0DDD3] bg-[#EFEEE8]"
        >
          {/* Faint technical grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(20,20,18,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,18,0.8) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          {/* Printed site plan linework */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M -20 60 Q 140 90 300 70 T 700 110 T 1200 90" stroke="#D9D6CC" strokeWidth="1" fill="none" />
            <path d="M 80 -20 Q 140 160 200 340" stroke="#D9D6CC" strokeWidth="1" fill="none" />
            <path d="M 350 320 L 980 -10" stroke="#E0DDD3" strokeWidth="1" fill="none" />
            <path d="M 60 200 L 600 40" stroke="#C98A2D" strokeWidth="1" strokeDasharray="6 6" fill="none" opacity="0.7" />
          </svg>

          {/* Pin + pulse ring */}
          <div className="absolute top-1/2 left-[52%] -translate-x-1/2 -translate-y-1/2">
            {!reducedMotion && (
              <motion.span
                className="absolute inset-0 -m-3 rounded-full border border-[#C98A2D]"
                initial={{ opacity: 0.4, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span className="relative block w-3 h-3 rounded-full bg-[#141412]" />
          </div>

          {/* Caption */}
          <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
            [ Registered Office — Chengalpattu, Tamil Nadu ]
          </div>
        </motion.div>
      </div>
    </section>
  );
}