import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, CheckCircle2, Film } from 'lucide-react';
import { OFFICIAL_ASSETS } from '../data/engineeringData';
import { AnimatedHeading } from './AnimatedText';

export default function EngineeringReelSection() {
  const [activeReel, setActiveReel] = useState<'main' | 'erection'>('main');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentSrc = activeReel === 'main' ? OFFICIAL_ASSETS.heroVideo1080 : OFFICIAL_ASSETS.structuralErectionReel;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [activeReel]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(curr);
      setDuration(dur);
      setProgress((curr / dur) * 100);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section
      id="engineering-reel"
      className="relative bg-transparent text-[#0C0A09] py-24 md:py-32 border-t border-[#E7E1D8]/60 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#EDA81C] font-sans font-bold mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Section 03 • Engineering in Motion</span>
            </div>
            <AnimatedHeading
              text="Technical Execution in Motion"
              highlightWord="Motion"
              highlightClass="text-[#EDA81C]"
              className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0C0A09] font-bold tracking-tight"
            />
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-[#57534E] text-sm max-w-md font-sans text-left md:text-right font-medium">
              Live footage of heavy structural plant modeling, pipeline coordination, and on-site engineering execution.
            </p>
            {/* Reel Switcher Buttons with Glassmorphism */}
            <div className="inline-flex p-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveReel('main')}
                className={`px-5 py-2 text-xs font-sans uppercase tracking-[0.16em] font-bold rounded-xl transition-all cursor-pointer ${
                  activeReel === 'main'
                    ? 'bg-[#EDA81C] text-[#0C0A09] shadow-sm'
                    : 'text-[#292524] hover:text-[#0C0A09]'
                }`}
              >
                Plant &amp; Structural Reel
              </button>
              <button
                type="button"
                onClick={() => setActiveReel('erection')}
                className={`px-5 py-2 text-xs font-sans uppercase tracking-[0.16em] font-bold rounded-xl transition-all cursor-pointer ${
                  activeReel === 'erection'
                    ? 'bg-[#EDA81C] text-[#0C0A09] shadow-sm'
                    : 'text-[#292524] hover:text-[#0C0A09]'
                }`}
              >
                Field Erection Sequence
              </button>
            </div>
          </div>
        </div>

        {/* Video Theatre Frame with Glassmorphic Container */}
        <div className="relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/80 p-3 shadow-2xl">
          {/* Main Video Element */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-[#0C0A09] flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentSrc}
              poster={OFFICIAL_ASSETS.heroVideoPoster}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onError={() => {
                if (videoRef.current && videoRef.current.src !== OFFICIAL_ASSETS.heroVideo1080) {
                  videoRef.current.src = OFFICIAL_ASSETS.heroVideo1080;
                  videoRef.current.load();
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="w-full h-full object-cover"
            />

            {/* Clean Floating Status Badges */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-sans font-medium select-none">
              <span className="w-2 h-2 rounded-full bg-[#EDA81C] animate-pulse" />
              <span>Real-Time Erection Footage</span>
            </div>
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-sans font-medium select-none">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#EDA81C]" />
              <span>Zero-Clash Verified</span>
            </div>

            {/* Center Big Play Button when Paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute z-20 w-16 h-16 rounded-full bg-white/95 backdrop-blur-md text-[#0C0A09] flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-[#EDA81C] hover:text-[#0C0A09] transition-all cursor-pointer"
                aria-label="Resume video"
              >
                <Play className="w-7 h-7 ml-1" />
              </button>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 sm:p-6 flex flex-col gap-3">
              {/* Progress Slider */}
              <div
                onClick={handleSeek}
                className="w-full h-1.5 bg-white/25 hover:h-2.5 rounded-full cursor-pointer transition-all relative overflow-hidden group"
              >
                <div
                  className="h-full bg-[#EDA81C] transition-all rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Control Buttons & Timers */}
              <div className="flex items-center justify-between text-white text-xs font-sans">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2.5 rounded-full bg-white/25 hover:bg-white/45 backdrop-blur-md transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-2.5 rounded-full bg-white/25 hover:bg-white/45 backdrop-blur-md transition-colors cursor-pointer"
                    aria-label="Restart video"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2.5 rounded-full bg-white/25 hover:bg-white/45 backdrop-blur-md transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-[11px] text-white/90 ml-2 font-semibold">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Technical Overlay Tag */}
                <div className="hidden sm:flex items-center gap-4 text-xs font-sans text-white/90">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#EDA81C]" />
                    Zero Clash Tolerance
                  </span>
                  <span className="font-semibold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md">LOD 500 Modeling</span>
                </div>
              </div>
            </div>
          </div>

          {/* Under-Video Deliverable Strip with Glassmorphic styling */}
          <div className="p-6 rounded-2xl mt-3 bg-white/85 backdrop-blur-xl border border-white/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#EDA81C] block">
                Engineering Discipline
              </span>
              <span className="font-semibold text-[#0C0A09] text-sm mt-0.5 block">
                {activeReel === 'main' ? 'Process Facility & Piping' : 'Structural Truss Erection'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#EDA81C] block">
                Quality Assurance
              </span>
              <span className="font-semibold text-[#0C0A09] text-sm mt-0.5 block">
                Multi-Discipline Clash Verification
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#EDA81C] block">
                Design Standard
              </span>
              <span className="font-semibold text-[#0C0A09] text-sm mt-0.5 block">
                AISC • IS 800 • API 650
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#EDA81C] block">
                Execution Deliverable
              </span>
              <span className="font-semibold text-[#0C0A09] text-sm mt-0.5 block">
                Fabrication-Ready Tekla Model
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
