import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/engineeringData';
import { ContactFormData } from '../types';
import { AnimatedHeading } from './AnimatedText';

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate real submission
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

  return (
    <section
      id="contact"
      className="relative bg-transparent text-[#0C0A09] py-20 md:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[2px] bg-[#EDA81C]" />
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-bold text-[#EDA81C]">
              COMMENCE ENGAGEMENT
            </span>
          </div>

          <AnimatedHeading
            text={COMPANY_DETAILS.journeyText}
            highlightWord="Journey"
            highlightClass="text-[#EDA81C]"
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0C0A09] font-bold tracking-tight leading-[1.12]"
          />

          <p className="mt-5 text-base sm:text-lg text-[#292524] font-sans font-normal leading-relaxed">
            Whether you require peer review validation, heavy industrial Tekla steel detailing, or turnkey PMC oversight, our directors and chartered consultants are ready to review your parameters.
          </p>
        </div>

        {/* 2-Column Layout: Form & Detailed Contact Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Glassmorphic Contact Form (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 p-8 sm:p-12 shadow-xl">
            
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF9ED] text-[#EDA81C] flex items-center justify-center mb-6 border border-[#EDA81C]/40">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#0C0A09] font-bold">
                    Project Ingestion Initiated
                  </h3>
                  <p className="mt-3 text-sm text-[#292524] font-sans max-w-md leading-relaxed">
                    Thank you. Your project brief has been assigned to our structural design team in Chennai. A senior partner will review your specifications and follow up within 24 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 px-7 py-3 text-xs uppercase tracking-widest bg-[#EDA81C] text-[#0C0A09] font-bold rounded-xl hover:bg-[#D49110] transition-colors shadow-sm cursor-pointer"
                  >
                    Submit Another Brief
                  </button>
                </motion.div>
              ) : (
                <form key="contact-form" onSubmit={handleSubmit} className="space-y-7">
                  
                  {/* Name Input */}
                  <div className="relative">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#0C0A09] mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      placeholder="e.g. Julian Sterling"
                      value={formData.name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3.5 rounded-xl bg-white/90 border text-sm text-[#0C0A09] placeholder:text-[#A8A29E] font-sans transition-all focus:outline-none ${
                        focusedField === 'name'
                          ? 'border-[#EDA81C] ring-2 ring-[#EDA81C]/20 shadow-xs'
                          : 'border-[#E7E1D8] hover:border-[#D6CEC2]'
                      }`}
                    />
                  </div>

                  {/* Two-Column: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <label
                        htmlFor="contact-email"
                        className="block text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#0C0A09] mb-2"
                      >
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        placeholder="julian@enterprise.com"
                        value={formData.email}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white/90 border text-sm text-[#0C0A09] placeholder:text-[#A8A29E] font-sans transition-all focus:outline-none ${
                          focusedField === 'email'
                            ? 'border-[#EDA81C] ring-2 ring-[#EDA81C]/20 shadow-xs'
                            : 'border-[#E7E1D8] hover:border-[#D6CEC2]'
                        }`}
                      />
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#0C0A09] mb-2"
                      >
                        Telephone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        placeholder="+91 98408 55422"
                        value={formData.phone}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white/90 border text-sm text-[#0C0A09] placeholder:text-[#A8A29E] font-sans transition-all focus:outline-none ${
                          focusedField === 'phone'
                            ? 'border-[#EDA81C] ring-2 ring-[#EDA81C]/20 shadow-xs'
                            : 'border-[#E7E1D8] hover:border-[#D6CEC2]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Project Discipline Selection */}
                  <div>
                    <label
                      htmlFor="contact-project-type"
                      className="block text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#0C0A09] mb-2"
                    >
                      Primary Engineering Discipline *
                    </label>
                    <select
                      id="contact-project-type"
                      value={formData.projectType}
                      onFocus={() => setFocusedField('type')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className={`w-full px-4 py-3.5 rounded-xl bg-white/90 border text-sm text-[#0C0A09] font-sans transition-all focus:outline-none cursor-pointer ${
                        focusedField === 'type'
                          ? 'border-[#EDA81C] ring-2 ring-[#EDA81C]/20 shadow-xs'
                          : 'border-[#E7E1D8] hover:border-[#D6CEC2]'
                      }`}
                    >
                      {projectTypes.map((type) => (
                        <option key={type} value={type} className="text-[#0C0A09] py-1">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Parameters Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#0C0A09] mb-2"
                    >
                      Project Specifications &amp; Scope *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Outline site location, building archetype, structural tonnage estimate, codes required (e.g. IS / AISC), target schedule, and file attachments..."
                      value={formData.message}
                      onFocus={() => setFocusedField('msg')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3.5 rounded-xl bg-white/90 border text-sm text-[#0C0A09] placeholder:text-[#A8A29E] font-sans transition-all focus:outline-none resize-none ${
                        focusedField === 'msg'
                          ? 'border-[#EDA81C] ring-2 ring-[#EDA81C]/20 shadow-xs'
                          : 'border-[#E7E1D8] hover:border-[#D6CEC2]'
                      }`}
                    />
                  </div>

                  {/* Submission Button & Disclaimer */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#EDA81C] text-[#0C0A09] font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#D49110] transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Transmitting Specs...' : 'Dispatch Project Dossier'}</span>
                      <Send className="w-4 h-4 text-[#0C0A09]" />
                    </button>

                    <p className="text-[11px] text-[#78716C] font-sans flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#EDA81C]" />
                      Confidentiality &amp; NDA protocols strictly maintained.
                    </p>
                  </div>

                </form>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Contact Details + Cartography (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details Card with Glassmorphism */}
            <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                <h3 className="font-serif text-2xl text-[#0C0A09] font-bold">Registered Office</h3>
                <span className="text-xs font-sans font-bold px-3 py-1 rounded-full bg-[#FFF9ED] text-[#EDA81C] border border-[#EDA81C]/30">
                  Chennai HQ
                </span>
              </div>

              <div className="space-y-5 text-sm text-[#292524] font-sans">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#EDA81C] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0C0A09]">Office Address</p>
                    <p className="text-xs text-[#292524] mt-0.5 leading-relaxed font-normal">
                      {COMPANY_DETAILS.address}
                    </p>
                    <p className="text-[11px] font-sans font-medium text-[#EDA81C] mt-1.5">
                      CIN: {COMPANY_DETAILS.cin}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#EDA81C] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0C0A09]">Telephone &amp; Mobile</p>
                    <p className="text-xs text-[#292524] mt-0.5">
                      Main Desk: <a href={`tel:${COMPANY_DETAILS.phone}`} className="hover:text-[#EDA81C] font-semibold">{COMPANY_DETAILS.phone}</a>
                    </p>
                    <p className="text-xs text-[#292524] mt-0.5">
                      Direct Mobile: <a href={`tel:${COMPANY_DETAILS.mobile}`} className="hover:text-[#EDA81C] font-semibold">{COMPANY_DETAILS.mobile}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#EDA81C] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0C0A09]">Electronic Communications</p>
                    <p className="text-xs text-[#292524] mt-0.5">
                      Consulting: <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-[#EDA81C] font-semibold">{COMPANY_DETAILS.email}</a>
                    </p>
                    <p className="text-xs text-[#292524] mt-0.5">
                      Careers: <a href={`mailto:${COMPANY_DETAILS.careersEmail}`} className="hover:text-[#EDA81C] font-semibold">{COMPANY_DETAILS.careersEmail}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#EDA81C] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0C0A09]">Operating Hours</p>
                    <p className="text-xs text-[#292524] mt-0.5 leading-relaxed font-normal">
                      {COMPANY_DETAILS.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Architectural Map Placeholder */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden backdrop-blur-xl bg-white/80 border border-white/80 shadow-xl group">
              {/* Light SVG stylized architectural cartography */}
              <div className="absolute inset-0 opacity-90">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="light-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#E5DFD4" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="#FBF9F5" />
                  <rect width="100%" height="100%" fill="url(#light-grid)" />
                  {/* Stylized arterial roads */}
                  <path d="M -20 80 Q 150 120 300 90 T 600 130" stroke="#E7E1D8" strokeWidth="6" fill="none" />
                  <path d="M 120 -20 Q 180 140 220 300" stroke="#E7E1D8" strokeWidth="8" fill="none" />
                  <path d="M 80 260 L 400 60" stroke="#EDA81C" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.6" />
                </svg>
              </div>

              {/* Pinpoint & Location Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-[#EDA81C] animate-ping opacity-60 absolute" />
                  <div className="w-4 h-4 rounded-full bg-[#EDA81C] border-2 border-white relative z-10 shadow-md" />
                </div>
                <div className="mt-2.5 px-4 py-1.5 bg-white/95 rounded-xl border border-white/80 text-xs font-sans font-bold text-[#0C0A09] shadow-md whitespace-nowrap">
                  Deweg Engineering • Chennai HQ
                </div>
              </div>

              {/* Map Footer Overlay with Glassmorphism */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-sans font-medium text-[#292524] bg-white/90 px-4 py-2 rounded-xl backdrop-blur-md border border-white/80">
                <span>12.9479° N, 80.1563° E</span>
                <span className="text-[#EDA81C] font-bold">Chitlapakkam / Chennai</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
