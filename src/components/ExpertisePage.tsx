import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Layers,
  Box,
  Flame,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ZoomIn,
  X,
  ChevronRight,
  ShieldCheck,
  Cpu,
  FileText,
  BarChart3,
  SlidersHorizontal,
  ArrowLeft,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  EXPERTISE_DOMAINS,
  EXPERTISE_HERO_ASSET,
  ExpertiseDomain,
  ExpertiseDomainAsset
} from '../data/expertiseData';
import { COMPANY_DETAILS } from '../data/engineeringData';

interface ExpertisePageProps {
  onNavigateHome: () => void;
  onNavigateToContact: (discipline?: string) => void;
  initialDomainId?: string;
}

export default function ExpertisePage({
  onNavigateHome,
  onNavigateToContact,
  initialDomainId
}: ExpertisePageProps) {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>(
    initialDomainId || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAssetModal, setActiveAssetModal] = useState<{
    asset: ExpertiseDomainAsset;
    domainTitle: string;
    domainCode: string;
  } | null>(null);

  // Icon selector per domain
  const getDomainIcon = (code: string) => {
    switch (code) {
      case 'PM-CTRL':
        return <BarChart3 className="w-5 h-5 text-[#EDA81C]" />;
      case 'STR-ENG':
        return <Compass className="w-5 h-5 text-[#EDA81C]" />;
      case 'BIM-LOD':
        return <Layers className="w-5 h-5 text-[#EDA81C]" />;
      case 'STL-DET':
        return <Box className="w-5 h-5 text-[#EDA81C]" />;
      case 'O&G-OFF':
        return <Flame className="w-5 h-5 text-[#EDA81C]" />;
      case 'MEP-ENG':
        return <Zap className="w-5 h-5 text-[#EDA81C]" />;
      case 'IT-AUTO':
        return <Cpu className="w-5 h-5 text-[#EDA81C]" />;
      default:
        return <Compass className="w-5 h-5 text-[#EDA81C]" />;
    }
  };

  const filteredDomains = useMemo(() => {
    return EXPERTISE_DOMAINS.filter((domain) => {
      const matchesCategory =
        selectedDomainFilter === 'all' || domain.id === selectedDomainFilter;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = domain.title.toLowerCase().includes(q);
      const matchSummary = domain.summary.toLowerCase().includes(q);
      const matchPillars = domain.keyPillars.some((p) =>
        p.toLowerCase().includes(q)
      );
      const matchDeliverables = domain.deliverables.some((d) =>
        d.toLowerCase().includes(q)
      );
      const matchSoftware = domain.softwareStack.some((s) =>
        s.toLowerCase().includes(q)
      );
      const matchStandards = domain.standards.some((s) =>
        s.toLowerCase().includes(q)
      );

      return (
        matchTitle ||
        matchSummary ||
        matchPillars ||
        matchDeliverables ||
        matchSoftware ||
        matchStandards
      );
    });
  }, [selectedDomainFilter, searchQuery]);

  return (
    <div id="expertise-page" className="min-h-screen bg-transparent text-[#0C0A09] pt-24 pb-20">
      {/* Top Breadcrumb Header Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#57534E]">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#EDA81C] transition-colors inline-flex items-center gap-1 cursor-pointer font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>DEWEG Engineering</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
            <span className="text-[#0C0A09] font-bold">Domain We Expertise</span>
            <span className="text-[#EDA81C] bg-[#EDA81C]/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              REFERENCE PORTFOLIO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-sans font-medium text-[#57534E] hidden sm:inline">
              CIN: {COMPANY_DETAILS.cin}
            </span>
            <button
              type="button"
              onClick={() => onNavigateToContact()}
              className="px-4 py-2 rounded-xl bg-[#0C0A09] text-white hover:bg-[#EDA81C] transition-all text-xs font-sans font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Consult an Engineer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5DC] text-[#EDA81C] text-xs font-sans font-bold uppercase tracking-widest mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Official Practice Reference</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0C0A09] font-bold leading-[1.1] tracking-tight">
              Domain We Expertise
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-[#292524] font-normal leading-relaxed max-w-2xl">
              From concept to construction-level reality. Detailed engineering,
              high-fidelity BIM coordination, structural analysis, offshore
              platforms, and proprietary IT automations engineered for zero field rework.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 px-6 rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)]">
              <div>
                <span className="block text-2xl font-serif font-bold text-[#0C0A09]">7</span>
                <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#57534E]">
                  Core Disciplines
                </span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#0C0A09]">LOD 500</span>
                <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#57534E]">
                  BIM Precision
                </span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#0C0A09]">100%</span>
                <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#57534E]">
                  Code Compliant
                </span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-[#0C0A09]">ISO</span>
                <span className="text-[11px] font-sans uppercase font-bold tracking-wider text-[#57534E]">
                  Certified QA
                </span>
              </div>
            </div>
          </div>

          {/* Hero Banner Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/80 backdrop-blur-xl bg-white/85 shadow-[0_12px_40px_rgb(0,0,0,0.04)] group">
              <img
                src={EXPERTISE_HERO_ASSET.url}
                alt={EXPERTISE_HERO_ASSET.alt}
                className="w-full h-80 sm:h-96 object-cover filter contrast-[1.04] group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 text-[#0C0A09] shadow-md">
                <p className="text-xs font-sans uppercase tracking-wider text-[#EDA81C] font-bold">
                  DEWEG Reference Portfolio
                </p>
                <p className="text-xs text-[#292524] mt-0.5 line-clamp-1 font-medium">
                  Verified CAD drawings, 3D structural skeletons, and live field simulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar with Glassmorphism */}
      <section className="sticky top-[69px] z-30 backdrop-blur-xl bg-white/85 border-y border-white/80 py-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDomainFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedDomainFilter === 'all'
                  ? 'bg-[#EDA81C] text-white shadow-sm'
                  : 'bg-white/90 text-[#292524] border border-white/80 hover:border-[#EDA81C]'
              }`}
            >
              All 7 Domains
            </button>
            {EXPERTISE_DOMAINS.map((domain) => (
              <button
                key={domain.id}
                type="button"
                onClick={() => setSelectedDomainFilter(domain.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider whitespace-nowrap transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                  selectedDomainFilter === domain.id
                    ? 'bg-[#0C0A09] text-white shadow-sm'
                    : 'bg-white/90 text-[#292524] border border-white/80 hover:border-[#EDA81C]'
                }`}
              >
                <span>{domain.code}</span>
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software, code, standards..."
              className="w-full bg-white/90 border border-[#E7E1D8] rounded-full pl-9 pr-4 py-2 text-xs text-[#0C0A09] font-medium placeholder-[#78716C] focus:outline-none focus:border-[#EDA81C] transition-colors"
            />
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#0C0A09] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Domains Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        {filteredDomains.length === 0 ? (
          <div className="py-20 text-center rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)]">
            <p className="font-serif text-2xl text-[#0C0A09] font-bold">No engineering domain found</p>
            <p className="text-sm text-[#57534E] mt-2 font-sans">
              No results match "{searchQuery}". Try searching for Tekla, STAAD, BIM, LOD, or Offshore.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDomainFilter('all');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#EDA81C] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#D49110] transition-colors cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredDomains.map((domain, index) => (
              <motion.article
                key={domain.id}
                id={domain.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="rounded-3xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                {/* Domain Header Banner */}
                <div className="p-6 sm:p-8 bg-[#FAF6F0]/80 border-b border-white/80">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-[#0C0A09] text-white text-xs font-sans font-bold tracking-widest">
                          {domain.number}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-[#EDA81C]/15 text-[#EDA81C] text-xs font-sans font-bold tracking-wider">
                          {domain.code}
                        </span>
                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-sans font-bold text-[#57534E]">
                          {getDomainIcon(domain.code)}
                          <span>Discipline</span>
                        </div>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0C0A09] font-bold tracking-tight">
                        {domain.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToContact(domain.title)}
                      className="px-4 py-2 rounded-xl border border-[#EDA81C] text-[#EDA81C] hover:bg-[#EDA81C] hover:text-white transition-all text-xs font-sans font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Engage Domain</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Verbatim quote from Deweg Reference page */}
                  <div className="mt-6 p-5 rounded-2xl bg-white/90 border-l-4 border-[#EDA81C] border border-white/80 shadow-sm">
                    <p className="text-sm sm:text-base text-[#0C0A09] italic font-serif leading-relaxed font-normal">
                      "{domain.summary}"
                    </p>
                  </div>
                </div>

                {/* Domain Body */}
                <div className="p-6 sm:p-8 space-y-10">
                  {/* Detailed Description & Pill Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Detailed Scope & Key Pillars */}
                    <div className="lg:col-span-7 space-y-6">
                      <div>
                        <h3 className="text-xs font-sans uppercase tracking-widest text-[#EDA81C] font-bold mb-2">
                          Engineering Architecture & Scope
                        </h3>
                        <p className="text-sm sm:text-base text-[#292524] font-sans leading-relaxed">
                          {domain.description}
                        </p>
                      </div>

                      {/* Key Pillars Checklist */}
                      <div>
                        <h4 className="text-xs font-sans uppercase tracking-widest text-[#0C0A09] font-bold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#EDA81C]" />
                          <span>Core Execution Pillars</span>
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {domain.keyPillars.map((pillar, pIdx) => (
                            <li
                              key={pIdx}
                              className="flex items-start gap-2 p-3 rounded-2xl backdrop-blur-md bg-white/70 border border-white/80 text-xs text-[#0C0A09] font-medium shadow-xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#EDA81C] mt-1.5 shrink-0" />
                              <span>{pillar}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deliverables Transmittals */}
                      <div>
                        <h4 className="text-xs font-sans uppercase tracking-widest text-[#0C0A09] font-bold mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#EDA81C]" />
                          <span>Standard Deliverable Transmittals</span>
                        </h4>
                        <div className="space-y-2">
                          {domain.deliverables.map((deliv, dIdx) => (
                            <div
                              key={dIdx}
                              className="flex items-center gap-2 text-xs text-[#292524] pl-3 border-l-2 border-[#EDA81C] font-medium"
                            >
                              <span>{deliv}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Technical Specs, Software & Compliance */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Software Stack */}
                      <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/80 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                        <h4 className="text-xs font-sans uppercase tracking-widest text-[#57534E] font-bold mb-3">
                          Software Engine & Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {domain.softwareStack.map((sw, swIdx) => (
                            <span
                              key={swIdx}
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#E7E1D8] text-xs font-sans text-[#0C0A09] font-bold shadow-xs"
                            >
                              {sw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Codes & Standards */}
                      <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/80 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                        <h4 className="text-xs font-sans uppercase tracking-widest text-[#57534E] font-bold mb-3 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#EDA81C]" />
                          <span>Codes, Norms & Regulatory Compliance</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {domain.standards.map((std, stdIdx) => (
                            <span
                              key={stdIdx}
                              className="px-3 py-1.5 rounded-xl bg-[#FFF9ED] text-[#0C0A09] text-xs font-sans font-semibold border border-[#E7E1D8]"
                            >
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Featured Callout */}
                      {domain.featuredAsset && (
                        <div
                          onClick={() =>
                            setActiveAssetModal({
                              asset: domain.featuredAsset!,
                              domainTitle: domain.title,
                              domainCode: domain.code
                            })
                          }
                          className="group relative rounded-3xl overflow-hidden border border-white/80 cursor-pointer shadow-[0_12px_40px_rgb(0,0,0,0.04)] bg-[#EAE5DC]"
                        >
                          <div className="aspect-[16/10] overflow-hidden">
                            <img
                              src={domain.featuredAsset.url}
                              alt={domain.featuredAsset.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/85 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#EDA81C] text-white font-bold">
                                {domain.featuredAsset.tag || 'Featured Asset'}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-white/90 group-hover:text-[#EDA81C] transition-colors font-semibold">
                                <ZoomIn className="w-3.5 h-3.5" />
                                <span>Inspect Full Res</span>
                              </span>
                            </div>
                            <p className="text-xs font-bold mt-2 text-white line-clamp-1">
                              {domain.featuredAsset.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Authentic High-Resolution Gallery Grid */}
                  <div className="border-t border-white/80 pt-8">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h4 className="text-xs font-sans uppercase tracking-widest text-[#0C0A09] font-bold">
                          Verified Technical Assets & Model Gallery
                        </h4>
                        <p className="text-xs text-[#57534E] mt-0.5 font-medium">
                          Click any drawing, model render, or simulation to open in high-resolution inspector.
                        </p>
                      </div>
                      <span className="text-xs font-sans font-bold text-[#EDA81C] bg-[#EDA81C]/10 px-3 py-1 rounded-full border border-[#EDA81C]/20">
                        {domain.gallery.length} Assets
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {domain.gallery.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() =>
                            setActiveAssetModal({
                              asset,
                              domainTitle: domain.title,
                              domainCode: domain.code
                            })
                          }
                          className="group relative rounded-3xl overflow-hidden border border-white/80 backdrop-blur-xl bg-white/85 cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-[#EDA81C]/50 transition-all"
                        >
                          <div className="aspect-[16/11] relative overflow-hidden bg-[#EAE5DC]">
                            <img
                              src={asset.url}
                              alt={asset.title}
                              className="w-full h-full object-cover filter contrast-[1.02] group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            {asset.type === 'gif' && (
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-sans font-bold tracking-wider shadow-sm">
                                LIVE SIMULATION
                              </span>
                            )}
                            <div className="absolute inset-0 bg-[#0C0A09]/0 group-hover:bg-[#0C0A09]/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="px-3.5 py-2 rounded-full bg-white text-[#0C0A09] text-xs font-sans font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg">
                                <ZoomIn className="w-3.5 h-3.5 text-[#EDA81C]" />
                                <span>Inspect Asset</span>
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-white/90 border-t border-white/80">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-sans uppercase tracking-wider text-[#EDA81C] font-bold">
                                {asset.tag || domain.code}
                              </span>
                              <span className="text-[10px] font-sans text-[#78716C] font-semibold uppercase">
                                {asset.type.toUpperCase()}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-[#0C0A09] mt-1.5 line-clamp-1 group-hover:text-[#EDA81C] transition-colors">
                              {asset.title}
                            </h5>
                            <p className="text-xs text-[#57534E] mt-1 line-clamp-2 leading-relaxed">
                              {asset.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Consultation Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="rounded-3xl bg-[#0C0A09] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#EDA81C] text-white text-xs font-sans uppercase tracking-widest font-bold inline-block">
              TECHNICAL ADVISORY & CONSULTING
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FBF9F5] leading-tight font-bold">
              Ready to execute complex engineering with zero field surprises?
            </h2>
            <p className="text-sm sm:text-base text-[#D6D3D1] font-normal leading-relaxed">
              Connect directly with our Chennai technical directorate for structural review,
              BIM federated modeling audits, offshore platform engineering, or custom IT tooling.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigateToContact()}
                className="px-6 py-3.5 rounded-xl bg-[#EDA81C] hover:bg-[#D49110] text-white font-sans uppercase tracking-wider text-xs font-bold transition-all inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Initiate Project Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-6 py-3.5 rounded-xl border border-white/20 hover:border-white text-white font-sans uppercase tracking-wider text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Return to Home</span>
              </button>
            </div>
          </div>
          {/* Subtle background blueprint grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #FFF 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />
        </div>
      </section>

      {/* High-Resolution Asset Inspector Lightbox Modal */}
      <AnimatePresence>
        {activeAssetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0C0A09]/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl max-h-[90vh] backdrop-blur-2xl bg-white/95 rounded-3xl border border-white/80 shadow-[0_25px_50px_rgb(0,0,0,0.25)] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-[#FAF6F0]/80 border-b border-white/80 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EDA81C] text-white text-[10px] font-sans uppercase tracking-widest font-bold">
                      {activeAssetModal.domainCode}
                    </span>
                    <span className="text-xs font-sans font-bold text-[#57534E]">
                      {activeAssetModal.domainTitle}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#0C0A09] font-bold">
                    {activeAssetModal.asset.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveAssetModal(null)}
                  className="p-2.5 rounded-full hover:bg-[#EAE5DC] text-[#57534E] hover:text-[#0C0A09] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Media Display */}
              <div className="flex-1 overflow-auto bg-[#0C0A09] flex items-center justify-center p-4 relative min-h-[350px] sm:min-h-[450px]">
                <img
                  src={activeAssetModal.asset.url}
                  alt={activeAssetModal.asset.title}
                  className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Modal Footer / Description */}
              <div className="p-5 sm:p-6 bg-white/95 border-t border-white/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-xs sm:text-sm text-[#292524] font-medium leading-relaxed">
                    {activeAssetModal.asset.caption}
                  </p>
                  <p className="text-[11px] font-sans font-medium text-[#78716C] mt-1">
                    Authentic Deweg Engineering asset source: static.wixstatic.com
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={activeAssetModal.asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#FFF9ED] border border-[#DDD6CC] text-[#0C0A09] hover:bg-[#EAE5DC] text-xs font-sans font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Raw Full-Res</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeAssetModal.domainTitle;
                      setActiveAssetModal(null);
                      onNavigateToContact(title);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#EDA81C] text-white hover:bg-[#D49110] text-xs font-sans font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Consult on Domain</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
