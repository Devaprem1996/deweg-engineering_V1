import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  Download,
  X
} from 'lucide-react';
import {
  EXPERTISE_DOMAINS,
  EXPERTISE_HERO_ASSET,
  ExpertiseDomain
} from '../data/expertiseData';
import { COMPANY_DETAILS } from '../data/engineeringData';

interface ExpertisePageProps {
  onNavigateHome: () => void;
  onNavigateToContact: (discipline?: string) => void;
  initialDomainId?: string;
  initialScrollId?: string;
}

const ACCENT = '#C98A2D';
const HAIRLINE = '#DDD9CE';
const EASE = [0.16, 1, 0.3, 1] as const;

const pad = (n: number) => String(n).padStart(2, '0');

const metrics = [
  { value: '7', label: 'Core Disciplines' },
  { value: 'LOD 500', label: 'BIM Precision' },
  { value: '100%', label: 'Code Compliant' },
  { value: 'ISO', label: 'Certified QA' }
];

const sideMenuLabels: Record<string, string> = {
  'project-management': 'Project Management',
  'structural-design': 'Structural Design',
  'bim-solutions': 'BIM / Digital Delivery',
  'structural-steel': 'Steel Detailing',
  'oil-and-gas': 'Oil & Gas Offshore',
  'mep-design': 'MEP Engineering',
  'information-technology': 'IT Automation'
};

/**
 * IntersectionObserver-driven image: only mounts the <img> when the frame
 * approaches the viewport (rootMargin 500px). Keeps 28 hi-res renders out of
 * the initial DOM and off the main thread until actually needed.
 */
function LazyImage({
  src,
  alt,
  imgClassName,
  frameClassName
}: {
  src: string;
  alt: string;
  imgClassName?: string;
  frameClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '500px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-[2px] border border-[#DDD9CE] bg-[#EBE8DF] ${frameClassName ?? ''}`}
      style={{ willChange: 'transform' }}
    >
      {visible && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={imgClassName}
        />
      )}
    </div>
  );
}

