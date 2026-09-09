import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ChevronLeft, ChevronRight, Maximize2, Film, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import { ReferenceAsset, Service } from '../types';

interface ReferenceAssetViewerProps {
  isOpen: boolean;
  onClose: () => void;
  activeAsset: ReferenceAsset | null;
  assetsList: ReferenceAsset[];
  onSelectAsset: (asset: ReferenceAsset) => void;
  activeService?: Service | null;
}

export default function ReferenceAssetViewer({
  isOpen,
  onClose,
  activeAsset,
  assetsList,
  onSelectAsset,
  activeService
}: ReferenceAssetViewerProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeAsset, assetsList]);

  if (!isOpen || !activeAsset) return null;

  const currentIndex = assetsList.findIndex((a) => a.id === activeAsset.id);

  const handleNext = () => {
    if (assetsList.length <= 1) return;
    const nextIdx = (currentIndex + 1) % assetsList.length;
    onSelectAsset(assetsList[nextIdx]);
  };

  const handlePrev = () => {
    if (assetsList.length <= 1) return;
    const prevIdx = (currentIndex - 1 + assetsList.length) % assetsList.length;
    onSelectAsset(assetsList[prevIdx]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1C1917]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#1C1917] border border-[#44403C] text-[#F5F5F4] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#292524] bg-[#292524]/70">
            <div className="flex items-center gap-3">
              {activeAsset.type === 'video' && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#EDA81C] text-[#0C0A09]">
                  <Film className="w-3 h-3" />
                  1080p Video Simulation
                </span>
              )}
              {activeAsset.type === 'gif' && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#0284C7] text-white">
                  <Sparkles className="w-3 h-3" />
                  3D Animation Model
                </span>
              )}
              {activeAsset.type === 'image' && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#44403C] text-[#E7E5E4]">
                  <ImageIcon className="w-3 h-3 text-[#EDA81C]" />
                  Reference Technical Drawing
                </span>
              )}
              {activeService && (
                <span className="text-xs font-serif text-[#A8A29E] hidden sm:inline">
                  {activeService.officialCode} — {activeService.title}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#78716C] font-mono font-medium mr-2">
                {currentIndex + 1} / {assetsList.length}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#A8A29E] hover:text-white hover:bg-[#44403C] transition-colors"
                aria-label="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Media Stage */}
          <div className="relative flex-1 min-h-[320px] sm:min-h-[460px] max-h-[60vh] bg-[#0C0A09] flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            {activeAsset.type === 'video' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  key={activeAsset.url}
                  src={activeAsset.url}
                  controls
                  autoPlay
                  playsInline
                  poster={activeAsset.posterUrl}
                  onError={(e) => {
                    console.warn('Video playback warning for asset:', activeAsset.url);
                  }}
                  className="max-h-[56vh] w-auto max-w-full rounded-lg shadow-2xl object-contain"
                >
                  <source src={activeAsset.url} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>
            ) : activeAsset.type === 'gif' ? (
              <div className="relative flex items-center justify-center w-full h-full">
                <img
                  src={activeAsset.url}
                  alt={activeAsset.title}
                  className="max-h-[56vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-full h-full">
                <img
                  src={activeAsset.url}
                  alt={activeAsset.title}
                  className="max-h-[56vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
                />
              </div>
            )}

            {/* Navigation Arrows */}
            {assetsList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#1C1917]/80 hover:bg-[#EDA81C] text-white hover:text-[#0C0A09] border border-[#44403C] transition-all shadow-lg hover:scale-105"
                  aria-label="Previous asset"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#1C1917]/80 hover:bg-[#EDA81C] text-white hover:text-[#0C0A09] border border-[#44403C] transition-all shadow-lg hover:scale-105"
                  aria-label="Next asset"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Asset Metadata & Information Footer */}
          <div className="p-4 sm:p-6 bg-[#1C1917] border-t border-[#292524]">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium">
                    {activeAsset.title}
                  </h3>
                  {activeAsset.fileName && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#D6D3D1] bg-[#292524] border border-[#44403C]">
                      {activeAsset.fileName}
                    </span>
                  )}
                  {activeAsset.resolution && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#EDA81C] bg-[#EDA81C]/10 border border-[#EDA81C]/30">
                      {activeAsset.resolution}
                    </span>
                  )}
                </div>
                {activeAsset.caption && (
                  <p className="text-xs sm:text-sm text-[#A8A29E] font-sans leading-relaxed max-w-3xl">
                    {activeAsset.caption}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#292524] hover:bg-[#38332E] text-[#E7E5E4] text-xs font-sans font-medium border border-[#44403C] transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#EDA81C]" />
                  <span>Open Full Resolution</span>
                </a>
              </div>
            </div>

            {/* Thumbnail Strip for Current Collection */}
            {assetsList.length > 1 && (
              <div className="mt-4 pt-3 border-t border-[#292524] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {assetsList.map((asset, idx) => {
                  const isSelected = asset.id === activeAsset.id;
                  return (
                    <button
                      key={asset.id}
                      onClick={() => onSelectAsset(asset)}
                      className={`relative shrink-0 w-16 h-12 rounded-md overflow-hidden border transition-all ${
                        isSelected
                          ? 'border-[#EDA81C] ring-2 ring-[#EDA81C]/40 scale-105'
                          : 'border-[#44403C] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={asset.posterUrl || asset.url}
                        alt={asset.title}
                        className="w-full h-full object-cover"
                      />
                      {asset.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
