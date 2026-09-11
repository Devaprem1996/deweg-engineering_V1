import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Layers, 
  Compass, 
  Cpu, 
  Briefcase, 
  Shield, 
  Zap, 
  Code, 
  CheckCircle,
  Play,
  Film,
  Sparkles,
  Maximize2,
  Image as ImageIcon,
  SlidersHorizontal,
  LayoutGrid,
  FileCheck
} from 'lucide-react';
import { SERVICES_DATA, OFFICIAL_ASSETS } from '../data/engineeringData';
import { Service, ReferenceAsset } from '../types';
import ReferenceAssetViewer from './ReferenceAssetViewer';

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'gallery'>('cards');
  
  // Reference Viewer Modal State
  const [activeViewerAsset, setActiveViewerAsset] = useState<ReferenceAsset | null>(null);
  const [viewerAssetsList, setViewerAssetsList] = useState<ReferenceAsset[]>([]);
  const [viewerService, setViewerService] = useState<Service | null>(null);

  // Flatten all reference assets for full gallery mode
  const allReferenceAssets = SERVICES_DATA.flatMap((service) =>
    (service.referenceAssets || []).map((asset) => ({
      ...asset,
      serviceTitle: service.title,
      serviceCode: service.officialCode || service.id.toUpperCase(),
      serviceId: service.id
    }))
  );

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-[#EDA81C]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#EDA81C]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#EDA81C]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#EDA81C]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-[#EDA81C]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#EDA81C]" />;
      case 'Code':
        return <Code className="w-5 h-5 text-[#EDA81C]" />;
      default:
        return <Layers className="w-5 h-5 text-[#EDA81C]" />;
    }
  };

  const handleOpenAsset = (asset: ReferenceAsset, service?: Service) => {
    if (service && service.referenceAssets) {
      setViewerAssetsList(service.referenceAssets);
      setViewerService(service);
    } else {
      setViewerAssetsList(allReferenceAssets);
      setViewerService(null);
    }
    setActiveViewerAsset(asset);
  };

  const filteredServices = selectedCategory === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter((s) => s.id === selectedCategory);

  const filteredGalleryAssets = selectedCategory === 'all'
    ? allReferenceAssets
    : allReferenceAssets.filter((a) => a.serviceId === selectedCategory);

  // Count stats
  const totalAssetsCount = allReferenceAssets.length;
  const totalVideosCount = allReferenceAssets.filter((a) => a.type === 'video').length;

  return (
    <section
      id="services"
      className="relative bg-[#FBF9F5] text-[#1C1917] py-24 md:py-32 lg:py-36 border-t border-[#E7E1D8]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header - Domain We Expertise from deweg-engineering.com & reference */}
        <div className="mb-14">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-[1px] bg-[#DDD6CC] origin-left mb-8"
          />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs uppercase tracking-[0.25em] text-[#EDA81C] font-sans font-semibold">
                  DEWEG DISCIPLINES & REFERENCE REPOSITORY
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-[#EDA81C] bg-[#EDA81C]/10 border border-[#EDA81C]/20">
                  {totalAssetsCount} Verified Models & Assets
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#1C1917] tracking-tight mt-2">
                Domain We Expertise
              </h2>
            </div>
            
            <div className="max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#57534E] text-sm sm:text-base font-sans font-normal leading-relaxed">
                7 integrated engineering practices bridging computational FEA analysis, LOD 500 digital twins, Tekla structural steel detailing, and high-definition video simulations collected directly from our active reference archive.
              </p>
              <a
                href="#contact"
                className="shrink-0 px-4 py-2.5 rounded-lg bg-[#EDA81C] text-[#0C0A09] hover:bg-[#F4BC3E] transition-all text-[11px] sm:text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Discuss Engineering Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Reference Asset Metrics Strip with Glassmorphism */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl backdrop-blur-xl bg-white/75 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="p-3 border-r border-[#F0EBE1] last:border-r-0">
              <div className="flex items-center gap-2 text-[#EDA81C] text-xs font-mono font-bold uppercase tracking-wider">
                <FileCheck className="w-3.5 h-3.5" />
                <span>7 Core Disciplines</span>
              </div>
              <p className="text-xs text-[#292524] mt-1 font-medium font-sans">
                PMC, SDE, BIM, SME, OGE, MEP & IT
              </p>
            </div>
            <div className="p-3 border-r border-[#F0EBE1] last:border-r-0">
              <div className="flex items-center gap-2 text-[#EDA81C] text-xs font-mono font-bold uppercase tracking-wider">
                <Film className="w-3.5 h-3.5" />
                <span>Advanced Simulation</span>
              </div>
              <p className="text-xs text-[#292524] mt-1 font-medium font-sans">
                Dynamic FEA & 3D Clash Models
              </p>
            </div>
            <div className="p-3 border-r border-[#F0EBE1] last:border-r-0">
              <div className="flex items-center gap-2 text-[#EDA81C] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LOD 100–500 BIM</span>
              </div>
              <p className="text-xs text-[#292524] mt-1 font-medium font-sans">
                Turnkey Federated Coordination
              </p>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 text-[#EDA81C] text-xs font-mono font-bold uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Precision Detailing</span>
              </div>
              <p className="text-xs text-[#292524] mt-1 font-medium font-sans">
                Fabrication-Ready Tekla & CNC
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Filter Controls with Glassmorphic Pills */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0C0A09] text-white shadow-md'
                  : 'bg-white/80 backdrop-blur-md text-[#292524] hover:text-[#0C0A09] border border-white/80 hover:border-[#EDA81C] shadow-xs'
              }`}
            >
              All Domains (7)
            </button>
            {SERVICES_DATA.map((s) => {
              const isSelected = selectedCategory === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedCategory(s.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#EDA81C] text-[#0C0A09] shadow-md'
                      : 'bg-white/80 backdrop-blur-md text-[#292524] hover:text-[#0C0A09] border border-white/80 hover:border-[#EDA81C] shadow-xs'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-90">{s.officialCode}</span>
                  <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Cards vs Visual Asset Gallery */}
          <div className="flex items-center self-end md:self-auto gap-1 p-1 bg-white/80 backdrop-blur-md rounded-xl border border-white/80 shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#0C0A09] text-white shadow-xs'
                  : 'text-[#292524] hover:text-[#0C0A09]'
              }`}
              title="Discipline Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#EDA81C]" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                viewMode === 'gallery'
                  ? 'bg-[#0C0A09] text-white shadow-xs'
                  : 'text-[#292524] hover:text-[#0C0A09]'
              }`}
              title="Reference Asset Visual Gallery"
            >
              <Film className="w-3.5 h-3.5 text-[#EDA81C]" />
              <span>Reference Media Gallery ({filteredGalleryAssets.length})</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DISCIPLINE CARDS VIEW */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => {
              const isHovered = hoveredId === service.id;
              const assets = service.referenceAssets || [];
              const videoCount = assets.filter((a) => a.type === 'video').length;
              const hasGif = assets.some((a) => a.type === 'gif');

              return (
                <motion.div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  onMouseEnter={() => setHoveredId(service.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/85 border border-white/80 shadow-[0_10px_35px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-[#EDA81C]/60 hover:shadow-[0_20px_45px_rgb(0,0,0,0.08)] hover:-translate-y-1"
                >
                  {/* Top accent hairline */}
                  <div 
                    className={`absolute top-0 left-6 right-6 h-[2px] bg-[#EDA81C] transition-opacity duration-300 rounded-t-full ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <div>
                    {/* Number & Icon header */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#F0EBE1]">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-2xl text-[#EDA81C] font-semibold">
                          {service.number}
                        </span>
                        <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#EDA81C] bg-[#F5F0E8] rounded-md border border-[#E7E1D8] uppercase tracking-wider">
                          {service.officialCode || service.id.toUpperCase()}
                        </span>
                      </div>
                      <div className="w-12 h-12 p-2 rounded-xl bg-white/80 border border-white/80 shadow-xs flex items-center justify-center group-hover:bg-[#EDA81C]/10 group-hover:border-[#EDA81C]/40 transition-colors">
                        {service.svgIconUrl ? (
                          <img
                            src={service.svgIconUrl}
                            alt={`${service.title} Icon`}
                            className="w-8 h-8 object-contain filter transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          getServiceIcon(service.icon)
                        )}
                      </div>
                    </div>

                    {/* Service Title with High Visibility */}
                    <h3 className="font-serif text-xl sm:text-2xl text-[#0C0A09] tracking-tight group-hover:text-[#EDA81C] transition-colors leading-snug font-semibold">
                      {service.title}
                    </h3>

                    {/* Tagline */}
                    <p className="mt-2 text-xs italic text-[#EDA81C] font-serif font-medium">
                      "{service.tagline}"
                    </p>

                    {/* Verbatim Philosophy from Reference Page with Glass Box */}
                    {service.referencePhilosophy && (
                      <div className="mt-3.5 p-3.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/70 text-[12px] font-sans text-[#292524] leading-relaxed">
                        <span className="text-[#EDA81C] font-bold">Engineering Intent: </span>
                        {service.referencePhilosophy}
                      </div>
                    )}

                    {/* Scope Description */}
                    <p className="mt-3 text-xs sm:text-sm text-[#292524] font-sans leading-relaxed font-normal">
                      {service.description}
                    </p>

                    {/* Clean Deliverables & Media Preview */}
                    {assets.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-[#F0EBE1]">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#0C0A09] flex items-center gap-1.5">
                            <Film className="w-3.5 h-3.5 text-[#EDA81C]" />
                            <span>Visual Deliverables ({assets.length})</span>
                          </span>
                        </div>

                        {/* Thumbnail Row */}
                        <div className="grid grid-cols-4 gap-2">
                          {assets.slice(0, 4).map((asset) => (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => handleOpenAsset(asset, service)}
                              className="group/thumb relative aspect-4/3 rounded-lg overflow-hidden border border-white/80 bg-[#F5F0E8] hover:border-[#EDA81C] transition-all hover:scale-105 cursor-pointer shadow-xs"
                              title={`${asset.title} - Click to inspect`}
                            >
                              <img
                                src={asset.posterUrl || asset.url}
                                alt={asset.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              {asset.type === 'video' && (
                                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                  <Play className="w-3.5 h-3.5 text-white fill-white" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-[#EDA81C]/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deliverable preview chips */}
                    <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex flex-wrap gap-1.5">
                      {service.deliverables.slice(0, 2).map((item, i) => (
                        <div
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] text-[#0C0A09] font-medium bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/80 shadow-xs"
                        >
                          <CheckCircle className="w-3 h-3 text-[#EDA81C] shrink-0" />
                          <span className="truncate max-w-[170px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-[#F0EBE1] space-y-2.5">
                    {assets.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenAsset(assets[0], service)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white/80 backdrop-blur-md hover:bg-white text-xs font-sans font-bold text-[#0C0A09] border border-white/80 hover:border-[#EDA81C] transition-all shadow-xs cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#EDA81C]" />
                        <span>Inspect Interactive Deliverables ({assets.length})</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectService(service)}
                      className="inline-flex items-center justify-between text-xs font-sans uppercase tracking-[0.16em] font-bold text-[#0C0A09] hover:text-[#EDA81C] transition-colors w-full text-left py-1 cursor-pointer"
                      aria-label={`Detailed Scope for ${service.title}`}
                    >
                      <span>Detailed Scope & Standards</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 transform group-hover:translate-x-1.5 text-[#EDA81C]" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: DEDICATED REFERENCE MEDIA GALLERY VIEW */}
        {viewMode === 'gallery' && (
          <div>
            <div className="mb-6 p-4 rounded-xl bg-white border border-[#E7E1D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Deweg Reference Visual Repository
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Showing {filteredGalleryAssets.length} engineering models, video simulations, and detailing drawings. Click any asset to play or inspect in full high-resolution.
                </p>
              </div>
              <button
                onClick={() => setViewMode('cards')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F0E8] text-xs font-sans font-medium text-[#1C1917] hover:bg-[#EAE4D9] transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#EDA81C]" />
                <span>Return to Cards</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGalleryAssets.map((asset, idx) => {
                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    onClick={() => handleOpenAsset(asset)}
                    className="group cursor-pointer flex flex-col justify-between rounded-xl bg-white border border-[#E7E1D8] overflow-hidden hover:border-[#EDA81C] hover:shadow-lg transition-all"
                  >
                    {/* Media Preview Box */}
                    <div className="relative aspect-16/10 bg-[#0C0A09] overflow-hidden">
                      <img
                        src={asset.posterUrl || asset.url}
                        alt={asset.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Media Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1C1917]/80 backdrop-blur-xs text-[#F5F5F4] border border-[#44403C]/50">
                          {asset.serviceCode}
                        </span>
                        {asset.type === 'video' && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EDA81C] text-[#0C0A09]">
                            <Film className="w-2.5 h-2.5" />
                            1080p Video
                          </span>
                        )}
                        {asset.type === 'gif' && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0D9488] text-white">
                            <Sparkles className="w-2.5 h-2.5" />
                            3D Model
                          </span>
                        )}
                      </div>

                      {/* Video Play Overlay */}
                      {asset.type === 'video' && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="w-11 h-11 rounded-full bg-[#EDA81C] text-[#0C0A09] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white translate-x-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Hover Overlay Icon for Images */}
                      {asset.type !== 'video' && (
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-white/90 text-[#1C1917] flex items-center justify-center shadow-md">
                            <Maximize2 className="w-4 h-4 text-[#EDA81C]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[10.5px] text-[#78716C] font-mono mb-1">
                          <span>{asset.fileName || 'Reference Model'}</span>
                          {asset.resolution && (
                            <span className="text-[#EDA81C] font-semibold">{asset.resolution}</span>
                          )}
                        </div>
                        <h4 className="font-serif text-sm sm:text-base font-medium text-[#1C1917] group-hover:text-[#EDA81C] transition-colors line-clamp-2">
                          {asset.title}
                        </h4>
                        {asset.caption && (
                          <p className="mt-1.5 text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                            {asset.caption}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#EDA81C] font-medium font-sans">
                        <span>{asset.type === 'video' ? 'Play Simulation' : 'Inspect Drawing'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Technical capability banner footer with Glassmorphism */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/80 border border-white/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#EDA81C] shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[#0C0A09]">
                Multi-Discipline Coordination & Audits
              </h4>
              <p className="text-xs text-[#292524] mt-0.5 font-sans font-medium">
                Need full Tekla DSTV CNC files, dynamic vibration FEA calculations, or LOD 500 Navisworks clash reports?
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#EDA81C] text-[#0C0A09] text-[11px] sm:text-xs font-sans uppercase tracking-[0.18em] font-bold hover:bg-[#F4BC3E] transition-colors shrink-0 shadow-md hover:shadow-lg text-center"
          >
            <span>Discuss Engineering Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Full-Screen Reference Asset Lightbox / 1080p Video Player */}
      <ReferenceAssetViewer
        isOpen={Boolean(activeViewerAsset)}
        onClose={() => setActiveViewerAsset(null)}
        activeAsset={activeViewerAsset}
        assetsList={viewerAssetsList}
        onSelectAsset={(asset) => setActiveViewerAsset(asset)}
        activeService={viewerService}
      />
    </section>
  );
}
