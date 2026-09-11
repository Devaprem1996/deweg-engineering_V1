import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, FileText, ArrowRight, ShieldCheck, Film, Play, Sparkles, Maximize2 } from 'lucide-react';
import { Service, ReferenceAsset } from '../types';
import ReferenceAssetViewer from './ReferenceAssetViewer';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  const [activeAsset, setActiveAsset] = useState<ReferenceAsset | null>(null);

  if (!service) return null;

  const assets = service.referenceAssets || [];

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#292524]/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-white rounded-2xl border border-[#E7E1D8] text-[#1C1917] z-10 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E1D8] bg-[#F5F0E8]">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-bold text-[#EDA81C]">{service.number}</span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#78716C] font-sans font-bold">
                  Domain Specification & Reference Repository
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE4D9] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-7">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-[#EDA81C] bg-[#F5F0E8] border border-[#E7E1D8]">
                    {service.officialCode || service.id.toUpperCase()}
                  </span>
                  {assets.length > 0 && (
                    <span className="text-xs text-[#78716C] font-mono">
                      {assets.length} Reference {assets.length === 1 ? 'Asset' : 'Assets'}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] tracking-tight">
                  {service.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#EDA81C] font-serif italic font-medium">
                  "{service.tagline}"
                </p>

                {/* Reference Philosophy */}
                {service.referencePhilosophy && (
                  <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF] text-xs sm:text-sm text-[#44403C] font-sans leading-relaxed">
                    <span className="font-semibold text-[#EDA81C]">Philosophy & Execution Intent: </span>
                    {service.referencePhilosophy}
                  </div>
                )}

                <p className="mt-4 text-sm text-[#57534E] font-sans font-normal leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Reference Assets & Video Simulations */}
              {assets.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-[#1C1917] mb-3 flex items-center gap-2 font-semibold">
                    <Film className="w-5 h-5 text-[#EDA81C]" />
                    <span>Reference Assets & Models ({assets.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => setActiveAsset(asset)}
                        className="group relative aspect-16/10 rounded-lg overflow-hidden border border-[#E7E1D8] bg-[#1C1917] cursor-pointer hover:border-[#EDA81C] transition-all hover:scale-[1.02]"
                      >
                        <img
                          src={asset.posterUrl || asset.url}
                          alt={asset.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {asset.type === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#EDA81C] flex items-center justify-center shadow-md">
                              <Play className="w-3.5 h-3.5 text-[#0C0A09] fill-[#0C0A09] translate-x-0.5" />
                            </div>
                          </div>
                        )}
                        {asset.type === 'gif' && (
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#0D9488] text-[9px] font-mono font-bold text-white">
                            3D Model
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-[11px] text-white font-sans truncate font-medium">
                            {asset.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scope of Engineering Works */}
              <div>
                <h3 className="font-serif text-xl text-[#1C1917] mb-3 flex items-center gap-2 font-semibold">
                  <ShieldCheck className="w-5 h-5 text-[#EDA81C]" />
                  <span>Scope of Technical Operations</span>
                </h3>
                <ul className="space-y-2.5">
                  {service.detailedScope.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#57534E] font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#EDA81C] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div className="p-5 rounded-xl bg-[#F5F0E8] border border-[#E7E1D8]">
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#EDA81C] font-sans font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Deliverables & Certification Output</span>
                </h4>
                <ul className="space-y-2">
                  {service.deliverables.map((del, i) => (
                    <li key={i} className="text-xs text-[#1C1917] font-sans flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EDA81C]" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="pt-6 border-t border-[#E7E1D8] flex items-center justify-between flex-wrap gap-4">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#EDA81C] text-[#0C0A09] text-[11px] sm:text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#F4BC3E] transition-colors shadow-sm text-center"
                >
                  <span>Request Scope Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onClose}
                  className="text-xs uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
                >
                  Close Specification
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Lightbox for Reference Asset inside modal */}
      <ReferenceAssetViewer
        isOpen={Boolean(activeAsset)}
        onClose={() => setActiveAsset(null)}
        activeAsset={activeAsset}
        assetsList={assets}
        onSelectAsset={(asset) => setActiveAsset(asset)}
        activeService={service}
      />
    </>
  );
}
