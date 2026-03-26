import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Play, SkipForward } from 'lucide-react';

interface VideoAdProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function VideoAd({ onComplete, onClose }: VideoAdProps) {
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const duration = 15000; // 15 seconds
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setCanSkip(true);
          return 100;
        }
        return prev + step;
      });

      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return Math.max(0, prev - (interval / 1000));
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Video Background Simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"
        />
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20">
              <Play className="text-white fill-white" size={48} />
            </div>
          </motion.div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Premium Fitness Pro</h2>
          <p className="text-zinc-400 max-w-xs mx-auto">Unlock your full potential with our advanced training algorithms.</p>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Advertisement</span>
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {canSkip ? (
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:bg-orange-500 hover:text-white transition-all active:scale-95"
          >
            Skip Ad <SkipForward size={18} />
          </button>
        ) : (
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white font-mono text-sm">
            Skip in {Math.ceil(timeLeft)}s
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800 z-20">
        <motion.div 
          className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* CTA Button */}
      <div className="absolute bottom-12 left-6 right-6 z-20">
        <button 
          onClick={onComplete}
          className="w-full py-5 bg-orange-500 text-white font-black uppercase italic tracking-tighter text-xl rounded-3xl shadow-2xl shadow-orange-500/40 hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          Install Now
        </button>
      </div>
    </motion.div>
  );
}