export default function ExpertisePage({
  onNavigateHome,
  onNavigateToContact,
  initialDomainId,
  initialScrollId
}: ExpertisePageProps) {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>(
    initialDomainId || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ domain: ExpertiseDomain; index: number } | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false
  );
  const scrollPanelRef = useRef<HTMLElement>(null);

  // Track large screens — desktop freezes the index rail and lets only the
  // chapter panel drift; mobile keeps the full-page flow with the sticky strip.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const filteredDomains = useMemo(() => {
    return EXPERTISE_DOMAINS.filter((domain) => {
      const matchesCategory =
        selectedDomainFilter === 'all' || domain.id === selectedDomainFilter;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = domain.title.toLowerCase().includes(q);
      const matchSummary = domain.summary.toLowerCase().includes(q);
      const matchPillars = domain.keyPillars.some((p) => p.toLowerCase().includes(q));
      const matchDeliverables = domain.deliverables.some((d) => d.toLowerCase().includes(q));
      const matchSoftware = domain.softwareStack.some((s) => s.toLowerCase().includes(q));
      const matchStandards = domain.standards.some((s) => s.toLowerCase().includes(q));

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

  // Scroll a chapter into view. On desktop the chapters live in an internal
  // scroll panel under a frozen index rail, so we scroll the panel; on mobile
  // we keep routing through Lenis so the full-page scroll lands cleanly below
  // the navbar (native scrollIntoView fights Lenis).
  const scrollPanelTo = (target: HTMLElement) => {
    const panel = scrollPanelRef.current;
    if (isDesktop && panel) {
      const top =
        target.getBoundingClientRect().top -
        panel.getBoundingClientRect().top +
        panel.scrollTop;
      panel.scrollTo({ top, behavior: 'smooth' });
      return;
    }
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: -88 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectTab = (id: string) => {
    setSelectedDomainFilter(id);
    setActiveDomainId(id);
    const target = document.getElementById(id);
    if (!target) {
      const panel = scrollPanelRef.current;
      if (isDesktop && panel) {
        panel.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    scrollPanelTo(target);
  };

  // Scrollspy — IntersectionObserver (off the main thread), not a scroll listener.
  // All intersecting chapters are tracked; the TOPMOST (earliest in DOM order) wins,
  // so the index highlight always names the chapter you're currently reading.
  // On desktop the observer roots to the drifting chapter panel.
  useEffect(() => {
    const targets = EXPERTISE_DOMAINS.map((d) => document.getElementById(d.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const visible = new Set<string>();
    const panel = scrollPanelRef.current;
    const usePanel = isDesktop && !!panel;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        if (visible.size === 0) return;
        const topmost = EXPERTISE_DOMAINS.find((d) => visible.has(d.id));
        if (topmost) setActiveDomainId(topmost.id);
      },
      usePanel
        ? { root: panel, rootMargin: '-15% 0px -45% 0px', threshold: 0 }
        : { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [selectedDomainFilter, isDesktop]);

  // React to an inbound navigation target (footer domain links) — filter to the
  // chapter, activate it, and scroll it into view even if already mounted.
  useEffect(() => {
    if (initialDomainId) {
      setSelectedDomainFilter(initialDomainId);
      setActiveDomainId(initialDomainId);
    }
    if (initialScrollId) {
      const timer = setTimeout(() => {
        const target = document.getElementById(initialScrollId);
        if (!target) return;
        scrollPanelTo(target);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialDomainId, initialScrollId, isDesktop]);

  const openModal = (domain: ExpertiseDomain, index: number) => setModal({ domain, index });
  const closeModal = () => setModal(null);

  const moveModal = (dir: number) =>
    setModal((m) =>
      m
        ? { ...m, index: (m.index + dir + m.domain.gallery.length) % m.domain.gallery.length }
        : m
    );

  useEffect(() => {
    if (!modal) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') moveModal(-1);
      if (e.key === 'ArrowRight') moveModal(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modal]);

  const activeAsset = modal?.domain.gallery[modal.index];
  const galTotal = modal?.domain.gallery.length ?? 0;

  return (
    <div id="expertise-page" className="min-h-screen bg-[#F5F4EE] text-[#141412] pt-[72px]">
      {/* ─── Masthead bar ─── */}
      <div className="w-full border-b border-[#DDD9CE]">
        <div className="max-w-[1600px] mx-auto px-[7vw] h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5C5A53] hover:text-[#141412] transition-colors cursor-pointer shrink-0 max-lg:tap-hit"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="whitespace-nowrap">Deweg Engineering</span>
            </button>
            <span className="font-mono text-[11px] text-[#B9B5A8] hidden sm:inline">/</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5C5A53] hidden sm:inline whitespace-nowrap">
              Domain We Expertise
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#C98A2D] hidden md:inline whitespace-nowrap">
              · Reference Portfolio
            </span>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            <span className="font-mono text-[11px] tracking-[0.12em] text-[#8A877E] hidden lg:inline">
              CIN: {COMPANY_DETAILS.cin}
            </span>
            <button
              type="button"
              onClick={() => onNavigateToContact()}
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141412] hover:text-black transition-colors cursor-pointer max-lg:tap-hit"
            >
              <span className="whitespace-nowrap">Consult an Engineer</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="max-w-[1600px] mx-auto px-[7vw] pt-16 lg:pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
                className="block h-px w-8 bg-[#DDD9CE] origin-left"
              />
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8A877E]"
              >
                Official Practice Reference
              </motion.span>
            </div>

            <h1 className="mt-6 font-sans font-medium text-[#141412] tracking-[-0.03em] leading-[1.02] text-[clamp(3rem,5.5vw,5.5rem)]">
              {['Domain We Expertise'].map((w) => (
                <span key={w}>
                  {w.split(' ').map((word, i) => (
                    <span key={`${word}-${i}`} className="inline-block overflow-hidden align-top">
                      <motion.span
                        initial={{ y: '100%', opacity: 0 }}
                        whileInView={{ y: '0%', opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                        className="inline-block"
                      >
                        {word}&nbsp;
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="mt-6 max-w-[620px] font-sans text-[1.125rem] leading-[1.6] text-[#5C5A53]"
            >
              From concept to construction-level reality. Detailed engineering,
              high-fidelity BIM coordination, structural analysis, offshore platforms, and
              proprietary IT automations engineered for zero field rework.
            </motion.p>
          </div>

          {/* Hero image + caption below frame */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              <div className="rounded-[2px] overflow-hidden border border-[#DDD9CE] bg-[#EBE8DF]">
                <img
                  src={EXPERTISE_HERO_ASSET.url}
                  alt={EXPERTISE_HERO_ASSET.alt}
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                [ FIG 01 — DEWEG REFERENCE PORTFOLIO ]
              </p>
              <p className="mt-1 font-sans text-[13px] text-[#5C5A53]">
                Verified CAD drawings, 3D structural skeletons, and live field simulations.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Metrics strip — hairline columns, no card */}
        <div className="mt-12 border-y border-[#DDD9CE]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className={`px-7 py-8 ${i > 0 ? 'lg:border-l border-[#DDD9CE]' : ''} ${
                  i % 2 === 1 ? 'border-l border-[#DDD9CE]' : ''
                } ${i >= 2 ? 'border-t border-[#DDD9CE] lg:border-t-0' : ''}`}
              >
                <span className="block font-sans font-medium text-[#141412] tracking-[-0.02em] text-[clamp(2.5rem,3.8vw,3.5rem)] leading-none">
                  {m.value}
                </span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-[#8A877E]">
                  {m.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mobile index strip (< 1024px) — pins under navbar ─── */}
      <nav className="sticky top-[72px] z-30 bg-[#F5F4EE] border-y border-[#DDD9CE] lg:hidden">
        <div className="flex items-center gap-5 px-[7vw] h-14 overflow-x-auto [scrollbar-width:none]">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A877E] shrink-0">
            Index
          </span>
          {EXPERTISE_DOMAINS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => selectTab(d.id)}
              className={`tap-hit font-mono text-[11px] uppercase tracking-[0.1em] whitespace-nowrap transition-colors duration-300 cursor-pointer shrink-0 ${
                selectedDomainFilter === d.id ? 'text-[#141412]' : 'text-[#8A877E] hover:text-[#141412]'
              }`}
            >
              {d.number} {d.code}
            </button>
          ))}
          <div className="relative shrink-0 w-44 ml-2">
            <Search
              className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8A877E]"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent border-b border-[#DDD9CE] focus:border-[#141412] outline-none pl-6 pr-4 py-1 text-[12px] text-[#141412] placeholder:text-[#B0ACA2] transition-colors duration-300"
            />
          </div>
        </div>
      </nav>

      {/* ─── Domains: frozen TOC index rail + drifting chapter panel ─── */}
      <div
        data-lenis-prevent={isDesktop || undefined}
        style={{ overscrollBehavior: 'auto' }}
        className="max-w-[1600px] mx-auto px-[7vw] lg:h-[calc(100vh_-_72px)] lg:overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 lg:h-full">
          {/* Sidebar TOC (columns 1–3) — frozen on desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="lg:h-full lg:overflow-y-auto lg:[scrollbar-width:none] pt-12 pr-2">
              <div className="flex items-baseline justify-between gap-4 border-b border-[#DDD9CE] pb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                  Index — 7 Domains
                </span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-[#B9B5A8]">
                  {selectedDomainFilter === 'all' ? 'All · 07' : '01 / 07'}
                </span>
              </div>

              <ul>
                {EXPERTISE_DOMAINS.map((d) => {
                  const isActive = activeDomainId === d.id;
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => selectTab(d.id)}
                        className={`group relative w-full text-left py-4 border-b border-[#EBE9E0] flex items-center justify-between gap-3 transition-colors duration-300 cursor-pointer ${
                          isActive ? 'text-[#141412]' : 'text-[#5C5A53] hover:text-[#141412]'
                        }`}
                      >
                        <motion.span
                          initial={false}
                          animate={{ scaleY: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-[2px] origin-top bg-[#C98A2D] ${
                            isActive ? 'block' : 'hidden'
                          }`}
                        />
                        <span className="flex items-baseline gap-3 pl-4">
                          <span className="font-mono text-[10px] tracking-[0.1em] text-[#8A877E]">
                            {d.number}
                          </span>
                          <span
                            className={`font-sans text-[14px] leading-snug ${
                              isActive ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {sideMenuLabels[d.id] || d.title}
                          </span>
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#8A877E] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 shrink-0" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Sidebar search */}
              <div className="relative mt-6">
                <Search
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A877E]"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discipline, software, code…"
                  className="w-full bg-transparent border-b border-[#DDD9CE] focus:border-[#141412] outline-none pl-7 pr-5 py-1.5 text-[13px] text-[#141412] placeholder:text-[#B0ACA2] transition-colors duration-300"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8A877E] hover:text-[#141412] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Spacer (column 4) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Chapters (columns 5–12) — the drifting panel */}
          <section
            ref={scrollPanelRef}
            className="lg:col-span-8 lg:h-full lg:overflow-y-auto scroll-smooth pb-4"
          >
        {filteredDomains.length === 0 ? (
          <div className="border-t border-[#DDD9CE] py-[120px] text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
              No Engineering Domain Found
            </p>
            <p className="mt-3 font-sans text-sm text-[#5C5A53]">
              No results match "{searchQuery}". Try Tekla, STAAD, BIM, LOD, or Offshore.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDomainFilter('all');
              }}
              className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141412] underline underline-offset-4 hover:text-[#C98A2D] transition-colors cursor-pointer max-lg:tap-hit"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredDomains.map((domain) => (
            <motion.article
              key={domain.id}
              id={domain.id}
              className="border-t border-[#DDD9CE] py-[90px] lg:py-[120px] scroll-mt-28"
            >
              {/* Chapter header */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="block h-px w-8 bg-[#DDD9CE] origin-left"
                  />
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]"
                  >
                    {domain.number} / {domain.code} — Discipline
                  </motion.span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToContact(domain.title)}
className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141412] hover:text-black transition-colors cursor-pointer shrink-0 max-lg:tap-hit"
                  >
                    <span className="whitespace-nowrap">Engage Domain</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>

              {/* Chapter title — word-masked reveal */}
              <h2 className="mt-6 font-sans font-medium text-[#141412] tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,4vw,3.6rem)]">
                {domain.title.split(' ').map((word, i) => (
                  <span key={`${domain.id}-${word}-${i}`} className="inline-block overflow-hidden align-top">
                    <motion.span
                      initial={{ y: '100%', opacity: 0 }}
                      whileInView={{ y: '0%', opacity: 1 }}
                      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </h2>

              {/* Editorial pull-quote */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="mt-10 max-w-[900px] border-l-2 border-[#C98A2D] pl-8"
              >
                <p className="font-sans text-[1.4rem] lg:text-[1.5rem] leading-[1.35] text-[#2A2A28]">
                  "{domain.summary}"
                </p>
              </motion.div>

              {/* Content grid */}
              <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-14">
                {/* Left column */}
                <div className="lg:col-span-7 space-y-12">
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                      Engineering Architecture &amp; Scope
                    </h3>
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="mt-4 font-sans text-[1rem] leading-[1.65] text-[#5C5A53]"
                    >
                      {domain.description}
                    </motion.p>
                  </div>

                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                      Core Execution Pillars
                    </h3>
                    <ul className="mt-4">
                      {domain.keyPillars.map((pillar, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                          transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                          className="flex items-baseline gap-4 border-t border-[#DDD9CE] py-4"
                        >
                          <span className="font-mono text-[11px] tracking-[0.1em] text-[#8A877E] shrink-0">
                            {pad(i + 1)}
                          </span>
                          <span className="font-sans text-[0.95rem] text-[#141412] leading-snug">
                            {pillar}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                      Standard Deliverable Transmittals
                    </h3>
                    <ul className="mt-4">
                      {domain.deliverables.map((deliv, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                          transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                          className="group flex items-center justify-between gap-6 border-t border-[#DDD9CE] py-4"
                        >
                          <span className="font-sans text-[0.95rem] text-[#141412] leading-snug">
                            {deliv}
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-[#8A877E] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-5 space-y-12">
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                      Software Engine &amp; Stack
                    </h3>
                    <p className="mt-4 font-mono text-[12px] leading-[1.9] text-[#141412]">
                      {domain.softwareStack.join('  ·  ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                      Codes, Norms &amp; Regulatory Compliance
                    </h3>
                    <p className="mt-4 font-mono text-[12px] leading-[1.9] text-[#141412]">
                      {domain.standards.join('  ·  ')}
                    </p>
                  </div>

                  {domain.featuredAsset && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      <div onClick={() => openModal(domain, 0)} className="cursor-pointer">
                        <LazyImage
                          src={domain.featuredAsset.url}
                          alt={domain.featuredAsset.title}
                          frameClassName="aspect-[16/10]"
                          imgClassName="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                          [ FIG {domain.number}.1 — {domain.featuredAsset.tag || domain.code} ]
                        </p>
                        <button
                          type="button"
                          onClick={() => openModal(domain, 0)}
                          className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141412] hover:text-black transition-colors cursor-pointer shrink-0 max-lg:tap-hit"
                        >
                          <span className="whitespace-nowrap">Inspect Full Resolution</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div className="mt-16 border-t border-[#DDD9CE] pt-10">
                <div className="flex items-baseline justify-between gap-6">
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]">
                    Verified Technical Assets &amp; Model Gallery
                  </h4>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-[#8A877E] shrink-0">
                    {pad(1)} / {pad(domain.gallery.length)} Assets
                  </span>
                </div>
                <p className="mt-2 font-sans text-[13px] text-[#5C5A53]">
                  Click any drawing, model render, or simulation to open in high-resolution inspector.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {domain.gallery.map((asset, gi) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                      transition={{ duration: 0.5, delay: gi * 0.05, ease: EASE }}
                      onClick={() => openModal(domain, gi)}
                      className="group cursor-pointer"
                    >
                      <LazyImage
                        src={asset.url}
                        alt={asset.title}
                        frameClassName="aspect-[16/11]"
                        imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8A877E]">
                          {asset.tag || domain.code}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8A877E]">
                          {asset.type}
                        </span>
                      </div>
                      <h5 className="mt-1 font-sans text-[0.95rem] font-medium text-[#141412] line-clamp-1 underline-offset-4 decoration-transparent transition-all duration-300 group-hover:translate-x-1 group-hover:underline group-hover:decoration-1 group-hover:decoration-[#DDD9CE]">
                        {asset.title}
                      </h5>
                      <p className="mt-1 font-sans text-[0.85rem] text-[#5C5A53] leading-[1.5] line-clamp-2">
                        {asset.caption}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))
        )}
          </section>
        </div>
      </div>

      {/* ─── Consultation banner ─── */}
      <section className="border-t border-[#DDD9CE] bg-[#EDEBE3]">
        <div className="relative overflow-hidden max-w-[1600px] mx-auto px-[7vw] py-[110px] lg:py-[140px]">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(20,20,18,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,18,0.9) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="block h-px w-8 bg-[#C98A2D] origin-left"
              />
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A877E]"
              >
                07 / Engage the Practice
              </motion.span>
            </div>

            <h2 className="mt-6 font-sans font-medium text-[#141412] tracking-[-0.02em] leading-[1.08] text-[clamp(2.4rem,4vw,3.4rem)]">
              Initiate Project Consultation.
            </h2>
            <p className="mt-5 max-w-[480px] font-sans text-[1rem] leading-[1.6] text-[#5C5A53]">
              Connect directly with our Chennai technical directorate for structural review, BIM
              federated modeling audits, offshore platform engineering, or custom IT tooling.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <button
                type="button"
                onClick={() => onNavigateToContact()}
                className="group inline-flex items-center gap-2.5 rounded-[2px] bg-[#141412] text-[#F5F4EE] px-9 py-5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 cursor-pointer"
              >
                <span className="whitespace-nowrap">Initiate Consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[6px]" />
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141412] hover:text-black transition-colors cursor-pointer max-lg:tap-hit"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="whitespace-nowrap">Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── High-resolution asset inspector ─── */}
      <AnimatePresence>
        {modal && activeAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-[rgba(20,20,18,0.92)] backdrop-blur-[24px] p-4 sm:p-[40px] flex"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative m-auto w-full h-full flex flex-col"
            >
              {/* Top bar */}
              <div className="flex items-baseline justify-between gap-6 border-b border-white/10 py-4">
                <div className="min-w-0">
                  <p className="font-sans text-[0.95rem] text-[#F5F4EE] truncate">
                    {activeAsset.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A8A49B]">
                    FIG {modal.domain.number}.1 · {activeAsset.tag || modal.domain.code} ·{' '}
                    {activeAsset.type.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <a
                    href={activeAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F5F4EE] hover:text-[#C98A2D] transition-colors cursor-pointer"
                  >
                    Download <span aria-hidden="true">↓</span>
                  </a>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F5F4EE] hover:text-[#C98A2D] transition-colors cursor-pointer"
                  >
                    Close <span aria-hidden="true">✕</span>
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 min-h-0 flex items-center justify-center border border-white/10 py-6">
                <img
                  src={activeAsset.url}
                  alt={activeAsset.title}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-end gap-6 border-t border-white/10 py-4">
                <span className="font-mono text-[11px] tracking-[0.14em] text-[#F5F4EE]">
                  {pad(modal.index + 1)} / {pad(galTotal)}
                </span>
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => moveModal(-1)}
                    aria-label="Previous asset"
                    className="font-mono text-[11px] tracking-[0.14em] text-[#F5F4EE] hover:text-[#C98A2D] transition-colors cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveModal(1)}
                    aria-label="Next asset"
                    className="font-mono text-[11px] tracking-[0.14em] text-[#F5F4EE] hover:text-[#C98A2D] transition-colors cursor-pointer"
                  >
                    →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}